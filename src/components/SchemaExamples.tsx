import React from 'react';
import { SchemaExample, SchemaExampleName } from '../app/hooks/useSchema';

interface SchemaExamplesProps {
  getExampleNames: () => string[];
  getExampleByName: (name: string) => SchemaExample | undefined;
  setSchema: (example: SchemaExampleName) => void;
}

export const SchemaExamples: React.FC<SchemaExamplesProps> = ({
  getExampleNames,
  getExampleByName,
  setSchema,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Example Schemas</h2>
      <select
        onChange={e => {
          const example = getExampleByName(e.target.value);
          if (example) {
            setSchema(example.name);
          }
        }}
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
