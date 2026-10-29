// Helm product page — demo data.
// Mirrors Helm's own demo company (Northwind Consulting, a 25-person consultancy).
// Everything here is illustrative and only drives the interactive dashboards.

export const HELM_URL = "https://helm-six-bice.vercel.app";
export const HELM_START_URL = `${HELM_URL}/welcome`;
export const HELM_DEMO_URL = `${HELM_URL}/demo`;

export const MONO = "var(--font-code), ui-monospace, SFMono-Regular, Menlo, monospace";
export const EASE = [0.16, 1, 0.3, 1] as const;

// Translucent version of any CSS color/variable.
export const tint = (color: string, pct: number) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;

export const STATUS = {
    on: "var(--status-on)",
    warn: "var(--status-warn)",
    off: "var(--status-off)",
} as const;

export type LeaderId = "sarah" | "daniel" | "priya" | "marcus";

export const LEADERS: Record<LeaderId, { name: string; initials: string; seat: string }> = {
    sarah: { name: "Sarah Okafor", initials: "SO", seat: "CEO" },
    daniel: { name: "Daniel Reyes", initials: "DR", seat: "Sales" },
    priya: { name: "Priya Nair", initials: "PN", seat: "Delivery" },
    marcus: { name: "Marcus Lee", initials: "ML", seat: "Finance" },
};

// ── Scorecard: 13 weeks, goal + direction per metric ──────────────────────────
export type Metric = {
    name: string;
    owner: LeaderId;
    goal: number;
    dir: "gte" | "lte";
    unit: "" | "%" | "$k" | "mo";
    values: number[];
};

export const SCORECARD: Metric[] = [
    { name: "Revenue booked", owner: "daniel", goal: 120, dir: "gte", unit: "$k", values: [112, 128, 131, 118, 104, 126, 135, 122, 141, 119, 133, 138, 144] },
    { name: "Qualified leads", owner: "daniel", goal: 45, dir: "gte", unit: "", values: [41, 44, 48, 46, 39, 43, 47, 50, 44, 46, 49, 42, 47] },
    { name: "Proposals sent", owner: "daniel", goal: 6, dir: "gte", unit: "", values: [5, 7, 6, 8, 4, 6, 7, 9, 6, 5, 8, 7, 5] },
    { name: "Win rate", owner: "sarah", goal: 35, dir: "gte", unit: "%", values: [31, 38, 36, 33, 29, 37, 40, 34, 39, 36, 42, 38, 41] },
    { name: "Billable utilisation", owner: "priya", goal: 75, dir: "gte", unit: "%", values: [78, 76, 72, 74, 79, 81, 77, 73, 80, 82, 78, 76, 73] },
    { name: "Projects on schedule", owner: "priya", goal: 90, dir: "gte", unit: "%", values: [92, 88, 94, 91, 86, 93, 95, 90, 89, 94, 96, 92, 93] },
    { name: "Overdue invoices", owner: "marcus", goal: 20, dir: "lte", unit: "$k", values: [18, 24, 22, 17, 26, 19, 15, 21, 14, 16, 12, 23, 13] },
    { name: "Cash runway", owner: "marcus", goal: 6, dir: "gte", unit: "mo", values: [6.2, 6.1, 5.8, 5.9, 6.0, 6.3, 6.4, 6.2, 6.5, 6.6, 6.4, 6.7, 6.8] },
    { name: "Team pulse (eNPS)", owner: "sarah", goal: 30, dir: "gte", unit: "", values: [28, 32, 31, 34, 30, 29, 33, 35, 36, 32, 34, 37, 38] },
];

export const onTarget = (m: Metric, v: number) => (m.dir === "gte" ? v >= m.goal : v <= m.goal);

export const fmt = (m: Metric, v: number) => {
    if (m.unit === "$k") return `$${v}k`;
    if (m.unit === "%") return `${v}%`;
    if (m.unit === "mo") return v.toFixed(1);
    return String(v);
};

export const fmtGoal = (m: Metric) => `${m.dir === "gte" ? "≥" : "≤"} ${fmt(m, m.goal)}`;

// ── 90-day priorities ─────────────────────────────────────────────────────────
export type Priority = {
    id: string;
    title: string;
    owner: LeaderId;
    milestones: { label: string; done: boolean }[];
};

