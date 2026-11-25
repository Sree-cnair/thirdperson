import { useState, type FormEvent } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { cmsSupabase } from '@/lib/cmsSupabase';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DUPLICATE_ERROR_CODE = '23505';

export function NewsletterForm({ tone = 'dark' }: { tone?: 'light' | 'dark' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const isDark = tone === 'dark';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = email.trim().toLowerCase();

    if (!EMAIL_PATTERN.test(normalized)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('submitting');
    setMessage('');
    if (!cmsSupabase) {
      setStatus('error');
      setMessage('The newsletter service is not configured yet. Please try again later.');
      return;
    }
    const { error } = await cmsSupabase.from('newsletter_subscribers').insert({ email: normalized });

    if (error && error.code !== DUPLICATE_ERROR_CODE) {
      setStatus('error');
      setMessage('We could not save your subscription just now. Please try again in a moment.');
      return;
    }

    setStatus('success');
    setMessage(error ? 'You are already on the list. Thank you for reading with us.' : 'You are in. Watch your inbox for the next edition.');
    setEmail('');
  };

  const inputClass = isDark
    ? 'border-cream/40 text-cream placeholder:text-cream/60 focus:border-orange'
    : 'border-ink/40 text-ink placeholder:text-charcoal-mid focus:border-orange';

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full max-w-xl">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          value={email}
          disabled={status === 'submitting'}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status !== 'submitting') setStatus('idle');
          }}
          placeholder="Your email address"
          aria-invalid={status === 'error'}
          aria-describedby="newsletter-message"
          className={`min-w-0 flex-1 border-b bg-transparent py-4 font-sans text-base focus:outline-none ${inputClass}`}
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="btn-primary justify-center disabled:cursor-wait disabled:opacity-70"
        >
          {status === 'submitting' ? 'Subscribing' : 'Subscribe'}
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
      <p
        id="newsletter-message"
        role="status"
        aria-live="polite"
        className={`mt-4 flex min-h-[1.5rem] items-center gap-2 font-sans text-sm ${
          status === 'error' ? (isDark ? 'text-[#FFA89C]' : 'text-error') : isDark ? 'text-cream/85' : 'text-charcoal'
        }`}
      >
        {status === 'success' && <Check aria-hidden="true" className="h-4 w-4 text-success" />}
        {message}
      </p>
    </form>
  );
}
