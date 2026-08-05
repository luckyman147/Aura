-- Fix: Session join failing with "Invalid code or session already full"
-- Run this in Supabase SQL Editor

-- 1. Drop existing join_session function
drop function if exists join_session(text, text);

-- 2. Recreate with proper logic
create or replace function join_session(p_code text, p_partner_id text)
returns sessions as $$
declare
  v_session sessions;
begin
  -- Find the session
  select * into v_session
  from sessions
  where upper(trim(p_code)) = code;

  -- Not found
  if not found then
    raise exception 'Session not found';
  end if;

  -- Already has partner
  if v_session.partner_id is not null then
    raise exception 'Session is already full';
  end if;

  -- Not waiting
  if v_session.status != 'waiting' then
    raise exception 'Session is no longer accepting players';
  end if;

  -- Join
  update sessions
  set partner_id = p_partner_id, status = 'active'
  where id = v_session.id
  returning * into v_session;

  return v_session;
end;
$$ language plpgsql security definer;

-- 3. Make sure RLS allows updates on sessions
-- Drop and recreate the update policy
drop policy if exists "sessions_update" on sessions;
create policy "sessions_update" on sessions
  for update using (true);

-- 4. Grant execute on the function to anonymous
grant execute on function join_session(text, text) to anon;
grant execute on function join_session(text, text) to authenticated;
