import { GoogleGenerativeAI } from '@google/generative-ai';
import { Language, PetitionCategory } from '@/types';

// Lazy initialize Gemini AI
let genAI: GoogleGenerativeAI | null = null;

const getGenAI = () => {
  if (!genAI) {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'Google Gemini API key is missing. Please add GOOGLE_GEMINI_API_KEY to your .env.local file. ' +
        'Get your key from: https://makersuite.google.com/app/apikey'
      );
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
};

export interface GeneratePetitionRequest {
  category: PetitionCategory;
  problemDescription: string;
  personalImpact: string;
  desiredChange: string;
  location: string;
  language: Language;
}

export interface AIRightsRequest {
  query: string;
  language: Language;
  category?: PetitionCategory;
}

/**
 * Generate a professionally formatted petition using AI
 */
export async function generatePetition(request: GeneratePetitionRequest): Promise<string> {
  const model = getGenAI().getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `You are a legal assistant helping Indian citizens create formal petitions to government authorities.

Generate a professional petition in ${getLanguageName(request.language)} language with the following details:

Category: ${request.category}
Problem: ${request.problemDescription}
Personal Impact: ${request.personalImpact}
Desired Resolution: ${request.desiredChange}
Location: ${request.location}

REQUIREMENTS:
1. Use formal, respectful tone appropriate for government communication
2. Include relevant Indian laws and constitutional rights if applicable
3. Structure: Opening address, problem statement, impact, legal basis, request for action, closing
4. Keep it concise (300-500 words)
5. Make it specific and actionable
6. Use ${getLanguageName(request.language)} language throughout
7. Include proper salutation and closing

Generate ONLY the petition text, no additional commentary.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

/**
 * AI Rights Assistant - Provide legal guidance
 */
export async function getAIRightsGuidance(request: AIRightsRequest) {
  const model = getGenAI().getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `You are a legal rights assistant for Indian citizens. Answer in ${getLanguageName(request.language)} language.

User's Question: ${request.query}
${request.category ? `Category: ${request.category}` : ''}

Provide a structured response with these EXACT sections:

YOUR RIGHTS:
- List relevant legal rights
- Mention specific Indian laws (IPC sections, acts, constitutional articles)
- Be specific and cite actual provisions

WHAT YOU SHOULD DO NOW:
- Provide clear, step-by-step actionable advice
- Be practical and realistic
- Include documentation needed

WHERE TO COMPLAIN:
- Identify the correct authority/department
- Provide typical contact methods
- Mention any online portals

IMPORTANT:
1. Be accurate - cite real laws only
2. Be empowering - give clear next steps
3. Use simple language in ${getLanguageName(request.language)}
4. If you're unsure, say so and recommend consulting a lawyer
5. Keep response under 500 words`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

/**
 * Suggest authorities based on petition category and location
 */
export async function suggestAuthorities(
  category: PetitionCategory,
  state: string,
  city: string
): Promise<string> {
  const model = getGenAI().getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `Suggest the correct government authority for this complaint:

Category: ${category}
State: ${state}
City: ${city}

Provide:
1. Specific authority/officer designation (e.g., Municipal Commissioner, District Collector)
2. Department name
3. Typical way to find their contact (e.g., city municipal website)

Keep response brief and actionable.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

/**
 * Generate email content for authority
 */
export async function generateAuthorityEmail(
  petitionTitle: string,
  petitionContent: string,
  signatureCount: number,
  location: string
): Promise<{ subject: string; body: string }> {
  const model = getGenAI().getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `Generate a formal email to send to a government authority.

Petition Title: ${petitionTitle}
Location: ${location}
Signatures: ${signatureCount} verified citizens

Base Content:
${petitionContent}

Create:
1. Professional email subject line
2. Email body that includes:
   - Brief introduction
   - The petition content
   - Emphasis on ${signatureCount} citizens supporting this
   - Polite request for action
   - Contact information placeholder

Format as JSON: {"subject": "...", "body": "..."}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  try {
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Error parsing AI response:', e);
  }

  // Fallback
  return {
    subject: `Citizen Petition: ${petitionTitle}`,
    body: petitionContent
  };
}

function getLanguageName(code: Language): string {
  const names: Record<Language, string> = {
    en: 'English',
    hi: 'Hindi (हिंदी)',
    ta: 'Tamil (தமிழ்)',
    te: 'Telugu (తెలుగు)',
    bn: 'Bengali (বাংলা)',
    mr: 'Marathi (मराठी)',
    gu: 'Gujarati (ગુજરાતી)',
    kn: 'Kannada (ಕನ್ನಡ)',
    ml: 'Malayalam (മലയാളം)',
    pa: 'Punjabi (ਪੰਜਾਬੀ)',
    or: 'Odia (ଓଡ଼ିଆ)',
  };
  return names[code] || 'English';
}
