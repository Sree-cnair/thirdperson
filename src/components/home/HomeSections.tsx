import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { byDateDesc } from '@/data/articles';
import { usePublishedArticles, useSiteSettings } from '@/lib/useCmsContent';
import { ArticleCard } from '@/components/ArticleCard';
import { SectionHeading } from '@/components/SectionHeading';

export function HomeHero() {
  const settings = useSiteSettings();
  return (
    <section className="relative overflow-hidden bg-ink text-cream">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 pb-16 pt-12 md:px-8 md:pt-16 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-12 lg:items-end lg:gap-12 lg:pb-20 lg:pt-16">
        <div className="order-2 flex flex-col lg:order-1 lg:col-span-7">
          <p className="eyebrow animate-fade-up !text-orange">Who keeps showing up in your decisions?</p>
          <h1 className="display-heading mt-6 animate-fade-up text-[4.25rem] leading-[0.9] [animation-delay:100ms] sm:text-[6.5rem] lg:text-[7.5rem] xl:text-[9.5rem]">
            Who is this other person anyway?
          </h1>
          <p className="mt-8 max-w-md animate-fade-up font-serif text-xl italic leading-relaxed text-cream/85 [animation-delay:200ms] md:text-2xl">
            The relative, the neighbour, the group chat, the imaginary audience in your head. We all know this person. We just never seem to meet them.
          </p>
          <div className="mt-10 animate-fade-up [animation-delay:300ms]">
            <Link to="/stories" className="btn-primary">
              Find out who
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="order-1 animate-fade-up [animation-delay:150ms] lg:order-2 lg:col-span-5">
          <div className="relative ml-auto max-w-md lg:max-w-none">
            <img
              src="https://images.pexels.com/photos/13400083/pexels-photo-13400083.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt="A couple sharing a quiet moment in an empty cinema hall, photographed in black and white"
              className="aspect-[4/5] w-full object-cover grayscale contrast-110 lg:aspect-[3/4]"
              fetchPriority="high"
            />
            <div className="absolute -bottom-4 -left-4 hidden h-16 w-16 items-center justify-center border border-cream/30 bg-ink md:flex">
              <span className="font-display text-2xl text-orange">01</span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-5 py-4 font-sans text-xs uppercase tracking-label text-cream/70 md:px-8">
          <span>Cinema</span>
          <span className="hidden sm:inline">Football</span>
          <span className="hidden md:inline">Fashion</span>
          <span className="hidden md:inline">Society</span>
          <span>Design</span>
          <span>Opinion</span>
        </div>
      </div>
    </section>
  );
}

export function LatestStories() {
  const articles = usePublishedArticles();
  const settings = useSiteSettings();
  const [lead, ...rest] = articles.filter(article => article.section === 'stories').sort((a,b) => Number(b.id === settings?.featured_article_id) - Number(a.id === settings?.featured_article_id) || Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || byDateDesc(a,b));

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28" aria-labelledby="latest-heading">
      <SectionHeading
        eyebrow="From the editorial desk"
        title="The questions behind the comments"
        as="h2"
        action={
          <Link to="/stories" className="link-underline text-ink hover:text-orange-deep">
            All stories
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        }
      />
      <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
        {lead && <div className="lg:col-span-6"><ArticleCard article={lead} /></div>}
        <div className="flex flex-col gap-10 lg:col-span-6">
          {rest.map((article) => (
            <ArticleCard key={article.slug} article={article} layout="horizontal" />
          ))}
        </div>
      </div>
    </section>
  );
}
