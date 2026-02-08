# RAG SYSTEM SETUP INSTRUCTIONS

This guide will help you complete the RAG (Retrieval-Augmented Generation) system setup for KAIRO.

## ✅ What's Already Done

1. **Database Schema**: `supabase-rag-schema.sql` is ready with:
   - `legal_documents` table with vector embeddings (384 dimensions)
   - `rag_query_logs` for tracking searches
   - Vector similarity search function
   - Proper indexes and RLS policies

2. **API Routes**: All RAG endpoints are implemented:
   - `/api/rag/embed` - Generate embeddings (HuggingFace)
   - `/api/rag/search` - Semantic search for legal documents
   - `/api/rag/documents` - CRUD operations for legal documents

3. **AI Integration**: `src/lib/ai.ts` updated to use RAG search before generating responses

4. **Seed Script**: 30+ common Indian laws ready to be imported

## 🔧 Setup Steps

### Step 1: Execute Database Schema

1. Go to your Supabase project: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Copy the entire contents of `supabase-rag-schema.sql`
4. Paste into SQL Editor and click **Run**
5. Verify tables created: Check "Table Editor" - you should see `legal_documents` and `rag_query_logs`

### Step 2: Get HuggingFace API Key (Optional but Recommended)

**Why?** Without this, embeddings will use a simple fallback method that won't give accurate semantic search results.

1. Go to https://huggingface.co/settings/tokens
2. Create a free account if you don't have one
3. Click **New token**
4. Name: "KAIRO RAG System"
5. Type: **Read**
6. Click **Generate**
7. Copy the token (starts with `hf_...`)

8. Add to `.env.local`:
   ```env
   HUGGINGFACE_API_KEY=hf_your_token_here
   ```

9. Restart dev server:
   ```bash
   npm run dev
   ```

### Step 3: Seed Legal Documents

**IMPORTANT**: Make sure your Next.js dev server is running first in one terminal:
```bash
npm run dev
```

Then in another terminal, run the seed script to populate the database with initial legal documents:

```bash
node scripts/seed-legal-documents.mjs
```

This will:
- Insert 30+ common Indian laws (Consumer, Criminal, Labour, RTI, etc.)
- Automatically generate embeddings for each document
- Show progress and summary

Expected output:
```
🌱 Starting legal documents seeding...
📄 Adding: Consumer Protection Act, 2019 - 2(7)
   ✅ Success (ID: ...)
...
📊 Seeding Summary:
   ✅ Success: 30
   ❌ Failed: 0
   📝 Total: 30
✅ Embeddings generated: 30 documents
✨ Seeding complete!
```

### Step 4: Test RAG System

#### Test 1: Search API

```bash
curl -X POST http://localhost:3000/api/rag/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are my rights as a consumer?",
    "limit": 3,
    "threshold": 0.5
  }'
```

Expected: Should return top 3 relevant consumer protection laws.

#### Test 2: AI Rights Guidance (End-to-End)

In your KAIRO app:
1. Go to "Know Your Rights" section
2. Ask: "What should I do if I bought a defective product?"
3. Expected response:
   - Cites Consumer Protection Act, 2019
   - Mentions Section 2(9) about defects
   - Provides step-by-step actions
   - Lists where to complain (District Consumer Forum)
   - Includes SOURCES section with Act names

#### Test 3: Verify Documents in Database

Go to Supabase Dashboard → Table Editor → `legal_documents`

You should see 30+ rows with:
- `act_name`, `section_number`, `title`, `content`
- `embedding` column filled (not NULL)
- `keywords`, `categories` arrays populated

## 🎯 What Happens Now?

### How RAG Works in KAIRO:

1. **User asks question**: "What are my labour rights?"

2. **RAG Search**: 
   - System converts question to 384-dim vector embedding
   - Searches `legal_documents` table using cosine similarity
   - Retrieves top 5 most relevant laws

3. **AI Response**:
   - Retrieved laws are passed to Groq AI
   - AI generates response ONLY from these verified documents
   - AI cites exact Act names and Section numbers
   - AI admits if no relevant law found in database

