"use client";

// AI & Intelligence service mockups. Company names and figures are illustrative.

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Avatar, Caret, Check, Chip, CYAN, Dot, EASE, Label, LINE, LivePill, MONO, PANEL,
    Stat, STATUS, tint, useEvery, useLive, useTyped, VIOLET, Window,
} from "./kit";

// ── 01. AI Integration: AI working inside the CRM, grounded in your systems ───

const ACCOUNTS = [
    {
        name: "Brightline Logistics", contact: "Maya Torres · Head of Ops", stage: "Proposal", value: "$48,000",
        summary: "Renewal is at risk: two late deliveries this month and an open support ticket. Maya asked for weekly reporting on the last call. Suggest offering the reporting add-on and a call with their account lead this week.",
        step: "Book call · Thu 10:00",
    },
    {
        name: "Halden & Co", contact: "James Okoro · CFO", stage: "Negotiation", value: "$112,500",
        summary: "Finance approved budget on 14 Nov. Legal flagged the data-residency clause. Their usage grew 38% this quarter. Suggest sending the EU hosting addendum and moving the close date to 2 Dec.",
        step: "Send addendum · today",
    },
    {
        name: "Northpeak Retail", contact: "Lena Fischer · COO", stage: "Discovery", value: "$27,400",
        summary: "Inbound from the pricing page. 14 stores, using spreadsheets for stock. Similar to three accounts that closed in under 30 days. Suggest a discovery call focused on stock visibility.",
        step: "Create task · Daniel",
    },
];

const SOURCES = ["CRM", "Postgres", "Support desk", "Email"];

export function AIIntegrationMock({ compact = false }: { compact?: boolean }) {
    const { ref, live } = useLive();
    const [i, setI] = useState(0);
    const [synced, setSynced] = useState(false);
    const acc = ACCOUNTS[i];
    const typed = useTyped(acc.summary, live, 60);
    const done = typed.length >= acc.summary.length;

    useEvery(live && done && !synced, 1400, () => setSynced(true));
    useEvery(live && synced, 2600, () => {
        setSynced(false);
        setI((x) => (x + 1) % ACCOUNTS.length);
    });

    const panel = (
        <div className="flex min-h-0 flex-1 flex-col gap-2.5 p-3.5" style={{ background: tint(VIOLET, 4) }}>
            <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/80">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded" style={{ background: "var(--accent-gradient)" }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z" fill="white" /></svg>
                    </span>
                    AI account brief
                </span>
                <span className="text-[9.5px] text-white/35" style={{ fontFamily: MONO }}>grounded · 4 sources</span>
            </div>
            <div className="flex flex-wrap gap-1">
                {SOURCES.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9.5px] text-white/50" style={PANEL}>
                        <Dot size={4} /> {s}
                    </span>
                ))}
            </div>
            <p className={`${compact ? "min-h-[64px] text-[11px]" : "min-h-[92px] text-[11.5px]"} leading-relaxed text-white/75`}>
                {typed}
                {!done && <Caret />}
            </p>
            <div className="mt-auto flex items-center justify-between gap-2 rounded-lg px-2.5 py-2" style={PANEL}>
                <span className="truncate text-[10.5px] text-white/60">Next step: <span className="text-white/85">{acc.step}</span></span>
                <AnimatePresence mode="wait">
                    {synced ? (
                        <motion.span key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                            <Chip><Check size={10} /> Saved to CRM</Chip>
                        </motion.span>
                    ) : (
                        <motion.span key="btn" initial={{ opacity: 0 }} animate={{ opacity: done ? 1 : 0.4 }} exit={{ opacity: 0 }}
                            className="rounded-md px-2 py-0.5 text-[10px] font-semibold text-white" style={{ background: "var(--accent-gradient)" }}>
                            Approve
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );

    if (compact) {
        return (
            <div ref={ref} className="h-full">
                <Window title="crm / accounts / ai-brief" right={<LivePill />} className="h-full" bodyClassName="flex flex-col">
                    <div className="flex items-center gap-2 px-3.5 py-2" style={{ borderBottom: `1px solid ${LINE}` }}>
                        <Avatar initials={acc.name.slice(0, 2).toUpperCase()} />
                        <span className="truncate text-[11.5px] text-white/85">{acc.name}</span>
                        <Chip color={CYAN} className="ml-auto">{acc.stage}</Chip>
                    </div>
                    {panel}
                </Window>
            </div>
        );
    }

    return (
        <div ref={ref}>
            <Window title="crm.yourcompany.com / accounts" right={<LivePill />} className="aspect-[5/4] w-full" bodyClassName="flex">
                {/* account list */}
                <div className="hidden w-[38%] flex-shrink-0 flex-col sm:flex" style={{ borderRight: `1px solid ${LINE}` }}>
                    <div className="px-3 py-2.5"><Label>Accounts</Label></div>
                    {ACCOUNTS.map((a, k) => (
                        <button key={a.name} type="button" onClick={() => { setI(k); setSynced(false); }}
                            className="flex flex-col gap-0.5 px-3 py-2.5 text-left transition-colors"
                            style={{ background: k === i ? "rgba(255,255,255,0.05)" : "transparent", borderLeft: `2px solid ${k === i ? CYAN : "transparent"}` }}>
                            <span className="truncate text-[11.5px] text-white/85">{a.name}</span>
                            <span className="flex items-center justify-between text-[10px] text-white/40">
                                <span>{a.stage}</span><span className="tabular-nums text-white/55">{a.value}</span>
                            </span>
                        </button>
                    ))}
                    <div className="mt-auto flex flex-col gap-1.5 p-3" style={{ borderTop: `1px solid ${LINE}` }}>
                        <Label>Audit log</Label>
                        {["Brief written · model v4", "Approved by Sam K.", "CRM field updated"].map((l) => (
                            <span key={l} className="flex items-center gap-1.5 text-[10px] text-white/45"><Check size={10} />{l}</span>
                        ))}
                    </div>
                </div>
                {/* record + AI panel */}
                <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-center gap-2.5 px-3.5 py-3" style={{ borderBottom: `1px solid ${LINE}` }}>
                        <Avatar initials={acc.name.slice(0, 2).toUpperCase()} size={28} />
                        <div className="min-w-0">
                            <p className="truncate text-[13px] text-white/90">{acc.name}</p>
                            <p className="truncate text-[10.5px] text-white/40">{acc.contact}</p>
                        </div>
                        <div className="ml-auto text-right">
                            <p className="text-[13px] tabular-nums text-white/90">{acc.value}</p>
                            <p className="text-[10px] text-white/40">{acc.stage}</p>
                        </div>
                    </div>
                    {panel}
                </div>
            </Window>
        </div>
    );
}

