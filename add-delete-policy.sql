-- Add DELETE policy for petitions table
-- This allows users to delete their own petitions

-- Add DELETE policy for petitions
CREATE POLICY "Users can delete own petitions" ON petitions 
FOR DELETE 
USING (creator_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()::text));

-- Also add DELETE policies for dev mode (optional, for testing)
-- If you want to allow deletion in dev mode without authentication:
-- DROP POLICY IF EXISTS "Users can delete own petitions" ON petitions;
-- CREATE POLICY "Users can delete own petitions" ON petitions 
-- FOR DELETE 
-- USING (true);  -- This allows anyone to delete in dev mode
