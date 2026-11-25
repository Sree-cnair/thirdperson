import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { byDateDesc } from '@/data/articles';
import { useActiveProducts, usePublishedArticles } from '@/lib/useCmsContent';

import { ArticleCard } from '@/components/ArticleCard';
import { PageHero } from '@/components/PageHero';
import { ProductCard } from '@/components/ProductCard';
import { PatternExperiments, TypographyPosters } from '@/components/fashion/FashionExperiments';
import { SectionHeading } from '@/components/SectionHeading';
import { useDocumentMeta } from '@/lib/useDocumentMeta';

const GRAPHIC_CONCEPTS = [
  {
    title: 'The Unsaid',
    text: 'Short phrases and familiar reactions, turned into graphics that leave room for the reader to bring their own meaning.',
  },
  {
    title: 'Conversation Type',
    text: 'Typography that borrows the energy of a note, a headline or a message passed across a room.',
  },
  {
    title: 'Everyday Symbols',
    text: 'Ordinary visual cues reworked into a graphic language for the small absurdities of daily life.',
  },
];

export function FashionPage() {
  useDocumentMeta(
    'Objects & Expression | THE OTHER PERSON',
    'Wearable ideas, graphic experiments and objects from THE OTHER PERSON.',
  );

  const articles = usePublishedArticles();
  const products = useActiveProducts();
  const fashionStories = articles.filter((article) => article.category === 'Fashion' || article.category === 'Design')
    .sort(byDateDesc)
    .slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="Objects & expression"
        title="Fashion"
        intro="A creative label where observations become graphics, words become wearable ideas and everyday culture becomes something you can take with you."
      />

      <section className="bg-ink text-cream" aria-labelledby="typography-heading">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
          <SectionHeading eyebrow="Typography" title="Words worn" tone="dark" as="h2" />
          <div className="mt-14">
            <TypographyPosters />
          </div>
        </div>
      </section>

      <section className="bg-cream" aria-labelledby="concepts-heading">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
          <SectionHeading eyebrow="Ideas turned into graphics" title="Concepts" as="h2" />
          <ol className="mt-14 grid gap-12 md:grid-cols-3">
            {GRAPHIC_CONCEPTS.map((concept, index) => (
              <li key={concept.title} className="flex flex-col gap-4 border-t border-ink pt-6">
                <span className="font-display text-6xl text-orange-deep">0{index + 1}</span>
                <h3 className="font-serif text-3xl">{concept.title}</h3>
                <p className="leading-relaxed text-charcoal">{concept.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-14 font-malayalam text-3xl text-ink">സ്വാഗതം</p>
          <p className="mt-2 font-sans text-xs uppercase tracking-label text-charcoal-mid">Welcome, in Malayalam</p>
        </div>
      </section>

      <section className="bg-charcoal text-cream" aria-labelledby="patterns-heading">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
          <SectionHeading eyebrow="Pattern experiments" title="Repeat" tone="dark" as="h2" />
          <p className="mt-8 max-w-xl font-serif text-xl italic text-cream/85">
            Repeats, shapes and visual rhythms give everyday observations a second life as prints, patterns and objects.
          </p>
          <div className="mt-14">
            <PatternExperiments />
          </div>
        </div>
      </section>

      <section className="bg-cream" aria-labelledby="fashion-stories-heading">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
          <SectionHeading eyebrow="Style, identity & expression" title="Read the thread" as="h2" />
          <div className="mt-14 grid gap-x-8 gap-y-12 md:grid-cols-3">
            {fashionStories.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-ink/15 bg-paper" aria-labelledby="collection-heading">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
          <SectionHeading
            eyebrow="Collection preview"
            title="Made to make a point"
            as="h2"
            action={
              <Link to="/store" className="link-underline text-ink hover:text-orange-deep">
                Full catalogue
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            }
          />
          <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
