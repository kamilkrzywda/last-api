import React from 'react';

interface SchemaPreviewProps {
  schemaError: string | null;
  editingValue: string;
  handleSchemaPreviewChange: (value: string) => void;
  handleSchemaPreviewBlur: () => void;
}

export const SchemaPreview: React.FC<SchemaPreviewProps> = ({
  schemaError,
  editingValue,
  handleSchemaPreviewChange,
  handleSchemaPreviewBlur,
}) => {
  return (
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
  );
};
