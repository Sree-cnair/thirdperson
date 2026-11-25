import { Link } from 'react-router-dom';
import type { Article } from '@/data/types';
import { formatDate, formatReadingTime } from '@/lib/format';

interface ArticleCardProps {
  article: Article;
  tone?: 'light' | 'dark' | 'opinion';
  layout?: 'stacked' | 'horizontal';
}

export function ArticleCard({ article, tone = 'light', layout = 'stacked' }: ArticleCardProps) {
  const isDark = tone === 'dark' || tone === 'opinion';
  const isOpinion = tone === 'opinion';
  const metaClass = isOpinion ? 'text-damson/70' : isDark ? 'text-cream/70' : 'text-charcoal-mid';
  const bodyClass = isOpinion ? 'text-damson/85' : isDark ? 'text-cream/80' : 'text-charcoal-mid';
  const titleClass = isOpinion ? 'text-damson hover:text-[#A23D69]' : isDark ? 'text-cream hover:text-orange' : 'text-ink hover:text-orange-deep';

  if (layout === 'horizontal') {
    return (
      <article className="group grid gap-6 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:items-start">
        <Link to={`/article/${article.slug}`} className="block overflow-hidden bg-charcoal/10">
          <img
            src={article.image.src}
            alt={article.image.alt}
            loading="lazy"
            className="img-mono aspect-[4/3] h-full w-full object-cover group-hover:grayscale-0 group-hover:scale-105"
          />
        </Link>
        <div className="flex flex-col">
          <p className={`eyebrow ${isOpinion ? '!text-damson' : isDark ? '!text-orange' : ''}`}>{article.category}</p>
          <h3 className={`mt-3 font-serif text-2xl leading-tight transition-colors md:text-3xl ${titleClass}`}>
            <Link to={`/article/${article.slug}`}>{article.title}</Link>
          </h3>
          <p className={`mt-3 text-sm leading-relaxed ${bodyClass}`}>{article.excerpt}</p>
          <ArticleMeta article={article} className={`mt-5 ${metaClass}`} />
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col">
      <Link to={`/article/${article.slug}`} className="block overflow-hidden bg-charcoal/10">
        <img
          src={article.image.src}
          alt={article.image.alt}
          loading="lazy"
          className="img-mono aspect-[4/5] w-full object-cover group-hover:grayscale-0 group-hover:scale-105 md:aspect-[4/3]"
        />
      </Link>
      <div className="flex flex-1 flex-col pt-5">
        <p className={`eyebrow ${isOpinion ? '!text-damson' : isDark ? '!text-orange' : ''}`}>{article.category}</p>
        <h3 className={`mt-3 font-serif text-2xl leading-tight transition-colors ${titleClass}`}>
          <Link to={`/article/${article.slug}`}>{article.title}</Link>
        </h3>
        <p className={`mt-3 line-clamp-3 text-sm leading-relaxed ${bodyClass}`}>{article.excerpt}</p>
        <ArticleMeta article={article} className={`mt-auto border-t border-current/15 pt-4 ${metaClass}`} />
      </div>
    </article>
  );
}

interface ArticleMetaProps {
  article: Article;
  className?: string;
}

export function ArticleMeta({ article, className = '' }: ArticleMetaProps) {
  return (
    <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 font-sans text-xs uppercase tracking-wide ${className}`}>
      <span className="font-semibold">{article.author.name}</span>
      <span aria-hidden="true">/</span>
      <time dateTime={article.date}>{formatDate(article.date)}</time>
      <span aria-hidden="true">/</span>
      <span>{formatReadingTime(article.readingTime)}</span>
    </p>
  );
}
