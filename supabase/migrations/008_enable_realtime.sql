-- Enable Realtime for sessions and messages tables
-- Run this in Supabase SQL Editor

-- Add tables to Supabase Realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE answers;
