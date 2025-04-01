'use client';

import React from 'react';
import { aiProxyService } from '../services/aiProxy';
import { Schema } from '../hooks/useSchema';

interface GenerateButtonProps {
  schema: Schema;
  prompt: string;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  result: string;
  setResult: (result: string) => void;
  setError: (error: string | null) => void;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  schema,
  prompt,
  isGenerating,
  setIsGenerating,
  result,
  setResult,
  setError,
}) => {
  const handleGenerate = async () => {
    if (schema == null || schema.length === 0 || !prompt) return;

    setIsGenerating(true);
    setError(null);

    console.log(JSON.stringify(schema));

    try {
      const systemMessage = `You are a universal API responder. Your ONLY role is to generate json response in a specific format.
        # RESPONSE RULES:
        - Respond ONLY with a valid JSON object
        - The JSON object should have EXACTLY this format: ${JSON.stringify(schema)}
        - MAKE SURE to include list of objects if such exists in the schema
        - "string[]" or other types should not return empty arrays
        - DO NOT return empty arrays
        - DO NOT include any other text, markdown, explanations, or formatting
        - DO NOT use code blocks or backticks
        - DO NOT include emojis or special characters that could break JSON parsing
        - BE CREATIVE, but make sure to follow the schema`;

      const response = await aiProxyService.chat(prompt, {
        systemMessage,
        temperature: 0.9,
      });

      if (response?.content) {
        try {
          const jsonMatch = response.content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const jsonStr = jsonMatch[0];
            const parsedResponse = JSON.parse(jsonStr);
            setResult(JSON.stringify(parsedResponse, null, 2));
          } else {
            throw new Error('No JSON object found in response');
          }
        } catch (err) {
          throw new Error(
            'Failed to parse AI response: ' + (err instanceof Error ? err.message : 'Unknown error')
          );
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mb-8 space-y-4">
      <button
        onClick={handleGenerate}
        disabled={isGenerating || schema.length === 0 || !prompt}
        className="w-full py-2 px-4 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-600 disabled:text-gray-400 text-gray-100 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
      >
        {isGenerating ? (
          <>
            <span className="animate-spin">⚡</span>
            <span>Generating...</span>
          </>
        ) : (
          <>
            <span>✨</span>
            <span>Generate Structured Text</span>
          </>
        )}
      </button>

      {result && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Result</h2>
          <pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md overflow-x-auto whitespace-pre-wrap break-words">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
};
