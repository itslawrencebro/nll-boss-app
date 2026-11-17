import { ArrowRight } from 'lucide-react';
import { ASSESSMENT_POINTS } from '../data/logisticsContent';
import { trackEvent } from '../lib/analytics';

interface AssessmentSectionProps {
  onScheduleClick: () => void;
  schedulerUrl?: string;
}

export function AssessmentSection({
  onScheduleClick,
  schedulerUrl,
}: AssessmentSectionProps) {
  return (
    <section
      id="assessment"
      aria-labelledby="assessment-heading"
      className="scroll-mt-20 border-b border-hairline bg-white py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left: Documentary Consulting Photograph */}
          <div className="lg:col-span-5">
            <div className="relative h-full min-h-[280px] overflow-hidden rounded-lg border border-hairline bg-smoke">
              <div className="gold-accent-bar h-1 w-full" aria-hidden="true" />
              <picture className="block h-[calc(100%-4px)] w-full">
                <source srcSet="assets/images/operations-workflow-review.webp" type="image/webp" />
                <img
                  src="assets/images/operations-workflow-review.jpg"
                  alt="Logistics operations executives reviewing freight dispatch schedules and billing documentation"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </picture>
            </div>
          </div>

          {/* Right: 4-Point Assessment Scope */}
          <div className="flex flex-col justify-between lg:col-span-7">
            <div>
              <p className="text-xs font-semibold tracking-widest text-gold-muted uppercase">
                Operations Assessment
              </p>
              <h2
                id="assessment-heading"
                className="mt-2 text-2xl font-bold text-ink sm:text-3xl"
                style={{ textWrap: 'balance' }}
              >
                One focused 30-minute diagnostic before you commit to a build.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-slate-ink">
                No generic sales pitch. We inspect one high-friction workflow in your
                operation and leave you with a clear map of where time and cash are
                getting stuck.
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {ASSESSMENT_POINTS.map((point, index) => (
                  <div
                    key={point.title}
                    className="rounded-md border border-hairline bg-smoke p-5"
                  >
                    <span className="font-mono text-xs font-semibold tabular-nums text-gold-muted">
                      0{index + 1}
                    </span>
                    <h3 className="mt-1.5 text-base font-bold text-ink">{point.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-ink">
                      {point.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-ink">
                Works alongside your existing TMS, dispatch inbox, and QuickBooks setup.
              </p>

              {schedulerUrl ? (
                <a
                  href={schedulerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent('cta_assessment_section', { target: 'verified_scheduler' })
                  }
                  className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-forest px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-hover"
                >
                  Open Scheduler
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    trackEvent('cta_assessment_section', { target: 'assessment_form' });
                    onScheduleClick();
                  }}
                  className="inline-flex min-h-[44px] shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-forest px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-hover"
                >
                  Request Your Assessment
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
