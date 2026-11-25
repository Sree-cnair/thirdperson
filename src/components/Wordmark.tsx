import { Sparkles } from 'lucide-react';
import { SITE_NAME } from '@/data/site';

interface WordmarkProps {
  className?: string;
}

export function Wordmark({ className = '' }: WordmarkProps) {
  return (
    <span className={`inline-flex items-start gap-1 font-display text-2xl leading-none tracking-tight ${className}`}>
      {SITE_NAME}
      <Sparkles aria-hidden="true" className="mt-0.5 h-3 w-3 text-lemon" strokeWidth={2.5} />
    </span>
  );
}
