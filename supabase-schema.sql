

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "cube";
CREATE EXTENSION IF NOT EXISTS "earthdistance";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firebase_uid TEXT UNIQUE NOT NULL,
  phone_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  role TEXT NOT NULL,
  preferred_language TEXT NOT NULL DEFAULT 'en',
  is_verified BOOLEAN DEFAULT FALSE,
  verification_type TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  trust_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PETITIONS TABLE
-- ============================================
CREATE TABLE petitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location_lat DECIMAL(10, 8) NOT NULL,
  location_lng DECIMAL(11, 8) NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  address TEXT,
  pincode TEXT,
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  signature_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  sent_to_authority BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP WITH TIME ZONE,
  response_received BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SIGNATURES TABLE
-- ============================================
CREATE TABLE signatures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  petition_id UUID NOT NULL REFERENCES petitions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_verified BOOLEAN DEFAULT FALSE,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  ip_address INET,
  signed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(petition_id, user_id)
);

-- ============================================
-- EVIDENCE TABLE
-- ============================================
CREATE TABLE evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  petition_id UUID NOT NULL REFERENCES petitions(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail TEXT,
  description TEXT,
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  metadata JSONB,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- AUTHORITIES TABLE
-- ============================================
CREATE TABLE authorities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  department TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  state TEXT NOT NULL,
  area TEXT,
  categories TEXT[] NOT NULL,
  response_rate DECIMAL(5, 2),
  average_response_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PETITION_AUTHORITIES (Many-to-Many)
-- ============================================
CREATE TABLE petition_authorities (
  petition_id UUID NOT NULL REFERENCES petitions(id) ON DELETE CASCADE,
  authority_id UUID NOT NULL REFERENCES authorities(id) ON DELETE CASCADE,
  PRIMARY KEY (petition_id, authority_id)
);

-- ============================================
-- CIVIC ISSUES TABLE
-- ============================================
CREATE TABLE civic_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location_lat DECIMAL(10, 8) NOT NULL,
  location_lng DECIMAL(11, 8) NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  reported_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  upvotes INTEGER DEFAULT 0,
  status TEXT DEFAULT 'reported',
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ISSUE UPVOTES TABLE
-- ============================================
CREATE TABLE issue_upvotes (
  issue_id UUID NOT NULL REFERENCES civic_issues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  upvoted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (issue_id, user_id)
);

-- ============================================
-- ISSUE VERIFICATIONS TABLE
-- ============================================
CREATE TABLE issue_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID NOT NULL REFERENCES civic_issues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment TEXT,
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(issue_id, user_id)
);

-- ============================================
-- PETITION UPDATES TABLE
-- ============================================
CREATE TABLE petition_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  petition_id UUID NOT NULL REFERENCES petitions(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  attachments TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- AI QUERIES TABLE
-- ============================================
CREATE TABLE ai_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  language TEXT NOT NULL,
  category TEXT,
  response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_petitions_creator ON petitions(creator_id);
CREATE INDEX idx_petitions_status ON petitions(status);
CREATE INDEX idx_petitions_category ON petitions(category);
CREATE INDEX idx_petitions_city_state ON petitions(city, state);
-- Geographic index for proximity searches (cast to float8 for earthdistance)
CREATE INDEX idx_petitions_location ON petitions USING gist(
  ll_to_earth(location_lat::float8, location_lng::float8)
);

CREATE INDEX idx_signatures_petition ON signatures(petition_id);
CREATE INDEX idx_signatures_user ON signatures(user_id);

CREATE INDEX idx_civic_issues_city_state ON civic_issues(city, state);
CREATE INDEX idx_civic_issues_status ON civic_issues(status);
-- Geographic index for proximity searches (cast to float8 for earthdistance)
CREATE INDEX idx_civic_issues_location ON civic_issues USING gist(
  ll_to_earth(location_lat::float8, location_lng::float8)
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE petitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE civic_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can read all, update only their own
CREATE POLICY "Users can read all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = firebase_uid);
CREATE POLICY "Anyone can create profile during signup" ON users FOR INSERT WITH CHECK (true);

-- Petitions are public read, authenticated create
CREATE POLICY "Anyone can read petitions" ON petitions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create petitions" ON petitions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own petitions" ON petitions FOR UPDATE USING (creator_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()::text));

-- Signatures are public read, authenticated create
CREATE POLICY "Anyone can read signatures" ON signatures FOR SELECT USING (true);
CREATE POLICY "Authenticated users can sign" ON signatures FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Civic issues are public
CREATE POLICY "Anyone can read civic issues" ON civic_issues FOR SELECT USING (true);
CREATE POLICY "Authenticated users can report issues" ON civic_issues FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Notifications are private
CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT USING (user_id IN (SELECT id FROM users WHERE firebase_uid = auth.uid()::text));

-- ============================================
-- TRIGGERS FOR AUTO-UPDATE timestamps
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_petitions_updated_at BEFORE UPDATE ON petitions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_authorities_updated_at BEFORE UPDATE ON authorities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_civic_issues_updated_at BEFORE UPDATE ON civic_issues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION: Auto-increment petition signature count
-- ============================================
CREATE OR REPLACE FUNCTION increment_signature_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE petitions 
  SET signature_count = signature_count + 1 
  WHERE id = NEW.petition_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_signature_count
AFTER INSERT ON signatures
FOR EACH ROW EXECUTE FUNCTION increment_signature_count();

-- ============================================
-- FUNCTION: Auto-increment issue upvote count
-- ============================================
CREATE OR REPLACE FUNCTION increment_upvote_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE civic_issues 
  SET upvotes = upvotes + 1 
  WHERE id = NEW.issue_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_upvote_count
AFTER INSERT ON issue_upvotes
FOR EACH ROW EXECUTE FUNCTION increment_upvote_count();
