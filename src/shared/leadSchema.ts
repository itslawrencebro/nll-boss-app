import { z } from 'zod';

export const BUSINESS_TYPES = [
  'broker',
  'carrier',
  'broker-carrier',
  '3PL',
  'other',
] as const;

export const BUSINESS_TYPE_LABELS: Record<(typeof BUSINESS_TYPES)[number], string> = {
  broker: 'Freight Brokerage',
  carrier: 'Asset-Based Carrier',
  'broker-carrier': 'Broker-Carrier Hybrid',
  '3PL': '3PL / Managed Logistics',
  other: 'Other Logistics Operation',
};

export const MONTHLY_LOAD_VOLUMES = [
  'Under 100 loads/month',
  '100–250 loads/month',
  '250–500 loads/month',
  '500–1,000 loads/month',
  '1,000+ loads/month',
] as const;

export const PRIMARY_BOTTLENECKS = [
  'paperwork',
  'dispatch',
  'tracking',
  'invoicing',
  'carrier verification',
  'other',
] as const;

export const PRIMARY_BOTTLENECK_LABELS: Record<(typeof PRIMARY_BOTTLENECKS)[number], string> = {
  paperwork: 'Paperwork & POD delays',
  dispatch: 'Manual dispatch check calls & assignment',
  tracking: 'Shipment visibility & exception alerts',
  invoicing: 'Invoicing delays & QuickBooks reconciliation',
  'carrier verification': 'Carrier onboarding & packet verification',
  other: 'Other workflow bottleneck',
};

export const leadFormSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, 'Please enter your full name.')
    .max(120, 'Full name must be 120 characters or fewer.'),
  company_name: z
    .string()
    .trim()
    .min(2, 'Please enter your company name.')
    .max(150, 'Company name must be 150 characters or fewer.'),
  job_title: z
    .string()
    .trim()
    .max(120, 'Job title must be 120 characters or fewer.')
    .optional()
    .default(''),
  email: z
    .string()
    .trim()
    .email('Please enter a valid work email address.')
    .max(180, 'Email must be 180 characters or fewer.'),
  phone: z
    .string()
    .trim()
    .min(7, 'Please enter a valid phone number.')
    .max(40, 'Phone number must be 40 characters or fewer.')
    .refine(
      (val) => val.replace(/\D/g, '').length >= 7,
      'Phone number must contain at least 7 digits.'
    ),
  business_type: z.enum(BUSINESS_TYPES, {
    error: 'Please select your business type.',
  }),
  monthly_load_volume: z
    .string()
    .trim()
    .max(60)
    .optional()
    .default(''),
  current_tms: z
    .string()
    .trim()
    .max(120, 'Current TMS must be 120 characters or fewer.')
    .optional()
    .default(''),
  primary_bottleneck: z.enum(PRIMARY_BOTTLENECKS, {
    error: 'Please select your primary operational bottleneck.',
  }),
  preferred_meeting_time: z
    .string()
    .trim()
    .max(160, 'Preferred meeting time must be 160 characters or fewer.')
    .optional()
    .default(''),
  consent_to_contact: z
    .boolean()
    .refine(
      (val) => val === true,
      'Please confirm consent so our team can respond to your assessment request.'
    ),
  // Anti-spam metadata
  website_url: z.string().max(200).optional().default(''),
  form_loaded_at: z.number().optional(),
});

export type LeadFormInput = z.infer<typeof leadFormSchema>;

export interface NormalizedLeadRecord {
  lead_id: string;
  lead_source: 'NLL Logistics';
  created_at: string;
  status: 'New Lead';
  owner: string;
  dedupe_key: string;
  full_name: string;
  company_name: string;
  job_title: string;
  email: string;
  phone: string;
  business_type: (typeof BUSINESS_TYPES)[number];
  monthly_load_volume: string;
  current_tms: string;
  primary_bottleneck: (typeof PRIMARY_BOTTLENECKS)[number];
  preferred_meeting_time: string;
  consent_to_contact: boolean;
}
