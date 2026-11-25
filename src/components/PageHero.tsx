import type { ReactNode } from 'react';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  intro?: string;
  tone?: 'light' | 'dark' | 'opinion';
  children?: ReactNode;
}

export function PageHero({ eyebrow, title, intro, tone = 'light', children }: PageHeroProps) {
  const isDark = tone === 'dark' || tone === 'opinion';
  const isOpinion = tone === 'opinion';

  return (
    <section className={isOpinion ? 'bg-damson text-blush' : isDark ? 'bg-ink text-cream' : 'bg-cream text-ink'}>
      <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-14 md:px-8 md:pb-24 md:pt-20">
        <p className={`eyebrow animate-fade-up ${isOpinion ? '!text-lemon' : isDark ? '!text-orange' : ''}`}>{eyebrow}</p>
        <h1 className="display-heading mt-4 animate-fade-up text-6xl [animation-delay:80ms] md:text-8xl lg:text-9xl">
          {title}
        </h1>
        {intro && (
          <p
            className={`mt-8 max-w-2xl animate-fade-up font-serif text-xl italic leading-relaxed [animation-delay:160ms] md:text-2xl ${
              isOpinion ? 'text-blush/90' : isDark ? 'text-cream/85' : 'text-charcoal'
            }`}
          >
            {intro}
          </p>
        )}
        {children && <div className="mt-10 animate-fade-up [animation-delay:240ms]">{children}</div>}
      </div>
    </section>
  );
}
