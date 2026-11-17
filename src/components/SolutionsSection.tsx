import { SOLUTION_ITEMS } from '../data/logisticsContent';

export function SolutionsSection() {
  return (
    <section
      id="solutions"
      aria-labelledby="solutions-heading"
      className="scroll-mt-20 border-b border-hairline bg-white py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-widest text-gold-muted uppercase">
              BOSS Logistics Solutions
            </p>
            <h2
              id="solutions-heading"
              className="mt-2 text-2xl font-bold text-ink sm:text-3xl"
              style={{ textWrap: 'balance' }}
            >
              Connected workflows from load tender to reconciled invoice.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-ink">
            Every engagement installs practical workflows your dispatchers and billing
            team can run daily—built around your current TMS and accounting tools.
          </p>
        </div>

        <div className="gold-hairline mt-8" aria-hidden="true" />

        <div className="mt-10 grid gap-5 lg:grid-cols-12">
          {SOLUTION_ITEMS.map((item) => (
            <article
              key={item.number}
              className={`flex flex-col justify-between rounded-lg border border-hairline bg-smoke p-6 sm:p-7 ${item.spanClass}`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-hairline pb-3">
                  <span className="font-mono text-xs font-semibold tabular-nums text-gold-muted">
                    {item.number}
                  </span>
                  <span className="text-xs font-medium text-slate-ink">BOSS Workflow</span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink">{item.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-ink sm:text-[15px]">
                  {item.summary}
                </p>
              </div>

              <p className="mt-6 border-t border-hairline pt-4 text-xs font-semibold text-forest">
                {item.workflowOutcome}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
