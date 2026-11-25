import { useId } from 'react';

interface PosterProps {
  index: string;
  caption: string;
  text: string;
  tone: 'ink' | 'orange' | 'cream';
}

const POSTER_TONES = {
  ink: 'bg-ink text-cream',
  orange: 'bg-orange-deep text-white',
  cream: 'bg-cream text-ink border border-ink/20',
} as const;

export function TypographyPosters() {
  const posters: PosterProps[] = [
    { index: '01', caption: 'Phrase study', text: 'Another way of seeing things.', tone: 'ink' },
    { index: '02', caption: 'Opinion tee', text: 'Not every story has one side.', tone: 'orange' },
    { index: '03', caption: 'Culture line', text: 'Culture is never just one thing.', tone: 'cream' },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {posters.map((poster) => (
        <figure key={poster.index} className="flex flex-col">
          <div className={`flex aspect-[3/4] flex-col justify-between p-6 md:p-8 ${POSTER_TONES[poster.tone]}`}>
            <span className="font-sans text-xs font-semibold uppercase tracking-label opacity-80">{poster.index}</span>
            <p className="display-heading text-5xl leading-[0.92] md:text-6xl">{poster.text}</p>
          </div>
          <figcaption className="mt-3 font-sans text-xs uppercase tracking-label text-charcoal-mid">{poster.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}

type PatternKind = 'triangles' | 'arcs' | 'grid';

interface PatternTileProps {
  kind: PatternKind;
  label: string;
  background: string;
  foreground: string;
}

export function PatternTile({ kind, label, background, foreground }: PatternTileProps) {
  const patternId = useId().replace(/:/g, '');

  return (
    <figure className="flex flex-col">
      <svg
        role="img"
        aria-label={label}
        className="aspect-square w-full"
        style={{ backgroundColor: background }}
      >
        <defs>
          <pattern id={patternId} width="48" height="48" patternUnits="userSpaceOnUse">
            {kind === 'triangles' && (
              <path d="M0 48 L24 0 L48 48 Z" fill={foreground} />
            )}
            {kind === 'arcs' && (
              <path d="M0 24 A24 24 0 0 1 48 24" fill="none" stroke={foreground} strokeWidth="4" />
            )}
            {kind === 'grid' && (
              <>
                <rect x="0" y="0" width="24" height="24" fill={foreground} />
                <rect x="24" y="24" width="24" height="24" fill={foreground} />
              </>
            )}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      <figcaption className="mt-3 font-sans text-xs uppercase tracking-label text-charcoal-mid">{label}</figcaption>
    </figure>
  );
}

export function PatternExperiments() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      <PatternTile kind="triangles" label="Experiment 01: triangle repeat" background="#0B0B0B" foreground="#D14F1F" />
      <PatternTile kind="arcs" label="Experiment 02: arc study" background="#F5EBDD" foreground="#0B0B0B" />
      <PatternTile kind="grid" label="Experiment 03: block check" background="#252525" foreground="#F5EBDD" />
    </div>
  );
}
