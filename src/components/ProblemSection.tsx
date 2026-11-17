import { PROBLEM_ITEMS } from '../data/logisticsContent';

export function ProblemSection() {
  return (
    <section
      id="problems"
      aria-labelledby="problems-heading"
      className="border-b border-hairline bg-smoke py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-widest text-gold-muted uppercase">
            Where Freight Margin Leaks
          </p>
          <h2
            id="problems-heading"
            className="mt-2 text-2xl font-bold text-ink sm:text-3xl"
            style={{ textWrap: 'balance' }}
          >
            Growing load volume breaks manual back-office handoffs first.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-ink">
            Most brokerages and carriers do not have a sales problem—they have an
            operational friction problem between load booking and cash collection.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {PROBLEM_ITEMS.map((item) => (
            <article
              key={item.number}
              className="flex flex-col justify-between rounded-lg border border-hairline bg-white p-6 sm:p-7"
            >
              <div>
                <span className="font-mono text-xs font-semibold tabular-nums text-gold-muted">
                  {item.number}
                </span>
                <h3 className="mt-2 text-lg font-bold text-ink">{item.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-ink sm:text-[15px]">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 border-t border-hairline pt-4">
                <p className="text-xs font-medium text-forest">
                  Operational impact: <span className="font-normal text-slate-ink">{item.impact}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
