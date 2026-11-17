import { ArrowRight, Truck } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

interface HeroSectionProps {
  onScheduleClick: () => void;
}

const SCOPE_STRIP = [
  {
    code: '01',
    label: 'Document Intake',
    detail: 'Rate cons, BOLs & signed POD routing',
  },
  {
    code: '02',
    label: 'Dispatch Cadence',
    detail: 'Exception-based check calls & handoffs',
  },
  {
    code: '03',
    label: 'Cash-Flow Timing',
    detail: 'Delivery-to-invoice QuickBooks readiness',
  },
  {
    code: '04',
    label: 'Margin Visibility',
    detail: 'Owner KPIs across loads & carriers',
  },
];

export function HeroSection({ onScheduleClick }: HeroSectionProps) {
  return (
    <section id="top" className="border-b border-hairline bg-white">
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Core Proposition */}
          <div className="flex flex-col justify-between lg:col-span-6">
            <div>
              <p className="text-xs font-semibold tracking-widest text-forest uppercase">
                New Limits Legacy · BOSS Logistics Operations Consulting
              </p>

              <h1
                className="mt-4 text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-[3.5rem] lg:leading-[1.06]"
                style={{ textWrap: 'balance' }}
              >
                Move Freight. Not Paperwork.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-ink sm:text-lg">
                We help freight brokerages, asset carriers, and 3PLs eliminate manual
                dispatch chasing, stalled PODs, and invoicing delays—protecting margin
                and cash-flow timing without forcing you onto a new TMS.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => {
                    trackEvent('cta_schedule_hero', { location: 'hero' });
                    onScheduleClick();
                  }}
                  className="inline-flex min-h-[46px] cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-forest px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-hover"
                >
                  Schedule an Operations Assessment
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </button>

                <a
                  href="#solutions"
                  onClick={() => trackEvent('cta_explore_solutions', { location: 'hero' })}
                  className="inline-flex min-h-[46px] items-center justify-center whitespace-nowrap rounded-md border border-hairline bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-forest hover:text-forest"
                >
                  Explore Solutions
                </a>
              </div>
            </div>

            <div className="mt-10 border-t border-hairline pt-5">
              <p className="text-xs leading-relaxed text-slate-ink">
                Built for brokerages, carriers, and hybrid operations teams running
                live freight on existing TMS, email, spreadsheet, and QuickBooks stacks.
              </p>
            </div>
          </div>

          {/* Right Column: Grounded Documentary Dispatch Photography */}
          <div className="lg:col-span-6">
            <div className="relative h-full min-h-[280px] overflow-hidden rounded-lg border border-hairline bg-smoke sm:min-h-[360px]">
              <div className="gold-accent-bar h-1 w-full" aria-hidden="true" />
              <picture className="block h-[calc(100%-4px)] w-full">
                <source srcSet="assets/images/logistics-dispatch-hero.webp" type="image/webp" />
                <img
                  src="assets/images/logistics-dispatch-hero.jpg"
                  alt="Freight brokerage dispatcher managing active loads and route schedules overlooking a trucking yard"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </picture>
              <noscript>
                <div className="flex h-full items-center justify-center bg-smoke p-8 text-slate-ink">
                  <Truck className="mr-2 h-5 w-5 text-forest" />
                  <span>Freight Dispatch &amp; Operations Floor</span>
                </div>
              </noscript>
            </div>
          </div>
        </div>

        {/* Full-Width Scope Strip Below Split */}
        <div className="mt-12 border-t border-hairline pt-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SCOPE_STRIP.map((item) => (
              <div key={item.code} className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-gold-muted">
                  <span className="font-mono tabular-nums">{item.code}</span>
                  <span aria-hidden="true">/</span>
                  <span className="font-semibold text-forest">{item.label}</span>
                </div>
                <p className="text-sm text-slate-ink">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
