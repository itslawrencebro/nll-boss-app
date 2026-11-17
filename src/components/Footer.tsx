interface FooterProps {
  contactEmail: string;
  contactPhone?: string;
  onOpenPrivacy: () => void;
}

export function Footer({ contactEmail, contactPhone, onOpenPrivacy }: FooterProps) {
  return (
    <footer className="bg-forest text-white">
      <div className="gold-accent-bar h-1 w-full" aria-hidden="true" />
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand Block with Primary Logo (on crisp ivory clear-space plate to preserve metallic finish per Brand Guide) */}
          <div className="md:col-span-5">
            <div className="inline-block rounded-md bg-white px-4 py-3">
              <picture>
                <source srcSet="assets/nll-logo-primary.webp" type="image/webp" />
                <img
                  src="assets/nll-logo-primary.png"
                  alt="New Limits Legacy — From Strategy to Execution"
                  width={210}
                  height={100}
                  className="h-14 w-auto object-contain"
                />
              </picture>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">
              BOSS Logistics Division — Operational workflow consulting for freight
              brokerages, carriers, and 3PLs.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold tracking-wider text-gold-bright uppercase">
              Page Sections
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-white/85">
              <li>
                <a href="#solutions" className="hover:text-white hover:underline">
                  Solutions
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white hover:underline">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#assessment" className="hover:text-white hover:underline">
                  Operations Assessment
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white hover:underline">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Verified Contact & Links */}
          <div className="md:col-span-4">
            <h3 className="text-xs font-semibold tracking-wider text-gold-bright uppercase">
              Contact &amp; Governance
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-white/85">
              <li>New Limits Legacy Consulting</li>
              <li>Dallas–Fort Worth Metroplex, Texas</li>
              <li>
                <a
                  href={`mailto:${contactEmail}`}
                  className="underline-offset-2 hover:text-white hover:underline"
                >
                  {contactEmail}
                </a>
              </li>
              {contactPhone && (
                <li>
                  <a
                    href={`tel:${contactPhone}`}
                    className="underline-offset-2 hover:text-white hover:underline"
                  >
                    {contactPhone}
                  </a>
                </li>
              )}
            </ul>

            <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-white/15 pt-4 text-xs text-white/80">
              <a
                href="https://newlimitslegacy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white underline-offset-2 hover:underline"
              >
                newlimitslegacy.com Home
              </a>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="cursor-pointer font-medium text-white underline-offset-2 hover:underline"
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-2 border-t border-white/15 pt-6 text-xs text-white/70 sm:flex-row">
          <p>&copy; 2026 New Limits Legacy Consulting. All rights reserved.</p>
          <p>Deployable under /logistics without altering existing site pages.</p>
        </div>
      </div>
    </footer>
  );
}
