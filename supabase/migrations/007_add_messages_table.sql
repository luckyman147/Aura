-- Messages table for online session chat
-- Run this in Supabase SQL Editor

create table messages (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references sessions(id) on delete cascade,
  sender_id text not null,
  text text not null check (char_length(text) > 0 and char_length(text) <= 500),
  created_at timestamptz not null default now()
);

create index idx_messages_session on messages(session_id, created_at);

alter table messages enable row level security;

create policy "messages_select" on messages for select using (true);
create policy "messages_insert" on messages for insert with check (true);
