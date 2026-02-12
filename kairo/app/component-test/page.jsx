'use client';

// Test our UI components individually
import { Button } from '@/components/ui/Button';

export default function ComponentTest() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Component Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-xl mb-2">Button Test</h2>
          <Button variant="primary">Primary Button</Button>
        </div>
      </div>
    </div>
  );
}