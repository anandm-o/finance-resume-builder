import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';

// Minimal schema matching your ParsedResume shape
const ParsedResumeSchema = {
  type: 'object',
  properties: {
    header: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        location: { type: 'string' },
        linkedin: { type: 'string' },
      },
      required: ['name', 'email', 'phone', 'location', 'linkedin'],
    },
    education: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          school: { type: 'string' },
          degree: { type: 'string' },
          major: { type: 'string' },
          graduationYear: { type: 'string' },
          gpa: { type: 'string' },
          location: { type: 'string' },
          awards: { type: 'array', items: { type: 'string' } },
          coursework: { type: 'array', items: { type: 'string' } },
          competitions: { type: 'array', items: { type: 'string' } },
        },
        required: ['school'],
      },
    },
    experience: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          company: { type: 'string' },
          title: { type: 'string' },
          location: { type: 'string' },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          groupName: { type: 'string' },
          summary: { type: 'string' },
          bullets: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                text: { type: 'string' },
                enhancementLevel: { type: 'string' },
              },
              required: ['id', 'text'],
            },
          },
        },
        required: ['company'],
      },
    },
    extraCurricular: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          organization: { type: 'string' },
          role: { type: 'string' },
          location: { type: 'string' },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          bullets: { type: 'array', items: { type: 'string' } },
        },
        required: ['organization'],
      },
    },
    skills: {
      type: 'object',
      properties: {
        technical: { type: 'array', items: { type: 'string' } },
        financeTools: { type: 'array', items: { type: 'string' } },
        languages: { type: 'array', items: { type: 'string' } },
        programming: { type: 'array', items: { type: 'string' } },
      },
      required: ['technical', 'financeTools', 'languages', 'programming'],
    },

    activities: { type: 'array', items: { type: 'string' } },
    interests: { type: 'array', items: { type: 'string' } },
  },
  required: [
    'header',
    'education',
    'experience',
    'extraCurricular',
    'skills',
    'activities',
    'interests',
  ],
} as const;

const PARSER_SYSTEM_PROMPT = `
You are an expert finance resume parser. Return ONLY valid JSON matching the provided schema.
- Do not include markdown, code fences, or commentary.
- Extract exact text from the resume (no rewriting).
- Use empty strings for missing scalar fields and empty arrays for missing lists.
- Keep dates and amounts as free-form strings if needed (e.g., "Jan 2025 – Apr 2025", "$9M").
- Convert bullets into objects: { id: "<stable-id>", text: "<exact bullet>", enhancementLevel: "original" }.

TEMPLATE STRUCTURE:
- EDUCATION: School, degree, major, graduation year, GPA, location, awards, coursework, competitions
- EMPLOYMENT EXPERIENCE: Company, title, location, dates, bullets (with optional selected projects)
- EXTRA-CURRICULAR EXPERIENCE: Organization, role, location, dates, bullets
- SKILLS, ACTIVITIES & INTERESTS: Technical skills, finance tools, languages, programming, activities, interests

For extraCurricular, extract from sections like "LEADERSHIP", "PROJECTS", "CLUBS", "VOLUNTEER WORK", etc.
`;

const ENHANCER_SYSTEM_PROMPT = `
You are an expert finance resume consultant for IB/PE/AM/CorpFin.
- Strong action verbs, quantified results, finance terminology.
- 18–26 words per bullet, no first-person.
- Return ONLY JSON as requested.
`;

