import { useState, type MouseEvent, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Mail } from 'lucide-react';
import { CONTACT_EMAIL } from '@/data/site';
import { SIZE_GUIDES } from '@/data/products';
import { useActiveProducts } from '@/lib/useCmsContent';
import type { Product } from '@/data/types';
import { ProductCard } from '@/components/ProductCard';
import { NotFoundContent } from '@/pages/NotFoundPage';
import { formatINR } from '@/lib/format';
import { useDocumentMeta } from '@/lib/useDocumentMeta';

export function ProductPage() {
  const { slug = '' } = useParams();
  const products = useActiveProducts();
  const product = products.find((item) => item.slug === slug);

  useDocumentMeta(
    product ? `${product.name} | PAKARAM Store` : 'Product not found | PAKARAM',
    product?.tagline ?? 'This product could not be found in the PAKARAM store.',
  );

  if (!product) return <NotFoundContent />;

  return <ProductDetail key={product.slug} product={product} products={products} />;
}

function ProductDetail({ product, products }: { product: Product; products: Product[] }) {
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [sizeError, setSizeError] = useState(false);
  const image = product.images[activeImage];
  const related = products.filter((item) => item.slug !== product.slug).slice(0, 3);
  const guide = SIZE_GUIDES[product.category];

  const enquiryHref = (() => {
    const subject = `Order enquiry: ${product.name}${size ? ` (${size})` : ''}`;
    const body = `Hello PAKARAM,\n\nI would like to enquire about ${product.name}${size ? `, size ${size}` : ''}.\n\nThank you.`;
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  })();

  const handleEnquiry = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!size) {
      event.preventDefault();
      setSizeError(true);
    }
  };

  return (
    <>
      <div className="bg-cream">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 pb-20 pt-10 md:px-8 md:pt-14 lg:grid-cols-12 lg:gap-16">
          <nav aria-label="Breadcrumb" className="lg:col-span-12">
            <Link to="/store" className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-label hover:text-orange-deep">
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Back to store
            </Link>
          </nav>

          <div className="lg:col-span-7">
            <div className="overflow-hidden bg-charcoal/10">
              <img
                key={image.src}
                src={image.src}
                alt={image.alt}
                className="aspect-[4/5] w-full object-cover animate-fade-up"
              />
            </div>
            {product.images.length > 1 && (
              <ul className="mt-4 grid grid-cols-4 gap-3" aria-label="Product images">
                {product.images.map((item, index) => (
                  <li key={item.src}>
                    <button
                      type="button"
                      onClick={() => setActiveImage(index)}
                      aria-pressed={index === activeImage}
                      aria-label={`Show image ${index + 1}: ${item.alt}`}
                      className={`block w-full overflow-hidden border-2 transition-colors ${
                        index === activeImage ? 'border-ink' : 'border-transparent hover:border-ink/40'
                      }`}
                    >
                      <img src={item.src} alt="" className="aspect-square w-full object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow">{product.category === 'Tees' ? 'Tee' : 'Tote'} / First drop</p>
              <h1 className="display-heading mt-4 text-5xl md:text-6xl">{product.name}</h1>
              <p className="mt-4 font-sans text-2xl font-semibold">{formatINR(product.price)}</p>
              <p className="mt-6 font-serif text-xl italic leading-relaxed text-charcoal">{product.tagline}</p>

              {product.sizes.length > 1 && (
                <fieldset className="mt-10">
                  <legend className="flex w-full items-center justify-between font-sans text-xs font-semibold uppercase tracking-label">
                    <span>Select size</span>
                    <span className="text-charcoal-mid">{size ? `Selected: ${size}` : 'Required'}</span>
                  </legend>
                  <div className="mt-4 grid grid-cols-5 gap-2">
                    {product.sizes.map((option) => (
                      <label key={option} className="relative">
                        <input
                          type="radio"
                          name="size"
                          value={option}
                          checked={size === option}
                          onChange={() => {
                            setSize(option);
                            setSizeError(false);
                          }}
                          className="peer sr-only"
                        />
                        <span className="flex h-12 cursor-pointer items-center justify-center border border-ink/30 font-sans text-sm font-semibold transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-cream peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-orange hover:border-ink">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                  {sizeError && (
                    <p role="alert" className="mt-3 font-sans text-sm text-error">
                      Please choose a size before sending your enquiry.
                    </p>
                  )}
                </fieldset>
              )}

              <div className="mt-10 border-t border-ink/15 pt-8">
                <a
                  href={enquiryHref}
                  onClick={handleEnquiry}
                  className="btn-primary w-full sm:w-auto"
                >
                  <Mail aria-hidden="true" className="h-4 w-4" />
                  Send order enquiry
                </a>
                <p className="mt-4 text-sm leading-relaxed text-charcoal-mid">
                  Orders are not taken online yet. Your enquiry opens an email to our team, who will confirm availability and next steps.
                </p>
              </div>

              <div className="mt-10 divide-y divide-ink/15 border-y border-ink/15">
                <Disclosure title="Description">
                  <p className="leading-relaxed text-charcoal">{product.description}</p>
                </Disclosure>
                <Disclosure title="Fabric and care">
                  <ul className="list-disc space-y-2 pl-5 text-charcoal">
                    {product.fabric.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </Disclosure>
                <Disclosure title="Fit">
                  <ul className="list-disc space-y-2 pl-5 text-charcoal">
                    {product.fit.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </Disclosure>
                <Disclosure title="Size guide">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans text-sm">
                      <caption className="sr-only">Size guide for {product.category.toLowerCase()}</caption>
                      <thead>
                        <tr className="border-b border-ink/20">
                          {guide.headers.map((header) => (
                            <th key={header} scope="col" className="py-2 pr-4 font-semibold">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {guide.rows.map((row) => (
                          <tr key={row[0]} className="border-b border-ink/10">
                            {row.map((cell) => (
                              <td key={cell} className="py-2 pr-4 text-charcoal">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4 text-sm text-charcoal-mid">Measurements are approximate and taken flat.</p>
                </Disclosure>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="border-t border-ink/15 bg-paper">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-8">
          <p className="eyebrow">Keep browsing</p>
          <h2 className="display-heading mt-3 text-5xl md:text-6xl">More from the store</h2>
          <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Disclosure({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="group py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between font-sans text-sm font-semibold uppercase tracking-label [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-open:rotate-180" />
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}
