import { Link } from 'react-router-dom';
import { ArrowRight, Triangle } from 'lucide-react';

export function FashionBanner() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-cream" aria-labelledby="fashion-heading">
      <img
        src="https://images.pexels.com/photos/19793651/pexels-photo-19793651.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
        alt="A man in a tailored outfit walking through a city, photographed in black and white"
        loading="lazy"
        className="absolute inset-0 -z-10 h-full w-full object-cover grayscale"
      />
      <div className="absolute inset-0 -z-10 bg-ink/75" aria-hidden="true" />
      <div className="mx-auto flex min-h-[70svh] max-w-[1400px] flex-col justify-center px-5 py-24 md:px-8 md:py-32">
        <Triangle aria-hidden="true" className="h-6 w-6 fill-orange text-orange" strokeWidth={0} />
        <p className="eyebrow mt-8 !text-orange">Objects & expression</p>
        <h2 id="fashion-heading" className="display-heading mt-4 max-w-5xl text-[4.5rem] leading-[0.9] sm:text-[7rem] lg:text-[9rem]">
          Wear what <span className="text-orange">you think.</span>
        </h2>
        <p className="mt-8 max-w-xl font-sans text-base leading-relaxed text-cream/85 md:text-lg">
          Our pieces turn observations, opinions and cultural references into things you can wear, carry and live with. Not merch for the sake of a logo. Ideas you can take outside.
        </p>
        <div className="mt-10">
          <Link to="/store" className="btn-primary">
            Explore the store
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
