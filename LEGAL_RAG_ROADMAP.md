# KAIRO AI Legal Assistant - Future Enhancement Plan

## Current Implementation Status

### ✅ What's Working Now
- AI assistant provides general legal information about Indian laws
- Strict prompt engineering to enforce responsible behavior
- Clear disclaimers that it's NOT a lawyer and NOT legal advice
- Requires exact Act names and Section numbers for citations
- Structured response format (Rights / Actions / Authority / Disclaimers)
- Multi-language support (11 Indian languages)

### ⚠️ Current Limitation
**The AI currently uses its training data knowledge of Indian laws**, not a curated database of verified legal documents.

This means:
- Responses are based on the model's general knowledge
- No guarantee of up-to-date information (laws may have changed)
- Cannot verify sources against official government databases
- Risk of hallucination or outdated information

---

## 🚀 Recommended Future Enhancement: RAG System

### What is RAG?
**Retrieval Augmented Generation** - A system that:
1. Stores verified legal documents in a database
2. Retrieves relevant documents based on user query
3. Passes ONLY those documents to the AI
4. AI answers based ONLY on provided documents

### Implementation Plan

#### Phase 1: Legal Document Database
```
/legal-documents/
  ├── constitution/
  │   ├── preamble.json
  │   ├── fundamental-rights.json
  │   └── directive-principles.json
  ├── ipc/
  │   ├── chapter-1-introduction.json
  │   ├── chapter-16-offences-affecting-life.json
  │   └── ...
  ├── crpc/
  ├── labour-laws/
  ├── consumer-protection/
  └── ...
```

Each document:
```json
{
  "id": "ipc-section-379",
  "act": "Indian Penal Code, 1860",
  "section": "379",
  "title": "Punishment for theft",
  "text": "Whoever commits theft shall be punished with imprisonment...",
  "keywords": ["theft", "stealing", "property", "dishonestly"],
  "category": "property",
  "last_updated": "2024-01-15",
  "source": "https://indiankanoon.org/doc/1459557/"
}
```

#### Phase 2: Vector Database for Semantic Search
- Use **Supabase pgvector** or **Pinecone**
- Convert legal documents to embeddings
- Store embeddings for fast similarity search
- Example: User asks "laptop stolen" → Retrieve IPC 379, 380, CrPC 154 docs

#### Phase 3: Update AI Integration
```typescript
// src/lib/ai.ts
export async function getAIRightsGuidance(request: AIRightsRequest) {
  // 1. Retrieve relevant legal documents
  const relevantDocs = await retrieveLegalDocuments(request.query, request.category);
  
  // 2. If no documents found, return safe response
  if (relevantDocs.length === 0) {
    return "There is no verified legal information available for this scenario in the system. Please consult a qualified lawyer.";
  }
  
  // 3. Format documents for prompt
  const legalContext = relevantDocs.map(doc => 
    `Act: ${doc.act}\nSection: ${doc.section}\nText: ${doc.text}`
  ).join('\n\n---\n\n');
  
  // 4. Insert into prompt
  const prompt = `You are KAIRO...

VERIFIED LEGAL DOCUMENTS:
${legalContext}

USER QUERY: ${request.query}

You MUST use ONLY the documents above...`;
  
  return await callGroqAPI(prompt);
}
```

#### Phase 4: Document Management System
- Admin panel to add/update legal documents
- Automatic sync with official government sources
- Version control for law amendments
- Citation tracking

---

## 📊 Benefits of RAG Implementation

### 1. **Accuracy & Reliability**
- ✅ Answers based only on verified documents
- ✅ No hallucination or invented laws
- ✅ Traceable sources for every response

### 2. **Up-to-date Information**
- ✅ Documents can be updated when laws change
- ✅ Version tracking for amendments
- ✅ Clear "last updated" timestamps

