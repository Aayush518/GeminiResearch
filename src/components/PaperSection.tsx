import React from 'react';
import ReactMarkdown from 'react-markdown';
import { clsx } from 'clsx';

interface PaperSectionProps {
  title: string;
  content: string;
  className?: string;
}

export function PaperSection({ title, content, className }: PaperSectionProps) {
  return (
    <div className={clsx("mb-8", className)}>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="prose prose-slate max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}