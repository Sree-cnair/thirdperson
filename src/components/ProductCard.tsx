import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Product } from '@/data/types';
import { formatINR } from '@/lib/format';

export function ProductCard({ product }: { product: Product }) {
  const [primary] = product.images;

  return (
    <article className="group flex h-full flex-col">
      <Link to={`/store/${product.slug}`} className="relative block overflow-hidden bg-charcoal/10">
        <img
          src={primary.src}
          alt={primary.alt}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover transition duration-700 ease-out group-hover:scale-105 group-hover:brightness-95"
        />
        <span className="absolute left-3 top-3 bg-cream px-2.5 py-1 font-sans text-[11px] font-semibold uppercase tracking-label text-ink">
          {product.category}
        </span>
      </Link>
      <div className="flex flex-1 flex-col pt-5">
        <h3 className="font-serif text-2xl leading-tight">
          <Link to={`/store/${product.slug}`} className="transition-colors hover:text-orange-deep">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-charcoal-mid">{product.tagline}</p>
        <div className="mt-auto flex items-center justify-between border-t border-ink/15 pt-4">
          <p className="font-sans text-lg font-semibold">{formatINR(product.price)}</p>
          <Link
            to={`/store/${product.slug}`}
            className="link-underline text-ink hover:text-orange-deep"
          >
            View product
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
