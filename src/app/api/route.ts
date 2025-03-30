import { NextResponse } from 'next/server';

export async function GET() {
  const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Structured Text Generation API Documentation</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css">
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-json.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-bash.min.js" defer></script>
    <style>
      :root {
        --primary-color: #6d28d9;
        --secondary-color: #4c1d95;
        --background-color: #f9fafb;
        --text-color: #1f2937;
        --code-bg: #1f2937;
      }
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: system-ui, -apple-system, sans-serif;
        line-height: 1.6;
        color: var(--text-color);
        background: var(--background-color);
        padding: 2rem;
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
      }
      
      h1 {
        color: var(--primary-color);
        margin-bottom: 1rem;
        font-size: 2.5rem;
      }
      
      h2 {
        color: var(--secondary-color);
        margin: 2rem 0 1rem;
        font-size: 1.8rem;
      }
      
      h3 {
        color: var(--secondary-color);
        margin: 1.5rem 0 0.5rem;
        font-size: 1.3rem;
      }
      
      p {
        margin-bottom: 1rem;
      }
      
      .endpoint {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        margin: 1rem 0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      
      .method {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 4px;
        font-weight: bold;
        margin-right: 0.5rem;
      }
      
      .method.post {
        background: #059669;
        color: white;
      }
      
      .method.get {
        background: #2563eb;
        color: white;
      }
      
      .path {
        font-family: monospace;
        font-size: 1.1rem;
      }
      
      pre {
        margin: 1rem 0;
        padding: 1rem;
        border-radius: 6px;
        background: var(--code-bg) !important;
        overflow-x: auto;
      }
      
      code {
        font-family: 'Fira Code', monospace;
        font-size: 0.9rem;
      }
      
      .response-example {
        margin-top: 1rem;
      }
      
      .status {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.9rem;
        margin-right: 0.5rem;
      }
      
      .status-200 {
        background: #059669;
        color: white;
      }
      
      .status-400, .status-500 {
        background: #dc2626;
        color: white;
      }
      
      .try-it {
        margin-top: 2rem;
        padding: 2rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      
      .copy-button {
        display: inline-block;
        padding: 0.5rem 1rem;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 1rem;
      }
      
      .copy-button:hover {
        background: var(--secondary-color);
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Structured Text Generation API</h1>
      <p>Generate structured text based on a schema and prompt using AI.</p>
      
      <h2>Endpoints</h2>
      
      <div class="endpoint">
        <span class="method post">POST</span>
        <span class="path">/api/generate</span>
        <p>Generate structured text based on provided schema and prompt</p>
        
        <h3>Request Body</h3>
        <pre><code class="language-json">{
  "fields": [
    {
      "id": "title",
      "type": "string"
    },
    {
      "id": "tags",
      "type": "string[]"
    },
    {
      "id": "wordCount",
      "type": "number"
    }
  ],
  "prompt": "Generate a blog post title with tags about artificial intelligence and machine learning, and estimate the word count"
}</code></pre>

        <h3>Field Types</h3>
        <ul>
          <li><code>string</code> - A text string</li>
          <li><code>string[]</code> - An array of text strings</li>
          <li><code>number</code> - A numeric value</li>
          <li><code>number[]</code> - An array of numeric values</li>
          <li><code>boolean</code> - true/false value</li>
          <li><code>boolean[]</code> - An array of true/false values</li>
        </ul>

        <h3>Responses</h3>
        
        <div class="response-example">
          <span class="status status-200">200 OK</span>
          <pre><code class="language-json">{
  "title": "The Future of AI: Transforming Our World Through Machine Learning",
  "tags": ["artificial intelligence", "machine learning", "technology", "future tech"],
  "wordCount": 150
}</code></pre>
        </div>

        <div class="response-example">
          <span class="status status-400">400 Bad Request</span>
          <pre><code class="language-json">{
  "error": "Invalid request. Fields array and prompt string are required."
}</code></pre>
        </div>

        <div class="response-example">
          <span class="status status-500">500 Server Error</span>
          <pre><code class="language-json">{
  "error": "Failed to generate structured text."
}</code></pre>
        </div>
      </div>

      <div class="try-it">
        <h2>Try it out</h2>
        <p>Use this curl command to test the API:</p>
        <pre><code class="language-bash">curl -X POST \\
  -H "Content-Type: application/json" \\
  -d '{
    "fields": [
      {
        "id": "title",
        "type": "string"
      },
      {
        "id": "tags",
        "type": "string[]"
      },
      {
        "id": "wordCount",
        "type": "number"
      }
    ],
    "prompt": "Generate a blog post title with tags about artificial intelligence and machine learning, and estimate the word count"
  }' \\
  http://localhost:3000/api/generate</code></pre>
        <button class="copy-button" onclick="navigator.clipboard.writeText(this.previousElementSibling.textContent)">
          Copy curl command
        </button>
      </div>
    </div>

    <script>
      // Initialize syntax highlighting
      document.addEventListener('DOMContentLoaded', (event) => {
        Prism.highlightAll();
      });
    </script>
  </body>
  </html>`;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
