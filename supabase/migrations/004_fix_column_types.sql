-- Fix: Change host_id/partner_id from uuid to text
-- Run this in Supabase SQL Editor

-- 1. Drop everything that depends on the columns
drop policy if exists "Session members can update" on sessions;
drop policy if exists "sessions_update" on sessions;
drop function if exists join_session(text, text);

-- 2. Alter columns from uuid to text
alter table sessions alter column host_id type text using host_id::text;
alter table sessions alter column partner_id type text using partner_id::text;

-- 3. Recreate update policy
create policy "sessions_update" on sessions
  for update using (true);

-- 4. Recreate join_session function
create or replace function join_session(p_code text, p_partner_id text)
returns sessions as $$
declare
  v_session sessions;
begin
  select * into v_session
  from sessions
  where upper(trim(p_code)) = code;

  if not found then
    raise exception 'Session not found';
  end if;

  if v_session.partner_id is not null then
    raise exception 'Session is already full';
  end if;

  if v_session.status != 'waiting' then
    raise exception 'Session is no longer accepting players';
  end if;

  update sessions
  set partner_id = p_partner_id, status = 'active'
  where id = v_session.id
  returning * into v_session;

  return v_session;
end;
$$ language plpgsql security definer;

grant execute on function join_session(text, text) to anon;
grant execute on function join_session(text, text) to authenticated;
