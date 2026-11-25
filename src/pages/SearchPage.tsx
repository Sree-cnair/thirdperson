import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ARTICLES, byDateDesc } from '@/data/articles';
import { PRODUCTS } from '@/data/products';
import { ArticleCard } from '@/components/ArticleCard';
import { ProductCard } from '@/components/ProductCard';
import { SearchField } from '@/components/SearchField';
import { articleFields, matchesQuery, productFields } from '@/lib/search';
import { useDocumentMeta } from '@/lib/useDocumentMeta';

export function SearchPage() {
  useDocumentMeta('Search | OTHER PEOPLE', 'Search OTHER PEOPLE stories, opinion, culture, fashion and store products.');

  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  const handleQueryChange = (value: string) => {
    setSearchParams(value ? { q: value } : {}, { replace: true });
  };

  const articles = useMemo(
    () => ARTICLES.filter((article) => matchesQuery(query, articleFields(article))).sort(byDateDesc),
    [query],
  );
  const products = useMemo(
    () => PRODUCTS.filter((product) => matchesQuery(query, productFields(product))),
    [query],
  );
  const hasQuery = query.trim().length > 0;
  const total = articles.length + products.length;

  return (
    <>
      <section className="bg-ink text-cream">
        <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-14 md:px-8 md:pb-20 md:pt-20">
          <p className="eyebrow !text-orange">Search</p>
          <h1 className="display-heading mt-4 text-6xl md:text-8xl">Find a perspective</h1>
          <div className="mt-10 max-w-2xl [&_input]:border-cream/40 [&_input]:text-cream [&_input]:placeholder:text-cream/60 [&_label]:text-cream">
            <SearchField
              label="Search the archive"
              value={query}
              onChange={handleQueryChange}
              placeholder="Search by topic, writer or product"
            />
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-20">
          {!hasQuery && (
            <p className="font-serif text-2xl italic text-charcoal">Type a topic, a writer or a product name to begin.</p>
          )}

          {hasQuery && total === 0 && (
            <div className="border-t border-ink/15 pt-10">
              <h2 className="font-serif text-3xl">Nothing matched “{query.trim()}”.</h2>
              <p className="mt-3 max-w-md text-charcoal-mid">Try a shorter word, or browse the sections from the menu above.</p>
            </div>
          )}

          {hasQuery && articles.length > 0 && (
            <div>
              <h2 className="eyebrow">Stories and opinion ({articles.length})</h2>
              <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </div>
          )}

          {hasQuery && products.length > 0 && (
            <div className={articles.length > 0 ? 'mt-20' : ''}>
              <h2 className="eyebrow">Store ({products.length})</h2>
              <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