// ── 02. Intelligent Workflows: AI classifies and routes incoming work ─────────

type Item = { id: number; title: string; kind: string; team: string; conf: number };
const INBOUND: Omit<Item, "id">[] = [
    { title: "Invoice INV-4471 · Apex Supply", kind: "Invoice", team: "Finance", conf: 98 },
    { title: "Refund request · order 20931", kind: "Support", team: "Support", conf: 64 },
    { title: "Signed contract · Halden & Co", kind: "Contract", team: "Legal", conf: 95 },
    { title: "\"Need a quote for 40 seats\"", kind: "Sales lead", team: "Sales", conf: 91 },
    { title: "Address change · customer 8812", kind: "Account", team: "Ops", conf: 97 },
    { title: "Complaint · late delivery x3", kind: "Escalation", team: "Support lead", conf: 88 },
    { title: "Supplier price list Q1", kind: "Document", team: "Procurement", conf: 93 },
    { title: "Partial payment, unclear ref", kind: "Payment", team: "Finance", conf: 58 },
];
const THRESHOLD = 80;

export function IntelligentWorkflowsMock() {
    const { ref, live } = useLive();
    const [rows, setRows] = useState<Item[]>(() => INBOUND.slice(0, 5).map((r, k) => ({ ...r, id: k })));
    const [n, setN] = useState(5);
    const [count, setCount] = useState(1284);
    useEvery(live, 1700, () => {
        const next = { ...INBOUND[n % INBOUND.length], id: n };
        setRows((r) => [next, ...r].slice(0, 6));
        setN((x) => x + 1);
        setCount((c) => c + 1);
    });
    const reviewed = rows.filter((r) => r.conf < THRESHOLD).length;

    return (
        <div ref={ref}>
            <Window title="workflows / inbound-router" right={<LivePill label="Routing" />} className="aspect-[5/4] w-full" bodyClassName="flex flex-col">
                <div className="grid grid-cols-3 gap-2 p-3">
                    <Stat label="Handled today" value={count.toLocaleString("en-US")} sub="across 6 teams" />
                    <Stat label="Auto-routed" value="91%" sub="rest go to a person" />
                    <Stat label="Decision time" value="0.8s" sub="was 4h in the inbox" />
                </div>
                <div className="flex items-center gap-2 px-3 pb-1.5 text-[9.5px] text-white/35" style={{ fontFamily: MONO }}>
                    <span className="flex-1">ITEM</span><span className="w-20">ROUTED TO</span><span className="w-[74px] text-right">CONFIDENCE</span>
                </div>
                <div className="relative min-h-0 flex-1 overflow-hidden px-3">
                    <AnimatePresence initial={false}>
                        {rows.map((r) => {
                            const review = r.conf < THRESHOLD;
                            return (
                                <motion.div key={r.id} layout initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    transition={{ duration: 0.45, ease: EASE }}
                                    className="mb-1.5 flex items-center gap-2 rounded-lg px-2.5 py-2" style={PANEL}>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-[11px] text-white/80">{r.title}</p>
                                        <p className="text-[9.5px] text-white/35">{r.kind}</p>
                                    </div>
                                    <span className="w-20 truncate text-[10.5px] text-white/60">{r.team}</span>
                                    <span className="flex w-[74px] justify-end">
                                        {review ? <Chip color={STATUS.warn}>{r.conf}% · review</Chip> : <Chip>{r.conf}% · auto</Chip>}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10" style={{ background: "linear-gradient(transparent, var(--surface))" }} />
                </div>
                <div className="flex items-center justify-between gap-2 px-3 py-2 text-[10px] text-white/45" style={{ borderTop: `1px solid ${LINE}` }}>
                    <span>Below {THRESHOLD}% confidence → a person checks it first</span>
                    <span className="tabular-nums text-white/60">{reviewed} waiting</span>
                </div>
            </Window>
        </div>
    );
}

// ── 03. Custom AI Solutions: a model trained on your data, in production ──────

const ACTUAL = [62, 58, 71, 66, 74, 81, 77, 85, 90, 84, 93, 97];
const PRED = [60, 61, 69, 68, 75, 79, 79, 84, 88, 87, 92, 96, 101, 99, 106];

export function CustomAIMock() {
    const { ref, live } = useLive();
    const [k, setK] = useState(0);
    useEvery(live, 1500, () => setK((x) => x + 1));
    const feed = [
        { sku: "SKU-2214 · Oat milk 1L", v: "+18% next week", c: STATUS.on },
        { sku: "SKU-0937 · Cold brew", v: "+31% (heatwave)", c: STATUS.on },
        { sku: "SKU-1180 · Hot chocolate", v: "−22% next week", c: STATUS.off },
        { sku: "SKU-0410 · Croissant x6", v: "+7% (pay week)", c: STATUS.on },
        { sku: "SKU-3302 · Matcha powder", v: "Reorder in 4 days", c: STATUS.warn },
    ];
    const W = 300, H = 110, max = 110, min = 50;
    const x = (i: number) => (i / (PRED.length - 1)) * W;
    const y = (v: number) => H - ((v - min) / (max - min)) * H;
    const path = (vals: number[]) => vals.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");

    return (
        <div ref={ref}>
            <Window title="models / demand-forecast-v3" right={<Chip>Deployed · private</Chip>} className="aspect-[5/4] w-full" bodyClassName="flex flex-col gap-2.5 p-3">
                <div className="grid grid-cols-3 gap-2">
                    <Stat label="Accuracy" value="94.2%" sub="v2 was 81.7%" subColor={STATUS.on} />
                    <Stat label="Trained on" value="2.4M" sub="rows of your orders" />
                    <Stat label="Latency" value="38ms" sub="your cloud, your data" />
                </div>
                <div className="rounded-xl p-3" style={PANEL}>
                    <div className="mb-2 flex items-center justify-between">
                        <Label>Weekly demand · forecast vs actual</Label>
                        <span className="flex items-center gap-3 text-[9.5px] text-white/45">
                            <span className="flex items-center gap-1"><span className="h-0.5 w-3 rounded" style={{ background: CYAN }} />Actual</span>
                            <span className="flex items-center gap-1"><span className="h-0.5 w-3 rounded" style={{ background: VIOLET }} />Model</span>
                        </span>
                    </div>
                    <svg viewBox={`0 0 ${W} ${H}`} className="block h-[96px] w-full" preserveAspectRatio="none" aria-hidden>
                        <rect x={x(ACTUAL.length - 1)} y="0" width={W - x(ACTUAL.length - 1)} height={H} fill={tint(VIOLET, 6)} />
                        <path d={path(PRED)} fill="none" stroke={VIOLET} strokeWidth="1.6" strokeDasharray="4 3" vectorEffect="non-scaling-stroke" />
                        <path d={path(ACTUAL)} fill="none" stroke={CYAN} strokeWidth="2" vectorEffect="non-scaling-stroke" />
                    </svg>
                    <div className="mt-1 flex justify-between text-[9px] text-white/30" style={{ fontFamily: MONO }}>
                        <span>12 weeks ago</span><span>today</span><span>+3 wks</span>
                    </div>
                </div>
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl" style={PANEL}>
                    <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: `1px solid ${LINE}` }}>
                        <Label>Live predictions</Label>
                        <LivePill label="API" />
                    </div>
                    {[0, 1, 2].map((o) => {
                        const f = feed[(k + o) % feed.length];
                        return (
                            <motion.div key={`${k}-${o}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
                                className="flex items-center justify-between px-3 py-1.5 text-[10.5px]">
                                <span className="truncate text-white/65">{f.sku}</span>
                                <span className="tabular-nums" style={{ color: f.c }}>{f.v}</span>
                            </motion.div>
                        );
                    })}
                </div>
            </Window>
        </div>
    );
}

// ── Problem: AI tools bought team by team, with no shared system ──────────────

const TOOLS = [
    { tool: "Chat assistant (12 seats)", team: "Everyone", cost: 360 },
    { tool: "AI email writer", team: "Sales", cost: 290 },
    { tool: "Meeting notes bot", team: "Ops", cost: 180 },
    { tool: "Support chatbot", team: "Support", cost: 499 },
    { tool: "AI image generator", team: "Marketing", cost: 120 },
    { tool: "Contract reviewer", team: "Legal", cost: 350 },
    { tool: "Spreadsheet AI add-on", team: "Finance", cost: 95 },
];

export function AIProblemMock() {
    const { ref, live } = useLive();
    const [shown, setShown] = useState(3);
    useEvery(live, 1100, () => setShown((s) => (s >= TOOLS.length ? 3 : s + 1)));
    const total = TOOLS.slice(0, shown).reduce((a, t) => a + t.cost, 0);

    return (
        <div ref={ref}>
            <Window title="billing / software subscriptions" className="w-full" bodyClassName="flex flex-col p-3 gap-2.5">
                <div className="grid grid-cols-3 gap-2">
                    <Stat label="AI tools" value={shown} sub="bought team by team" />
                    <Stat label="Monthly" value={`$${total.toLocaleString("en-US")}`} sub="and climbing" subColor={STATUS.warn} />
                    <Stat label="Connected" value="0" sub="no shared data" subColor={STATUS.off} />
                </div>
                <div className="flex flex-col gap-1.5">
                    {/* Every row is always laid out, so the window never changes height. */}
                    {TOOLS.map((t, i) => (
                        <motion.div key={t.tool} initial={false} animate={{ opacity: i < shown ? 1 : 0, x: i < shown ? 0 : -10 }}
                            transition={{ duration: 0.35, ease: EASE }}
                            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2" style={PANEL} aria-hidden={i >= shown}>
                            <span className="h-6 w-6 flex-shrink-0 rounded-md" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${LINE}` }} />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-[11px] text-white/80">{t.tool}</p>
                                <p className="truncate text-[9.5px] text-white/35">{t.team} · sees only its own data</p>
                            </div>
                            <span className="text-[10.5px] tabular-nums text-white/60">${t.cost}/mo</span>
                            <Chip color={STATUS.off}>Not connected</Chip>
                        </motion.div>
                    ))}
                </div>
                <div className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[10.5px]" style={{ background: tint(STATUS.warn, 8), border: `1px solid ${tint(STATUS.warn, 25)}` }}>
                    <Dot color={STATUS.warn} />
                    <span className="text-white/70">Nobody owns these tools, and none of them share what they know.</span>
                </div>
            </Window>
        </div>
    );
}
