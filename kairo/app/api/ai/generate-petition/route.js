import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const getClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }
  return new Groq({ apiKey });
};

const buildPrompt = ({ whatAbout, whyImportant, personalStory, category, target, language }) => {
  const base = {
    en: `You are helping a citizen draft a short, clear petition. Use a respectful, civic tone.\n\nDetails:\n- Topic: ${whatAbout}\n- Why it matters: ${whyImportant}\n- Personal story: ${personalStory}\n- Category: ${category || 'General'}\n- Target authority: ${target || 'Local Authority'}\n\nReturn ONLY valid JSON with keys: title, description.\nTitle: max 12 words.\nDescription: 2 short paragraphs, total under 120 words.`,
    hi: `आप एक नागरिक की संक्षिप्त और स्पष्ट याचिका तैयार करने में मदद कर रहे हैं। भाषा सरल और सम्मानजनक रखें।\n\nविवरण:\n- विषय: ${whatAbout}\n- महत्व: ${whyImportant}\n- व्यक्तिगत कहानी: ${personalStory}\n- श्रेणी: ${category || 'सामान्य'}\n- लक्षित प्राधिकरण: ${target || 'स्थानीय प्राधिकरण'}\n\nकृपया केवल वैध JSON लौटाएं जिसमें keys हों: title, description।\nTitle: अधिकतम 12 शब्द।\nDescription: 2 छोटे पैराग्राफ, कुल 120 शब्द से कम।`,
  };

  return base[language === 'hi' ? 'hi' : 'en'];
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { whatAbout, whyImportant, personalStory, category, target, language } = body;

    if (!whatAbout || !whyImportant) {
      return NextResponse.json(
        { error: 'Please provide the petition details' },
        { status: 400 }
      );
    }

    const groq = getClient();
    const prompt = buildPrompt({
      whatAbout,
      whyImportant,
      personalStory: personalStory || '',
      category,
      target,
      language,
    });

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'openai/gpt-oss-20b',
      temperature: 0.7,
    });

    const raw = completion.choices?.[0]?.message?.content || '';

    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      parsed = null;
    }

    if (!parsed || !parsed.title || !parsed.description) {
      return NextResponse.json(
        { error: 'AI response could not be parsed. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { title: parsed.title, description: parsed.description },
      { status: 200 }
    );
  } catch (error) {
    console.error('AI petition error:', error);
    const message = error?.message === 'GROQ_API_KEY is not configured'
      ? 'GROQ API key not configured'
      : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
