-- ============================================
-- ADD LOCATION FIELDS TO USERS TABLE
-- ============================================

-- Add latitude and longitude columns for user location
ALTER TABLE users ADD COLUMN IF NOT EXISTS location_lat DECIMAL(10, 8);
ALTER TABLE users ADD COLUMN IF NOT EXISTS location_lng DECIMAL(11, 8);
ALTER TABLE users ADD COLUMN IF NOT EXISTS location_country VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS location_state VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS location_district VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS location_address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS location_updated_at TIMESTAMP WITH TIME ZONE;

-- Create geographic index for user locations (for proximity-based features)
CREATE INDEX IF NOT EXISTS idx_users_location ON users USING gist(
  ll_to_earth(location_lat::float8, location_lng::float8)
);

-- Update RLS policy to allow users to update their own location
-- (The existing "Users can update own profile" policy already covers this)
