-- Fix signature count and user data display issues

-- First, let's ensure the trigger function is working correctly
-- Drop and recreate the signature count trigger
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

-- Also create a trigger to decrement when signature is deleted
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

DROP TRIGGER IF EXISTS trigger_decrement_signature_count ON signatures;
CREATE TRIGGER trigger_decrement_signature_count
AFTER DELETE ON signatures
FOR EACH ROW EXECUTE FUNCTION decrement_signature_count();

-- Fix any existing petitions with incorrect counts
UPDATE petitions p
SET signature_count = (
  SELECT COUNT(*)
  FROM signatures s
  WHERE s.petition_id = p.id
);