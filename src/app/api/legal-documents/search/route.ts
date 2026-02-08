import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Search legal documents using semantic similarity
 */
export async function POST(request: NextRequest) {
  try {
    const { query, category, matchThreshold = 0.7, matchCount = 5 } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Generate embedding for the query
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: query,
      encoding_format: 'float',
    });

    const queryEmbedding = embeddingResponse.data[0].embedding;

    // Search for similar documents in Supabase
    const supabaseAdmin = getSupabaseAdmin();
    
    let rpcQuery = supabaseAdmin.rpc('search_legal_documents', {
      query_embedding: queryEmbedding,
      match_threshold: matchThreshold,
      match_count: matchCount,
    });

    // Add category filter if provided
    if (category) {
      const { data: filteredData, error: filterError } = await rpcQuery;
      if (filterError) throw filterError;
      
      const filtered = (filteredData || []).filter((doc: any) => 
        doc.categories?.includes(category)
      );
      
      return NextResponse.json({ 
        documents: filtered,
        count: filtered.length,
        query,
        category 
      });
    }

    const { data, error } = await rpcQuery;

    if (error) {
      console.error('Supabase search error:', error);
      throw error;
    }

    return NextResponse.json({ 
      documents: data || [],
      count: (data || []).length,
      query 
    });
  } catch (error: any) {
    console.error('Error searching legal documents:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search legal documents' },
      { status: 500 }
    );
  }
}
