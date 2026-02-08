-- ============================================
-- RAG SYSTEM FOR LEGAL DOCUMENTS
-- ============================================
-- This script is idempotent - safe to run multiple times

-- Enable pgvector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Drop existing objects (if upgrading)
DROP TABLE IF EXISTS rag_query_logs CASCADE;
DROP TABLE IF EXISTS legal_documents CASCADE;
DROP FUNCTION IF EXISTS search_legal_documents CASCADE;
DROP VIEW IF EXISTS active_legal_documents CASCADE;

-- ============================================
-- LEGAL DOCUMENTS TABLE
-- ============================================
CREATE TABLE legal_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  act_name TEXT NOT NULL,
  section_number TEXT,
  chapter TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  plain_language_summary TEXT,
  keywords TEXT[] DEFAULT '{}',
  categories TEXT[] DEFAULT '{}',
  jurisdiction TEXT DEFAULT 'Central', -- Central / State / Municipal
  state TEXT, -- For state-specific laws (NULL for central laws)
  effective_from DATE,
  amended_on DATE,
  status TEXT DEFAULT 'active', -- active / amended / repealed
  source_url TEXT,
  government_gazette_reference TEXT,
  embedding VECTOR(384), -- HuggingFace sentence-transformers/all-MiniLM-L6-v2 embeddings
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_legal_docs_act ON legal_documents(act_name);
CREATE INDEX idx_legal_docs_section ON legal_documents(section_number);
CREATE INDEX idx_legal_docs_keywords ON legal_documents USING GIN(keywords);
CREATE INDEX idx_legal_docs_categories ON legal_documents USING GIN(categories);
CREATE INDEX idx_legal_docs_status ON legal_documents(status);
CREATE INDEX idx_legal_docs_jurisdiction ON legal_documents(jurisdiction);

-- Vector similarity search index (cosine distance)
CREATE INDEX idx_legal_docs_embedding ON legal_documents 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;

-- Everyone can read legal documents (public information)
CREATE POLICY "Anyone can read legal documents" ON legal_documents 
FOR SELECT USING (true);

-- Only authenticated users can insert/update (for admin panel later)
CREATE POLICY "Authenticated users can manage documents" ON legal_documents 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Service role can do everything (for API routes)
CREATE POLICY "Service role full access" ON legal_documents
FOR ALL
TO service_role
USING (true);

