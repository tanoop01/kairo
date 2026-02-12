'use client';

import { useState } from 'react';
import { Brain, Send, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AiAssistantPage() {
  const { language } = useLanguage();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) {
      setError('Please enter a question to get help.');
      return;
    }

    setError('');
    setAnswer('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: trimmed }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || 'Unable to get a response right now.');
        return;
      }

      setAnswer(data?.result || 'No response received.');
    } catch (err) {
      console.error('AI assistant error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      handleSubmit(event);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-slate-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 text-primary-700 text-sm font-medium">
            <Brain className="h-4 w-4" />
            AI Rights Assistant
          </div>
          <h1 className={`mt-4 text-3xl md:text-4xl font-bold text-slate-900 ${language === 'hi' ? 'font-hindi' : ''}`}>
            Ask about your rights in India
          </h1>
          <p className={`mt-3 text-slate-600 ${language === 'hi' ? 'font-hindi' : ''}`}>
            Get guidance based on laws, rules, and citizen rights. For urgent legal matters, contact a qualified professional.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className={language === 'hi' ? 'font-hindi' : ''}>
              Ask a question
            </CardTitle>
            <CardDescription className={language === 'hi' ? 'font-hindi' : ''}>
              Type your question and press Send. Use Ctrl+Enter to submit quickly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium text-slate-700 mb-2 ${language === 'hi' ? 'font-hindi' : ''}`}>
                  Your question
                </label>
                <textarea
                  className="w-full min-h-[120px] rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  placeholder="Example: What are my rights if my landlord refuses to return my security deposit?"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-end">
                <Button type="submit" isLoading={isLoading} disabled={isLoading || !question.trim()}>
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </Button>
              </div>
            </form>

            <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <ShieldAlert className="h-4 w-4 text-accent-amber" />
                Response
              </div>
              <div className={`mt-3 whitespace-pre-wrap text-sm text-slate-700 ${language === 'hi' ? 'font-hindi' : ''}`}>
                {isLoading && 'Thinking...'}
                {!isLoading && answer}
                {!isLoading && !answer && 'Ask a question to see the answer here.'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
