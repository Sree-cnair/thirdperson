import { useMemo, useState } from 'react';
import { useActiveProducts } from '@/lib/useCmsContent';
import { FilterChips } from '@/components/FilterChips';
import { PageHero } from '@/components/PageHero';
import { ProductCard } from '@/components/ProductCard';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import type { ProductCategory } from '@/data/types';

type CategoryFilter = 'All' | ProductCategory;

const FILTERS: { value: CategoryFilter; label: string }[] = [
  { value: 'All', label: 'All' },
  { value: 'Tees', label: 'Tees' },
  { value: 'Totes', label: 'Totes' },
];

export function StorePage() {
  useDocumentMeta(
    'Store | PAKARAM',
    'The first PAKARAM catalogue: oversized tees, pattern and typography prints, and the everyday tote. Prices in INR.',
  );
  const productsFromCms = useActiveProducts();
  const [category, setCategory] = useState<CategoryFilter>('All');

  const products = useMemo(
    () => productsFromCms.filter((product) => category === 'All' || product.category === category),
    [category, productsFromCms],
  );

  return (
    <>
      <PageHero
        eyebrow="Store"
        title="The Store"
        intro="A first catalogue of tees and totes, designed as an extension of the magazine. Orders are not taken online yet, so enquire by email for sizes and availability."
      />

      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 pb-24 md:px-8 md:pb-32">
          <div className="flex flex-col gap-6 border-y border-ink/15 py-6 md:flex-row md:items-center md:justify-between">
            <FilterChips label="Filter products by category" options={FILTERS} value={category} onChange={setCategory} />
            <p className="font-sans text-xs uppercase tracking-label text-charcoal-mid" aria-live="polite">
              {products.length} {products.length === 1 ? 'product' : 'products'}
            </p>
          </div>
          <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          <p className="mt-20 max-w-2xl border-t border-ink/15 pt-8 font-serif text-lg italic text-charcoal">
            Demonstration catalogue for launch. Prices are shown in Indian rupees. Payment is not yet available online.
          </p>
        </div>
      </section>
    </>
  );
}
