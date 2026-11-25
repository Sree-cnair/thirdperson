import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useDocumentMeta } from '@/lib/useDocumentMeta';

export function NotFoundContent() {
  return (
    <section className="bg-ink text-cream">
      <div className="mx-auto flex min-h-[70svh] max-w-[1400px] flex-col justify-center px-5 py-24 md:px-8">
        <p className="eyebrow !text-orange">Error 404</p>
        <h1 className="display-heading mt-4 text-[5rem] leading-[0.9] md:text-[9rem]">
          Wrong <span className="text-orange">angle.</span>
        </h1>
        <p className="mt-8 max-w-md font-serif text-xl italic text-cream/85">
          The page you are looking for has moved, or never existed. Try the latest stories instead.
        </p>
        <div className="mt-10">
          <Link to="/" className="btn-primary">
            Back to home
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function NotFoundPage() {
  useDocumentMeta('Page not found | OTHER PEOPLE', 'The page you were looking for could not be found.');
  return <NotFoundContent />;
}
