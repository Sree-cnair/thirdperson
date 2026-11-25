import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  tone?: 'light' | 'dark';
  action?: ReactNode;
  as?: 'h1' | 'h2';
}

export function SectionHeading({ eyebrow, title, tone = 'light', action, as = 'h2' }: SectionHeadingProps) {
  const Heading = as;
  const isDark = tone === 'dark';

  return (
    <div
      className={`flex flex-col gap-6 border-t pt-6 md:flex-row md:items-end md:justify-between ${
        isDark ? 'border-cream/20' : 'border-ink/15'
      }`}
    >
      <div>
        <p className={`eyebrow ${isDark ? '!text-orange' : ''}`}>{eyebrow}</p>
        <Heading className={`display-heading mt-3 text-5xl md:text-7xl ${isDark ? 'text-cream' : 'text-ink'}`}>
          {title}
        </Heading>
      </div>
      {action}
    </div>
  );
}
