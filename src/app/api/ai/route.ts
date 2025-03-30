import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openAI = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL || 'http://192.168.1.100:1234/v1',
  apiKey: process.env.OPENAI_API_KEY || 'not-needed',
});

export async function POST(request: NextRequest) {
  try {
    const { service, message, options } = await request.json();

    if (service === 'openai') {
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

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

      const completion = await openAI.chat.completions.create({
        model: 'gemma-3-12b-it-GGUF',
        messages,
        temperature: options?.temperature ?? 0.6,
        max_tokens: options?.maxTokens,
      });

      return NextResponse.json(completion.choices[0].message);
    }

    if (service === 'gemini') {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key not configured');
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-exp-03-25:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: message,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: options?.temperature ?? 0.6,
              maxOutputTokens: options?.maxTokens,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json({ content: data.candidates[0]?.content.parts[0]?.text || '' });
    }

    throw new Error('Invalid service specified');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
