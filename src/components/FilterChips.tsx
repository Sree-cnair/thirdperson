interface FilterOption<T extends string> {
  value: T;
  label: string;
}

interface FilterChipsProps<T extends string> {
  label: string;
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  tone?: 'default' | 'opinion';
}

export function FilterChips<T extends string>({ label, options, value, onChange, tone = 'default' }: FilterChipsProps<T>) {
  const opinion = tone === 'opinion';

  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`border px-4 py-2 font-sans text-xs font-semibold uppercase tracking-label transition-colors duration-300 ${
              active
                ? opinion ? 'border-damson bg-damson text-lemon' : 'border-ink bg-ink text-cream'
                : opinion ? 'border-damson/30 text-damson hover:border-damson hover:bg-damson/5' : 'border-ink/25 text-ink hover:border-ink hover:bg-ink/5'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
