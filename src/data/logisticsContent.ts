export interface ProblemItem {
  number: string;
  title: string;
  description: string;
  impact: string;
}

export interface SolutionItem {
  number: string;
  title: string;
  summary: string;
  workflowOutcome: string;
  spanClass: string;
}

export interface ProcessStage {
  id: string;
  number: string;
  name: string;
  tagline: string;
  description: string;
  activities: string[];
  artifact: string;
  gate: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const PROBLEM_ITEMS: ProblemItem[] = [
  {
    number: '01',
    title: 'Paperwork & POD Delays',
    description:
      'Signed Bills of Lading and rate confirmations sit in driver text threads, personal inboxes, or carrier portals—forcing back-office staff to chase documents before loads can clear.',
    impact: 'Extends delivery-to-invoice cycle time and delays customer billing.',
  },
  {
    number: '02',
    title: 'Manual Dispatch Check Calls',
    description:
      'Dispatchers spend productive hours calling carriers for routine location updates instead of focusing attention on late pickups, detention risk, and high-margin freight.',
    impact: 'Caps loads-per-dispatcher capacity and drives avoidable team fatigue.',
  },
  {
    number: '03',
    title: 'Disconnected TMS, Email & Accounting',
    description:
      'Load details, accessorial charges, and carrier pay are copied manually between your TMS, shared spreadsheets, email threads, and accounting software.',
    impact: 'Creates re-keying errors, missed accessorial recovery, and margin leakage.',
  },
  {
    number: '04',
    title: 'Invoice & Cash-Flow Timing Lag',
    description:
      'When verified PODs and billing packets arrive late or incomplete, customer invoices stall while carrier settlements and operating expenses remain due on schedule.',
    impact: 'Tightens working capital and obscures true load-level profitability.',
  },
];

export const SOLUTION_ITEMS: SolutionItem[] = [
  {
    number: '01',
    title: 'Document Intake & POD Processing',
    summary:
      'Standardize how rate confirmations, BOLs, lumper receipts, and signed PODs enter your operation—validating required fields and filing documents directly against the right load record.',
    workflowOutcome: 'Clean billing packets ready on delivery without inbox hunting.',
    spanClass: 'lg:col-span-7',
  },
  {
    number: '02',
    title: 'Dispatch Workflow Automation',
    summary:
      'Replace ad-hoc sticky notes and verbal handoffs with structured dispatch checklists, automated carrier status prompts, and clear owner assignment from load booking through tender.',
    workflowOutcome: 'Consistent load execution across every dispatcher on the floor.',
    spanClass: 'lg:col-span-5',
  },
  {
    number: '03',
    title: 'Shipment Visibility & Exception Alerts',
    summary:
      'Surface missed check-ins, appointment delays, and incomplete document milestones automatically so your team only intervenes on loads that actually require attention.',
    workflowOutcome: 'Proactive shipper communication without manual spreadsheet tracking.',
    spanClass: 'lg:col-span-4',
  },
  {
    number: '04',
    title: 'Billing & QuickBooks Handoffs',
    summary:
      'Connect verified delivery milestones and approved accessorial charges to structured QuickBooks Online invoice preparation and settlement review—eliminating duplicate data entry.',
    workflowOutcome: 'Faster invoicing cadence and tighter margin reconciliation.',
    spanClass: 'lg:col-span-4',
  },
  {
    number: '05',
    title: 'Owner KPI Dashboard',
    summary:
      'Give leadership daily visibility into unbilled loads, average days from delivery to invoice, open dispatch exceptions, and margin performance without asking for status meetings.',
    workflowOutcome: 'Calm operational oversight built on live load and billing records.',
    spanClass: 'lg:col-span-4',
  },
];

export const PROCESS_STAGES: ProcessStage[] = [
  {
    id: 'discover',
    number: '01',
    name: 'Discover',
    tagline: 'Trace how freight actually moves today',
    description:
      'We shadow your existing booking, dispatch, document collection, and billing steps—working around your live freight schedule without disrupting active loads.',
    activities: [
      'Audit one high-friction workflow from load tender through final payment',
      'Catalog current TMS, inbox, Drive, spreadsheet, and QuickBooks touchpoints',
      'Identify where staff re-key load numbers, rates, or carrier documents',
    ],
    artifact: 'Current-State Workflow & System Inventory',
    gate: 'Leadership confirms baseline steps and priority workflow.',
  },
  {
    id: 'diagnose',
    number: '02',
    name: 'Diagnose',
    tagline: 'Quantify bottlenecks and margin leakage',
    description:
      'We isolate the exact handoff failures causing delayed PODs, repetitive check calls, unbilled loads, and missed accessorial charges.',
    activities: [
      'Pinpoint time lost per load across dispatch and back-office billing',
      'Measure lag between physical delivery, POD verification, and invoice issue',
      'Prioritize fixes by operational impact and implementation complexity',
    ],
    artifact: 'Bottleneck Map & Opportunity Estimate',
    gate: 'Agreement on target bottlenecks and expected operational scope.',
  },
  {
    id: 'design',
    number: '03',
    name: 'Design',
    tagline: 'Architect connected workflows before building',
    description:
      'We design the exact data flow, exception rules, document naming conventions, and QuickBooks handoff triggers tailored to your current TMS and team roles.',
    activities: [
      'Define load status rules, required documents, and owner accountability',
      'Design intake forms, Airtable/database structure, and n8n automation logic',
      'Specify QuickBooks billing handoff checks and exception alert thresholds',
    ],
    artifact: 'BOSS Logistics Architecture & Scope Specification',
    gate: 'Written approval of workflow design and fixed implementation scope.',
  },
  {
    id: 'implement',
    number: '04',
    name: 'Implement',
    tagline: 'Configure, test, and train your floor',
    description:
      'We build the configured workspace, connect approved automations, verify end-to-end test loads, and train dispatch and billing staff with plain-language SOPs.',
    activities: [
      'Configure structured intake, exception routing, and billing handoff workflows',
      'Run controlled parallel tests on real load scenarios before cutover',
      'Deliver role-based SOPs and live team walkthroughs for dispatch and accounting',
    ],
    artifact: 'Tested Production Workflow & Team SOP Playbook',
    gate: 'Staff completes test loads independently and signs off on launch.',
  },
  {
    id: 'measure',
    number: '05',
    name: 'Measure',
    tagline: 'Track cycle times and protect margin',
    description:
      'Once live, we verify that daily exceptions are surfacing cleanly, invoices move out on schedule, and leadership has reliable dashboard visibility.',
    activities: [
      'Monitor delivery-to-invoice turnaround and unbilled load aging',
      'Review automation reliability and exception-handling compliance',
      'Hand over full system ownership with optional ongoing advisory support',
    ],
    artifact: 'Operating KPI Baseline & Ownership Handoff Package',
    gate: 'Leadership confirms steady-state metrics and full team ownership.',
  },
];

export const ASSESSMENT_POINTS = [
  {
    title: 'Review one high-friction workflow',
    detail:
      'Walk through a real load lifecycle—booking, dispatch, tracking, POD capture, invoicing, and payment—to see where work slows down.',
  },
  {
    title: 'Map operational bottlenecks',
    detail:
      'Identify manual re-keying, scattered carrier documents, and repetitive check calls across your TMS, inbox, and accounting stack.',
  },
  {
    title: 'Estimate practical opportunity',
    detail:
      'Ground your decision in realistic dispatcher hours saved, faster cash-flow timing, and fewer unbilled or mis-billed loads.',
  },
  {
    title: 'Propose scoped next steps',
    detail:
      'Receive a clear, fixed-phase implementation recommendation with zero pressure to rip and replace your current TMS.',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'tms',
    question: 'Do I need a new TMS?',
    answer:
      'No. Our BOSS Logistics engagements are built to stabilize and connect the systems you already run—whether that is an off-the-shelf TMS, shared dispatch spreadsheets, email inboxes, or QuickBooks Online. Replacing a TMS before fixing underlying handoffs usually recreates the same bottlenecks in more expensive software.',
  },
  {
    id: 'assessment',
    question: 'What happens in an assessment?',
    answer:
      'In a focused 30-minute working session, we walk step-by-step through one high-friction workflow from load booking to payment, document your current TMS and monthly load volume, isolate where manual follow-up is heaviest, and outline scoped next steps you can act on immediately.',
  },
  {
    id: 'small-brokerages',
    question: 'Can small brokerages use this?',
    answer:
      'Yes. Owner-led brokerages, small asset carriers, and growing 3PLs often see the clearest return because structured POD intake, dispatch exception tracking, and clean billing handoffs allow your current team to handle higher load volume without adding back-office overhead.',
  },
  {
    id: 'cost',
    question: 'What does implementation cost?',
    answer:
      'Implementation is scoped in transparent, fixed-fee phases after your Operations Assessment, based on workflow count and the tools involved. Smaller foundational workflow builds start in the low thousands, while multi-department automation and QuickBooks/KPI builds are quoted explicitly before any work begins.',
  },
];
