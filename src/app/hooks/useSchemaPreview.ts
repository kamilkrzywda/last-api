import { useState, useEffect } from 'react';
import type { Field } from './useSchemaFields';

export const useSchemaPreview = (fields: Field[], setFields: (fields: Field[]) => void) => {
  const [schemaError, setSchemaError] = useState<string>('');
  const [editingValue, setEditingValue] = useState<string>('');
  const [isDirty, setIsDirty] = useState(false);

  const getSchemaPreview = () => {
    const preview: Record<string, string | string[] | number | number[] | boolean | boolean[]> = {};
    fields.forEach(field => {
      preview[field.id] = field.example;
    });
    return JSON.stringify(preview, null, 2);
  };

  // Update editing value when fields change and not in editing mode
  useEffect(() => {
    if (!isDirty) {
      setEditingValue(getSchemaPreview());
    }
  }, [fields, isDirty]);

  const handleSchemaPreviewChange = (value: string) => {
    setEditingValue(value);
    setIsDirty(true);
  };

  const handleSchemaPreviewBlur = () => {
    if (!isDirty) return;

    try {
      const parsed = JSON.parse(editingValue);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        setSchemaError('Schema must be an object');
        return;
      }

      const updatedFields = Object.entries(parsed).map(([id, example]): Field => {
        const isArray = Array.isArray(example);
        if (isArray) {
          if (example.length === 0) {
            return {
              id,
              type: 'string[]',
              example: [],
            };
          }

          if (example.every(item => typeof item === 'string')) {
            return {
              id,
              type: 'string[]',
              example: example as string[],
            };
          }
          if (example.every(item => typeof item === 'number')) {
            return {
              id,
              type: 'number[]',
              example: example as number[],
            };
          }
          if (example.every(item => typeof item === 'boolean')) {
            return {
              id,
              type: 'boolean[]',
              example: example as boolean[],
            };
          }
          throw new Error(
            `Array items must all be of the same type (string, number, or boolean). Found mixed types in array for field "${id}"`
          );
        }

        const exampleType = typeof example;
        let fieldType: Field['type'];

        switch (exampleType) {
          case 'string':
            fieldType = 'string';
            break;
          case 'number':
            fieldType = 'number';
            break;
          case 'boolean':
            fieldType = 'boolean';
            break;
          default:
            throw new Error(`Unsupported type: ${exampleType}`);
        }

        return {
          id,
          type: fieldType,
          example: example as string | number | boolean,
        };
      });

      setFields(updatedFields);
      setSchemaError('');
    } catch (error: unknown) {
      setSchemaError(error instanceof Error ? error.message : 'Invalid JSON format');
    } finally {
      setIsDirty(false);
    }
  };

  return {
    schemaError,
    handleSchemaPreviewChange,
    handleSchemaPreviewBlur,
    editingValue,
  };
};
