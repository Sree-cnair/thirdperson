import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface ShareLinksProps {
  title: string;
}

export function ShareLinks({ title }: ShareLinksProps) {
  const [copied, setCopied] = useState<'idle' | 'copied' | 'failed'>('idle');

  const getUrl = () => window.location.href;
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied('copied');
    } catch {
      setCopied('failed');
    }
    window.setTimeout(() => setCopied('idle'), 2400);
  };

  const linkClass =
    'font-sans text-xs font-semibold uppercase tracking-label text-ink transition-colors hover:text-orange-deep';

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <p className="font-sans text-xs font-semibold uppercase tracking-label text-charcoal-mid">Share</p>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodeURIComponent(getUrl())}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        X
      </a>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodeURIComponent(getUrl())}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        WhatsApp
      </a>
      <button type="button" onClick={handleCopy} className={`${linkClass} inline-flex items-center gap-2`}>
        {copied === 'copied' ? <Check aria-hidden="true" className="h-3.5 w-3.5 text-success" /> : <Copy aria-hidden="true" className="h-3.5 w-3.5" />}
        {copied === 'copied' ? 'Link copied' : copied === 'failed' ? 'Copy failed' : 'Copy link'}
      </button>
    </div>
  );
}
