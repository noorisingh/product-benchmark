// ─────────────────────────────────────────────
// AMPLITUDE PRODUCT BENCHMARK REPORT — DATA
// Source: Amplitude Product Benchmark Report (Sep 2023 – Sep 2024)
// All percentages stored as numeric values (e.g. 0.11 = 0.11%)
// ─────────────────────────────────────────────

export const methodologyStats = [
  { label: 'Companies', value: 2600, suffix: '+', prefix: '' },
  { label: 'Digital Products', value: 10600, suffix: '+', prefix: '' },
  { label: 'Industries', value: 17, suffix: '', prefix: '' },
  { label: 'Monthly Users', value: 171, suffix: 'B', prefix: '' },
  { label: 'Countries', value: 102, suffix: '', prefix: '' },
  { label: 'New Users', value: 93, suffix: 'B', prefix: '' },
];

export const insightCards = [
  {
    icon: '01',
    stat: 'Top 10%',
    body: 'outperform the rest across every key metric — acquisition, activation, engagement, and retention.',
  },
  {
    icon: '02',
    stat: '>80%',
    body: 'of all new users go to just 10% of products, leaving the rest to fight for a shrinking share.',
  },
  {
    icon: '03',
    stat: '69%',
    body: 'of top performers in 7-day activation were also the top performers in 3-month retention.',
  },
  {
    icon: '04',
    stat: '0',
    body: 'correlation between acquisition speed and long-term retention. Fast growth doesn\'t equal loyal users.',
  },
];

// ─────────────────────────────────────────────
// ACQUISITION
// ─────────────────────────────────────────────
export const acquisitionGrowthRate = {
  label: 'New User Growth Rate',
  groups: ['Daily', 'Weekly', 'Monthly'],
  all: {
    p50:  [0.004, 0.03,  0.11],
    p75:  [0.05,  0.50,  2.5],
    p90:  [0.28,  2.0,   8.7],
  },
  enterprise: {
    p50:  [0.09,  0.65,  2.9],
    p75:  [0.28,  2.1,   5.5],
    p90:  [0.56,  4.1,   8.8],
  },
};

export const acquisitionGrowthOverYear = {
  label: 'Growth Over a Year (Starting: 100 users)',
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  // Compounded from monthly rates: 0.11%, 2.5%, 8.7% monthly
  all: {
    p50: [100, 100.1, 100.2, 100.3, 100.4, 100.6, 100.7, 100.8, 100.9, 101.0, 101.1, 103],
    p75: [100, 102.5, 105.1, 107.7, 110.4, 113.2, 116.0, 118.9, 121.9, 124.9, 128.0, 135],
    p90: [100, 108.7, 118.2, 128.5, 139.7, 151.8, 165.0, 179.4, 195.0, 212.0, 230.5, 274],
  },
};

// Sankey data: acquisition quartile → retention quartile
// Values represent flow weights (roughly equal distribution)
export const acquisitionRetentionSankey = {
  nodes: [
    { id: 'acq-q4', label: 'Top 25%', side: 'left', color: '#0052F2' },
    { id: 'acq-q3', label: 'Upper Mid', side: 'left', color: '#6980FF' },
    { id: 'acq-q2', label: 'Lower Mid', side: 'left', color: '#9FA5AD' },
    { id: 'acq-q1', label: 'Bottom 25%', side: 'left', color: '#D5D9E0' },
    { id: 'ret-q4', label: 'Top 25%', side: 'right', color: '#0052F2' },
    { id: 'ret-q3', label: 'Upper Mid', side: 'right', color: '#6980FF' },
    { id: 'ret-q2', label: 'Lower Mid', side: 'right', color: '#9FA5AD' },
    { id: 'ret-q1', label: 'Bottom 25%', side: 'right', color: '#D5D9E0' },
  ],
  // Roughly even: each left node splits ~25/25/25/25 to right nodes
  links: [
    // From Top acquisition
    { source: 'acq-q4', target: 'ret-q4', value: 28 },
    { source: 'acq-q4', target: 'ret-q3', value: 24 },
    { source: 'acq-q4', target: 'ret-q2', value: 26 },
    { source: 'acq-q4', target: 'ret-q1', value: 22 },
    // From Upper Mid acquisition
    { source: 'acq-q3', target: 'ret-q4', value: 25 },
    { source: 'acq-q3', target: 'ret-q3', value: 27 },
    { source: 'acq-q3', target: 'ret-q2', value: 23 },
    { source: 'acq-q3', target: 'ret-q1', value: 25 },
    // From Lower Mid acquisition
    { source: 'acq-q2', target: 'ret-q4', value: 24 },
    { source: 'acq-q2', target: 'ret-q3', value: 22 },
    { source: 'acq-q2', target: 'ret-q2', value: 28 },
    { source: 'acq-q2', target: 'ret-q1', value: 26 },
    // From Bottom acquisition
    { source: 'acq-q1', target: 'ret-q4', value: 23 },
    { source: 'acq-q1', target: 'ret-q3', value: 27 },
    { source: 'acq-q1', target: 'ret-q2', value: 23 },
    { source: 'acq-q1', target: 'ret-q1', value: 27 },
  ],
  sourceLabel: 'Acquisition Quartile',
  targetLabel: 'Retention Quartile',
  insight: 'No correlation — each acquisition quartile distributes almost evenly across all retention quartiles.',
};

