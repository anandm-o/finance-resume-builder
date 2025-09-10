import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

const MODEL = google("gemini-2.5-flash-lite");

// Retry utility function
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Log the error for debugging
      console.error(`Attempt ${attempt + 1} failed:`, {
        error: lastError.message,
        name: lastError.name,
        stack: lastError.stack?.split("\n").slice(0, 3).join("\n"),
      });

      if (attempt === maxRetries) {
        throw lastError;
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      console.log(`Retrying in ${Math.round(delay)}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

// Clean JSON response utility
function cleanJsonResponse(text: string): string {
  return text
    .replace(/\t/g, "") // Remove tabs
    .replace(/\n\s*\n/g, "\n") // Remove multiple newlines
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

export const runtime = "nodejs";

// Individual Zod schemas for each resume section
const HeaderSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  linkedin: z.string(),
});

const EducationSchema = z.array(
  z.object({
    school: z.string(),
    degree: z.string().optional(),
    major: z.string().optional(),
    graduationYear: z.string().optional(),
    gpa: z.string().optional(),
    location: z.string().optional(),
    awards: z.array(z.string()).optional(),
    coursework: z.array(z.string()).optional(),
    competitions: z.array(z.string()).optional(),
  }),
);

const ExperienceSchema = z.array(
  z.object({
    company: z.string(),
    title: z.string().optional(),
    location: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    groupName: z.string().optional(),
    summary: z.string().optional(),
    bullets: z
      .array(
        z.object({
          id: z.string(),
          text: z.string(),
          enhancementLevel: z.string().optional(),
        }),
      )
      .optional(),
  }),
);

const ExtraCurricularSchema = z.array(
  z.object({
    organization: z.string(),
    role: z.string().optional(),
    location: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    bullets: z.array(z.string()).optional(),
  }),
);

const SkillsSchema = z.object({
  technical: z.array(z.string()),
  financeTools: z.array(z.string()),
  languages: z.array(z.string()),
  programming: z.array(z.string()),
});

const ActivitiesSchema = z.array(z.string());
const InterestsSchema = z.array(z.string());

// Combined schema for final validation
const ParsedResumeSchema = z.object({
  header: HeaderSchema,
  education: EducationSchema,
  experience: ExperienceSchema,
  extraCurricular: ExtraCurricularSchema,
  skills: SkillsSchema,
  activities: ActivitiesSchema,
  interests: InterestsSchema,
});

const SECTION_PARSER_PROMPT = `
You are an expert finance resume parser. Extract the specific section information according to the provided schema.

CONTENT RULES:
- Extract exact text from resume (no rewriting or enhancement)
- Keep dates as simple strings: "Jan 2025 - Apr 2025"
- Keep amounts as simple strings: "$9M", "100+"
- Convert bullets to: {"id": "unique-id", "text": "exact bullet text", "enhancementLevel": "original"}
- Use empty strings "" for missing fields, empty arrays [] for missing lists
- Focus only on the requested section, ignore other sections

JSON OUTPUT RULES:
- Return ONLY valid JSON, no additional text or explanations
- NO tabs or special characters in JSON values
- Use proper JSON escaping for quotes and special characters
- Ensure all JSON is properly formatted and complete
- Do not include partial or malformed JSON structures
`;

const ENHANCER_SYSTEM_PROMPT = `
You are an expert finance resume consultant for IB/PE/AM/CorpFin.
- Strong action verbs, quantified results, finance terminology.
- 18–26 words per bullet, no first-person.
- Return structured JSON as requested.
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
        { error: "Gemini API key not configured on server" },
        { status: 500 },
      );
    }

    // Configure the Google provider - it uses GOOGLE_GENERATIVE_AI_API_KEY env var automatically
    // Set the environment variable for this request
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = apiKey;
    const model = MODEL;

    if (action === "parseResume") {
      if (typeof data !== "string") {
        return NextResponse.json(
          { error: "Expected resume text" },
          { status: 400 },
        );
      }

      // Step 1: Clean and extract readable text from the malformed PDF text
      const { object: cleanedResult } = await retryWithBackoff(() =>
        generateObject({
          model,
          prompt: `
You are a text cleaning expert. I have extracted text from a PDF resume, but it's malformed with missing spaces, character spacing issues, and formatting problems.

Your task: Clean this text and make it readable and properly formatted.

Rules:
- Add proper spacing between words
- Fix character spacing issues
- Keep the original content but make it readable
- Maintain the structure (sections, bullet points, etc.)
- Return ONLY the cleaned text, no explanations
- Remove tabs and normalize whitespace

Malformed text:
${data}

Cleaned text:`,
          schema: z.object({
            text: z
              .string()
              .describe("The cleaned and properly formatted resume text"),
          }),
          temperature: 0.1,
        }),
      );

      const cleanedText = cleanedResult.text;

      console.log("Cleaned text length:", cleanedText.length);
      console.log("Cleaned text preview:", cleanedText.substring(0, 500));

      // Step 2: Parse each section in parallel using Promise.all with retries
      const basePrompt = `Target role: ${targetRole || "Finance Analyst"}

Clean resume text:
${cleanedText}`;

      const [
        headerResult,
        educationResult,
        experienceResult,
        extraCurricularResult,
        skillsResult,
        activitiesResult,
        interestsResult,
      ] = await Promise.all([
        // Parse Header with retry
        retryWithBackoff(() =>
          generateObject({
            model,
            system: SECTION_PARSER_PROMPT,
            prompt: `${basePrompt}

Extract the HEADER section (name, email, phone, location, linkedin).`,
            schema: z.object({ header: HeaderSchema }),
            temperature: 0.1,
          }),
        ),

        // Parse Education with retry
        retryWithBackoff(() =>
          generateObject({
            model,
            system: SECTION_PARSER_PROMPT,
            prompt: `${basePrompt}

Extract the EDUCATION section (schools, degrees, majors, graduation years, GPA, locations, awards, coursework, competitions).`,
            schema: z.object({ education: EducationSchema }),
            temperature: 0.1,
          }),
        ),

        // Parse Experience with retry
        retryWithBackoff(() =>
          generateObject({
            model,
            system: SECTION_PARSER_PROMPT,
            prompt: `${basePrompt}

Extract the EMPLOYMENT EXPERIENCE section (companies, titles, locations, dates, bullets).`,
            schema: z.object({ experience: ExperienceSchema }),
            temperature: 0.1,
          }),
        ),

        // Parse Extra Curricular with retry
        retryWithBackoff(() =>
          generateObject({
            model,
            system: SECTION_PARSER_PROMPT,
            prompt: `${basePrompt}

Extract the EXTRA-CURRICULAR section (leadership, projects, clubs, organizations, roles, locations, dates, bullets).`,
            schema: z.object({ extraCurricular: ExtraCurricularSchema }),
            temperature: 0.1,
          }),
        ),

        // Parse Skills with retry
        retryWithBackoff(() =>
          generateObject({
            model,
            system: SECTION_PARSER_PROMPT,
            prompt: `${basePrompt}

Extract the SKILLS section (technical skills, finance tools, languages, programming languages).`,
            schema: z.object({ skills: SkillsSchema }),
            temperature: 0.1,
          }),
        ),

        // Parse Activities with retry
        retryWithBackoff(() =>
          generateObject({
            model,
            system: SECTION_PARSER_PROMPT,
            prompt: `${basePrompt}

Extract the ACTIVITIES section (activities, hobbies, interests).`,
            schema: z.object({ activities: ActivitiesSchema }),
            temperature: 0.1,
          }),
        ),

        // Parse Interests with retry
        retryWithBackoff(() =>
          generateObject({
            model,
            system: SECTION_PARSER_PROMPT,
            prompt: `${basePrompt}

Extract the INTERESTS section (personal interests, hobbies).`,
            schema: z.object({ interests: InterestsSchema }),
            temperature: 0.1,
          }),
        ),
      ]);

      // Combine all results with error handling
      try {
        const parsedResume = {
          header: headerResult.object.header,
          education: educationResult.object.education,
          experience: experienceResult.object.experience,
          extraCurricular: extraCurricularResult.object.extraCurricular,
          skills: skillsResult.object.skills,
          activities: activitiesResult.object.activities,
          interests: interestsResult.object.interests,
        };

        // Validate the combined result
        const validatedResume = ParsedResumeSchema.parse(parsedResume);

        console.log("Successfully parsed resume with parallel AI SDK calls");
        return NextResponse.json(validatedResume);
      } catch (validationError) {
        console.error("Validation error:", validationError);
        console.error("Parsed resume data:", {
          header: headerResult.object.header,
          education: educationResult.object.education,
          experience: experienceResult.object.experience,
          extraCurricular: extraCurricularResult.object.extraCurricular,
          skills: skillsResult.object.skills,
          activities: activitiesResult.object.activities,
          interests: interestsResult.object.interests,
        });

        return NextResponse.json(
          {
            error: "Failed to validate parsed resume data",
            details:
              validationError instanceof Error
                ? validationError.message
                : "Unknown validation error",
          },
          { status: 500 },
        );
      }
    }

    if (action === "enhanceResume") {
      const enhanceSchema = z.object({
        enhancedBullets: z.array(z.string()),
        suggestedProjects: z.array(z.string()),
        suggestedSkills: z.array(z.string()),
        suggestedDeals: z.array(z.string()),
        gapAnalysis: z.array(z.string()),
      });

      const { object: enhancedResume } = await retryWithBackoff(() =>
        generateObject({
          model,
          system: ENHANCER_SYSTEM_PROMPT,
          prompt: `Enhance for ${targetRole || "Investment Banking Analyst"}.

Current resume JSON:
${JSON.stringify(data ?? {}, null, 2)}`,
          schema: enhanceSchema,
          temperature: 0.2,
        }),
      );

      return NextResponse.json(enhancedResume);
    }

    if (action === "generateBulletPoints") {
      const { notes, context } = (data || {}) as {
        notes?: string;
        context?: string;
      };

      const { object: bulletPoints } = await retryWithBackoff(() =>
        generateObject({
          model,
          system: ENHANCER_SYSTEM_PROMPT,
          prompt: `Generate 3–5 bullets for ${
            targetRole || "IB Analyst"
          } from the notes/context.

Notes:
${notes || ""}

Context:
${context || ""}`,
          schema: z.object({
            bullets: z.array(z.string()).describe("Array of 3-5 bullet points"),
          }),
          temperature: 0.2,
        }),
      );

      return NextResponse.json(bulletPoints);
    }

    if (action === "analyzeATS") {
      const atsSchema = z.object({
        score: z.number().describe("ATS fitness score from 0-100"),
        suggestions: z
          .array(z.string())
          .describe("Array of improvement suggestions"),
        missingKeywords: z
          .array(z.string())
          .describe("Array of missing keywords"),
      });

      const { object: atsAnalysis } = await retryWithBackoff(() =>
        generateObject({
          model,
          system: ENHANCER_SYSTEM_PROMPT,
          prompt: `Analyze ATS fitness for ${targetRole || "IB Analyst"}.

Resume JSON:
${JSON.stringify(data ?? {}, null, 2)}`,
          schema: atsSchema,
          temperature: 0.1,
        }),
      );

      return NextResponse.json(atsAnalysis);
    }

    return NextResponse.json(
      { error: "Invalid action specified" },
      { status: 400 },
    );
  } catch (err: any) {
    console.error("Gemini API error:", err);
    // only use the safe variable
    console.error("Error context:", { action: actionSafe || "unknown" });
    return NextResponse.json(
      {
        error: "Failed to process request with AI",
        details: err?.message || "unknown",
      },
      { status: 500 },
    );
  }
}
