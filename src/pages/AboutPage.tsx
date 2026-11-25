import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { useDocumentMeta } from '@/lib/useDocumentMeta';

const PRINCIPLES = [
  {
    title: 'Independent',
    text: 'We are curious before we are certain. We ask who sets the rules, who benefits from them and whether they still make sense.',
  },
  {
    title: 'Plural',
    text: 'There is rarely just one way to see a situation. We welcome different experiences, regional perspectives, first-time voices and respectful disagreement.',
  },
  {
    title: 'Considered',
    text: 'We value thoughtful writing, clear ideas, honest context and design that has something to say. Not every hot take needs to become a headline.',
  },
];

export function AboutPage() {
  useDocumentMeta(
    'About | THE OTHER PERSON',
    'THE OTHER PERSON is an independent space for stories, opinions, design and ideas from Kerala and beyond. Read our mission and editorial philosophy.',
  );

  return (
    <>
      <PageHero eyebrow="About THE OTHER PERSON" title="About" tone="dark" />

      <section className="bg-cream">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <p className="font-serif text-3xl leading-snug md:text-5xl">
              There are always three people. You. Me. And the other person.
            </p>
          </div>
          <div className="space-y-6 font-sans text-lg leading-[1.75] text-charcoal lg:col-span-5 lg:col-start-8">
            <p>
              The other person is the one whose opinion somehow matters, even when they have nothing to do with our lives. They show up when we choose what to wear, what to study, where to work, who to love, when to marry and what to post. Sometimes they are family, neighbours, friends or complete strangers. Sometimes they are simply a voice in our heads asking, “Log kya kahenge?” THE OTHER PERSON is an Indian culture and ideas platform exploring that space between who we are and who we are expected to be. Through stories, opinions, conversations, design and products, we question the rules, laugh at the contradictions and make room for different perspectives.
            </p>
            <p className="font-serif text-2xl italic text-ink">The opinions, expectations, contradictions, conversations, culture and everyday absurdities that shape the way we live.</p>
          </div>
        </div>
      </section>

      <section className="bg-charcoal text-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
          <p className="eyebrow !text-orange">Editorial philosophy</p>
          <ul className="mt-12 grid gap-12 md:grid-cols-3 md:gap-0">
            {PRINCIPLES.map((principle, index) => (
              <li
                key={principle.title}
                className={`flex flex-col gap-5 md:px-8 ${index > 0 ? 'md:border-l md:border-cream/15' : 'md:pl-0'}`}
              >
                <span className="font-display text-6xl text-orange">0{index + 1}</span>
                <h2 className="display-heading text-4xl md:text-5xl">{principle.title}</h2>
                <p className="leading-relaxed text-cream/80">{principle.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-2 lg:items-center lg:gap-20">
          <img
            src="https://images.pexels.com/photos/30396798/pexels-photo-30396798.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            alt="A film crew working indoors with professional camera equipment, photographed in black and white"
            loading="lazy"
            className="aspect-[4/5] w-full object-cover grayscale"
          />
          <div>
            <p className="eyebrow">Written by readers</p>
            <h2 className="display-heading mt-4 text-5xl md:text-7xl">Your angle belongs here</h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-charcoal">
              Writers, photographers and designers from across India send us their work. Every submission is read by our editorial team.
            </p>
            <Link to="/contribute" className="link-underline mt-10 text-ink hover:text-orange-deep">
              Contribute to THE OTHER PERSON
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="policies" className="scroll-mt-24 border-t border-ink/15 bg-cream">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-20 md:px-8 md:grid-cols-12 md:gap-16">
          <h2 className="display-heading text-5xl md:col-span-4 md:text-6xl">Policies</h2>
          <dl className="space-y-10 md:col-span-8">
            <div>
              <dt className="font-serif text-2xl">Privacy</dt>
              <dd className="mt-3 max-w-2xl leading-relaxed text-charcoal">
                We only store the email addresses people give us for the newsletter and contributor submissions, and use them to respond to that request. We never sell personal data.
              </dd>
            </div>
            <div>
              <dt className="font-serif text-2xl">Contributions</dt>
              <dd className="mt-3 max-w-2xl leading-relaxed text-charcoal">
                Contributors keep the rights to their work unless otherwise agreed in writing. Submissions must be original and must not be published elsewhere at the same time.
              </dd>
            </div>
            <div>
              <dt className="font-serif text-2xl">Store and returns</dt>
              <dd className="mt-3 max-w-2xl leading-relaxed text-charcoal">
                Store products are currently shown as a catalogue. Orders are not yet taken online, so please send an enquiry by email for sizes and availability.
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
