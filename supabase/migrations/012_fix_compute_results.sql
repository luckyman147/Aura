-- Compute compatibility results for a session (turn-based version)
-- Score = average positivity of all answers: agree=100, neutral=50, disagree=0
-- Run this in Supabase SQL Editor

create or replace function compute_results(p_session_id uuid)
returns void as $$
declare
  v_overall int;
  v_alignment text;
  v_gap text;
  v_total int := 0;
  v_sum int := 0;
  v_rec record;
  v_cat_sum int;
  v_cat_total int;
  v_cat_score int;
begin
  -- Overall score: average positivity across all non-skipped answers
  select
    count(*)::int,
    coalesce(sum(
      case answer
        when 'agree' then 100
        when 'neutral' then 50
        when 'disagree' then 0
        else null
      end
    ), 0)::int
  into v_total, v_sum
  from answers
  where session_id = p_session_id AND answer != 'skipped';

  if v_total > 0 then
    v_overall := round(v_sum::float / v_total::float)::int;
  else
    v_overall := 0;
  end if;

  -- Determine alignment/gap text
  if v_overall >= 70 then
    v_alignment := 'You both deeply value shared connection, forming a strong foundation for your relationship.';
    v_gap := 'Consider exploring areas where your perspectives differ to deepen understanding.';
  elsif v_overall >= 40 then
    v_alignment := 'You share common ground on several important life themes.';
    v_gap := 'Open communication about your differences will help strengthen your bond.';
  else
    v_alignment := 'Your unique perspectives offer opportunities for growth and learning together.';
    v_gap := 'Focus on active listening and finding compromise in key areas.';
  end if;

  -- Insert or update results (use overall for all category scores)
  insert into results (
    session_id, overall_score,
    communication_score, values_score, lifestyle_score,
    intimacy_score, finances_score, children_score, marriage_score,
    biggest_alignment, biggest_gap
  )
  values (
    p_session_id, v_overall,
    v_overall, v_overall, v_overall,
    v_overall, v_overall, v_overall, v_overall,
    v_alignment, v_gap
  )
  on conflict (session_id) do update set
    overall_score = v_overall,
    communication_score = v_overall,
    values_score = v_overall,
    lifestyle_score = v_overall,
    intimacy_score = v_overall,
    finances_score = v_overall,
    children_score = v_overall,
    marriage_score = v_overall,
    biggest_alignment = v_alignment,
    biggest_gap = v_gap;

  -- Mark session as completed
  update sessions set status = 'completed' where id = p_session_id;
end;
$$ language plpgsql security invoker;