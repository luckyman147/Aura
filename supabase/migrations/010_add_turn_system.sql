-- Add turn tracking to sessions
-- Run this in Supabase SQL Editor

ALTER TABLE sessions
  ADD COLUMN IF NOT EXISTS current_turn text NOT NULL DEFAULT 'host',
  ADD COLUMN IF NOT EXISTS turn_selected boolean NOT NULL DEFAULT false;

-- Update join_session function to set random initial turn
CREATE OR REPLACE FUNCTION join_session(p_code text, p_partner_id text)
RETURNS sessions AS $$
DECLARE
  v_session sessions;
  v_initial_turn text;
BEGIN
  SELECT * INTO v_session
  FROM sessions
  WHERE upper(trim(p_code)) = code
    AND status = 'waiting'
    AND partner_id IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Session not found or already full';
  END IF;

  -- Randomly choose who goes first (50/50 chance)
  v_initial_turn := CASE WHEN random() < 0.5 THEN 'host' ELSE 'partner' END;

  UPDATE sessions
  SET partner_id = p_partner_id, 
      status = 'active',
      current_turn = v_initial_turn,
      turn_selected = true
  WHERE id = v_session.id
  RETURNING * INTO v_session;

  RETURN v_session;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;