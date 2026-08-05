-- Aura SoulSync Database Schema (No Auth - Anonymous Players)
-- Run this in Supabase SQL Editor

create extension if not exists "uuid-ossp";

-- Drop types if they exist (safe re-run)
drop type if exists category cascade;
drop type if exists session_mode cascade;
drop type if exists session_status cascade;
drop type if exists app_language cascade;

create type category as enum (
  'communication', 'values', 'lifestyle', 'intimacy', 'finances', 'children', 'marriage'
);
create type session_mode as enum ('online', 'realtime');
create type session_status as enum ('waiting', 'active', 'completed');
create type app_language as enum ('en', 'fr', 'ar');

create table questions (
  id uuid primary key default uuid_generate_v4(),
  category category not null,
  text_en text not null,
  text_fr text not null,
  text_ar text not null,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create table sessions (
  id uuid primary key default uuid_generate_v4(),
  code varchar(6) unique not null,
  mode session_mode not null default 'online',
  language app_language not null default 'en',
  categories category[] not null default '{communication,values,lifestyle}',
  status session_status not null default 'waiting',
  host_id text not null,
  partner_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table answers (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references sessions(id) on delete cascade,
  player_id text not null,
  question_id uuid not null references questions(id) on delete cascade,
  answer varchar(10) not null check (answer in ('agree', 'neutral', 'disagree', 'skipped')),
  created_at timestamptz not null default now(),
  unique(session_id, player_id, question_id)
);

create table results (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid unique not null references sessions(id) on delete cascade,
  overall_score int not null default 0,
  communication_score int,
  values_score int,
  lifestyle_score int,
  intimacy_score int,
  finances_score int,
  children_score int,
  marriage_score int,
  biggest_alignment text,
  biggest_gap text,
  created_at timestamptz not null default now()
);

create index idx_sessions_code on sessions(code);
create index idx_answers_session on answers(session_id);
create index idx_answers_player on answers(player_id);
create index idx_questions_category on questions(category);

-- Enable RLS
alter table questions enable row level security;
alter table sessions enable row level security;
alter table answers enable row level security;
alter table results enable row level security;

-- RLS Policies (no auth, public quiz app)
-- Questions: everyone can read
create policy "questions_select" on questions for select using (true);

-- Sessions: everyone can read
create policy "sessions_select" on sessions for select using (true);

-- Sessions: anyone can create
create policy "sessions_insert" on sessions for insert with check (true);

-- Sessions: anyone can update (host/partner join handled by function)
create policy "sessions_update" on sessions for update using (true);

-- Answers: everyone can read
create policy "answers_select" on answers for select using (true);

-- Answers: anyone can insert
create policy "answers_insert" on answers for insert with check (true);

-- Results: everyone can read
create policy "results_select" on results for select using (true);

-- Results: anyone can insert
create policy "results_insert" on results for insert with check (true);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger sessions_updated_at
  before update on sessions
  for each row execute function update_updated_at();

-- Join session function (validates code + status)
create or replace function join_session(p_code text, p_partner_id text)
returns sessions as $$
declare
  v_session sessions;
begin
  select * into v_session
  from sessions
  where upper(trim(p_code)) = code
    and status = 'waiting'
    and partner_id is null;

  if not found then
    raise exception 'Session not found or already full';
  end if;

  update sessions
  set partner_id = p_partner_id, status = 'active'
  where id = v_session.id
  returning * into v_session;

  return v_session;
end;
$$ language plpgsql security definer;

-- Seed questions (only if table is empty)
insert into questions (category, text_en, text_fr, text_ar, order_index)
select * from (values
('communication', 'We handle disagreements in a healthy and constructive way.', 'Nous gérons les désaccords de manière saine et constructive.', 'نتعامل مع خلافاتنا بطريقة صحية وبنّاءة', 1),
('communication', 'We feel comfortable expressing our true feelings to each other.', 'Nous nous sentons à l''aise pour exprimer nos vrais sentiments.', 'نشعر بالراحة في التعبير عن مشاعرنا الحقيقية', 2),
('communication', 'We listen actively when the other person is speaking.', 'Nous écoutons activement quand l''autre personne parle.', 'نستمع بشكل فعّال عندما يتحدث الطرف الآخر', 3),
('communication', 'We rarely misunderstand each other.', 'Nous nous comprenons rarement mal.', 'نادرًا ما نفهم بعضنا بشكل خاطئ', 4),
('values', 'We share similar core values about family and relationships.', 'Nous partageons des valeurs fondamentales similaires sur la famille et les relations.', 'نشارك قيمًا جوهرية متشابهة حول الأسرة والعلاقات', 5),
('values', 'We are aligned on our long-term life goals and aspirations.', 'Nous sommes alignés sur nos objectifs de vie à long terme.', 'نحن متّفقون على أهداف حياتنا طويلة الأمد', 6),
('values', 'We have similar views on what matters most in life.', 'Nous avons des points de vue similaires sur ce qui compte le plus.', 'لدينا وجهات نظر متشابهة حول ما يهمّ أكثر في الحياة', 7),
('lifestyle', 'We enjoy spending quality time together on weekends.', 'Nous aimons passer du temps de qualité ensemble le week-end.', 'نستمتع بقضاء وقت ممتع معًا في عطلات نهاية الأسبوع', 8),
('lifestyle', 'We have compatible daily routines and habits.', 'Nous avons des routines quotidiennes et des habitudes compatibles.', 'لدينا روتين يومي وعادات متوافقة', 9),
('lifestyle', 'We support each other''s personal hobbies and interests.', 'Nous soutenons les hobbies et intérêts personnels de l''autre.', 'ندعم الهوايات والاهتمامات الشخصية لبعضنا', 10),
('intimacy', 'We feel emotionally connected and close.', 'Nous nous sentons émotionnellement connectés et proches.', 'نشعر بارتباط عاطفي وقرب', 11),
('intimacy', 'We are satisfied with our physical affection.', 'Nous sommes satisfaits de notre affection physique.', 'راضون عن تعبيراتنا الجسدية عن الحب', 12),
('finances', 'We have similar attitudes toward saving and spending.', 'Nous avons des attitudes similaires vers l''épargne et les dépenses.', 'لدينا مواقف متشابهة تجاه الادخار والإنفاق', 13),
('finances', 'We are open and honest about financial matters.', 'Nous sommes ouverts et honnêtes sur les questions financières.', 'مفتوحون وصادقون في Matters المالية', 14),
('children', 'We agree on whether or not to have children.', 'Nous sommes d''accord sur le fait d''avoir des enfants ou non.', 'نتفق على ما إذا كان لدينا أطفال أم لا', 15),
('children', 'We share similar ideas about parenting styles.', 'Nous partageons des idées similaires sur les styles d''éducation.', 'نشارك أفكارًا متشابهة حول أساليب تربية الأطفال', 16),
('marriage', 'We have similar expectations about marriage.', 'Nous avons des attentes similaires sur le mariage.', 'لدينا توقعات متشابهة حول الزواج', 17),
('marriage', 'We are on the same page about our future together.', 'Nous sommes sur la même longueur d''onde concernant notre avenir ensemble.', 'نحن على نفس التوافق بشأن مستقبلنا معًا', 18)
) as v(category, text_en, text_fr, text_ar, order_index)
where not exists (select 1 from questions limit 1);
