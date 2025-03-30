import React from 'react';
import { Field } from '../app/hooks/useSchemaFields';
import { openAIService } from '../app/services/openAI';

interface GenerateButtonProps {
  fields: Field[];
  prompt: string;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  result: string;
  setResult: (result: string) => void;
  setError: (error: string | null) => void;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  fields,
  prompt,
  isGenerating,
  setIsGenerating,
  result,
  setResult,
  setError,
}) => {
  const handleGenerate = async () => {
    if (fields.length === 0 || !prompt) return;

    setIsGenerating(true);
    setError(null);

    try {
      const systemMessage = `You are a universal API responder. Your ONLY role is to generate json response in a specific format.
        RESPONSE RULES:
        1. Respond ONLY with a valid JSON object
        2. The JSON object should contain EXACTLY these keys: ${fields.map(f => f.id).join(', ')}
        3. Each value should match its field type EXACTLY as specified:
        - string: a single text string (not an array)
        - string[]: an array of text strings (e.g. ["text1", "text2"])
        - number: a single numeric value (not an array)
        - number[]: an array of numeric values (e.g. [1, 2, 3])
        - boolean: true or false (not an array)
        - boolean[]: an array of true/false values (e.g. [true, false])
        4. DO NOT convert single values to arrays unless the type explicitly ends with []
        5. DO NOT convert arrays to single values unless the type is a single string/number/boolean
        6. DO NOT include any other text, markdown, explanations, or formatting
        7. DO NOT use code blocks or backticks
        8. DO NOT include emojis or special characters that could break JSON parsing`;

      const response = await openAIService.chat(prompt, {
        systemMessage,
        temperature: 0.7,
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
        disabled={isGenerating || fields.length === 0 || !prompt}
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
