'use client';

import { Schema, useSchemaExamples } from '../hooks/useSchema';
import { useState } from 'react';
import { QuickLinks } from '../components/QuickLinks';
import { SchemaExamples } from '../components/SchemaExamples';
import { SchemaPreview } from '../components/SchemaPreview';
import { PromptSection } from '../components/PromptSection';
import { GenerateButton } from '../components/GenerateButton';

export default function StructuredTextPage() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schema, setSchema] = useState<Schema>({});

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
        setSchema={exampleName => {
          const example = getExampleByName(exampleName);
          if (example) {
            setSchema(example.schema);
          }
        }}
      />

      <SchemaPreview schema={schema} setSchema={setSchema} />

      <PromptSection
        prompt={prompt}
        setPrompt={setPrompt}
        isGeneratingPrompt={isGeneratingPrompt}
        setIsGeneratingPrompt={setIsGeneratingPrompt}
        isGenerating={isGenerating}
        schema={schema}
        setError={setError}
      />

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm mb-8">
          {error}
        </div>
      )}

      <GenerateButton
        schema={schema}
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
