import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client on the server side
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { action, data, targetRole } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured on server' },
        { status: 500 }
      );
    }

    let result;

    switch (action) {
      case 'parseResume':
        result = await parseResumeWithAI(data, targetRole);
        break;
      case 'enhanceResume':
        result = await enhanceResumeWithAI(data, targetRole);
        break;
      case 'generateBulletPoints':
        result = await generateBulletPointsWithAI(data, targetRole);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request with AI' },
      { status: 500 }
    );
  }
}

async function parseResumeWithAI(resumeText: string, targetRole: string) {
  const SYSTEM_PROMPT = `You are an expert finance resume consultant specializing in investment banking, private equity, asset management, and corporate finance. You help students and professionals create compelling, ATS-friendly finance resumes.

Key Guidelines:
- Use strong action verbs (led, developed, analyzed, executed, managed)
- Quantify achievements with numbers, percentages, and dollar amounts
- Focus on finance-specific skills and terminology
- Ensure bullet points are 18-26 words, single line
- No first-person pronouns
- Emphasize leadership, analytical skills, and results
- Use finance industry standard language

IMPORTANT: When parsing resumes, you must extract and structure information into these EXACT categories:
- header: name, email, phone, location, linkedin
- education: school, degree, major, graduationYear, gpa, location, awards, coursework, competitions
- experience: company, title, location, startDate, endDate, groupName, summary, bullets (array of ExperienceBullet objects)
- leadership: organization, role, location, startDate, endDate, bullets
- projects: name, startDate, endDate, bullets
- skills: technical (array), financeTools (array), languages (array), programming (array)
- certifications: name, issuer, date
- deals: type, size, role, tasks (array), outcome
- activities: array of strings
- interests: array of strings`;

  const prompt = `
${SYSTEM_PROMPT}

CRITICAL INSTRUCTIONS: Parse the following resume text and extract structured information for a ${targetRole} position. You MUST return a valid JSON object that matches the ParsedResume interface exactly.

Resume Text:
${resumeText}

EXTRACTION REQUIREMENTS:
1. HEADER: Extract name, email, phone, location, and LinkedIn (if available)
2. EDUCATION: Look for schools, degrees, majors, graduation years, GPAs, locations, awards, coursework, competitions
3. EXPERIENCE: Find companies, job titles, locations, dates, group names, summaries, and bullet points
4. LEADERSHIP: Identify organizations, roles, dates, locations, and achievements
5. PROJECTS: Extract project names, dates, descriptions, and outcomes
6. SKILLS: Categorize into technical, finance tools, languages, and programming
7. ACTIVITIES: Extract extracurricular activities and interests
8. CERTIFICATIONS: Find certifications, issuers, and dates
9. DEALS: Look for financial transactions, deal sizes, roles, and outcomes

FORMAT REQUIREMENTS:
- Return ONLY valid JSON that matches the ParsedResume interface
- Use empty arrays [] for missing sections
- Use empty strings "" for missing individual fields
- Ensure all dates are in string format
- Convert bullet points to ExperienceBullet objects with id, text, and enhancementLevel
- Categorize skills properly into the correct arrays

Return ONLY the JSON object, no additional text or explanations.`;

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  const response = result.response.text();

  if (!response) {
    throw new Error('No response from AI');
  }

  // Clean the response to extract just the JSON
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('AI response does not contain valid JSON');
  }

  return JSON.parse(jsonMatch[0]);
}

async function enhanceResumeWithAI(resume: any, targetRole: string) {
  const SYSTEM_PROMPT = `You are an expert finance resume consultant specializing in investment banking, private equity, asset management, and corporate finance. You help students and professionals create compelling, ATS-friendly finance resumes.

Key Guidelines:
- Use strong action verbs (led, developed, analyzed, executed, managed)
- Quantify achievements with numbers, percentages, and dollar amounts
- Focus on finance-specific skills and terminology
- Ensure bullet points are 18-26 words, single line
- No first-person pronouns
- Emphasize leadership, analytical skills, and results
- Use finance industry standard language`;

  const prompt = `
${SYSTEM_PROMPT}

Please enhance this finance resume for a ${targetRole} position. Analyze the existing content and provide:

1. Enhanced bullet points (improve existing ones with stronger verbs, quantification, finance terminology)
2. Suggested projects/transactions to add (based on what's missing)
3. Suggested skills to add (finance tools, technical skills, certifications)
4. Suggested deals/transactions (if applicable)
5. Gap analysis (what's missing for this role)

Current Resume:
${JSON.stringify(resume, null, 2)}

Focus on:
- Making bullet points more impactful and finance-specific
- Adding missing finance elements
- Optimizing for ${targetRole} requirements
- Ensuring ATS compatibility

Return as JSON with: enhancedBullets (array), suggestedProjects (array), suggestedSkills (array), suggestedDeals (array), gapAnalysis (array)`;

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  const response = result.response.text();

  if (!response) {
    throw new Error('No response from AI');
  }

  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('AI response does not contain valid JSON');
  }

  return JSON.parse(jsonMatch[0]);
}

async function generateBulletPointsWithAI(notes: string, context: string, targetRole: string) {
  const SYSTEM_PROMPT = `You are an expert finance resume consultant specializing in investment banking, private equity, asset management, and corporate finance. You help students and professionals create compelling, ATS-friendly finance resumes.

Key Guidelines:
- Use strong action verbs (led, developed, analyzed, executed, managed)
- Quantify achievements with numbers, percentages, and dollar amounts
- Focus on finance-specific skills and terminology
- Ensure bullet points are 18-26 words, single line
- No first-person pronouns
- Emphasize leadership, analytical skills, and results
- Use finance industry standard language`;

  const prompt = `
${SYSTEM_PROMPT}

Generate 3-5 compelling bullet points for a ${targetRole} resume based on these notes:

Notes: ${notes}
Context: ${context}

Requirements:
- Use strong action verbs
- Quantify achievements where possible
- Focus on finance-specific outcomes
- 18-26 words per bullet
- No first-person pronouns
- Emphasize leadership, analysis, and results

Return as a JSON array of strings.`;

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  const response = result.response.text();

  if (!response) {
    throw new Error('No response from AI');
  }

  const jsonMatch = response.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('AI response does not contain valid JSON array');
  }

  return JSON.parse(jsonMatch[0]);
}
