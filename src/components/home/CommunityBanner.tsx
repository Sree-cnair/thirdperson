import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ROLES = [
  { title: 'Writers', text: 'Essays, reviews and reported pieces from every corner of the country.' },
  { title: 'Designers', text: 'Visual experiments, pattern studies and the posters on your street.' },
  { title: 'Readers', text: 'People who argue back, leave comments and keep the conversation honest.' },
];

export function CommunityBanner() {
  return (
    <section className="border-y border-ink/15 bg-cream" aria-labelledby="community-heading">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <p className="eyebrow">Community</p>
          <h2 id="community-heading" className="display-heading mt-4 text-5xl md:text-7xl lg:text-8xl">
            Every perspective <span className="text-orange-deep">has a place.</span>
          </h2>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-charcoal md:text-lg">
            PAKARAM is built by the people who read it. If you have an argument, a story or a design worth sharing, we want to hear it.
          </p>
          <div className="mt-10">
            <Link to="/contribute" className="btn-primary">
              Contribute a story
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <ul className="flex flex-col divide-y divide-ink/15 border-t border-ink/15 lg:col-span-5 lg:self-end lg:border-t-0">
          {ROLES.map((role, index) => (
            <li key={role.title} className="flex gap-6 py-6">
              <span className="font-display text-3xl text-orange-deep">0{index + 1}</span>
              <div>
                <h3 className="font-serif text-2xl">{role.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-mid">{role.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
