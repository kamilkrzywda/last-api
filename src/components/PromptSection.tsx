import React from 'react';
import { aiProxyService } from '../app/services/aiProxy';
import { Schema } from '@/app/hooks/useSchema';

interface PromptSectionProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGeneratingPrompt: boolean;
  setIsGeneratingPrompt: (isGenerating: boolean) => void;
  isGenerating: boolean;
  schema: Schema;
  setError: (error: string | null) => void;
}

export const PromptSection: React.FC<PromptSectionProps> = ({
  prompt,
  setPrompt,
  isGeneratingPrompt,
  setIsGeneratingPrompt,
  isGenerating,
  schema,
  setError,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Enter Prompt</h2>
        <button
          onClick={async () => {
            setIsGeneratingPrompt(true);
            try {
              const response = await aiProxyService.chat(
                `Generate a creative prompt that would work well with the current schema fields: ${JSON.stringify(schema)}
                - The prompt should be specific and detailed, encouraging structured output
                - Don't include any explanation, just the prompt text
                - Make it short and concise
                - Do not include list of fields in the prompt
                - It should describe type of item, not specific one.
                - It should be generic type, every response should return diferent object.
                - It should be creative, but make sure to follow the schema.
                - It should be short, max 2 sentences.
                `,
                {
                  temperature: 0.9,
                }
              );
              if (response?.content) {
                setPrompt(response.content);
              }
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Failed to generate random prompt');
            } finally {
              setIsGeneratingPrompt(false);
            }
          }}
          disabled={isGeneratingPrompt || isGenerating}
          className="px-3 py-1 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-600 disabled:text-gray-400 text-gray-100 rounded-md text-sm font-medium transition-colors flex items-center gap-2 min-w-[135px] justify-center shadow-sm"
        >
          {isGeneratingPrompt ? (
            <>
              <span className="animate-spin">⚡</span>
              <span>Thinking...</span>
            </>
          ) : (
            <>
              <span>🎲</span>
              <span>Random Prompt</span>
            </>
          )}
        </button>
      </div>
      <textarea
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        placeholder="Describe what you want to generate..."
        className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 min-h-[100px] resize-y"
      />
    </div>
  );
};