4. **User gets accurate answer**:
   - Based on real Indian laws
   - With proper citations
   - No AI hallucination
   - With source URLs

## 🔍 Monitoring & Maintenance

### View Query Logs

```sql
-- See what users are searching for
SELECT query, results_count, created_at 
FROM rag_query_logs 
ORDER BY created_at DESC 
LIMIT 20;
```

### Add More Legal Documents

Use the API endpoint:

```bash
curl -X POST http://localhost:3000/api/rag/documents \
  -H "Content-Type: application/json" \
  -d '{
    "act_name": "Food Safety and Standards Act, 2006",
    "section_number": "59",
    "title": "Penalty for Unsafe Food",
    "content": "Full legal text here...",
    "plain_language_summary": "Simple explanation...",
    "keywords": ["food safety", "penalty"],
    "categories": ["consumer-protection", "public-health"],
    "jurisdiction": "Central"
  }'
```

Embedding will be generated automatically if `HUGGINGFACE_API_KEY` is set.

### Regenerate All Embeddings

If you update the embedding model or fix old documents:

```bash
curl -X PUT http://localhost:3000/api/rag/embed
```

This processes 100 documents without embeddings.

## 📈 Performance Tips

1. **Add More Documents**: The more laws in the database, the better answers users get. Aim for 100+ documents covering common scenarios.

2. **Update Regularly**: Indian laws change. Update `effective_from`, `amended_on`, and `status` fields regularly.

3. **Monitor Search Quality**: Check `rag_query_logs` to see what users search for. Add documents for frequently searched topics with no results.

4. **Optimize Categories**: Use consistent category names for better filtering:
   - `consumer-protection`
   - `labour`
   - `criminal`
   - `women-rights`
   - `child-rights`
   - `environmental`
   - `traffic`
   - `disability-rights`

## 🚨 Troubleshooting

### "No relevant documents found"

**Cause**: Database empty or embeddings not generated.

**Fix**:
```bash
# Check if documents exist
curl http://localhost:3000/api/rag/documents?limit=5

# If empty, run seed script
npx ts-node scripts/seed-legal-documents.ts
```

### "Embedding generation failed"

**Cause**: No `HUGGINGFACE_API_KEY` in `.env.local`.

**Fix**: Add the API key (Step 2 above) OR accept fallback embeddings (less accurate).

### "Search returns irrelevant results"

**Cause**: Fallback embeddings being used (not semantic).

**Fix**: Add `HUGGINGFACE_API_KEY` and regenerate embeddings:
```bash
curl -X PUT http://localhost:3000/api/rag/embed
```

### "Query logs not working"

**Cause**: RLS policies blocking inserts.

**Fix**: Check Supabase RLS policies on `rag_query_logs` table. Service role should be able to insert.

## 🎓 Next Steps

1. **Build Admin UI**: Create `/dashboard/admin/legal-documents` page for:
   - Adding new laws via web interface
   - Viewing search analytics
   - Bulk import/export
   - Regenerating embeddings

2. **Expand Coverage**: Add more laws for:
   - Property rights
   - Marriage & divorce
   - Taxation
   - Business regulations
   - State-specific laws

3. **Multilingual Support**: Add Hindi translations of laws for better accessibility.

4. **Source Verification**: Add `government_gazette_reference` for legal authenticity.

## ✅ Success Checklist

- [ ] Database schema executed successfully
- [ ] HuggingFace API key added to `.env.local`
- [ ] 30+ legal documents seeded
- [ ] Embeddings generated (all documents have embedding vectors)
- [ ] Search API returns relevant results
- [ ] AI rights guidance cites real laws from database
- [ ] Query logs are recording searches

Once all checked, your RAG system is **PRODUCTION READY**! 🎉

## 📚 Resources

- HuggingFace Models: https://huggingface.co/sentence-transformers
- Supabase pgvector: https://supabase.com/docs/guides/ai/vector-embeddings
- Indian Laws: https://www.indiacode.nic.in/
- Consumer Rights: https://consumeraffairs.nic.in/
- Labour Laws: https://labour.gov.in/

---

**Need Help?** Check the API routes in `src/app/api/rag/` for implementation details.