export async function POST(request: NextRequest) {
  // Make sure we never reference undefined locals in catch
  let actionSafe: string | undefined;
  try {
    const body = await request.json().catch(() => ({}));
    const { action, data, targetRole } = (body || {}) as {
      action?: string;
      data?: any;
      targetRole?: string;
    };
    actionSafe = action;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured on server' },
        { status: 500 }
      );
    }
    const genAI = new GoogleGenerativeAI(apiKey);

    if (action === 'parseResume') {
      if (typeof data !== 'string') {
        return NextResponse.json({ error: 'Expected resume text' }, { status: 400 });
      }
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: PARSER_SYSTEM_PROMPT,
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json',
          responseSchema: ParsedResumeSchema as any,
          maxOutputTokens: 4096,
        },
      });

      const resp = await model.generateContent([
        { text: `Target role: ${targetRole || 'Finance Analyst'}` },
        { text: `Resume text:\n${data}` },
      ]);

      const json = resp.response.text(); // guaranteed JSON text
      console.log('Gemini response length:', json.length);
      
      try {
        return NextResponse.json(JSON.parse(json));
      } catch (parseError: any) {
        console.error('JSON parse error:', parseError);
        console.error('Response text (first 1000 chars):', json.substring(0, 1000));
        console.error('Response text (last 1000 chars):', json.substring(Math.max(0, json.length - 1000)));
        
        // Try to fix common JSON issues
        let fixedText = json;
        
        // Remove any trailing incomplete JSON
        const lastBrace = fixedText.lastIndexOf('}');
        if (lastBrace > 0) {
          fixedText = fixedText.substring(0, lastBrace + 1);
        }
        
        // Try parsing again
        try {
          return NextResponse.json(JSON.parse(fixedText));
        } catch (secondError) {
          return NextResponse.json(
            { error: 'AI response was malformed. Please try again or upload a shorter resume.' },
            { status: 500 }
          );
        }
      }
    }

    if (action === 'enhanceResume') {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: ENHANCER_SYSTEM_PROMPT,
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
          maxOutputTokens: 2048,
        },
      });

      const resp = await model.generateContent([
        {
          text:
            `Enhance for ${targetRole || 'Investment Banking Analyst'}.\n` +
            `Return JSON with keys: enhancedBullets (string[]), suggestedProjects (string[]), ` +
            `suggestedSkills (string[]), suggestedDeals (string[]), gapAnalysis (string[]).\n`,
        },
        { text: `Current resume JSON:\n${JSON.stringify(data ?? {}, null, 2)}` },
      ]);

      const json = resp.response.text();
      try {
        return NextResponse.json(JSON.parse(json));
      } catch (parseError: any) {
        console.error('JSON parse error in enhanceResume:', parseError);
        return NextResponse.json(
          { error: 'AI response was malformed. Please try again.' },
          { status: 500 }
        );
      }
    }

    if (action === 'generateBulletPoints') {
      const { notes, context } = (data || {}) as { notes?: string; context?: string };
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: ENHANCER_SYSTEM_PROMPT,
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
          maxOutputTokens: 1024,
        },
      });

      const resp = await model.generateContent([
        {
          text:
            `Generate 3–5 bullets for ${targetRole || 'IB Analyst'} from the notes/context. ` +
            `Return ONLY a JSON array of strings.`,
        },
        { text: `Notes:\n${notes || ''}\nContext:\n${context || ''}` },
      ]);

      const json = resp.response.text();
      try {
        return NextResponse.json(JSON.parse(json));
      } catch (parseError: any) {
        console.error('JSON parse error in generateBulletPoints:', parseError);
        return NextResponse.json(
          { error: 'AI response was malformed. Please try again.' },
          { status: 500 }
        );
      }
    }

    if (action === 'analyzeATS') {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: ENHANCER_SYSTEM_PROMPT,
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json',
          maxOutputTokens: 1024,
        },
      });

      const resp = await model.generateContent([
        {
          text:
            `Analyze ATS fitness for ${targetRole || 'IB Analyst'} and return JSON: ` +
            `{ "score": number, "suggestions": string[], "missingKeywords": string[] }`,
        },
        { text: `Resume JSON:\n${JSON.stringify(data ?? {}, null, 2)}` },
      ]);

      const json = resp.response.text();
      try {
        return NextResponse.json(JSON.parse(json));
      } catch (parseError: any) {
        console.error('JSON parse error in analyzeATS:', parseError);
        return NextResponse.json(
          { error: 'AI response was malformed. Please try again.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
  } catch (err: any) {
    console.error('Gemini API error:', err);
    // only use the safe variable
    console.error('Error context:', { action: actionSafe || 'unknown' });
    return NextResponse.json(
      { error: 'Failed to process request with AI', details: err?.message || 'unknown' },
      { status: 500 }
    );
  }
}