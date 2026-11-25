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
    'Who is this other person anyway? An Indian editorial and creative platform about the invisible audience in our everyday lives.',
  );

  return (
    <>
      <PageHero eyebrow="About THE OTHER PERSON" title="About" tone="dark" />

      <section className="bg-cream">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <p className="font-serif text-3xl leading-snug md:text-5xl">
              Who is this other person anyway?
            </p>
          </div>
          <div className="space-y-6 font-sans text-lg leading-[1.75] text-charcoal lg:col-span-5 lg:col-start-8">
            <p>
              The other person is not one person. They are the relative with a question, the neighbour with an update, the colleague with an opinion, the family group chat and the stranger whose judgement we imagine before they have said a word. They appear when we choose what to wear, what to study, where to work, who to love, when to marry or what to post. Sometimes the voice is familiar. Sometimes it is a vague “log kya kahenge?” hanging in the air. THE OTHER PERSON is an Indian editorial and creative platform exploring the invisible audience that shapes our choices. Through stories, opinions, cultural observations and design, we look at who this person is, why their opinion carries weight and what happens when we stop treating it as the final word.
            </p>
            <p className="font-serif text-2xl italic text-ink">A closer look at the audience we carry around — and the lives we build while imagining what they might say.</p>
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
              We want to hear from writers, photographers, illustrators and designers with a perspective to share. If you have an idea, a story or an observation that belongs in this conversation, send it our way.
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
                Before subscribing or submitting work, please share only the information needed for your enquiry. We will publish a clear privacy notice before collecting personal information through this site.
              </dd>
            </div>
            <div>
              <dt className="font-serif text-2xl">Contributions</dt>
              <dd className="mt-3 max-w-2xl leading-relaxed text-charcoal">
                Please submit work you created and have the right to share. We will agree on publication, editing, credit and any usage permissions with contributors before publishing.
              </dd>
            </div>
            <div>
              <dt className="font-serif text-2xl">Store and returns</dt>
              <dd className="mt-3 max-w-2xl leading-relaxed text-charcoal">
                The store is currently a collection preview. Online ordering, payment, shipping and returns are not yet available.
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
