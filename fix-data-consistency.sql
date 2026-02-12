-- ============================================
-- FIX DATA CONSISTENCY ISSUES
-- ============================================
-- This script fixes signature count mismatches and ensures data consistency

-- 1. Fix any existing petitions with incorrect signature counts
-- This will recalculate from actual signatures table
UPDATE petitions p
SET signature_count = (
  SELECT COUNT(*)
  FROM signatures s
  WHERE s.petition_id = p.id
),
updated_at = NOW()
WHERE signature_count != (
  SELECT COUNT(*)
  FROM signatures s
  WHERE s.petition_id = p.id
);

-- 2. Ensure the increment trigger exists and works correctly
DROP TRIGGER IF EXISTS trigger_increment_signature_count ON signatures;
DROP FUNCTION IF EXISTS increment_signature_count();

CREATE OR REPLACE FUNCTION increment_signature_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE petitions 
  SET signature_count = signature_count + 1,
      updated_at = NOW()
  WHERE id = NEW.petition_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_signature_count
AFTER INSERT ON signatures
FOR EACH ROW EXECUTE FUNCTION increment_signature_count();

-- 3. Create decrement trigger for when signatures are deleted
DROP TRIGGER IF EXISTS trigger_decrement_signature_count ON signatures;
DROP FUNCTION IF EXISTS decrement_signature_count();

CREATE OR REPLACE FUNCTION decrement_signature_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE petitions 
  SET signature_count = GREATEST(signature_count - 1, 0),
      updated_at = NOW()
  WHERE id = OLD.petition_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_decrement_signature_count
AFTER DELETE ON signatures
FOR EACH ROW EXECUTE FUNCTION decrement_signature_count();

-- 4. Create a function to manually recalculate signature counts if needed
CREATE OR REPLACE FUNCTION recalculate_signature_counts()
RETURNS void AS $$
BEGIN
  UPDATE petitions p
  SET signature_count = (
    SELECT COUNT(*)
    FROM signatures s
    WHERE s.petition_id = p.id
  ),
  updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- 5. Add index to improve signature count queries
CREATE INDEX IF NOT EXISTS idx_signatures_petition_id ON signatures(petition_id);

-- 6. Verify the results
SELECT 
  p.id,
  p.title,
  p.signature_count AS stored_count,
  COUNT(s.id) AS actual_count,
  CASE 
    WHEN p.signature_count = COUNT(s.id) THEN '✓ Match'
    ELSE '✗ Mismatch'
  END AS status
FROM petitions p
LEFT JOIN signatures s ON s.petition_id = p.id
GROUP BY p.id, p.title, p.signature_count
ORDER BY p.created_at DESC
LIMIT 10;