-- ============================================
-- RAG QUERY LOGS TABLE
-- ============================================
CREATE TABLE rag_query_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  results_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRIGGER FOR AUTO-UPDATE TIMESTAMPS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_legal_documents_updated_at 
BEFORE UPDATE ON legal_documents
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HELPER FUNCTION: Search legal documents by similarity
-- ============================================
CREATE OR REPLACE FUNCTION search_legal_documents(
  query_embedding VECTOR(384),
  match_threshold FLOAT DEFAULT 0.5,
  match_count INT DEFAULT 5,
  filter_categories TEXT[] DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  act_name TEXT,
  section_number TEXT,
  title TEXT,
  content TEXT,
  plain_language_summary TEXT,
  keywords TEXT[],
  categories TEXT[],
  jurisdiction TEXT,
  source_url TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    legal_documents.id,
    legal_documents.act_name,
    legal_documents.section_number,
    legal_documents.title,
    legal_documents.content,
    legal_documents.plain_language_summary,
    legal_documents.keywords,
    legal_documents.categories,
    legal_documents.jurisdiction,
    legal_documents.source_url,
    1 - (legal_documents.embedding <=> query_embedding) AS similarity
  FROM legal_documents
  WHERE 
    legal_documents.status = 'active'
    AND legal_documents.embedding IS NOT NULL
    AND 1 - (legal_documents.embedding <=> query_embedding) > match_threshold
    AND (filter_categories IS NULL OR legal_documents.categories && filter_categories)
  ORDER BY legal_documents.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ============================================
-- SAMPLE DATA: Most Common Legal Provisions
-- ============================================
-- These will be inserted without embeddings first
-- Embeddings will be generated by the application

INSERT INTO legal_documents (
  act_name, section_number, chapter, title, content, 
  plain_language_summary, keywords, categories, 
  jurisdiction, source_url, effective_from
) VALUES 
-- IPC Sections
(
  'Indian Penal Code, 1860',
  '379',
  'XVII - Of Offences Against Property',
  'Punishment for theft',
  'Whoever commits theft shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both.',
  'Stealing someone else''s property without permission is a crime. Punishment: Up to 3 years in prison and/or fine.',
  ARRAY['theft', 'stealing', 'property', 'crime', 'punishment'],
  ARRAY['property', 'criminal'],
  'Central',
  'https://indiankanoon.org/doc/1459557/',
  '1860-10-06'
),
(
  'Indian Penal Code, 1860',
  '323',
  'XVI - Of Offences Affecting the Human Body',
  'Punishment for voluntarily causing hurt',
  'Whoever, except in the case provided for by section 334, voluntarily causes hurt, shall be punished with imprisonment of either description for a term which may extend to one year, or with fine which may extend to one thousand rupees, or with both.',
  'Causing physical hurt to someone intentionally is a crime. Punishment: Up to 1 year in prison and/or fine up to ₹1000.',
  ARRAY['assault', 'hurt', 'violence', 'injury', 'crime'],
  ARRAY['violence', 'criminal'],
  'Central',
  'https://indiankanoon.org/doc/1128779/',
  '1860-10-06'
),
(
  'Indian Penal Code, 1860',
  '498A',
  'XX - Of Offences Relating to Marriage',
  'Husband or relative of husband of a woman subjecting her to cruelty',
  'Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment for a term which may extend to three years and shall also be liable to fine. Explanation: "Cruelty" means any wilful conduct which is of such a nature as is likely to drive the woman to commit suicide or to cause grave injury or danger to life, limb or health (whether mental or physical) of the woman; or harassment of the woman where such harassment is with a view to coercing her or any person related to her to meet any unlawful demand for any property or valuable security or is on account of failure by her or any person related to her to meet such demand.',
  'Cruelty by husband or his relatives towards a woman is a crime. This includes mental or physical harassment, dowry demands, or forcing her to harm herself. Punishment: Up to 3 years in prison and fine.',
  ARRAY['domestic violence', 'cruelty', 'harassment', 'dowry', 'women rights'],
  ARRAY['women', 'family', 'criminal'],
  'Central',
  'https://indiankanoon.org/doc/542341/',
  '1860-10-06'
),

-- Constitution of India
(
  'Constitution of India, 1950',
  '14',
  'III - Fundamental Rights',
  'Equality before law',
  'The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.',
  'Every person in India has the right to equal treatment under the law. No discrimination is allowed.',
  ARRAY['equality', 'fundamental rights', 'discrimination', 'constitutional rights'],
  ARRAY['constitutional', 'rights'],
  'Central',
  'https://legislative.gov.in/constitution-of-india',
  '1950-01-26'
),
(
  'Constitution of India, 1950',
  '19',
  'III - Fundamental Rights',
  'Protection of certain rights regarding freedom of speech, etc.',
  'All citizens shall have the right to freedom of speech and expression; to assemble peaceably and without arms; to form associations or unions; to move freely throughout the territory of India; to reside and settle in any part of the territory of India; and to practise any profession, or to carry on any occupation, trade or business.',
  'Citizens have the freedom to speak, assemble peacefully, form groups, move anywhere in India, and work in any profession (with reasonable restrictions).',
  ARRAY['freedom of speech', 'assembly', 'movement', 'profession', 'fundamental rights'],
  ARRAY['constitutional', 'rights', 'freedom'],
  'Central',
  'https://legislative.gov.in/constitution-of-india',
  '1950-01-26'
),
(
  'Constitution of India, 1950',
  '21',
  'III - Fundamental Rights',
  'Protection of life and personal liberty',
  'No person shall be deprived of his life or personal liberty except according to procedure established by law.',
  'Everyone has the right to life and personal freedom. These can only be taken away by proper legal process.',
  ARRAY['right to life', 'personal liberty', 'fundamental rights', 'human rights'],
  ARRAY['constitutional', 'rights', 'life'],
  'Central',
  'https://legislative.gov.in/constitution-of-india',
  '1950-01-26'
),

-- CrPC Sections
(
  'Code of Criminal Procedure, 1973',
  '154',
  'XII - Information to the Police and Their Powers to Investigate',
  'Information in cognizable cases',
  'Every information relating to the commission of a cognizable offence, if given orally to an officer in charge of a police station, shall be reduced to writing by him or under his direction, and be read over to the informant; and every such information, whether given in writing or reduced to writing as aforesaid, shall be signed by the person giving it, and the substance thereof shall be entered in a book to be kept by such officer in such form as the State Government may prescribe in this behalf. This is known as First Information Report (FIR).',
  'You have the right to file a police complaint (FIR) for serious crimes. Police must write it down and give you a copy. This is the first step in criminal cases.',
  ARRAY['fir', 'police complaint', 'cognizable offence', 'report crime'],
  ARRAY['police', 'criminal', 'procedure'],
  'Central',
  'https://legislative.gov.in/criminal-procedure-code',
  '1974-04-01'
),
(
  'Code of Criminal Procedure, 1973',
  '156',
  'XII - Information to the Police and Their Powers to Investigate',
  'Police officer''s power to investigate cognizable case',
  'Any officer in charge of a police station may, without the order of a Magistrate, investigate any cognizable case which a Court having jurisdiction over the local area within the limits of such station would have power to inquire into or try under the provisions of Chapter XIII.',
  'Police can investigate serious crimes (cognizable offences) on their own without waiting for a magistrate''s order. They must investigate if you file an FIR.',
  ARRAY['investigation', 'police powers', 'cognizable case', 'fir'],
  ARRAY['police', 'criminal', 'procedure'],
  'Central',
  'https://legislative.gov.in/criminal-procedure-code',
  '1974-04-01'
),

-- Labour Laws
(
  'Payment of Wages Act, 1936',
  '5',
  'II - Payment of Wages',
  'Fixation of wage-periods',
  'Every person responsible for the payment of wages under section 3 shall fix periods (in this Act referred to as wage-periods) in respect of which such wages shall be payable. No wage-period shall exceed one month.',
  'Your employer must pay your salary at regular intervals. The maximum wage period is one month. This means you must be paid at least once every month.',
  ARRAY['salary', 'wage payment', 'monthly payment', 'employer', 'labour rights'],
  ARRAY['labour', 'employment', 'salary'],
  'Central',
  'https://legislative.gov.in/payment-of-wages-act',
  '1936-03-23'
),
(
  'Payment of Wages Act, 1936',
  '7',
  'II - Payment of Wages',
  'Time of payment of wages',
  'The wages of every person employed upon or in any railway, factory or industrial or other establishment upon or in which less than one thousand persons are employed, shall be paid before the expiry of the seventh day, and the wages of every person employed upon or in any other railway, factory or industrial or other establishment, before the expiry of the tenth day, after the last day of the wage-period in respect of which the wages are payable.',
  'Salaries must be paid within 7 days (for workplaces with less than 1000 employees) or 10 days (for larger workplaces) after the month ends. Delayed payments violate this law.',
  ARRAY['salary delay', 'payment timeline', 'wage payment', 'employer duty'],
  ARRAY['labour', 'employment', 'salary'],
  'Central',
  'https://legislative.gov.in/payment-of-wages-act',
  '1936-03-23'
),

-- Consumer Protection
(
  'Consumer Protection Act, 2019',
  '2(7)',
  'I - Preliminary',
  'Definition of consumer',
  'Consumer means any person who buys any goods for a consideration which has been paid or promised or partly paid and partly promised, or under any system of deferred payment and includes any user of such goods other than the person who buys such goods for consideration paid or promised or partly paid or partly promised, or under any system of deferred payment, when such use is made with the approval of such person, but does not include a person who obtains such goods for resale or for any commercial purpose.',
  'A consumer is someone who buys goods or services for personal use (not for resale or business). You have rights as a consumer if you buy products or services.',
  ARRAY['consumer', 'buyer rights', 'goods', 'services', 'consumer protection'],
  ARRAY['consumer', 'commerce'],
  'Central',
  'https://legislative.gov.in/consumer-protection-act',
  '2019-08-09'
),
(
  'Consumer Protection Act, 2019',
  '2(9)',
  'I - Preliminary',
  'Definition of defect',
  'Defect means any fault, imperfection or shortcoming in the quality, quantity, potency, purity or standard which is required to be maintained by or under any law for the time being in force or under any contract, express or implied, or as is claimed by the trader in any manner whatsoever in relation to any goods.',
  'A defect is any problem with a product - poor quality, wrong quantity, or not meeting standards. If you buy a defective product, you can file a consumer complaint.',
  ARRAY['defective product', 'product quality', 'consumer complaint', 'faulty goods'],
  ARRAY['consumer', 'product defect'],
  'Central',
  'https://legislative.gov.in/consumer-protection-act',
  '2019-08-09'
),

-- Right to Information
(
  'Right to Information Act, 2005',
  '6',
  'II - Right to Information and Obligations of Public Authorities',
  'Request for obtaining information',
  'A person, who desires to obtain any information under this Act, shall make a request in writing or through electronic means in English or Hindi or in the official language of the area in which the application is being made, to the Public Information Officer of the concerned public authority, specifying the particulars of the information sought by him.',
  'You have the right to ask for information from government departments. Submit a written request (in English, Hindi, or local language) to the Public Information Officer. They must respond within 30 days.',
  ARRAY['rti', 'right to information', 'government information', 'transparency', 'public information'],
  ARRAY['transparency', 'government', 'rights'],
  'Central',
  'https://legislative.gov.in/right-to-information-act',
  '2005-06-21'
),

-- Motor Vehicles Act
(
  'Motor Vehicles Act, 1988',
  '166',
  'XI - Insurance of Motor Vehicles Against Third Party Risks',
  'Application for compensation',
  'An application for compensation arising out of an accident of the nature specified in sub-section (1) of section 165 may be made to the Claims Tribunal having jurisdiction in the matter.',
  'If you are injured or your vehicle is damaged in a road accident caused by someone else, you can file a claim with the Motor Accident Claims Tribunal for compensation.',
  ARRAY['road accident', 'accident compensation', 'vehicle insurance', 'claims tribunal', 'motor accident'],
  ARRAY['accident', 'vehicle', 'compensation'],
  'Central',
  'https://legislative.gov.in/motor-vehicles-act',
  '1989-07-01'
),

-- Shops and Establishments (General - varies by state)
(
  'Shops and Establishments Act (General)',
  'Common Provisions',
  'Working Hours and Conditions',
  'Working hours, weekly holidays, and overtime',
  'Shops and commercial establishments must provide: Maximum 9 hours work per day and 48 hours per week; At least one full day off per week (usually Sunday); Overtime payment at double the normal rate; Annual leave with pay; Notice period before termination. (Note: Exact provisions vary by state)',
  'If you work in a shop or office, you have rights: maximum 9-hour work day, one weekly holiday, overtime pay (double rate), paid annual leave, and notice before termination. Rules vary slightly by state.',
  ARRAY['working hours', 'weekly off', 'overtime', 'leave', 'shop act', 'employee rights'],
  ARRAY['labour', 'employment', 'working conditions'],
  'State',
  'https://labour.gov.in/',
  '1948-01-01'
);

-- ============================================
-- VIEW: Active legal documents with full text
-- ============================================
CREATE OR REPLACE VIEW active_legal_documents AS
SELECT 
  id,
  act_name,
  section_number,
  chapter,
  title,
  content,
  plain_language_summary,
  keywords,
  categories,
  jurisdiction,
  state,
  source_url,
  effective_from,
  amended_on
FROM legal_documents
WHERE status = 'active'
ORDER BY act_name, section_number;

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================
COMMENT ON TABLE legal_documents IS 'Verified legal documents for RAG-based legal assistant';
COMMENT ON COLUMN legal_documents.embedding IS 'HuggingFace sentence-transformers/all-MiniLM-L6-v2 embedding (384 dimensions) for semantic search';
COMMENT ON FUNCTION search_legal_documents IS 'Semantic search function for finding relevant legal documents based on query embedding';
COMMENT ON TABLE rag_query_logs IS 'Logs of RAG queries for analytics and improvement';

-- ============================================
-- CONFIRMATION MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ RAG System Schema Created Successfully!';
  RAISE NOTICE '📊 Tables: legal_documents, rag_query_logs';
  RAISE NOTICE '🔍 Function: search_legal_documents()';
  RAISE NOTICE '🎯 Next Step: Run seed script to populate documents';
END $$;

