import { CheckCircle2 } from 'lucide-react';
import { ContributeForm } from '@/components/contribute/ContributeForm';
import { PageHero } from '@/components/PageHero';
import { useDocumentMeta } from '@/lib/useDocumentMeta';

const STEPS = [
  { title: 'Send your piece', text: 'Fill in the form with your article, a short bio and a category.' },
  { title: 'Editorial review', text: 'Our editors read every submission and may suggest edits before anything is published.' },
  { title: 'Publication', text: 'If it is a fit, we will work with you on the final version and a date.' },
];

export function ContributePage() {
  useDocumentMeta(
    'Contribute | THE OTHER PERSON',
    'Share an essay, opinion, observation or creative work with THE OTHER PERSON. Curious voices and fresh perspectives are welcome.',
  );

  return (
    <>
      <PageHero
        eyebrow="Contribute"
        title="Write for us"
        intro="We are interested in the things people notice, question, laugh about and rarely say out loud. Bring us a personal essay, an uncomfortable question, a cultural observation, an opinion you can stand behind or a creative idea."
      />

      <section className="bg-cream">
        <div className="mx-auto grid max-w-[1400px] gap-16 px-5 pb-24 md:px-8 md:pb-32 lg:grid-cols-12 lg:gap-20">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow">How it works</p>
              <ol className="mt-6 divide-y divide-ink/15 border-y border-ink/15">
                {STEPS.map((step, index) => (
                  <li key={step.title} className="flex gap-5 py-6">
                    <span className="font-display text-3xl text-orange-deep">0{index + 1}</span>
                    <div>
                      <h2 className="font-serif text-xl">{step.title}</h2>
                      <p className="mt-2 text-sm leading-relaxed text-charcoal">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-8 flex gap-3 text-sm leading-relaxed text-charcoal">
                <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                Every submission is reviewed by the THE OTHER PERSON editorial team before publication. Nothing is published automatically.
              </p>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <ContributeForm />
          </div>
        </div>
      </section>
    </>
  );
}
