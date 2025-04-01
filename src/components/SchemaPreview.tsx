import React, { useState, useEffect } from 'react';
import { aiProxyService } from '../app/services/aiProxy';
import { Schema, useSchemaExamples } from '@/app/hooks/useSchema';

interface SchemaPreviewProps {
  schema: Schema;
  setSchema: (schema: Schema) => void;
}

export const SchemaPreview: React.FC<SchemaPreviewProps> = ({ schema, setSchema }) => {
  const [isGeneratingSchema, setIsGeneratingSchema] = useState(false);
  const [schemaError, setSchemaError] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState(() => JSON.stringify(schema, null, 2));
  const { examples: schemaExamples } = useSchemaExamples();
  useEffect(() => {
    setEditingValue(JSON.stringify(schema, null, 2));
  }, [schema]);

  const handleSchemaPreviewChange = (value: string) => {
    setEditingValue(value);
  };

  const handleSchemaPreviewBlur = () => {
    try {
      const parsedValue = JSON.parse(editingValue);
      if (typeof parsedValue === 'object' && parsedValue !== null && !Array.isArray(parsedValue)) {
        setSchema(parsedValue);
        setSchemaError(null);
      } else {
        throw new Error('Schema must be a JSON object');
      }
    } catch (err) {
      setSchemaError(err instanceof Error ? err.message : 'Invalid JSON schema');
    }
  };

  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Schema Preview</h2>
        <div className="flex items-center gap-4">
          {schemaError && <span className="text-red-500 text-sm">{schemaError}</span>}
          <button
            onClick={async () => {
              setIsGeneratingSchema(true);
              try {
                const response = await aiProxyService.chat(
                  `Generate a random schema for a JSON API response. The schema should be creative and practical.
                  Return ONLY a JSON object with the following format:

                  SchemaFieldType =
                  | 'uuid'
                  | 'uuid[]'
                  | 'string'
                  | 'string[]'
                  | 'number'
                  | 'number[]'
                  | 'boolean'
                  | 'boolean[]'
                  | 'date'
                  | 'date[]'
                  | SchemaFieldType
                  | SchemaFieldType[]; (it can be nested recursively)

                  Schema = Record<string, SchemaFieldType>;

                  Generate between 5-10 fields. Make it coherent and related to a single theme/purpose.
                  NO explanation text, ONLY the JSON object.
                  
                  Heres some examples: ${JSON.stringify(schemaExamples)}`,
                  {
                    temperature: 0.9,
                  }
                );
                if (response?.content) {
                  try {
                    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                      const jsonStr = jsonMatch[0];
                      const parsedResponse = JSON.parse(jsonStr);
                      setSchema(parsedResponse);
                    } else {
                      throw new Error('No JSON object found in response');
                    }
                  } catch (err) {
                    throw new Error(
                      'Failed to parse AI response: ' +
                        (err instanceof Error ? err.message : 'Unknown error')
                    );
                  }
                }
              } catch (err) {
                setSchemaError(
                  err instanceof Error ? err.message : 'Failed to generate random schema'
                );
              } finally {
                setIsGeneratingSchema(false);
              }
            }}
            disabled={isGeneratingSchema}
            className="px-3 py-1 bg-gray-800 text-gray-100 rounded-md hover:bg-gray-700 disabled:bg-gray-600 disabled:text-gray-400 transition-colors shadow-sm text-sm flex items-center gap-2 min-w-[135px] justify-center"
          >
            {isGeneratingSchema ? (
              <>
                <span className="animate-spin">⚡</span>
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <span>🎲</span>
                <span>Random Schema</span>
              </>
            )}
          </button>
        </div>
      </div>
      <textarea
        value={editingValue}
        onChange={e => handleSchemaPreviewChange(e.target.value)}
        onBlur={handleSchemaPreviewBlur}
        className="w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-md overflow-x-auto font-mono text-sm min-h-[200px] resize-y"
        spellCheck="false"
      />
    </div>
  );
};
