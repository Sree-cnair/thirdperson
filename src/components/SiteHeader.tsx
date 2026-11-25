import { useEffect, useState, type FormEvent } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, X } from 'lucide-react';
import { NAV_LINKS } from '@/data/site';
import { Wordmark } from '@/components/Wordmark';

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname, search } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname, search]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink text-cream">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-5 md:px-8">
        <Link to="/" aria-label="OTHER PEOPLE home" className="shrink-0 text-cream transition-opacity hover:opacity-80">
          <Wordmark />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `relative py-2 font-sans text-xs font-semibold uppercase tracking-label transition-colors duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:bg-lemon after:transition-all after:duration-300 hover:text-lemon ${
                      isActive ? 'text-lemon after:w-full' : 'text-cream after:w-0 hover:after:w-full'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            aria-expanded={searchOpen}
            aria-controls="site-search"
            aria-label={searchOpen ? 'Close search' : 'Open search'}
            className="flex h-11 w-11 items-center justify-center text-cream transition-colors hover:text-lemon"
          >
            {searchOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Search aria-hidden="true" className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="flex h-11 w-11 items-center justify-center text-cream transition-colors hover:text-lemon lg:hidden"
          >
            {menuOpen ? <X aria-hidden="true" className="h-6 w-6" /> : <Menu aria-hidden="true" className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {searchOpen && <HeaderSearch />}

      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto bg-ink animate-slide-down lg:hidden"
        >
          <nav aria-label="Mobile" className="flex min-h-full flex-col justify-between px-5 pb-10 pt-8">
            <ul className="flex flex-col divide-y divide-white/10 border-y border-white/10">
              {NAV_LINKS.map((link, index) => (
                <li
                  key={link.to}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center justify-between py-5 font-display text-4xl uppercase tracking-wide transition-colors ${
                        isActive ? 'text-orange' : 'text-cream hover:text-lemon'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col gap-3 font-sans text-sm text-cream/80">
              <Link to="/about" className="hover:text-lemon">
                About OTHER PEOPLE
              </Link>
              <Link to="/search" className="hover:text-lemon">
                Search the archive
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function HeaderSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search');
  };

  return (
    <div id="site-search" className="border-t border-white/10 bg-ink animate-slide-down">
      <form
        role="search"
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-[1400px] items-center gap-3 px-5 py-4 md:px-8"
      >
        <label htmlFor="header-search-input" className="sr-only">
          Search stories, opinion, and products
        </label>
        <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-cream/70" />
        <input
          id="header-search-input"
          type="search"
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search stories, opinion, products"
          className="w-full bg-transparent py-2 font-sans text-base text-cream placeholder:text-cream/50 focus:outline-none"
        />
        <button type="submit" className="btn-primary px-5 py-2.5">
          Search
        </button>
      </form>
    </div>
  );
}