// ─────────────────────────────────────────────
// ACTIVATION
// ─────────────────────────────────────────────
export const activationRate = {
  label: 'Activation Rate',
  days: ['Day 1', 'Day 7', 'Day 14'],
  all: {
    p50: [5,   2,   2],
    p75: [11,  5,   4],
    p90: [21,  7,   9],
  },
  enterprise: {
    p50: [1,   2.1, 1],
    p75: [4,   6,   2.5],
    p90: [8,   12.4, 5],
  },
};

// Sankey: activation → retention (strong correlation)
export const activationRetentionSankey = {
  nodes: [
    { id: 'act-q4', label: 'Top 25%', side: 'left', color: '#0052F2' },
    { id: 'act-q3', label: 'Upper Mid', side: 'left', color: '#6980FF' },
    { id: 'act-q2', label: 'Lower Mid', side: 'left', color: '#9FA5AD' },
    { id: 'act-q1', label: 'Bottom 25%', side: 'left', color: '#D5D9E0' },
    { id: 'ret-q4', label: 'Top 25%', side: 'right', color: '#0052F2' },
    { id: 'ret-q3', label: 'Upper Mid', side: 'right', color: '#6980FF' },
    { id: 'ret-q2', label: 'Lower Mid', side: 'right', color: '#9FA5AD' },
    { id: 'ret-q1', label: 'Bottom 25%', side: 'right', color: '#D5D9E0' },
  ],
  // Strong positive correlation: top→top, bottom→bottom dominate
  links: [
    // From Top activation (69% → top retention)
    { source: 'act-q4', target: 'ret-q4', value: 69 },
    { source: 'act-q4', target: 'ret-q3', value: 18 },
    { source: 'act-q4', target: 'ret-q2', value: 9 },
    { source: 'act-q4', target: 'ret-q1', value: 4 },
    // From Upper Mid
    { source: 'act-q3', target: 'ret-q4', value: 20 },
    { source: 'act-q3', target: 'ret-q3', value: 42 },
    { source: 'act-q3', target: 'ret-q2', value: 28 },
    { source: 'act-q3', target: 'ret-q1', value: 10 },
    // From Lower Mid
    { source: 'act-q2', target: 'ret-q4', value: 8 },
    { source: 'act-q2', target: 'ret-q3', value: 25 },
    { source: 'act-q2', target: 'ret-q2', value: 42 },
    { source: 'act-q2', target: 'ret-q1', value: 25 },
    // From Bottom (strong correlation to bottom retention)
    { source: 'act-q1', target: 'ret-q4', value: 3 },
    { source: 'act-q1', target: 'ret-q3', value: 12 },
    { source: 'act-q1', target: 'ret-q2', value: 21 },
    { source: 'act-q1', target: 'ret-q1', value: 64 },
  ],
  sourceLabel: 'Activation Quartile',
  targetLabel: 'Retention Quartile',
  insight: '69% of top week-one activators became top 3-month retainers. First impressions are everything.',
};

// ─────────────────────────────────────────────
// ENGAGEMENT
// ─────────────────────────────────────────────
export const engagementGrowthRate = {
  label: 'Active User Growth Rate',
  groups: ['Daily', 'Weekly', 'Monthly'],
  all: {
    p50: [0.003, 0.02, 0.6],
    p75: [0.04,  0.40, 2.0],
    p90: [0.24,  1.7,  7.5],
  },
  enterprise: {
    p50: [0.02, 0.13, 0.6],
    p75: [0.07, 0.50, 3.2],
    p90: [0.21, 1.55, 6.5],
  },
};

export const engagementGrowthOverYear = {
  label: 'Engagement Over a Year (Starting: 100 active users)',
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  all: {
    p50: [100, 100.6, 101.2, 101.8, 102.4, 103.0, 103.7, 104.3, 104.9, 105.5, 106.1, 106],
    p75: [100, 102,   104.1, 106.2, 108.3, 110.5, 112.7, 115.0, 117.3, 119.7, 122.1, 127],
    p90: [100, 107.5, 115.6, 124.3, 133.6, 143.6, 154.4, 165.9, 178.4, 191.8, 206.2, 238],
  },
};

