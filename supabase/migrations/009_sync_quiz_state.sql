-- Add synced quiz state columns to sessions
-- Run this in Supabase SQL Editor

ALTER TABLE sessions
  ADD COLUMN IF NOT EXISTS current_question_index int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS partner_active boolean NOT NULL DEFAULT true;
