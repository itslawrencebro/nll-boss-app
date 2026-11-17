import { useEffect } from 'react';
import { X } from 'lucide-react';

interface PrivacyModalProps {
  open: boolean;
  contactEmail: string;
  onClose: () => void;
}

export function PrivacyModal({ open, contactEmail, onClose }: PrivacyModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg border border-hairline bg-white p-6 shadow-xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-hairline pb-4">
          <div>
            <p className="text-xs font-semibold tracking-wider text-gold-muted uppercase">
              New Limits Legacy Consulting
            </p>
            <h2 id="privacy-modal-title" className="mt-1 text-xl font-bold text-ink">
              Privacy &amp; Data Handling Disclosure
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close privacy disclosure"
            onClick={onClose}
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-hairline text-ink hover:bg-smoke"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-ink">
          <p>
            Contact and operational profile details submitted on the BOSS Logistics
            assessment form are used exclusively by New Limits Legacy Consulting to
            evaluate workflow fit, prevent duplicate outreach, and coordinate your
            requested Operations Assessment.
          </p>
          <p>
            <strong className="font-semibold text-ink">No sensitive freight documents:</strong>{' '}
            This public inquiry form is not designed to store Bills of Lading, rate
            confirmations, carrier W-9s, or banking records. Do not paste sensitive
            financial or shipper contract files into form fields.
          </p>
          <p>
            <strong className="font-semibold text-ink">Data retention &amp; removal:</strong>{' '}
            We do not sell or share prospect contact records with third-party data brokers.
            To update or remove your inquiry record, contact{' '}
            <a
              href={`mailto:${contactEmail}`}
              className="font-medium text-forest underline underline-offset-2"
            >
              {contactEmail}
            </a>
            .
          </p>
        </div>

        <div className="mt-6 flex justify-end border-t border-hairline pt-4">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[42px] cursor-pointer rounded-md bg-forest px-5 py-2 text-xs font-semibold text-white hover:bg-forest-hover"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
