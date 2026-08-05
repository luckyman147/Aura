-- Compute compatibility results for a session
create or replace function compute_results(p_session_id uuid)
returns void as $$
declare
  v_host_id text;
  v_partner_id text;
  v_overall int;
  v_comm int;
  v_vals int;
  v_life int;
  v_intim int;
  v_fin int;
  v_child int;
  v_mar int;
  v_alignment text;
  v_gap text;
  v_host_answers record;
  v_partner_answers record;
  v_match_count int := 0;
  v_total_count int := 0;
  v_best_cat text := '';
  v_best_score int := 0;
  v_worst_cat text := '';
  v_worst_score int := 100;
begin
  select host_id, partner_id into v_host_id, v_partner_id
  from sessions where id = p_session_id;

  if v_partner_id is null then
    return;
  end if;

  -- Calculate category scores
  for v_host_answers in
    select q.category, a.answer
    from answers a
    join questions q on q.id = a.question_id
    where a.session_id = p_session_id and a.player_id = v_host_id and a.answer != 'skipped'
  loop
    select a.answer into v_partner_answers
    from answers a
    where a.session_id = p_session_id
      and a.player_id = v_partner_id
      and a.question_id = (
        select id from questions where category = v_host_answers.category
        order by random() limit 1
      );

    v_total_count := v_total_count + 1;
    if v_partner_answers.answer = v_host_answers.answer then
      v_match_count := v_match_count + 1;
    elsif (
      (v_host_answers.answer = 'agree' and v_partner_answers.answer = 'neutral') or
      (v_host_answers.answer = 'neutral' and v_partner_answers.answer = 'agree') or
      (v_host_answers.answer = 'disagree' and v_partner_answers.answer = 'neutral') or
      (v_host_answers.answer = 'neutral' and v_partner_answers.answer = 'disagree')
    ) then
      v_match_count := v_match_count + 0.5;
    end if;
  end loop;

  if v_total_count > 0 then
    v_overall := round((v_match_count::float / v_total_count::float) * 100)::int;
  else
    v_overall := 0;
  end if;

  -- Category breakdowns (simplified - using overall for each)
  v_comm := v_overall;
  v_vals := v_overall;
  v_life := v_overall;
  v_intim := v_overall;
  v_fin := v_overall;
  v_child := v_overall;
  v_mar := v_overall;

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

  -- Insert or update results
  insert into results (session_id, overall_score, communication_score, values_score, lifestyle_score, intimacy_score, finances_score, children_score, marriage_score, biggest_alignment, biggest_gap)
  values (p_session_id, v_overall, v_comm, v_vals, v_life, v_intim, v_fin, v_child, v_mar, v_alignment, v_gap)
  on conflict (session_id) do update set
    overall_score = v_overall,
    communication_score = v_comm,
    values_score = v_vals,
    lifestyle_score = v_life,
    intimacy_score = v_intim,
    finances_score = v_fin,
    children_score = v_child,
    marriage_score = v_mar,
    biggest_alignment = v_alignment,
    biggest_gap = v_gap;

  -- Mark session as completed
  update sessions set status = 'completed' where id = p_session_id;
end;
$$ language plpgsql security invoker;
