import React, { useState } from 'react';
import { Field } from '../app/hooks/useSchemaFields';
import { openAIService } from '../app/services/openAI';

interface SchemaBuilderProps {
  fields: Field[];
  setFields: (fields: Field[]) => void;
  newField: Field;
  handleAddField: () => void;
  handleUpdateFieldExample: (
    index: number,
    value: string | number | boolean | string[] | number[] | boolean[]
  ) => void;
  handleFieldTypeChange: (type: Field['type']) => void;
  handleRemoveField: (index: number) => void;
  handleUpdateNewField: (id: string) => void;
  setError: (error: string | null) => void;
}

export const SchemaBuilder: React.FC<SchemaBuilderProps> = ({
  fields,
  setFields,
  newField,
  handleAddField,
  handleUpdateFieldExample,
  handleFieldTypeChange,
  handleRemoveField,
  handleUpdateNewField,
  setError,
}) => {
  const [isGeneratingSchema, setIsGeneratingSchema] = useState(false);

  return (
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
        <button
          onClick={async () => {
            setIsGeneratingSchema(true);
            try {
              const response = await openAIService.chat(
                `Generate a random schema for a JSON API response. The schema should be creative and practical.
                Return ONLY a JSON array of objects, where each object has these exact keys:
                - id: a camelCase field name (string)
                - type: one of: string, string[], number, number[], boolean, boolean[]
                - example: an appropriate example value matching the type
                
                Generate between 5-10 fields. Make it coherent and related to a single theme/purpose.
                NO explanation text, ONLY the JSON array.`,
                {
                  temperature: 0.9,
                }
              );
              if (response?.content) {
                try {
                  const jsonMatch = response.content.match(/\[[\s\S]*\]/);
                  if (jsonMatch) {
                    const jsonStr = jsonMatch[0];
                    const parsedResponse = JSON.parse(jsonStr);
                    setFields(parsedResponse);
                  } else {
                    throw new Error('No JSON array found in response');
                  }
                } catch (err) {
                  throw new Error(
                    'Failed to parse AI response: ' +
                      (err instanceof Error ? err.message : 'Unknown error')
                  );
                }
              }
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Failed to generate random schema');
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
  );
};
