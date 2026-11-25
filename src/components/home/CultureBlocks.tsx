import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ARTICLES } from '@/data/articles';
import { CULTURE_CATEGORIES, type CultureCategory } from '@/data/culture';
import { SectionHeading } from '@/components/SectionHeading';

export function CultureBlocks() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28" aria-labelledby="culture-heading">
      <SectionHeading
        eyebrow="Culture"
        title="Culture"
        action={
          <Link to="/culture" className="link-underline text-ink hover:text-orange-deep">
            Explore culture
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        }
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CULTURE_CATEGORIES.map((category) => (
          <CultureTile key={category.slug} category={category} />
        ))}
      </div>
    </section>
  );
}

function CultureTile({ category }: { category: CultureCategory }) {
  const count = ARTICLES.filter((article) => category.categories.includes(article.category)).length;

  return (
    <Link
      to={`/culture?c=${category.slug}`}
      className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden bg-ink text-cream"
    >
      <img
        src={category.image.src}
        alt={category.image.alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-80 grayscale transition duration-700 ease-out group-hover:scale-105 group-hover:opacity-60"
      />
      <div className="relative flex flex-col gap-2 p-6">
        <p className="font-sans text-xs font-semibold uppercase tracking-label text-cream/80">
          {count} {count === 1 ? 'story' : 'stories'}
        </p>
        <h3 className="display-heading text-4xl leading-none md:text-5xl">{category.label}</h3>
        <span className="mt-2 flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-label text-orange transition-transform duration-300 group-hover:translate-x-1">
          Enter
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
