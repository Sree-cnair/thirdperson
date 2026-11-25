import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useActiveProducts } from '@/lib/useCmsContent';
import type { Product } from '@/data/types';
import { ProductCard } from '@/components/ProductCard';
import { NotFoundContent } from '@/pages/NotFoundPage';
import { formatINR } from '@/lib/format';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { DigitalProductPage } from '@/pages/DigitalProductPage';

export function ProductPage() {
  const { slug = '' } = useParams();
  const products = useActiveProducts();
  const product = products.find((item) => item.slug === slug);
  useDocumentMeta(product ? `${product.name} | THE OTHER PERSON Store` : 'Product not found | THE OTHER PERSON',
    product?.tagline ?? 'This product could not be found in the store.');
  if (!product) return <NotFoundContent />;
  if (product.category === 'Digital') return <DigitalProductPage product={product} />;
  return <ProductDetail product={product} products={products} />;
}

function ProductDetail({ product, products }: { product: Product; products: Product[] }) {
  const [activeImage, setActiveImage] = useState(0);
  const image = product.images[activeImage];
  const related = products.filter((item) => item.slug !== product.slug).slice(0, 3);
  return <>
    <div className="bg-cream"><div className="mx-auto grid max-w-[1400px] gap-12 px-5 pb-20 pt-10 md:px-8 md:pt-14 lg:grid-cols-12 lg:gap-16">
      <nav aria-label="Breadcrumb" className="lg:col-span-12"><Link to="/store" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-label"><ArrowLeft size={15}/> Back to store</Link></nav>
      <div className="lg:col-span-7"><img src={image.src} alt={image.alt} className="aspect-[4/5] w-full object-cover"/></div>
      <div className="lg:col-span-5"><p className="eyebrow">{product.category} / First drop</p><h1 className="display-heading mt-4 text-5xl md:text-6xl">{product.name}</h1><p className="mt-4 text-2xl font-semibold">{formatINR(product.price)}</p><p className="mt-6 font-serif text-xl italic text-charcoal">{product.tagline}</p><p className="mt-7 leading-relaxed text-charcoal">{product.description}</p></div>
    </div></div>
    <section className="border-t border-ink/15 bg-paper"><div className="mx-auto max-w-[1400px] px-5 py-20 md:px-8"><h2 className="display-heading text-5xl">More from the store</h2><div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{related.map((item)=><ProductCard key={item.slug} product={item}/>)}</div></div></section>
  </>;
}
