'use client';

import { useState } from 'react';

// Test basic functionality without our custom hooks
export default function DebugPage() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8">Debug Page</h1>
      
      <div className="space-y-4">
        <p>This is a basic page to test if React is working.</p>
        
        <div className="p-4 bg-white rounded-lg shadow">
          <p>Counter: {count}</p>
          <button 
            onClick={() => setCount(count + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Increment
          </button>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Tailwind CSS Test</h2>
          <div className="grid grid-cols-4 gap-2">
            <div className="h-8 bg-red-500 rounded"></div>
            <div className="h-8 bg-green-500 rounded"></div>
            <div className="h-8 bg-blue-500 rounded"></div>
            <div className="h-8 bg-yellow-500 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}