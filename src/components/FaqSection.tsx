import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../data/logisticsContent';
import { trackEvent } from '../lib/analytics';

export function FaqSection() {
  const [openId, setOpenId] = useState<string>(FAQ_ITEMS[0].id);

  const toggle = (id: string) => {
    setOpenId((prev) => {
      const next = prev === id ? '' : id;
      trackEvent('faq_toggle', { questionId: id, expanded: next === id });
      return next;
    });
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="scroll-mt-20 border-b border-hairline bg-white py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-xs font-semibold tracking-widest text-gold-muted uppercase">
              Frequently Asked Questions
            </p>
            <h2
              id="faq-heading"
              className="mt-2 text-2xl font-bold text-ink sm:text-3xl"
              style={{ textWrap: 'balance' }}
            >
              Direct answers before we schedule.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-ink">
              Straightforward answers on TMS compatibility, assessment structure,
              brokerage size, and how engagements are priced.
            </p>
          </div>

          <div className="divide-y divide-hairline border-y border-hairline lg:col-span-8">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div key={item.id}>
                  <h3>
                    <button
                      type="button"
                      id={`faq-btn-${item.id}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${item.id}`}
                      onClick={() => toggle(item.id)}
                      className="flex min-h-[56px] w-full cursor-pointer items-center justify-between gap-4 py-4 text-left text-base font-semibold text-ink transition-colors hover:text-forest"
                    >
                      <span>{item.question}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-gold-muted transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>
                  <div
                    id={`faq-panel-${item.id}`}
                    role="region"
                    aria-labelledby={`faq-btn-${item.id}`}
                    hidden={!isOpen}
                    className="pb-5 text-sm leading-relaxed text-slate-ink sm:text-[15px]"
                  >
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
