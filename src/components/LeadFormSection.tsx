import { useRef, useState, type FormEvent } from 'react';
import { AlertCircle, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import {
  BUSINESS_TYPES,
  BUSINESS_TYPE_LABELS,
  MONTHLY_LOAD_VOLUMES,
  PRIMARY_BOTTLENECKS,
  PRIMARY_BOTTLENECK_LABELS,
  leadFormSchema,
} from '../shared/leadSchema';
import { trackEvent } from '../lib/analytics';

interface LeadFormSectionProps {
  contactEmail: string;
  contactPhone?: string;
  firstInputRef: React.RefObject<HTMLInputElement | null>;
  onOpenPrivacy: () => void;
}

interface SubmissionSuccess {
  leadId: string;
  deduplicated: boolean;
  integrationMode: 'live' | 'staging';
  message: string;
}

interface FormState {
  full_name: string;
  company_name: string;
  job_title: string;
  email: string;
  phone: string;
  business_type: string;
  monthly_load_volume: string;
  current_tms: string;
  primary_bottleneck: string;
  preferred_meeting_time: string;
  consent_to_contact: boolean;
  website_url: string;
}

const INITIAL_FORM: FormState = {
  full_name: '',
  company_name: '',
  job_title: '',
  email: '',
  phone: '',
  business_type: '',
  monthly_load_volume: '',
  current_tms: '',
  primary_bottleneck: '',
  preferred_meeting_time: '',
  consent_to_contact: false,
  website_url: '',
};

export function LeadFormSection({
  contactEmail,
  contactPhone,
  firstInputRef,
  onOpenPrivacy,
}: LeadFormSectionProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<SubmissionSuccess | null>(null);
  const loadedAtRef = useRef<number>(Date.now());
  const startedRef = useRef(false);

  const markStarted = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent('form_started');
    }
  };

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    markStarted();
    setForm((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
    if (formError) setFormError('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');

    const payload = {
      ...form,
      form_loaded_at: loadedAtRef.current,
    };

    const parsed = leadFormSchema.safeParse(payload);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] || 'form');
        if (!errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      setFormError('Please correct the highlighted fields below before submitting.');
      trackEvent('form_validation_error', { errorCount: Object.keys(errors).length });
      return;
    }

    setIsSubmitting(true);
    try {
      const basePath = import.meta.env.BASE_URL || '/';
      const normalizedBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
      const endpoint = `${normalizedBase}/api/logistics/leads`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      const body = (await response.json()) as {
        ok?: boolean;
        message?: string;
        fieldErrors?: Record<string, string>;
        leadId?: string;
        deduplicated?: boolean;
        integrationMode?: 'live' | 'staging';
      };

      if (!response.ok || !body.ok) {
        if (body.fieldErrors) setFieldErrors(body.fieldErrors);
        setFormError(
          body.message ||
            'Unable to submit your request right now. Please try again or reach out by email.'
        );
        trackEvent('form_submit_error', { status: response.status });
        return;
      }

      setSuccess({
        leadId: body.leadId || 'RECEIVED',
        deduplicated: Boolean(body.deduplicated),
        integrationMode: body.integrationMode === 'live' ? 'live' : 'staging',
        message: body.message || 'Your Operations Assessment request has been received.',
      });
      setFieldErrors({});
      setForm(INITIAL_FORM);
      trackEvent('form_submit_success', {
        business_type: parsed.data.business_type,
        primary_bottleneck: parsed.data.primary_bottleneck,
      });
    } catch {
      setFormError(
        'Network error while submitting your request. Please check your connection and try again.'
      );
      trackEvent('form_submit_error', { status: 'network_error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="assessment-form"
      aria-labelledby="lead-form-heading"
      className="scroll-mt-20 border-b border-hairline bg-smoke py-16 sm:py-20"
    >
      <div id="contact" className="scroll-mt-20" />
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Context Column */}
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold tracking-widest text-gold-muted uppercase">
              Schedule an Assessment
            </p>
            <h2
              id="lead-form-heading"
              className="mt-2 text-2xl font-bold text-ink sm:text-3xl"
              style={{ textWrap: 'balance' }}
            >
              Tell us where freight paperwork or dispatch slows down.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-ink">
              Complete the brief intake below. We will review your current stack and
              confirm a 30-minute Operations Assessment slot—with zero obligation.
            </p>

            <div className="mt-8 space-y-5 border-t border-hairline pt-6 text-sm">
              <div>
                <h3 className="font-semibold text-ink">What we cover on the call</h3>
                <ul className="mt-2 space-y-1.5 text-slate-ink">
                  <li>· Load booking to dispatch handoff</li>
                  <li>· Tracking, check calls, and exception alerts</li>
                  <li>· POD collection, invoicing, and payment timing</li>
                </ul>
              </div>

              <div className="rounded-md border border-hairline bg-white p-4">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-forest" aria-hidden="true" />
                  <p className="text-xs leading-relaxed text-slate-ink">
                    <strong className="font-semibold text-ink">Document safety notice:</strong>{' '}
                    Please do not include sensitive freight documents, rate confirmations,
                    carrier banking details, or tax IDs in this public inquiry form.
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-ink">
                <p className="font-semibold text-ink">Direct Contact</p>
                <p className="mt-1">
                  Email:{' '}
                  <a
                    href={`mailto:${contactEmail}`}
                    className="font-medium text-forest underline underline-offset-2"
                  >
                    {contactEmail}
                  </a>
                </p>
                {contactPhone && (
                  <p className="mt-1">
                    Phone:{' '}
                    <a
                      href={`tel:${contactPhone}`}
                      className="font-medium text-forest underline underline-offset-2"
                    >
                      {contactPhone}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7">
            <div className="rounded-lg border border-hairline bg-white p-6 sm:p-8">
              <div className="gold-hairline mb-6" aria-hidden="true" />

              {success ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="space-y-4 py-4"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      className="mt-0.5 h-6 w-6 shrink-0 text-forest"
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-ink">
                        Assessment Request Received
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-ink">
                        {success.message}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md border border-hairline bg-smoke p-4 text-xs text-slate-ink">
                    <p>
                      <strong className="font-semibold text-ink">Reference ID:</strong>{' '}
                      <span className="font-mono">{success.leadId}</span>
                    </p>
                    <p className="mt-1">
                      <strong className="font-semibold text-ink">Pipeline Mode:</strong>{' '}
                      {success.integrationMode === 'live'
                        ? 'Synced to CRM & Workflow Adapter'
                        : 'Staging Capture (Server-side Airtable/n8n awaiting live environment credentials)'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      loadedAtRef.current = Date.now();
                      setSuccess(null);
                    }}
                    className="inline-flex min-h-[42px] cursor-pointer items-center rounded-md border border-hairline bg-white px-4 py-2 text-xs font-semibold text-ink transition-colors hover:border-forest hover:text-forest"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {formError && (
                    <div
                      role="alert"
                      className="flex items-start gap-2.5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" aria-hidden="true" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Honeypot field — invisible to humans */}
                  <div className="sr-only" aria-hidden="true">
                    <label htmlFor="website_url">Leave this field blank</label>
                    <input
                      id="website_url"
                      name="website_url"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website_url}
                      onChange={(e) => updateField('website_url', e.target.value)}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="full_name"
                        className="block text-xs font-semibold text-ink"
                      >
                        Full Name <span className="text-red-700">*</span>
                      </label>
                      <input
                        ref={firstInputRef}
                        id="full_name"
                        name="full_name"
                        type="text"
                        required
                        autoComplete="name"
                        value={form.full_name}
                        onChange={(e) => updateField('full_name', e.target.value)}
                        aria-invalid={Boolean(fieldErrors.full_name)}
                        aria-describedby={fieldErrors.full_name ? 'err-full_name' : undefined}
                        placeholder="Jordan Rivera"
                        className="mt-1.5 w-full rounded-md border border-hairline bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-slate-ink/55 focus:border-forest focus:outline-none"
                      />
                      {fieldErrors.full_name && (
                        <p id="err-full_name" className="mt-1 text-xs text-red-700">
                          {fieldErrors.full_name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="company_name"
                        className="block text-xs font-semibold text-ink"
                      >
                        Company Name <span className="text-red-700">*</span>
                      </label>
                      <input
                        id="company_name"
                        name="company_name"
                        type="text"
                        required
                        autoComplete="organization"
                        value={form.company_name}
                        onChange={(e) => updateField('company_name', e.target.value)}
                        aria-invalid={Boolean(fieldErrors.company_name)}
                        aria-describedby={
                          fieldErrors.company_name ? 'err-company_name' : undefined
                        }
                        placeholder="Lone Star Freight Logistics"
                        className="mt-1.5 w-full rounded-md border border-hairline bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-slate-ink/55 focus:border-forest focus:outline-none"
                      />
                      {fieldErrors.company_name && (
                        <p id="err-company_name" className="mt-1 text-xs text-red-700">
                          {fieldErrors.company_name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="job_title"
                        className="block text-xs font-semibold text-ink"
                      >
                        Job Title <span className="font-normal text-slate-ink">(Optional)</span>
                      </label>
                      <input
                        id="job_title"
                        name="job_title"
                        type="text"
                        autoComplete="organization-title"
                        value={form.job_title}
                        onChange={(e) => updateField('job_title', e.target.value)}
                        placeholder="VP of Operations / Owner"
                        className="mt-1.5 w-full rounded-md border border-hairline bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-slate-ink/55 focus:border-forest focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs font-semibold text-ink"
                      >
                        Work Email <span className="text-red-700">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        aria-invalid={Boolean(fieldErrors.email)}
                        aria-describedby={fieldErrors.email ? 'err-email' : undefined}
                        placeholder="jordan@company.com"
                        className="mt-1.5 w-full rounded-md border border-hairline bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-slate-ink/55 focus:border-forest focus:outline-none"
                      />
                      {fieldErrors.email && (
                        <p id="err-email" className="mt-1 text-xs text-red-700">
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-xs font-semibold text-ink"
                      >
                        Phone Number <span className="text-red-700">*</span>
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        autoComplete="tel"
                        value={form.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        aria-invalid={Boolean(fieldErrors.phone)}
                        aria-describedby={fieldErrors.phone ? 'err-phone' : undefined}
                        placeholder="(817) 555-0140"
                        className="mt-1.5 w-full rounded-md border border-hairline bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-slate-ink/55 focus:border-forest focus:outline-none"
                      />
                      {fieldErrors.phone && (
                        <p id="err-phone" className="mt-1 text-xs text-red-700">
                          {fieldErrors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="business_type"
                        className="block text-xs font-semibold text-ink"
                      >
                        Business Type <span className="text-red-700">*</span>
                      </label>
                      <select
                        id="business_type"
                        name="business_type"
                        required
                        value={form.business_type}
                        onChange={(e) => updateField('business_type', e.target.value)}
                        aria-invalid={Boolean(fieldErrors.business_type)}
                        aria-describedby={
                          fieldErrors.business_type ? 'err-business_type' : undefined
                        }
                        className="mt-1.5 w-full rounded-md border border-hairline bg-white px-3.5 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
                      >
                        <option value="">Select operation type</option>
                        {BUSINESS_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {BUSINESS_TYPE_LABELS[type]}
                          </option>
                        ))}
                      </select>
                      {fieldErrors.business_type && (
                        <p id="err-business_type" className="mt-1 text-xs text-red-700">
                          {fieldErrors.business_type}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="monthly_load_volume"
                        className="block text-xs font-semibold text-ink"
                      >
                        Monthly Load Volume{' '}
                        <span className="font-normal text-slate-ink">(Optional)</span>
                      </label>
                      <select
                        id="monthly_load_volume"
                        name="monthly_load_volume"
                        value={form.monthly_load_volume}
                        onChange={(e) => updateField('monthly_load_volume', e.target.value)}
                        className="mt-1.5 w-full rounded-md border border-hairline bg-white px-3.5 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
                      >
                        <option value="">Select approximate range</option>
                        {MONTHLY_LOAD_VOLUMES.map((vol) => (
                          <option key={vol} value={vol}>
                            {vol}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="current_tms"
                        className="block text-xs font-semibold text-ink"
                      >
                        Current TMS / Stack{' '}
                        <span className="font-normal text-slate-ink">(Optional)</span>
                      </label>
                      <input
                        id="current_tms"
                        name="current_tms"
                        type="text"
                        value={form.current_tms}
                        onChange={(e) => updateField('current_tms', e.target.value)}
                        placeholder="e.g. McLeod, Aljex, Rose Rocket, spreadsheets"
                        className="mt-1.5 w-full rounded-md border border-hairline bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-slate-ink/55 focus:border-forest focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="primary_bottleneck"
                        className="block text-xs font-semibold text-ink"
                      >
                        Primary Bottleneck <span className="text-red-700">*</span>
                      </label>
                      <select
                        id="primary_bottleneck"
                        name="primary_bottleneck"
                        required
                        value={form.primary_bottleneck}
                        onChange={(e) => updateField('primary_bottleneck', e.target.value)}
                        aria-invalid={Boolean(fieldErrors.primary_bottleneck)}
                        aria-describedby={
                          fieldErrors.primary_bottleneck
                            ? 'err-primary_bottleneck'
                            : undefined
                        }
                        className="mt-1.5 w-full rounded-md border border-hairline bg-white px-3.5 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
                      >
                        <option value="">Select highest-friction area</option>
                        {PRIMARY_BOTTLENECKS.map((item) => (
                          <option key={item} value={item}>
                            {PRIMARY_BOTTLENECK_LABELS[item]}
                          </option>
                        ))}
                      </select>
                      {fieldErrors.primary_bottleneck && (
                        <p id="err-primary_bottleneck" className="mt-1 text-xs text-red-700">
                          {fieldErrors.primary_bottleneck}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="preferred_meeting_time"
                        className="block text-xs font-semibold text-ink"
                      >
                        Preferred Meeting Window{' '}
                        <span className="font-normal text-slate-ink">(Optional)</span>
                      </label>
                      <input
                        id="preferred_meeting_time"
                        name="preferred_meeting_time"
                        type="text"
                        value={form.preferred_meeting_time}
                        onChange={(e) => updateField('preferred_meeting_time', e.target.value)}
                        placeholder="e.g. Tue/Thu afternoons Central"
                        className="mt-1.5 w-full rounded-md border border-hairline bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-slate-ink/55 focus:border-forest focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Consent & Privacy Disclosure */}
                  <div className="rounded-md border border-hairline bg-smoke p-4">
                    <div className="flex items-start gap-3">
                      <input
                        id="consent_to_contact"
                        name="consent_to_contact"
                        type="checkbox"
                        required
                        checked={form.consent_to_contact}
                        onChange={(e) => updateField('consent_to_contact', e.target.checked)}
                        aria-invalid={Boolean(fieldErrors.consent_to_contact)}
                        aria-describedby={
                          fieldErrors.consent_to_contact ? 'err-consent' : undefined
                        }
                        className="mt-1 h-4 w-4 rounded border-hairline accent-forest"
                      />
                      <label
                        htmlFor="consent_to_contact"
                        className="text-xs leading-relaxed text-slate-ink"
                      >
                        I consent to New Limits Legacy Consulting contacting me regarding
                        this Operations Assessment request. Information submitted here is
                        used solely to schedule and prepare for your consultation under our{' '}
                        <button
                          type="button"
                          onClick={onOpenPrivacy}
                          className="cursor-pointer font-semibold text-forest underline underline-offset-2"
                        >
                          Privacy Disclosure
                        </button>
                        .
                      </label>
                    </div>
                    {fieldErrors.consent_to_contact && (
                      <p id="err-consent" className="mt-2 text-xs text-red-700">
                        {fieldErrors.consent_to_contact}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-forest px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-hover disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        <span>Submitting Assessment Request...</span>
                      </>
                    ) : (
                      <span>Schedule an Operations Assessment</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
