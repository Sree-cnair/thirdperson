import { Search, X } from 'lucide-react';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label: string;
  tone?: 'default' | 'opinion';
}

export function SearchField({ value, onChange, placeholder = 'Search', label, tone = 'default' }: SearchFieldProps) {
  const opinion = tone === 'opinion';

  return (
    <div className="relative w-full md:max-w-sm">
      <label htmlFor={`search-${label}`} className="sr-only">
        {label}
      </label>
      <Search aria-hidden="true" className={`pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 ${opinion ? 'text-damson/70' : 'text-charcoal-mid'}`} />
      <input
        id={`search-${label}`}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`w-full border-b bg-transparent py-3 pl-7 pr-8 font-sans text-base focus:outline-none ${opinion ? 'border-damson/35 text-damson placeholder:text-damson/55 focus:border-damson' : 'border-ink/30 text-ink placeholder:text-charcoal-mid focus:border-orange'}`}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className={`absolute right-0 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center transition-colors ${opinion ? 'text-damson/70 hover:text-damson' : 'text-charcoal-mid hover:text-ink'}`}
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
