import React from 'react';
import { Field } from '../app/hooks/useSchemaFields';

interface SchemaExamplesProps {
  getExampleNames: () => string[];
  getExampleByName: (name: string) => Field[];
  setFields: (fields: Field[]) => void;
}

export const SchemaExamples: React.FC<SchemaExamplesProps> = ({
  getExampleNames,
  getExampleByName,
  setFields,
}) => {
  return (
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
  );
};