export const PRIORITIES: Priority[] = [
    {
        id: "p1", title: "Launch the fixed-fee advisory package", owner: "sarah",
        milestones: [
            { label: "Pricing model signed off", done: true },
            { label: "Pilot with two existing clients", done: true },
            { label: "Sales deck + one-pager", done: true },
            { label: "Public launch to pipeline", done: false },
        ],
    },
    {
        id: "p2", title: "Sign 4 new retainer clients", owner: "daniel",
        milestones: [
            { label: "Retainer #1: Halcyon Labs", done: true },
            { label: "Retainer #2: Brightwater", done: true },
            { label: "Retainer #3: Northbeam", done: true },
            { label: "Retainer #4", done: false },
        ],
    },
    {
        id: "p3", title: "Proposal turnaround under 48 hours", owner: "daniel",
        milestones: [
            { label: "Proposal template library", done: true },
            { label: "Pricing calculator in CRM", done: true },
            { label: "Approval step cut to one sign-off", done: false },
        ],
    },
    {
        id: "p4", title: "Roll out the delivery playbook to 3 teams", owner: "priya",
        milestones: [
            { label: "Playbook drafted and reviewed", done: true },
            { label: "Team A trained", done: false },
            { label: "Team B trained", done: false },
            { label: "Team C trained", done: false },
        ],
    },
    {
        id: "p5", title: "Hire 2 senior consultants", owner: "priya",
        milestones: [
            { label: "Role scorecards written", done: true },
            { label: "Shortlist of 6 candidates", done: true },
            { label: "Offer #1 accepted", done: true },
            { label: "Offer #2 accepted", done: false },
        ],
    },
    {
        id: "p6", title: "Close the monthly books in 5 days", owner: "marcus",
        milestones: [
            { label: "Close checklist in the Playbook", done: true },
            { label: "Automated bank reconciliation", done: false },
            { label: "Two clean 5-day closes", done: false },
        ],
    },
];

// ── Issues (ranked) and the to-do each one resolves into ───────────────────────
export type Issue = {
    id: string;
    title: string;
    owner: LeaderId;
    cause: string;
    todo: string;
    todoOwner: LeaderId;
};

export const ISSUES: Issue[] = [
    {
        id: "i1", title: "Proposals stall waiting on CEO approval", owner: "daniel",
        cause: "Every proposal over $20k needs Sarah, who is on client sites 3 days a week.",
        todo: "Write approval rules so Daniel signs off proposals under $60k", todoOwner: "sarah",
    },
    {
        id: "i2", title: "Two seniors above 95% utilisation", owner: "priya",
        cause: "New work defaults to whoever knows the client, not who has capacity.",
        todo: "Move the Brightwater workstream to the new senior hire", todoOwner: "priya",
    },
    {
        id: "i3", title: "Halcyon invoices paid 40+ days late", owner: "marcus",
        cause: "Invoices go to a shared inbox nobody on the client side owns.",
        todo: "Agree a named AP contact and 14-day terms with Halcyon", todoOwner: "marcus",
    },
    {
        id: "i4", title: "Discovery calls run differently every time", owner: "daniel",
        cause: "No written process, so each consultant improvises.",
        todo: "Add a discovery-call checklist to the Playbook", todoOwner: "daniel",
    },
    {
        id: "i5", title: "Client onboarding takes three weeks", owner: "priya",
        cause: "Contracts, access and kickoff are booked one after another, not in parallel.",
        todo: "Map onboarding steps and run the first three in parallel", todoOwner: "priya",
    },
];

export const TODOS: { id: string; label: string; owner: LeaderId; due: string; done: boolean }[] = [
    { id: "t1", label: "Call the 12 stalled leads", owner: "daniel", due: "Done 2 days early", done: true },
    { id: "t2", label: "Send Q4 board pack draft", owner: "marcus", due: "Due Thu", done: false },
    { id: "t3", label: "Book Team A playbook training", owner: "priya", due: "Due Wed", done: false },
    { id: "t4", label: "Final interview: senior consultant", owner: "sarah", due: "Due Fri", done: false },
    { id: "t5", label: "Chase Halcyon on invoice #1042", owner: "marcus", due: "Due Tue", done: true },
    { id: "t6", label: "Add win rate to the CRM dashboard", owner: "daniel", due: "Due Mon", done: false },
    { id: "t7", label: "Share team pulse results", owner: "sarah", due: "Due Fri", done: false },
];

// ── Company health (six areas) ────────────────────────────────────────────────
export const HEALTH_AREAS = [
    { key: "vision", label: "Vision", now: 82, prev: 70 },
    { key: "people", label: "People", now: 68, prev: 61 },
    { key: "numbers", label: "Numbers", now: 86, prev: 72 },
    { key: "issues", label: "Issues", now: 61, prev: 48 },
    { key: "process", label: "Process", now: 47, prev: 44 },
    { key: "rhythm", label: "Rhythm", now: 79, prev: 55 },
] as const;

// ── Pulse Meeting agenda (90 minutes) ─────────────────────────────────────────
export const AGENDA = [
    { label: "Check-in", minutes: 5, note: "One personal and one business win each." },
    { label: "Scorecard", minutes: 5, note: "Read the numbers. Anything red becomes an issue." },
    { label: "Priorities", minutes: 5, note: "On track or off track. No discussion." },
    { label: "Headlines", minutes: 5, note: "Client and people news in one sentence." },
    { label: "To-do review", minutes: 5, note: "Last week's seven-day commitments: done or not done." },
    { label: "Solve issues", minutes: 60, note: "Rank the list. Solve the top three, one at a time." },
    { label: "Wrap-up", minutes: 5, note: "Confirm new to-dos and rate the meeting from 1 to 10." },
] as const;
