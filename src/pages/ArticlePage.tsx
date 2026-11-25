import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { usePublishedArticles } from '@/lib/useCmsContent';
import { ArticleCard, ArticleMeta } from '@/components/ArticleCard';
import { ShareLinks } from '@/components/ShareLinks';
import { NotFoundContent } from '@/pages/NotFoundPage';
import { useDocumentMeta } from '@/lib/useDocumentMeta';

const SECTION_LABELS = {
  stories: { label: 'Stories', to: '/stories' },
  opinion: { label: 'Opinion', to: '/opinion' },
  culture: { label: 'Culture', to: '/culture' },
  fashion: { label: 'Fashion', to: '/fashion' },
} as const;

export function ArticlePage() {
  const { slug = '' } = useParams();
  const articles = usePublishedArticles();
  const article = articles.find((item) => item.slug === slug);

  useDocumentMeta(
    article ? `${article.title} | OTHER PEOPLE` : 'Article not found | OTHER PEOPLE',
    article?.excerpt ?? 'This article could not be found on OTHER PEOPLE.',
  );

  if (!article) {
    return <NotFoundContent />;
  }

  const section = SECTION_LABELS[article.section];
  const [firstParagraph, ...restParagraphs] = article.body;
  const related = [
    ...articles.filter((item) => item.slug !== article.slug && item.category === article.category),
    ...articles.filter((item) => item.slug !== article.slug && item.category !== article.category),
  ].slice(0, 3);

  return (
    <article>
      <header className="bg-cream">
        <div className="mx-auto max-w-[1100px] px-5 pb-12 pt-10 md:px-8 md:pb-16 md:pt-14">
          <Link
            to={section.to}
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-label text-ink transition-colors hover:text-orange-deep"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            {section.label}
          </Link>
          <p className="eyebrow mt-10 animate-fade-up">{article.category}</p>
          <h1 className="display-heading mt-4 animate-fade-up text-6xl [animation-delay:80ms] md:text-8xl lg:text-[7.5rem]">
            {article.title}
          </h1>
          <p className="mt-8 max-w-3xl animate-fade-up font-serif text-xl italic leading-relaxed text-charcoal [animation-delay:160ms] md:text-2xl">
            {article.dek}
          </p>
          <div className="mt-10 flex flex-col gap-6 border-t border-ink/15 pt-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-serif text-xl">{article.author.name}</p>
              <p className="mt-1 text-sm text-charcoal-mid">{article.author.role}</p>
              <ArticleMeta article={article} className="mt-3 text-charcoal-mid" />
            </div>
            <ShareLinks title={article.title} />
          </div>
        </div>
      </header>

      <figure className="mx-auto max-w-[1400px] px-0 md:px-8">
        <img
          src={article.image.src}
          alt={article.image.alt}
          className="aspect-[4/3] w-full object-cover grayscale md:aspect-[21/9]"
        />
        <figcaption className="px-5 pt-3 font-sans text-xs text-charcoal-mid md:px-0">{article.image.alt}</figcaption>
      </figure>

      <div className="mx-auto max-w-[680px] px-5 py-16 md:py-24">
        <p className="font-serif text-2xl italic leading-relaxed text-ink md:text-3xl">{firstParagraph}</p>
        <div className="mt-10 space-y-7 font-sans text-lg leading-[1.75] text-charcoal">
          {restParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-6 border-y border-ink/15 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-serif text-xl">About {article.author.name}</p>
            <p className="mt-1 text-sm text-charcoal-mid">{article.author.role}, OTHER PEOPLE</p>
          </div>
          <ShareLinks title={article.title} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-ink/15 bg-paper" aria-labelledby="related-heading">
          <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-24">
            <p className="eyebrow">Keep reading</p>
            <h2 id="related-heading" className="display-heading mt-3 text-5xl md:text-6xl">
              Related stories
            </h2>
            <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3">
              {related.map((item) => (
                <ArticleCard key={item.slug} article={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
