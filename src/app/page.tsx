'use client';

import { useSchemaFields } from './hooks/useSchemaFields';
import { useSchemaPreview } from './hooks/useSchemaPreview';
import { useSchemaExamples } from './hooks/useSchemaExamples';
import { useState } from 'react';
import { QuickLinks } from '../components/QuickLinks';
import { SchemaExamples } from '../components/SchemaExamples';
import { SchemaBuilder } from '../components/SchemaBuilder';
import { SchemaPreview } from '../components/SchemaPreview';
import { PromptSection } from '../components/PromptSection';
import { GenerateButton } from '../components/GenerateButton';

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

  const { getExampleNames, getExampleByName } = useSchemaExamples();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">
        {`Structured Text Generator (Last API you'll ever need)`}
      </h1>

      <QuickLinks />

      <SchemaExamples
        getExampleNames={getExampleNames}
        getExampleByName={getExampleByName}
        setFields={setFields}
      />

      <SchemaBuilder
        fields={fields}
        setFields={setFields}
        newField={newField}
        handleAddField={handleAddField}
        handleUpdateFieldExample={handleUpdateFieldExample}
        handleFieldTypeChange={handleFieldTypeChange}
        handleRemoveField={handleRemoveField}
        handleUpdateNewField={handleUpdateNewField}
        setError={setError}
      />

      <SchemaPreview
        schemaError={schemaError}
        editingValue={editingValue}
        handleSchemaPreviewChange={handleSchemaPreviewChange}
        handleSchemaPreviewBlur={handleSchemaPreviewBlur}
      />

      <PromptSection
        prompt={prompt}
        setPrompt={setPrompt}
        isGeneratingPrompt={isGeneratingPrompt}
        setIsGeneratingPrompt={setIsGeneratingPrompt}
        isGenerating={isGenerating}
        fields={fields}
        setError={setError}
      />

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm mb-8">
          {error}
        </div>
      )}

      <GenerateButton
        fields={fields}
        prompt={prompt}
        isGenerating={isGenerating}
        setIsGenerating={setIsGenerating}
        result={result}
        setResult={setResult}
        setError={setError}
      />
    </div>
  );
}
