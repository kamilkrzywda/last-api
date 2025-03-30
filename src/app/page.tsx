'use client';

import { useSchemaFields, type Field } from './hooks/useSchemaFields';
import { useSchemaPreview } from './hooks/useSchemaPreview';
import { useSchemaExamples } from './hooks/useSchemaExamples';
import { openAIService } from './services/openAI';
import { useState } from 'react';

export default function StructuredTextPage() {
  const {
    fields,
    setFields,
    newField,
    handleAddField,
    handleUpdateFieldExample,
    handleFieldTypeChange,
    handleRemoveField,
    handleUpdateNewField,
  } = useSchemaFields();

  const { schemaError, handleSchemaPreviewChange, editingValue, handleSchemaPreviewBlur } =
    useSchemaPreview(fields, setFields);

  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const { getExampleNames, getExampleByName } = useSchemaExamples();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">
        {`Structured Text Generator (Last API you'll ever need)`}
      </h1>

      {/* Quick Links */}
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
        <a
          href="/api"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-100 rounded-md transition-colors shadow-sm hover:shadow-md"
        >
          <span>📚</span>
          <span>API Documentation</span>
        </a>
        <a
          href="https://github.com/kamilkrzywda/last-api"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-100 rounded-md transition-colors shadow-sm hover:shadow-md"
        >
          <span>📦</span>
          <span>GitHub Repository</span>
        </a>
      </div>

      {/* Schema Examples */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Example Schemas</h2>
        <select
          onChange={e => setFields(getExampleByName(e.target.value))}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
        >
          <option value="">Select an example schema...</option>
          {getExampleNames().map(name => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Schema Builder */}
      <div className="mb-6 space-y-3">
        <h2 className="text-xl font-semibold mb-3">Define Schema</h2>

        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newField.id}
            onChange={e => handleUpdateNewField(e.target.value)}
            placeholder="Field ID"
            className="flex-1 px-2 py-1 border rounded-md dark:bg-gray-800 text-sm"
          />
          <select
            value={newField.type}
            onChange={e => handleFieldTypeChange(e.target.value as Field['type'])}
            className="px-2 py-1 border rounded-md dark:bg-gray-800 text-sm"
          >
            <option value="string">String</option>
            <option value="string[]">String Array</option>
            <option value="number">Number</option>
            <option value="number[]">Number Array</option>
            <option value="boolean">Boolean</option>
            <option value="boolean[]">Boolean Array</option>
          </select>
          <button
            onClick={handleAddField}
            disabled={!newField.id}
            className="px-3 py-1 bg-gray-800 text-gray-100 rounded-md hover:bg-gray-700 disabled:bg-gray-600 disabled:text-gray-400 transition-colors shadow-sm text-sm"
          >
            Add Field
          </button>
        </div>

        {/* Field List */}
        <div className="space-y-1">
          {fields.map((field, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-1.5 border rounded-md dark:bg-gray-800 text-sm"
            >
              <span className="flex-none w-1/4 truncate">
                {field.id} ({field.type})
              </span>
              <div className="flex-1">
                {field.type === 'string' ? (
                  <input
                    type="text"
                    value={field.example as string}
                    onChange={e => handleUpdateFieldExample(index, e.target.value)}
                    className="w-full px-2 py-1 border rounded-md dark:bg-gray-700 text-sm"
                    placeholder="Example value"
                  />
                ) : field.type === 'string[]' ? (
                  <input
                    type="text"
                    value={(field.example as string[]).join(', ')}
                    onChange={e =>
                      handleUpdateFieldExample(
                        index,
                        e.target.value.split(',').map(s => s.trim())
                      )
                    }
                    className="w-full px-2 py-1 border rounded-md dark:bg-gray-700 text-sm"
                    placeholder="Example values (comma-separated)"
                  />
                ) : field.type === 'number' ? (
                  <input
                    type="number"
                    step="any"
                    value={field.example as number}
                    onChange={e => handleUpdateFieldExample(index, parseFloat(e.target.value))}
                    className="w-full px-2 py-1 border rounded-md dark:bg-gray-700 text-sm"
                    placeholder="Enter a number"
                  />
                ) : field.type === 'number[]' ? (
                  <input
                    type="text"
                    value={(field.example as number[]).join(', ')}
                    onChange={e =>
                      handleUpdateFieldExample(
                        index,
                        e.target.value
                          .split(',')
                          .map(s => parseFloat(s.trim()))
                          .filter(n => !isNaN(n))
                      )
                    }
                    className="w-full px-2 py-1 border rounded-md dark:bg-gray-700 text-sm"
                    placeholder="Example numbers (comma-separated)"
                  />
                ) : field.type === 'boolean' ? (
                  <select
                    value={(field.example as boolean).toString()}
                    onChange={e => handleUpdateFieldExample(index, e.target.value === 'true')}
                    className="w-full px-2 py-1 border rounded-md dark:bg-gray-700 text-sm"
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                ) : field.type === 'boolean[]' ? (
                  <input
                    type="text"
                    value={(field.example as boolean[]).map(b => b.toString()).join(', ')}
                    onChange={e =>
                      handleUpdateFieldExample(
                        index,
                        e.target.value.split(',').map(s => s.trim().toLowerCase() === 'true')
                      )
                    }
                    className="w-full px-2 py-1 border rounded-md dark:bg-gray-700 text-sm"
                    placeholder="Example booleans (comma-separated true/false)"
                  />
                ) : (
                  <select
                    value={(field.example as boolean).toString()}
                    onChange={e => handleUpdateFieldExample(index, e.target.value === 'true')}
                    className="w-full px-2 py-1 border rounded-md dark:bg-gray-700 text-sm"
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                )}
              </div>
              <button
                onClick={() => handleRemoveField(index)}
                className="flex-none text-gray-400 hover:text-red-400 transition-colors px-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Schema Preview */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Schema Preview</h2>
          {schemaError && <span className="text-red-500 text-sm">{schemaError}</span>}
        </div>
        <textarea
          value={editingValue}
          onChange={e => handleSchemaPreviewChange(e.target.value)}
          onBlur={handleSchemaPreviewBlur}
          className="w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-md overflow-x-auto font-mono text-sm min-h-[200px] resize-y"
          spellCheck="false"
        />
      </div>

      {/* Prompt Input */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Enter Prompt</h2>
          <button
            onClick={async () => {
              setIsGeneratingPrompt(true);
              try {
                const response = await openAIService.chat(
                  `Generate a creative prompt that would work well with the current schema fields: ${fields.map(f => f.id).join(', ')}. The prompt should be specific and detailed, encouraging structured output. Don't include any explanation, just the prompt text. Make it short and concise. Do not include list of fields in the prompt.`,
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
            disabled={isGeneratingPrompt || isGenerating || fields.length === 0}
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

      {/* Generate Button */}
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
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Result Display */}
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
}
