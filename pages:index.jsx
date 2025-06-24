import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [model, setModel] = useState(null);
  const [framework, setFramework] = useState(null);
  const [improved, setImproved] = useState('');

  const handleGenerate = async () => {
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setModel(data.bestModel);
      setFramework(data.framework);
      setImproved(data.improvedPrompt);
    } catch (error) {
      console.error('Error generating prompt:', error);
    }
  };

  const stringValue = typeof query === 'string' ? query : '';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">AI Prompt Generator</h1>
        <textarea
          rows={4}
          className="w-full p-2 border rounded mb-4"
          value={stringValue}
          onChange={(e) => setQuery(e.target.value || '')}
          placeholder="Enter your prompt idea..."
        />
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleGenerate}
        >
          Generate
        </button>

        {model && (
          <div className="mt-6 space-y-4">
            <div>
              <strong>Suggested Model:</strong> {model}
            </div>
            <div>
              <strong>Framework:</strong> {framework}
            </div>
            <div>
              <strong>Improved Prompt:</strong>
              <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">{improved}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
