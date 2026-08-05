-- Aura SoulSync Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Categories enum
create type category as enum (
  'communication',
  'values',
  'lifestyle',
  'intimacy',
  'finances',
  'children',
  'marriage'
);

-- Session mode enum
create type session_mode as enum ('online', 'realtime');

-- Session status enum
create type session_status as enum ('waiting', 'active', 'completed');

-- Language enum
create type app_language as enum ('en', 'fr', 'ar');

-- Questions table
create table questions (
  id uuid primary key default uuid_generate_v4(),
  category category not null,
  text_en text not null,
  text_fr text not null,
  text_ar text not null,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

-- Sessions table
create table sessions (
  id uuid primary key default uuid_generate_v4(),
  code varchar(6) unique not null,
  mode session_mode not null default 'online',
  language app_language not null default 'en',
  categories category[] not null default '{communication,values,lifestyle}',
  status session_status not null default 'waiting',
  host_id uuid not null,
  partner_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Answers table
create table answers (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references sessions(id) on delete cascade,
  player_id uuid not null,
  question_id uuid not null references questions(id) on delete cascade,
  answer varchar(10) not null check (answer in ('agree', 'neutral', 'disagree', 'skipped')),
  created_at timestamptz not null default now(),
  unique(session_id, player_id, question_id)
);

-- Results table
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

-- Indexes
create index idx_sessions_code on sessions(code);
create index idx_answers_session on answers(session_id);
create index idx_answers_player on answers(player_id);
create index idx_questions_category on questions(category);

-- RLS policies
alter table questions enable row level security;
alter table sessions enable row level security;
alter table answers enable row level security;
alter table results enable row level security;

-- Questions: anyone can read
create policy "Questions are public" on questions
  for select using (true);

-- Sessions: anyone can read (need code to join)
create policy "Sessions are readable" on sessions
  for select using (true);

-- Sessions: anyone can create
create policy "Sessions are creatable" on sessions
  for insert with check (true);

-- Sessions: host or partner can update
create policy "Session members can update" on sessions
  for update using (
    status = 'waiting' or
    auth.uid()::text = host_id::text or
    auth.uid()::text = partner_id::text
  );

-- Answers: players can insert their own
create policy "Players can insert answers" on answers
  for insert with check (true);

-- Answers: readable by session members
create policy "Session members can read answers" on answers
  for select using (true);

-- Results: readable by session members
create policy "Session results are readable" on results
  for select using (true);

-- Results: system can insert
create policy "Results are insertable" on results
  for insert with check (true);

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

-- Generate unique 6-char session code
create or replace function generate_session_code()
returns varchar(6) as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := '';
  i int;
begin
  for i in 1..6 loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  end loop;
  return result;
end;
$$ language plpgsql;

-- Seed questions
insert into questions (category, text_en, text_fr, text_ar, order_index) values
-- Communication
('communication', 'We handle disagreements in a healthy and constructive way.', 'Nous gérons les désaccords de manière saine et constructive.', 'نتعامل مع خلافاتنا بطريقة صحية وبنّاءة', 1),
('communication', 'We feel comfortable expressing our true feelings to each other.', 'Nous nous sentons à l''aise pour exprimer nos vrais sentiments.', 'نشعر بالراحة في التعبير عن مشاعرنا الحقيقية', 2),
('communication', 'We listen actively when the other person is speaking.', 'Nous écoutons activement quand l''autre personne parle.', 'نستمع بشكل فعّال عندما يتحدث الطرف الآخر', 3),
('communication', 'We rarely misunderstand each other.', 'Nous nous comprenons rarement mal.', 'نادرًا ما نفهم بعضنا بشكل خاطئ', 4),

-- Values
('values', 'We share similar core values about family and relationships.', 'Nous partageons des valeurs fondamentales similaires sur la famille et les relations.', 'نشارك قيمًا جوهرية متشابهة حول الأسرة والعلاقات', 5),
('values', 'We are aligned on our long-term life goals and aspirations.', 'Nous sommes alignés sur nos objectifs de vie à long terme.', 'نحن متّفقون على أهداف حياتنا طويلة الأمد', 6),
('values', 'We have similar views on what matters most in life.', 'Nous avons des points de vue similaires sur ce qui compte le plus.', 'لدينا وجهات نظر متشابهة حول ما يهمّ أكثر في الحياة', 7),

-- Lifestyle
('lifestyle', 'We enjoy spending quality time together on weekends.', 'Nous aimons passer du temps de qualité ensemble le week-end.', 'نستمتع بقضاء وقت ممتع معًا في عطلات نهاية الأسبوع', 8),
('lifestyle', 'We have compatible daily routines and habits.', 'Nous avons des routines quotidiennes et des habitudes compatibles.', 'لدينا روتين يومي وعادات متوافقة', 9),
('lifestyle', 'We support each other''s personal hobbies and interests.', 'Nous soutenons les hobbies et intérêts personnels de l''autre.', 'ندعم الهوايات والاهتمامات الشخصية لبعضنا', 10),

-- Intimacy
('intimacy', 'We feel emotionally connected and close.', 'Nous nous sentons émotionnellement connectés et proches.', 'نشعر بارتباط عاطفي وقرب', 11),
('intimacy', 'We are satisfied with our physical affection.', 'Nous sommes satisfaits de notre affection physique.', 'راضون عن تعبيراتنا الجسدية عن الحب', 12),

-- Finances
('finances', 'We have similar attitudes toward saving and spending.', 'Nous avons des attitudes similaires vers l''épargne et les dépenses.', 'لدينا مواقف متشابهة تجاه الادخار والإنفاق', 13),
('finances', 'We are open and honest about financial matters.', 'Nous sommes ouverts et honnêtes sur les questions financières.', 'مفتوحون وصادقون في Matters المالية', 14),

-- Children
('children', 'We agree on whether or not to have children.', 'Nous sommes d''accord sur le fait d''avoir des enfants ou non.', 'نتفق على ما إذا كان لدينا أطفال أم لا', 15),
('children', 'We share similar ideas about parenting styles.', 'Nous partageons des idées similaires sur les styles d''éducation.', 'نشارك أفكارًا متشابهة حول أساليب تربية الأطفال', 16),

-- Marriage
('marriage', 'We have similar expectations about marriage.', 'Nous avons des attentes similaires sur le mariage.', 'لدينا توقعات متشابهة حول الزواج', 17),
('marriage', 'We are on the same page about our future together.', 'Nous sommes sur la même longueur d''onde concernant notre avenir ensemble.', 'نحن على نفس التوافق بشأن مستقبلنا معًا', 18);
