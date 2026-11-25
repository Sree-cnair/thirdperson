import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_EMAIL, FOOTER_LINKS, NAV_LINKS, POLICY_LINKS, SOCIAL_LINKS, TAGLINE } from '@/data/site';
import { Wordmark } from '@/components/Wordmark';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-16 md:px-8 md:py-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Link to="/" aria-label="OTHER PEOPLE home" className="inline-block transition-opacity hover:opacity-80">
            <Wordmark className="text-3xl" />
          </Link>
          <p className="mt-6 max-w-xs font-serif text-2xl italic leading-snug text-cream">{TAGLINE}</p>
          <p className="mt-4 font-sans text-xs uppercase tracking-label text-cream/70">
            Culture / Fashion / Opinion / Community
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-3">
          <FooterColumn title="Sections">
            {NAV_LINKS.map((link) => (
              <FooterLink key={link.to} to={link.to}>
                {link.label}
              </FooterLink>
            ))}
          </FooterColumn>
          <FooterColumn title="Company">
            {FOOTER_LINKS.map((link) => (
              <FooterLink key={link.to} to={link.to}>
                {link.label}
              </FooterLink>
            ))}
          </FooterColumn>
          <FooterColumn title="Policies">
            {POLICY_LINKS.map((link) => (
              <FooterLink key={link.label} to={link.to}>
                {link.label}
              </FooterLink>
            ))}
          </FooterColumn>
        </nav>

        <div className="flex flex-col gap-8 lg:col-span-3">
          <div>
            <h2 className="font-sans text-xs font-semibold uppercase tracking-label text-lemon">Contact</h2>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-4 block font-sans text-base text-cream underline decoration-cream/30 underline-offset-4 transition-colors hover:text-lemon"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
          <div>
            <h2 className="font-sans text-xs font-semibold uppercase tracking-label text-lemon">Follow</h2>
            <ul className="mt-4 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center border border-cream/20 text-cream transition-colors hover:border-orange hover:text-lemon"
                  >
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-5 py-6 font-sans text-xs text-cream/70 md:flex-row md:items-center md:justify-between md:px-8">
          <p>&copy; {year} OTHER PEOPLE. All rights reserved.</p>
          <p>Independent. Kerala, India.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="font-sans text-xs font-semibold uppercase tracking-label text-lemon">{title}</h2>
      <ul className="mt-4 flex flex-col gap-3">{children}</ul>
    </div>
  );
}

function FooterLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <li>
      <Link to={to} className="font-sans text-sm text-cream/85 transition-colors hover:text-lemon">
        {children}
      </Link>
    </li>
  );
}