### 3. **Legal Safety**
- ✅ Reduces liability (AI only explains what's in docs)
- ✅ Can explicitly state "no information available"
- ✅ Better compliance with legal service regulations

### 4. **User Trust**
- ✅ Users see actual Act names and Sections
- ✅ Links to official government sources
- ✅ Transparent about limitations

---

## 💾 Database Schema for Legal Documents

```sql
CREATE TABLE legal_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  act_name TEXT NOT NULL,
  section_number TEXT,
  chapter TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  plain_language_summary TEXT,
  keywords TEXT[],
  categories TEXT[],
  jurisdiction TEXT, -- Central / State / Municipal
  state TEXT, -- For state-specific laws
  effective_from DATE,
  amended_on DATE,
  status TEXT DEFAULT 'active', -- active / amended / repealed
  source_url TEXT,
  government_gazette_reference TEXT,
  embedding VECTOR(1536), -- For semantic search
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_legal_docs_keywords ON legal_documents USING GIN(keywords);
CREATE INDEX idx_legal_docs_categories ON legal_documents USING GIN(categories);
CREATE INDEX idx_legal_docs_embedding ON legal_documents USING ivfflat(embedding vector_cosine_ops);
```

---

## 🛠️ Technical Stack for RAG

### Option 1: Supabase + pgvector (Recommended)
- Already using Supabase
- Built-in vector similarity search
- Easy integration with existing DB
- Cost-effective

### Option 2: Pinecone + Supabase
- Dedicated vector database (faster for large scale)
- Better for 10M+ documents
- More expensive

### Embedding Model
- **OpenAI ada-002** (1536 dimensions) - Most accurate
- **Sentence Transformers** (768 dimensions) - Open source
- **Multilingual models** - For Hindi/Tamil support

---

## 📝 Sample RAG Flow

### User Query: "My salary hasn't been paid for 3 months"

1. **Embedding Generation**
   ```
   Query → OpenAI Embeddings API → Vector [0.123, -0.456, ...]
   ```

2. **Similarity Search**
   ```sql
   SELECT * FROM legal_documents
   ORDER BY embedding <-> query_embedding
   LIMIT 5;
   ```

3. **Retrieved Documents**
   - Payment of Wages Act, 1936 - Section 5
   - Industrial Disputes Act, 1947 - Section 33C
   - Labour Code on Wages, 2019 - Section 14
   - Payment of Gratuity Act, 1972 - Section 7
   - Shops and Establishments Act (State-specific)

4. **AI Response** (using ONLY above documents)
   ```
   YOUR LEGAL RIGHTS:
   1. Payment of Wages Act, 1936 - Section 5
      [Explains wage payment timelines]
   
   WHAT YOU SHOULD DO NOW:
   [Based on the retrieved documents]
   ```

---

## 🎯 Implementation Priority

### Phase 1 (MVP) - 2-3 weeks
- [ ] Set up Supabase pgvector
- [ ] Create 50-100 most common legal documents
- [ ] Implement basic retrieval system
- [ ] Update AI prompt to use retrieved docs

### Phase 2 (Enhancement) - 4-6 weeks
- [ ] Add 500+ legal documents
- [ ] State-specific laws
- [ ] Multi-language summaries
- [ ] Admin panel for document management

### Phase 3 (Production) - Ongoing
- [ ] 5000+ comprehensive legal database
- [ ] Automatic updates from government APIs
- [ ] User feedback loop for accuracy
- [ ] Legal review team

---

## ⚖️ Legal Disclaimer Enhancement

With RAG, we can add:
```
"This information is based on official legal documents as of [date].
Laws may have been amended. Source: [Act Name, Section, Official URL]
This is NOT legal advice. Consult a qualified lawyer for your situation."
```

---

## 📚 Resources

### Legal Document Sources
- https://indiankanoon.org - Judgments and citations
- https://legislative.gov.in - Central Acts
- https://www.india.gov.in - Government portals
- State government law portals

### Technical References
- Supabase pgvector: https://supabase.com/docs/guides/ai
- OpenAI Embeddings: https://platform.openai.com/docs/guides/embeddings
- LangChain RAG: https://js.langchain.com/docs/use_cases/question_answering

---

**Status: This is a roadmap document. Current system works without RAG but will be enhanced in future iterations.**
