-- Add UPDATE policy for results table (needed for UPSERT in compute_results)
-- Run this in Supabase SQL Editor

create policy "results_update" on results for update using (true);