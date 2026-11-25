import { NewsletterForm } from '@/components/NewsletterForm';

export function NewsletterSection() {
  return (
    <section className="bg-ink text-cream" aria-labelledby="newsletter-heading">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-20 md:px-8 md:py-24 lg:grid-cols-12 lg:items-end lg:gap-16">
        <div className="lg:col-span-6">
          <p className="eyebrow !text-orange">Newsletter</p>
          <h2 id="newsletter-heading" className="display-heading mt-4 text-5xl md:text-7xl">
            A little less noise. <span className="text-orange">A better question.</span>
          </h2>
          <p className="mt-6 max-w-md font-serif text-lg italic leading-relaxed text-cream/80">
            A note from our side of the conversation: new stories, opinions, cultural observations and first looks at things we are making.
          </p>
        </div>
        <div className="lg:col-span-6">
          <NewsletterForm tone="dark" />
        </div>
      </div>
    </section>
  );
}
