import { useState, type FormEvent } from 'react';
import { CONTRIBUTION_CATEGORIES, validateContribution, type ContributionValues, EMPTY_CONTRIBUTION } from '@/lib/contribution';
import { cmsSupabase } from '@/lib/cmsSupabase';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ContributeForm() {
  const [values, setValues] = useState<ContributionValues>(EMPTY_CONTRIBUTION);
  const [errors, setErrors] = useState<Partial<Record<keyof ContributionValues, string>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState('');

  const update = <K extends keyof ContributionValues>(key: K, value: ContributionValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validateContribution(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus('submitting');
    setServerError('');
    if (!cmsSupabase) {
      setStatus('error');
      setServerError('The submission service is not configured yet. Please try again later.');
      return;
    }
    const { error } = await cmsSupabase.from('contributions').insert({
      contributor_name: values.name.trim(),
      contributor_email: values.email.trim().toLowerCase(),
      proposed_title: values.articleTitle.trim(),
      category: values.category,
      author_bio: values.authorBio.trim(),
      content: values.articleText.trim(),
      reference_link: values.referenceLink.trim() || null,
      originality_confirmed: values.originalityConfirmed,
      status: 'pending',
    });

    if (error) {
      setStatus('error');
      setServerError('Your submission could not be sent. Your text is still here, so please try again in a moment.');
      return;
    }

    setStatus('success');
    setValues(EMPTY_CONTRIBUTION);
  };

  if (status === 'success') {
    return (
      <div role="status" className="border border-ink/20 bg-paper p-8 md:p-12">
        <p className="eyebrow">Received</p>
        <h2 className="display-heading mt-4 text-5xl">Thank you.</h2>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-charcoal">
          Your submission has reached the PAKARAM editorial team. We review every piece before it is published, and we will reply to the email address you provided.
        </p>
        <button type="button" onClick={() => setStatus('idle')} className="btn-outline mt-10">
          Submit another piece
        </button>
      </div>
    );
  }

  const fieldClass = (key: keyof ContributionValues) =>
    `mt-2 w-full border bg-paper px-4 py-3 font-sans text-base text-ink placeholder:text-charcoal-mid focus:outline-none focus:ring-2 focus:ring-orange/40 ${
      errors[key] ? 'border-error' : 'border-ink/30 focus:border-orange'
    }`;

  const errorText = (key: keyof ContributionValues) =>
    errors[key] && (
      <p id={`${key}-error`} className="mt-2 font-sans text-sm text-error">
        {errors[key]}
      </p>
    );

  const describedBy = (key: keyof ContributionValues) => (errors[key] ? `${key}-error` : undefined);
  const isSubmitting = status === 'submitting';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8" aria-label="Contributor submission form">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="font-sans text-sm font-semibold">Full name</label>
          <input id="name" autoComplete="name" value={values.name} onChange={(e) => update('name', e.target.value)} aria-invalid={!!errors.name} aria-describedby={describedBy('name')} className={fieldClass('name')} />
          {errorText('name')}
        </div>
        <div>
          <label htmlFor="email" className="font-sans text-sm font-semibold">Email</label>
          <input id="email" type="email" autoComplete="email" value={values.email} onChange={(e) => update('email', e.target.value)} aria-invalid={!!errors.email} aria-describedby={describedBy('email')} className={fieldClass('email')} />
          {errorText('email')}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
        <div>
          <label htmlFor="articleTitle" className="font-sans text-sm font-semibold">Article title</label>
          <input id="articleTitle" value={values.articleTitle} onChange={(e) => update('articleTitle', e.target.value)} aria-invalid={!!errors.articleTitle} aria-describedby={describedBy('articleTitle')} className={fieldClass('articleTitle')} />
          {errorText('articleTitle')}
        </div>
        <div>
          <label htmlFor="category" className="font-sans text-sm font-semibold">Category</label>
          <select id="category" value={values.category} onChange={(e) => update('category', e.target.value as ContributionValues['category'])} aria-invalid={!!errors.category} aria-describedby={describedBy('category')} className={fieldClass('category')}>
            <option value="">Choose one</option>
            {CONTRIBUTION_CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errorText('category')}
        </div>
      </div>

      <div>
        <label htmlFor="authorBio" className="font-sans text-sm font-semibold">Short author bio</label>
        <p className="mt-1 text-sm text-charcoal-mid">Two or three sentences about you and your work.</p>
        <textarea id="authorBio" rows={3} value={values.authorBio} onChange={(e) => update('authorBio', e.target.value)} aria-invalid={!!errors.authorBio} aria-describedby={describedBy('authorBio')} className={fieldClass('authorBio')} />
        {errorText('authorBio')}
      </div>

      <div>
        <label htmlFor="articleText" className="font-sans text-sm font-semibold">Article text</label>
        <p className="mt-1 text-sm text-charcoal-mid">Paste your piece. At least 200 characters.</p>
        <textarea id="articleText" rows={12} value={values.articleText} onChange={(e) => update('articleText', e.target.value)} aria-invalid={!!errors.articleText} aria-describedby={describedBy('articleText')} className={fieldClass('articleText')} />
        <p className="mt-1 text-right font-sans text-xs text-charcoal-mid">{values.articleText.length} characters</p>
        {errorText('articleText')}
      </div>

      <div>
        <label htmlFor="referenceLink" className="font-sans text-sm font-semibold">Image or document link (optional)</label>
        <p className="mt-1 text-sm text-charcoal-mid">A shared link to images or a document. Starts with https://</p>
        <input id="referenceLink" type="url" value={values.referenceLink} onChange={(e) => update('referenceLink', e.target.value)} aria-invalid={!!errors.referenceLink} aria-describedby={describedBy('referenceLink')} className={fieldClass('referenceLink')} />
        {errorText('referenceLink')}
      </div>

      <div className="border-t border-ink/15 pt-8">
        <label className="flex cursor-pointer items-start gap-4">
          <input type="checkbox" checked={values.originalityConfirmed} onChange={(e) => update('originalityConfirmed', e.target.checked)} aria-invalid={!!errors.originalityConfirmed} aria-describedby={describedBy('originalityConfirmed')} className="mt-1 h-5 w-5 shrink-0 accent-orange-deep" />
          <span className="font-sans text-sm leading-relaxed text-charcoal">
            I confirm this work is original, written by me, and that I have permission to share any images or quotes it contains. I agree that PAKARAM may edit it for publication.
          </span>
        </label>
        {errorText('originalityConfirmed')}
      </div>

      {status === 'error' && (
        <p role="alert" className="border-l-2 border-error pl-4 font-sans text-sm text-error">{serverError}</p>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-sm text-charcoal-mid">Submissions are reviewed by the editorial team before publication. Nothing goes live automatically.</p>
        <button type="submit" disabled={isSubmitting} className="btn-primary disabled:cursor-wait disabled:opacity-70">
          {isSubmitting ? 'Sending' : 'Submit for review'}
        </button>
      </div>
    </form>
  );
}
