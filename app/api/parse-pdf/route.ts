import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Toggle this to true to use stub responses instead of real PDF parsing
const USE_STUB = false;

// Alternative text extraction function for problematic PDFs
async function extractTextAlternative(buffer: Buffer): Promise<string> {
  try {
    // Try to extract text using a different approach
    // This is a simplified version that might work better for some PDFs
    const text = buffer.toString('utf8');
    
    // Look for text patterns in the raw buffer
    const textMatches = text.match(/[A-Za-z0-9\s@.,!?()-]+/g);
    if (textMatches && textMatches.length > 0) {
      return textMatches.join(' ').replace(/\s+/g, ' ').trim();
    }
    
    return '';
  } catch (error) {
    console.error('Alternative text extraction failed:', error);
    return '';
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
    }

    if (USE_STUB) {
      // --- STUB: return fake parsed text for testing ---
      return NextResponse.json({
        text: `ANAND MUNKH-ORGIL

+1 (236) 863-0030| a.munkhorgil@mail.utoronto.ca | Linkedin

EDUCATION

University of Toronto, Rotman Commerce                                                                      Toronto, ON
Bachelor of Commerce                                                                                                                                                                               Class of 2028

Eric Hamber Secondary School                                                                                Vancouver, BC
High School Diploma                                                                                                                                                                                Class of 2024

EXPERIENCE

Finance Club, University of Toronto                                                                        Toronto, ON
Vice President of Finance                                                                                   September 2024 – Present
• Manage club finances and budget allocation
• Organize financial workshops and events
• Collaborate with other executive members

Retail Assistant, Local Store                                                                              Vancouver, BC
Sales Associate                                                                                             June 2023 – August 2023
• Assisted customers with product selection
• Processed transactions and maintained inventory
• Provided excellent customer service

SKILLS
• Financial Analysis
• Microsoft Excel
• Team Leadership
• Customer Service

ACTIVITIES
• University Finance Club
• Volunteer at local food bank
• Intramural basketball

INTERESTS
• Financial markets and investing
• Basketball and sports
• Reading business books`,
        pages: 1,
        info: { title: 'Anand Munkh-Orgil Resume (Stub)' },
      });
    }

    // --- PRODUCTION: real PDF → text using pdf2json ---
    const buf = Buffer.from(await file.arrayBuffer());

    let rawText = '';
    let pageCount = 1;
    try {
      // Import pdf2json with proper error handling
      const PDFParser = (await import('pdf2json')).default;
      
      // Create a promise-based wrapper for pdf2json
      const parsePDF = (buffer: Buffer): Promise<any> => {
        return new Promise((resolve, reject) => {
          const pdfParser = new PDFParser();
          
          pdfParser.on('pdfParser_dataError', (errData: any) => {
            reject(new Error(`PDF parsing error: ${errData.parserError}`));
          });
          
          pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
            resolve(pdfData);
          });
          
          pdfParser.parseBuffer(buffer);
        });
      };
      
      const pdfData = await parsePDF(buf);
      pageCount = pdfData.Pages ? pdfData.Pages.length : 1;
      
      // Extract text from all pages
      const textContent = [];
      if (pdfData.Pages) {
        for (const page of pdfData.Pages) {
          if (page.Texts) {
            const pageText = page.Texts
              .map((textItem: any) => {
                // Decode the text (pdf2json encodes it)
                return textItem.R.map((r: any) => decodeURIComponent(r.T)).join('');
              })
              .join(' ');
            textContent.push(pageText);
          }
        }
      }
      
      rawText = textContent.join('\n\n').trim();
      
      // Fix character-spaced text (where every character is separated by spaces)
      // This happens when PDFs have unusual font encoding
      rawText = rawText
        .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
        .replace(/([a-zA-Z])\s+([a-zA-Z])/g, '$1$2')  // Remove spaces between letters
        .replace(/([a-zA-Z])\s+([a-zA-Z])/g, '$1$2')  // Run twice to catch nested cases
        .replace(/([a-zA-Z])\s+([a-zA-Z])/g, '$1$2')  // Run three times for complex cases
        .replace(/\s+/g, ' ')  // Clean up any remaining multiple spaces
        .trim();
      
      // Add proper spacing between words that are running together
      rawText = rawText
        .replace(/([a-z])([A-Z])/g, '$1 $2')  // Add space between lowercase and uppercase
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')  // Add space between uppercase letters
        .replace(/([a-zA-Z])(\d)/g, '$1 $2')  // Add space between letters and numbers
        .replace(/(\d)([a-zA-Z])/g, '$1 $2')  // Add space between numbers and letters
        .replace(/([a-zA-Z])([.,!?;:])/g, '$1$2')  // Keep punctuation attached
        .replace(/([.,!?;:])([a-zA-Z])/g, '$1 $2')  // Add space after punctuation
        .replace(/\s+/g, ' ')  // Clean up multiple spaces
        .trim();
      
    } catch (parseError: any) {
      console.error('PDF parsing error details:', {
        message: parseError.message,
        stack: parseError.stack,
        name: parseError.name,
        fileSize: file.size,
        fileName: file.name,
        fileType: file.type
      });
      
      // Try alternative parsing approach
      try {
        console.log('Trying alternative PDF parsing approach...');
        
        // Use a simpler text extraction approach
        const alternativeText = await extractTextAlternative(buf);
        if (alternativeText && alternativeText.length > 50) {
          console.log('Alternative parsing successful, length:', alternativeText.length);
          rawText = alternativeText;
          pageCount = 1;
        } else {
          throw new Error('Alternative parsing also failed');
        }
      } catch (altError: any) {
        console.error('Alternative parsing also failed:', altError.message);
        
        // For parsing errors, suggest DOCX
        return NextResponse.json(
          { 
            error: 'Failed to parse PDF. Please try uploading a DOCX file or a different PDF.',
            details: parseError.message 
          },
          { status: 500 }
        );
      }
    }

    // Normalize whitespace a bit for downstream LLMs
    const normalizedText = rawText
      .replace(/\r/g, '')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n');

    if (!normalizedText) {
      // Likely a scanned PDF (no extractable text). Your UI can tell users to upload text-based PDFs.
      return NextResponse.json(
        { error: 'Unable to extract text (scanned image PDF?). Try a text-based PDF or DOCX.' },
        { status: 422 }
      );
    }

    return NextResponse.json({
      text: normalizedText,
      pages: pageCount,
      info: { title: file.name || 'PDF' },
    });
  } catch (error: any) {
    console.error('PDF parsing error (outer catch):', error);
    return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 500 });
  }
}