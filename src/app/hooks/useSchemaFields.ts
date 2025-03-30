import { useState } from 'react';

export type Field = {
  id: string;
  type: 'string' | 'string[]' | 'number' | 'number[]' | 'boolean' | 'boolean[]';
  example: string | string[] | number | number[] | boolean | boolean[];
  placeholder?: string | string[];
};

const DEFAULT_FIELD: Field = {
  id: '',
  type: 'string',
  example: 'example_text',
};

export const useSchemaFields = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [newField, setNewField] = useState<Field>(DEFAULT_FIELD);

  const handleAddField = () => {
    if (newField.id) {
      setFields([...fields, { ...newField }]);
      setNewField(DEFAULT_FIELD);
    }
  };

  const handleUpdateFieldExample = (
    index: number,
    value: string | string[] | number | number[] | boolean | boolean[]
  ) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], example: value };
    setFields(updatedFields);
  };

  const handleFieldTypeChange = (value: Field['type']) => {
    let defaultExample: Field['example'];
    switch (value) {
      case 'string':
        defaultExample = 'example_text';
        break;
      case 'string[]':
        defaultExample = ['item1', 'item2'];
        break;
      case 'number':
        defaultExample = 42;
        break;
      case 'number[]':
        defaultExample = [1, 2, 3];
        break;
      case 'boolean':
        defaultExample = true;
        break;
      case 'boolean[]':
        defaultExample = [true, false];
        break;
      default:
        defaultExample = 'example_text';
    }

    setNewField({
      ...newField,
      type: value,
      example: defaultExample,
    });
  };

  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleUpdateNewField = (id: string) => {
    setNewField({ ...newField, id });
  };

  return {
    fields,
    setFields,
    newField,
    handleAddField,
    handleUpdateFieldExample,
    handleFieldTypeChange,
    handleRemoveField,
    handleUpdateNewField,
  };
};
