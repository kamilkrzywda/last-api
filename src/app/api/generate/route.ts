import { NextResponse } from 'next/server';
import { structuredTextGenerationService } from '@/app/services/structuredTextGeneration';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fields, prompt } = body;

    if (!Array.isArray(fields) || !prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request. Fields array and prompt string are required.' },
        { status: 400 }
      );
    }

    const response = await structuredTextGenerationService.generateStructuredText(fields, prompt);

    if (!response) {
      return NextResponse.json({ error: 'Failed to generate structured text.' }, { status: 500 });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in structured text generation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
