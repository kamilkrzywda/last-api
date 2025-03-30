import React from 'react';

export const QuickLinks: React.FC = () => {
  return (
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
  );
};
