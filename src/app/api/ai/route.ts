import { NextRequest, NextResponse } from 'next/server';

const OPEN_WEBUI_URL = process.env.OPEN_WEBUI_URL || 'http://localhost:3000';
const OPEN_WEBUI_API_KEY = process.env.OPEN_WEBUI_API_KEY;

if (!OPEN_WEBUI_API_KEY) {
  console.warn('Warning: OPEN_WEBUI_API_KEY is not set');
}

export async function POST(request: NextRequest) {
  try {
    const { message, options } = await request.json();

    const messages = [];

    if (options?.systemMessage) {
      messages.push({
        role: 'system',
        content: options.systemMessage,
      });
    }

    messages.push({
      role: 'user',
      content: message,
    });

    const response = await fetch(`${OPEN_WEBUI_URL}/api/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPEN_WEBUI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google_genai.gemini-2.0-flash',
        messages,
        temperature: options?.temperature ?? 0.6,
        max_tokens: options?.maxTokens,
        response_format: options?.responseFormat ? { type: options.responseFormat } : undefined,
        tools: options?.tools,
        tool_choice: options?.toolChoice,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get completion from Open WebUI');
    }

    const completion = await response.json();
    return NextResponse.json(completion.choices[0].message);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
