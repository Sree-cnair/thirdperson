import { useMemo, useState } from 'react';
import { byDateDesc } from '@/data/articles';
import { usePublishedArticles } from '@/lib/useCmsContent';
import type { Article, ArticleCategory, ArticleSection } from '@/data/types';
import { ArticleCard } from '@/components/ArticleCard';
import { FilterChips } from '@/components/FilterChips';
import { PageHero } from '@/components/PageHero';
import { SearchField } from '@/components/SearchField';
import { articleFields, matchesQuery } from '@/lib/search';
import { useDocumentMeta } from '@/lib/useDocumentMeta';

type CategoryFilter = 'All' | ArticleCategory;

const ALL_CATEGORIES: CategoryFilter[] = ['All', 'Cinema', 'Football', 'Fashion', 'Design', 'Society', 'World Affairs'];

interface ArticleListingPageProps {
  section: ArticleSection;
  eyebrow: string;
  title: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  tone?: 'light' | 'dark' | 'opinion';
}

export function ArticleListingPage({
  section,
  eyebrow,
  title,
  intro,
  metaTitle,
  metaDescription,
  tone = 'light',
}: ArticleListingPageProps) {
  useDocumentMeta(metaTitle, metaDescription);
  const articles = usePublishedArticles();
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [query, setQuery] = useState('');

  const sectionArticles = useMemo(
    () => articles.filter((article) => article.section === section).sort(byDateDesc),
    [section, articles],
  );

  const filterOptions = useMemo(() => {
    const available = new Set(sectionArticles.map((article) => article.category));
    return ALL_CATEGORIES.filter((c) => c === 'All' || available.has(c));
  }, [sectionArticles]);

  const visible = useMemo(
    () =>
      sectionArticles.filter(
        (article: Article) =>
          (category === 'All' || article.category === category) && matchesQuery(query, articleFields(article)),
      ),
    [category, query, sectionArticles],
  );

  const isDark = tone === 'dark' || tone === 'opinion';
  const isOpinion = tone === 'opinion';

  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} intro={intro} tone={tone} />
      <section className={isOpinion ? 'bg-blush text-damson' : isDark ? 'bg-charcoal text-cream' : 'bg-cream text-ink'}>
        <div className="mx-auto max-w-[1400px] px-5 pb-24 md:px-8 md:pb-32">
          <div
            className={`flex flex-col gap-6 border-y py-6 lg:flex-row lg:items-center lg:justify-between ${
              isOpinion ? 'border-damson/25' : isDark ? 'border-cream/20' : 'border-ink/15'
            }`}
          >
            <FilterChips tone={isOpinion ? 'opinion' : 'default'} label="Filter by category" options={filterOptions.map((c) => ({ value: c, label: c }))} value={category} onChange={setCategory} />
            <SearchField tone={isOpinion ? 'opinion' : 'default'} label="Search articles" value={query} onChange={setQuery} placeholder="Search by title, writer or topic" />
          </div>

          <p className={`mt-8 font-sans text-xs uppercase tracking-label ${isOpinion ? 'text-damson/70' : isDark ? 'text-cream/70' : 'text-charcoal-mid'}`} aria-live="polite">
            {visible.length} {visible.length === 1 ? 'story' : 'stories'}
          </p>

          {visible.length > 0 ? (
            <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((article) => (
                <ArticleCard key={article.slug} article={article} tone={tone} />
              ))}
            </div>
          ) : (
            <div className={`mt-16 border-t pt-10 ${isOpinion ? 'border-damson/25' : isDark ? 'border-cream/20' : 'border-ink/15'}`}>
              <h2 className="font-serif text-3xl">No stories match that search.</h2>
              <p className={`mt-3 max-w-md ${isOpinion ? 'text-damson/80' : isDark ? 'text-cream/80' : 'text-charcoal-mid'}`}>
                Try a different keyword or clear the filters to see everything in this section.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setCategory('All');
                }}
                className={`btn-outline mt-8 ${isOpinion ? "!border-damson !text-damson hover:!bg-damson hover:!text-lemon" : ""}`}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
