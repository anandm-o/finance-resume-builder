import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const file = form.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const name = (file as any).name?.toLowerCase() || '';
    const isDocxMime = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const isDocxName = name.endsWith('.docx');
    
    if (!isDocxMime && !isDocxName) {
      return NextResponse.json({ error: 'File must be a DOCX' }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const mammoth = await import('mammoth');
    const { value } = await mammoth.extractRawText({ buffer: buf });
    const text = (value || '').trim();

    if (!text) {
      return NextResponse.json({ error: 'No text found in DOCX' }, { status: 422 });
    }

    // Normalize whitespace for better AI processing
    const normalizedText = text
      .replace(/\r/g, '')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n');

    return NextResponse.json({ 
      text: normalizedText, 
      pages: null, 
      info: { title: (file as any).name || 'DOCX' } 
    });
  } catch (e: any) {
    console.error('DOCX parsing error:', e);
    return NextResponse.json({ error: 'Failed to parse DOCX' }, { status: 500 });
  }
}
