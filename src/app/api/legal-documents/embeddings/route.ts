import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate and store embeddings for all legal documents that don't have them yet
 */
export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Get all documents without embeddings
    const { data: documents, error: fetchError } = await supabaseAdmin
      .from('legal_documents')
      .select('id, title, content, plain_language_summary, keywords')
      .is('embedding', null)
      .eq('status', 'active');

    if (fetchError) {
      throw fetchError;
    }

    if (!documents || documents.length === 0) {
      return NextResponse.json({
        message: 'All documents already have embeddings',
        processed: 0,
      });
    }

    const results = {
      processed: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Process each document
    for (const doc of documents) {
      try {
        // Create a rich text representation for embedding
        const textForEmbedding = `
Title: ${doc.title}
Content: ${doc.content}
Summary: ${doc.plain_language_summary || ''}
Keywords: ${doc.keywords?.join(', ') || ''}
        `.trim();

        // Generate embedding
        const embeddingResponse = await openai.embeddings.create({
          model: 'text-embedding-ada-002',
          input: textForEmbedding,
          encoding_format: 'float',
        });

        const embedding = embeddingResponse.data[0].embedding;

        // Update document with embedding
        const { error: updateError } = await supabaseAdmin
          .from('legal_documents')
          .update({ embedding })
          .eq('id', doc.id);

        if (updateError) {
          throw updateError;
        }

        results.processed++;
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error: any) {
        results.failed++;
        results.errors.push(`${doc.title}: ${error.message}`);
        console.error(`Failed to process document ${doc.id}:`, error);
      }
    }

    return NextResponse.json({
      message: 'Embedding generation complete',
      ...results,
      total: documents.length,
    });
  } catch (error: any) {
    console.error('Error generating embeddings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate embeddings' },
      { status: 500 }
    );
  }
}

/**
 * Get embedding generation status
 */
export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { count: totalCount } = await supabaseAdmin
      .from('legal_documents')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { count: withEmbeddings } = await supabaseAdmin
      .from('legal_documents')
      .select('*', { count: 'exact', head: true })
      .not('embedding', 'is', null)
      .eq('status', 'active');

    const { count: withoutEmbeddings } = await supabaseAdmin
      .from('legal_documents')
      .select('*', { count: 'exact', head: true })
      .is('embedding', null)
      .eq('status', 'active');

    return NextResponse.json({
      total: totalCount || 0,
      withEmbeddings: withEmbeddings || 0,
      withoutEmbeddings: withoutEmbeddings || 0,
      progress: totalCount ? ((withEmbeddings || 0) / totalCount * 100).toFixed(1) : 0,
    });
  } catch (error: any) {
    console.error('Error getting embedding status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get status' },
      { status: 500 }
    );
  }
}
