import { useState } from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { PROCESS_STAGES } from '../data/logisticsContent';
import { trackEvent } from '../lib/analytics';

export function ProcessSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = PROCESS_STAGES[activeIndex];

  const handleSelect = (index: number) => {
    setActiveIndex(index);
    trackEvent('process_stage_select', { stage: PROCESS_STAGES[index].id });
  };

  return (
    <section
      id="how-it-works"
      aria-labelledby="process-heading"
      className="scroll-mt-20 border-b border-hairline bg-smoke py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-widest text-gold-muted uppercase">
            How BOSS Works
          </p>
          <h2
            id="process-heading"
            className="mt-2 text-2xl font-bold text-ink sm:text-3xl"
            style={{ textWrap: 'balance' }}
          >
            Discover, Diagnose, Design, Implement, Measure.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-ink">
            Every stage closes with a concrete deliverable and client signoff before
            moving forward—keeping your daily freight operations uninterrupted.
          </p>
        </div>

        {/* Interactive 5-Stage Selector */}
        <div
          role="tablist"
          aria-label="BOSS Implementation Process"
          className="mt-10 grid gap-2 sm:grid-cols-5"
        >
          {PROCESS_STAGES.map((stage, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={stage.id}
                role="tab"
                id={`tab-${stage.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${stage.id}`}
                type="button"
                onClick={() => handleSelect(idx)}
                className={`flex min-h-[60px] cursor-pointer items-center justify-between rounded-md border px-4 py-3 text-left transition-colors ${
                  isActive
                    ? 'border-forest bg-forest text-white'
                    : 'border-hairline bg-white text-ink hover:border-forest/50'
                }`}
              >
                <div>
                  <span
                    className={`block font-mono text-[11px] tabular-nums ${
                      isActive ? 'text-gold-bright' : 'text-gold-muted'
                    }`}
                  >
                    {stage.number}
                  </span>
                  <span className="text-sm font-bold whitespace-nowrap">{stage.name}</span>
                </div>
                <ChevronRight
                  className={`h-4 w-4 shrink-0 ${
                    isActive ? 'text-gold-bright' : 'text-slate-ink/50'
                  }`}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>

        {/* Active Stage Detail Panel */}
        <div
          role="tabpanel"
          id={`panel-${current.id}`}
          aria-labelledby={`tab-${current.id}`}
          className="mt-4 rounded-lg border border-hairline bg-white p-6 sm:p-8"
        >
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="font-mono text-xs font-semibold tabular-nums text-gold-muted">
                Stage {current.number} of 05 · {current.name}
              </p>
              <h3 className="mt-2 text-2xl font-bold text-ink">{current.tagline}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-ink sm:text-base">
                {current.description}
              </p>
            </div>

            <div className="flex flex-col justify-between gap-6 border-t border-hairline pt-6 lg:col-span-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
              <div>
                <h4 className="text-xs font-semibold tracking-wider text-forest uppercase">
                  Stage Activities
                </h4>
                <ul className="mt-3 space-y-2.5">
                  {current.activities.map((activity) => (
                    <li
                      key={activity}
                      className="flex items-start gap-2.5 text-sm text-ink"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-forest"
                        aria-hidden="true"
                      />
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-4 border-t border-hairline pt-4 sm:grid-cols-2">
                <div>
                  <span className="block text-[11px] font-semibold tracking-wider text-slate-ink uppercase">
                    Deliverable Artifact
                  </span>
                  <span className="mt-1 block text-sm font-semibold text-ink">
                    {current.artifact}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold tracking-wider text-slate-ink uppercase">
                    Stage Approval Gate
                  </span>
                  <span className="mt-1 block text-sm font-medium text-forest">
                    {current.gate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
