import { NextResponse } from 'next/server';

const getBaseUrl = () => {
  const baseUrl =
    process.env.RAG_API_BASE_URL ||
    process.env.NEXT_PUBLIC_RAG_API_BASE_URL;

  if (!baseUrl) {
    throw new Error('RAG_API_BASE_URL is not configured');
  }

  return baseUrl.replace(/\/+$/, '');
};

export async function POST(request) {
  try {
    const body = await request.json();
    const question =
      typeof body?.question === 'string' ? body.question.trim() : '';

    if (!question) {
      return NextResponse.json(
        { error: 'Please provide a question.' },
        { status: 400 }
      );
    }

    const baseUrl = getBaseUrl();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    let response;
    try {
      response = await fetch(`http://127.0.0.1:8000/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
        cache: 'no-store',
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    // Parse response safely
    const contentType = response.headers.get('content-type') || '';
    let data;

    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { result: text };
    }

    // Handle non-200 responses
    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data?.error ||
            data?.result ||
            data?.answer ||
            'RAG service error.',
        },
        { status: 502 }
      );
    }

    // Accept both "result" and "answer"
    const result = data?.result || data?.answer;

    if (typeof result !== 'string') {
      return NextResponse.json(
        { error: 'Unexpected RAG response format.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    const isTimeout = error?.name === 'AbortError';

    const message =
      error?.message === 'RAG_API_BASE_URL is not configured'
        ? 'RAG API base URL is not configured.'
        : isTimeout
        ? 'RAG service timed out. Please try again.'
        : 'Internal server error.';

    console.error('RAG ask error:', error);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
