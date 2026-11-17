import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

interface NavbarProps {
  onScheduleClick: (source: 'cta_nav_assessment') => void;
}

export function Navbar({ onScheduleClick }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '#solutions', label: 'Solutions' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#assessment', label: 'Assessment' },
    { href: '#contact', label: 'Contact' },
  ];

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-8 px-4 py-2.5 sm:px-6 lg:px-8">
        {/* Zone 1: Official NLL Compact Logo with >= 10% clear space */}
        <a
          href="#top"
          aria-label="New Limits Legacy BOSS Logistics — Back to top"
          className="flex shrink-0 items-center px-2 py-1 whitespace-nowrap"
        >
          <picture>
            <source srcSet="assets/nll-logo-header.webp" type="image/webp" />
            <img
              src="assets/nll-logo-header.png"
              alt="New Limits Legacy"
              width={132}
              height={57}
              className="h-9 w-auto object-contain sm:h-10"
            />
          </picture>
        </a>

        {/* Zone 2: Clean single-line text links */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-7 md:flex"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="shrink-0 whitespace-nowrap text-sm font-medium text-slate-ink underline-offset-4 transition-colors hover:text-forest hover:underline"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single primary action + mobile menu toggle */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => {
              trackEvent('cta_nav_assessment', { location: 'navbar' });
              onScheduleClick('cta_nav_assessment');
            }}
            className="hidden shrink-0 cursor-pointer whitespace-nowrap rounded-md bg-forest px-4 py-2.5 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-forest-hover sm:inline-flex"
          >
            Schedule Assessment
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-hairline text-ink transition-colors hover:bg-smoke md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileOpen && (
        <div
          id="mobile-nav-panel"
          className="border-t border-hairline bg-white px-4 py-4 md:hidden"
        >
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="flex min-h-[44px] items-center rounded-md px-3 text-sm font-medium text-ink transition-colors hover:bg-smoke"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onScheduleClick('cta_nav_assessment');
              }}
              className="mt-2 flex min-h-[44px] w-full cursor-pointer items-center justify-center rounded-md bg-forest px-4 text-sm font-semibold text-white transition-colors hover:bg-forest-hover"
            >
              Schedule an Operations Assessment
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
