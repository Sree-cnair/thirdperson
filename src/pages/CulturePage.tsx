import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { byDateDesc } from '@/data/articles';
import { usePublishedArticles } from '@/lib/useCmsContent';
import { CULTURE_CATEGORIES, getCultureCategory, type CultureCategory } from '@/data/culture';
import { ArticleCard } from '@/components/ArticleCard';
import { FilterChips } from '@/components/FilterChips';
import { PageHero } from '@/components/PageHero';
import { useDocumentMeta } from '@/lib/useDocumentMeta';

const ALL = 'all';

export function CulturePage() {
  useDocumentMeta(
    'Culture | THE OTHER PERSON',
    'A closer look at the people, habits and unspoken rules that shape everyday Indian life.',
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSlug = searchParams.get('c') ?? ALL;
  const selected = getCultureCategory(selectedSlug);

  const filterOptions = [
    { value: ALL, label: 'All' },
    ...CULTURE_CATEGORIES.map((category) => ({ value: category.slug, label: category.label })),
  ];

  const articles = usePublishedArticles();
  const sections = selected ? [selected] : CULTURE_CATEGORIES;

  const handleFilter = (value: string) => {
    setSearchParams(value === ALL ? {} : { c: value }, { replace: true });
  };

  return (
    <>
      <PageHero
        eyebrow="Culture"
        title="Culture"
        intro="Culture is what we watch, wear, repeat and pass on. It is also the comments we inherit, the rules we follow and the expectations we rarely stop to question."
      >
        <FilterChips label="Filter culture by category" options={filterOptions} value={selectedSlug} onChange={handleFilter} />
      </PageHero>

      {sections.map((category, index) => (
        <CultureSection key={category.slug} category={category} articles={articles} tone={index % 2 === 0 ? 'light' : 'dark'} />
      ))}
    </>
  );
}

function CultureSection({ category, articles: allArticles, tone }: { category: CultureCategory; articles: import('@/data/types').Article[]; tone: 'light' | 'dark' }) {
  const articles = allArticles.filter((article) => category.categories.includes(article.category)).sort(byDateDesc);
  const isDark = tone === 'dark';

  return (
    <section
      id={category.slug}
      aria-labelledby={`${category.slug}-heading`}
      className={`scroll-mt-24 ${isDark ? 'bg-charcoal text-cream' : 'bg-cream text-ink'}`}
    >
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className={`eyebrow ${isDark ? '!text-orange' : ''}`}>
              {articles.length} {articles.length === 1 ? 'story' : 'stories'}
            </p>
            <h2 id={`${category.slug}-heading`} className="display-heading mt-3 text-6xl md:text-7xl">
              {category.label}
            </h2>
            <p className={`mt-6 max-w-sm font-serif text-lg italic leading-relaxed ${isDark ? 'text-cream/80' : 'text-charcoal'}`}>
              {category.description}
            </p>
            <img
              src={category.image.src}
              alt={category.image.alt}
              loading="lazy"
              className="mt-8 hidden aspect-[4/3] w-full object-cover grayscale lg:block"
            />
          </div>
        </div>

        <div className="lg:col-span-8">
          {articles.length > 0 ? (
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} tone={tone} />
              ))}
            </div>
          ) : (
            <p className={isDark ? 'text-cream/80' : 'text-charcoal-mid'}>New stories in this section are on their way.</p>
          )}
          <Link
            to="/contribute"
            className={`link-underline mt-14 ${isDark ? 'text-cream hover:text-orange' : 'text-ink hover:text-orange-deep'}`}
          >
            Pitch a story for {category.label}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