// Sankey: engagement → retention (no strong relationship)
export const engagementRetentionSankey = {
  nodes: [
    { id: 'eng-q4', label: 'Top 25%', side: 'left', color: '#0052F2' },
    { id: 'eng-q3', label: 'Upper Mid', side: 'left', color: '#6980FF' },
    { id: 'eng-q2', label: 'Lower Mid', side: 'left', color: '#9FA5AD' },
    { id: 'eng-q1', label: 'Bottom 25%', side: 'left', color: '#D5D9E0' },
    { id: 'ret-q4', label: 'Top 25%', side: 'right', color: '#0052F2' },
    { id: 'ret-q3', label: 'Upper Mid', side: 'right', color: '#6980FF' },
    { id: 'ret-q2', label: 'Lower Mid', side: 'right', color: '#9FA5AD' },
    { id: 'ret-q1', label: 'Bottom 25%', side: 'right', color: '#D5D9E0' },
  ],
  // Roughly even distribution, small strand top→top
  links: [
    { source: 'eng-q4', target: 'ret-q4', value: 32 },
    { source: 'eng-q4', target: 'ret-q3', value: 26 },
    { source: 'eng-q4', target: 'ret-q2', value: 24 },
    { source: 'eng-q4', target: 'ret-q1', value: 18 },
    { source: 'eng-q3', target: 'ret-q4', value: 26 },
    { source: 'eng-q3', target: 'ret-q3', value: 28 },
    { source: 'eng-q3', target: 'ret-q2', value: 24 },
    { source: 'eng-q3', target: 'ret-q1', value: 22 },
    { source: 'eng-q2', target: 'ret-q4', value: 24 },
    { source: 'eng-q2', target: 'ret-q3', value: 25 },
    { source: 'eng-q2', target: 'ret-q2', value: 27 },
    { source: 'eng-q2', target: 'ret-q1', value: 24 },
    { source: 'eng-q1', target: 'ret-q4', value: 18 },
    { source: 'eng-q1', target: 'ret-q3', value: 21 },
    { source: 'eng-q1', target: 'ret-q2', value: 25 },
    { source: 'eng-q1', target: 'ret-q1', value: 36 },
  ],
  sourceLabel: 'Engagement Quartile',
  targetLabel: 'Retention Quartile',
  insight: 'Active users today doesn\'t guarantee retention tomorrow. Engagement alone isn\'t enough.',
};

// ─────────────────────────────────────────────
// RETENTION
// ─────────────────────────────────────────────
export const retentionRate = {
  label: 'Retention Rate',
  months: ['Month 1', 'Month 2', 'Month 3'],
  all: {
    p50: [6.5,  4.5,  3.8],
    p75: [13,   10,   8],
    p90: [26,   22,   18.5],
  },
  enterprise: {
    p50: [5,    4,    3.5],
    p75: [14,   11,   9],
    p90: [28,   26,   25],
  },
};

// ─────────────────────────────────────────────
// INDUSTRY SNAPSHOT
// ─────────────────────────────────────────────
export const industries = [
  {
    id: 'b2b-tech',
    name: 'B2B Technology',
    emoji: '💻',
    standout: false,
    proTip: 'Take a page from the product-led growth (PLG) playbook. Surface key value moments early, guide users through onboarding flows, and use product usage signals to drive expansion.',
    acquisition: { p50: 0.3,  p75: 3.5,  p90: 9.0  },
    retention:   { p50: 2.5,  p75: 8.2,  p90: 15.6 },
    callout: null,
  },
  {
    id: 'ecommerce',
    name: 'Ecommerce',
    emoji: '🛍',
    standout: false,
    proTip: 'Combat cart abandonment by optimizing your checkout flow. Analyze drop-off points and A/B test alternatives that offer a more seamless experience.',
    acquisition: { p50: 0.03, p75: 3.1,  p90: 7.5  },
    retention:   { p50: 2.8,  p75: 9.5,  p90: 18.9 },
    callout: null,
  },
  {
    id: 'financial-services',
    name: 'Financial Services',
    emoji: '🏦',
    standout: false,
    proTip: 'Double down on user trust by improving your onboarding. Clear value communication, fast time-to-value, and frictionless onboarding — especially on mobile — goes a long way.',
    acquisition: { p50: 0.5,  p75: 4.8,  p90: 10.2 },
    retention:   { p50: 4.6,  p75: 11.0, p90: 19.5 },
    callout: null,
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    emoji: '🏥',
    standout: false,
    proTip: 'Make the digital experience as human as the care you provide. Map key patient journeys and identify moments where confusing flows create frustration or disengagement.',
    acquisition: { p50: 0.7,  p75: 3.8,  p90: 7.3  },
    retention:   { p50: 2.1,  p75: 5.8,  p90: 10.6 },
    callout: null,
  },
  {
    id: 'media',
    name: 'Media & Entertainment',
    emoji: '🎬',
    standout: false,
    proTip: 'Personalization is the antidote to churn. Use behavioral data to serve up content and recommendations that keep users engaged beyond their first session.',
    acquisition: { p50: -0.2, p75: 3.2,  p90: 8.0  },
    retention:   { p50: 2.5,  p75: 7.2,  p90: 13.4 },
    callout: null,
  },
  {
    id: 'travel',
    name: 'Travel & Hospitality',
    emoji: '✈️',
    standout: true,
    proTip: 'Remove friction from booking because every second counts. Reduce unnecessary steps, highlight pricing transparency, and personalize results based on previous behavior.',
    acquisition: { p50: 1.4,  p75: 4.5,  p90: 7.6  },
    retention:   { p50: 10.0, p75: 18.2, p90: 25.6 },
    callout: 'The top 10% of travel & hospitality companies retained 1 out of 4 users by month three — the highest of any industry.',
  },
];
