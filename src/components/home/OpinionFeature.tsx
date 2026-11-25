import { byDateDesc } from '@/data/articles';
import { usePublishedArticles } from '@/lib/useCmsContent';
import { ArticleCard } from '@/components/ArticleCard';

export function OpinionFeature() {
  const articles = usePublishedArticles();
  const [first, second] = articles.filter(article => article.section === 'opinion').sort(byDateDesc);

  return (
    <section className="bg-charcoal text-cream" aria-labelledby="opinion-heading">
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
        <div className="flex flex-col gap-6 border-t border-cream/20 pt-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow !text-orange">Opinion</p>
            <h2 id="opinion-heading" className="display-heading mt-3 max-w-4xl text-5xl text-cream md:text-7xl lg:text-8xl">
              Not every story has <span className="text-orange">one side.</span>
            </h2>
          </div>
        </div>

        <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-0">
          {first && (
            <div className="flex flex-col md:pr-12">
              <p className="font-display text-7xl leading-none text-cream/20">01</p>
              <div className="mt-6">
                <ArticleCard article={first} tone="dark" />
              </div>
            </div>
          )}
          {second && (
            <div className="flex flex-col border-t border-cream/15 pt-12 md:border-l md:border-t-0 md:pl-12 md:pt-0">
              <p className="font-display text-7xl leading-none text-cream/20">02</p>
              <div className="mt-6">
                <ArticleCard article={second} tone="dark" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
