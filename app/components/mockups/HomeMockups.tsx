"use client";

// Home page mockups: the "scaling chaos" desktop, the unified operations view,
// and small live screens of Helm and Sable. Illustrative data, except Helm and
// Sable, which reuse each product's own demo company.

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Avatar, Check, Chip, CYAN, Dot, EASE, Label, LINE, LivePill, Meter, MONO, PANEL,
    Stat, STATUS, tint, useEvery, useLive, VIOLET, Window,
} from "./kit";
import { fmt, LEADERS, onTarget, PRIORITIES, SCORECARD } from "@/app/products/helm/helmData";

function Tag({ n }: { n: string }) {
    return (
        <span className="rounded px-1.5 py-0.5 text-[9px] font-semibold tabular-nums tracking-[0.14em]" style={{ fontFamily: MONO, color: STATUS.off, background: tint(STATUS.off, 10), border: `1px solid ${tint(STATUS.off, 28)}` }}>
            {n}
        </span>
    );
}

// ── Problem: a desktop of disconnected tools ─────────────────────────────────

const SHEET = [
    ["Brightline", "$48,000", "Proposal", "?"],
    ["Halden & Co", "$112,500", "Negot.", "see email"],
    ["Northpeak", "$27,400", "Discovery", ""],
    ["Kestrel Foods", "#REF!", "Won?", "ask Sam"],
];
const PINGS = [
    "Who has the latest revenue number?",
    "23 follow-ups overdue",
    "Website lead waited 3 days for a reply",
    "Can someone rebuild the Friday report?",
];

export function ChaosDeskMock() {
    const { ref, live } = useLive();
    const [k, setK] = useState(0);
    useEvery(live, 2000, () => setK((x) => x + 1));
    const hours = (11.5 + (k % 6) * 0.25).toFixed(2);

    const win = "lg:absolute";
    return (
        <div ref={ref} className="relative flex flex-col gap-3 lg:block lg:h-[500px]">
            {/* 01 Manual operations: spreadsheet built by hand */}
            <Window title="weekly_report_FINAL_v7 (2).xlsx" right={<Tag n="01" />} className={`${win} lg:left-0 lg:top-0 lg:w-[56%]`} bodyClassName="flex flex-col">
                <div className="grid grid-cols-[1.2fr_1fr_0.9fr_0.9fr] text-[10px]" style={{ fontFamily: MONO }}>
                    {["Account", "Value", "Stage", "Notes"].map((h) => (
                        <span key={h} className="px-2 py-1 text-white/35" style={{ borderBottom: `1px solid ${LINE}`, borderRight: `1px solid ${LINE}`, background: "rgba(255,255,255,0.03)" }}>{h}</span>
                    ))}
                    {SHEET.flat().map((c, i) => (
                        <span key={i} className="truncate px-2 py-1" style={{ borderBottom: `1px solid ${LINE}`, borderRight: `1px solid ${LINE}`, color: c === "#REF!" ? STATUS.off : "var(--text-secondary)", outline: i === (k % 16) ? `1px solid ${CYAN}` : undefined, outlineOffset: -1 }}>{c || " "}</span>
                    ))}
                </div>
                <div className="flex items-center justify-between px-2.5 py-1.5 text-[10px] text-white/45">
                    <span>Copied by hand from 4 tools</span>
                    <span className="tabular-nums" style={{ color: STATUS.warn }}>{hours}h this week</span>
                </div>
            </Window>

            {/* 02 No single source of truth */}
            <Window title="revenue this month?" right={<Tag n="02" />} className={`${win} lg:right-0 lg:top-[11%] lg:w-[41%]`} bodyClassName="flex flex-col gap-1.5 p-2.5">
                {[{ s: "CRM", v: "$182,400" }, { s: "Accounting", v: "$167,950" }, { s: "Ops sheet", v: "$175,100" }].map((r) => (
                    <div key={r.s} className="flex items-center justify-between rounded-md px-2.5 py-1.5" style={PANEL}>
                        <span className="text-[10.5px] text-white/50">{r.s}</span>
                        <span className="text-[11.5px] tabular-nums text-white/85">{r.v}</span>
                    </div>
                ))}
                <p className="px-0.5 text-[10px]" style={{ color: STATUS.off }}>Three answers. Which one goes to the board?</p>
            </Window>

            {/* 03 Digital presence that doesn't convert */}
            <Window title="analytics / last 30 days" right={<Tag n="03" />} className={`${win} lg:bottom-0 lg:left-[4%] lg:w-[46%]`} bodyClassName="flex flex-col gap-1.5 p-2.5">
                {[{ l: "Visitors", v: "12,480", pct: 100 }, { l: "Enquiries", v: "41", pct: 9 }, { l: "Qualified", v: "3", pct: 2 }].map((r) => (
                    <div key={r.l} className="flex items-center gap-2 text-[10.5px]">
                        <span className="w-16 text-white/50">{r.l}</span>
                        <div className="flex-1"><Meter pct={Math.max(r.pct, 2)} color={r.pct < 10 ? STATUS.off : "rgba(255,255,255,0.35)"} /></div>
                        <span className="w-12 text-right tabular-nums text-white/85">{r.v}</span>
                    </div>
                ))}
                <p className="text-[10px] text-white/40">Traffic in. Pipeline flat.</p>
            </Window>

            {/* 04 AI adoption without a system */}
            <Window title="ai tools · 7 subscriptions" right={<Tag n="04" />} className={`${win} lg:bottom-[5%] lg:right-0 lg:w-[46%]`} bodyClassName="flex flex-wrap gap-1.5 p-2.5">
                {["Chat assistant", "Email writer", "Notes bot", "Support bot", "Image AI", "Contract AI", "Sheet AI"].map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] text-white/60" style={PANEL}>
                        <Dot color={STATUS.off} size={4} />{t}
                    </span>
                ))}
                <p className="w-full pt-0.5 text-[10px] text-white/40">$1,894 a month · connected to nothing</p>
            </Window>

            {/* notifications */}
            <div className="pointer-events-none hidden lg:absolute lg:left-1/2 lg:top-[46%] lg:block lg:w-[300px] lg:-translate-x-1/2">
                <AnimatePresence mode="popLayout">
                    <motion.div key={k} initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
                        style={{ background: "var(--surface-elevated)", border: `1px solid ${tint(STATUS.off, 35)}`, boxShadow: `0 18px 40px rgba(0,0,0,0.6), 0 0 30px ${tint(STATUS.off, 12)}` }}>
                        <Dot color={STATUS.off} pulse />
                        <span className="text-[11px] text-white/85">{PINGS[k % PINGS.length]}</span>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

// ── Solution: the same business, connected ───────────────────────────────────

const FEED = [
    "Friday report built and sent to leadership",
    "New website lead scored 86 and routed to Daniel",
    "Invoice paid · revenue updated everywhere",
    "AI brief added to Halden & Co before the call",
    "Low stock caught · reorder drafted for approval",
];

export function UnifiedOpsMock() {
    const { ref, live } = useLive();
    const [k, setK] = useState(0);
    useEvery(live, 1900, () => setK((x) => x + 1));
    const tiles = [
        { n: "01", t: "Reporting runs itself", v: "0 min", s: "manual work on the weekly report", c: STATUS.on },
        { n: "02", t: "One revenue number", v: "$182,400", s: "CRM, accounting and ops agree", c: STATUS.on },
        { n: "03", t: "Website feeds pipeline", v: `${41 + (k % 4)} qualified`, s: "leads routed in under 2 minutes", c: STATUS.on },
        { n: "04", t: "AI on your own data", v: "3 agents", s: "connected to every system", c: STATUS.on },
    ];
    return (
        <div ref={ref}>
            <Window title="operations / overview" right={<LivePill label="All systems synced" />} className="w-full" bodyClassName="grid gap-3 p-3 md:grid-cols-[1.6fr_1fr]">
                <div className="grid grid-cols-2 gap-2.5">
                    {tiles.map((t) => (
                        <div key={t.n} className="flex flex-col gap-1.5 rounded-xl p-3" style={PANEL}>
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-semibold tracking-[0.14em] text-white/35" style={{ fontFamily: MONO }}>{t.n}</span>
                                <Check color={t.c} />
                            </div>
                            <p className="text-[11px] text-white/55">{t.t}</p>
                            <p className="text-[18px] font-light leading-none tabular-nums text-white">{t.v}</p>
                            <p className="text-[10px] leading-snug text-white/40">{t.s}</p>
                        </div>
                    ))}
                </div>
                <div className="flex min-w-0 flex-col gap-2 rounded-xl p-3" style={PANEL}>
                    <div className="flex items-center justify-between"><Label>Happening now</Label><span className="text-[9.5px] text-white/35" style={{ fontFamily: MONO }}>no one lifted a finger</span></div>
                    <div className="flex flex-col gap-1.5">
                        <AnimatePresence initial={false} mode="popLayout">
                            {[0, 1, 2, 3].map((o) => {
                                const idx = (k - o + FEED.length * 100) % FEED.length;
                                return (
                                    <motion.div key={`${k - o}`} layout initial={{ opacity: 0, y: -8 }} animate={{ opacity: o === 0 ? 1 : 0.6 - o * 0.1, y: 0 }} exit={{ opacity: 0 }}
                                        transition={{ duration: 0.4, ease: EASE }} className="flex items-start gap-2 text-[10.5px] leading-snug text-white/75">
                                        <Dot color={CYAN} size={5} /><span className="-mt-0.5">{FEED[idx]}</span>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                    <div className="mt-auto flex flex-wrap gap-1 pt-1">
                        {["CRM", "Accounting", "Website", "Support", "Slack"].map((s) => (
                            <span key={s} className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9.5px] text-white/50" style={PANEL}><Dot size={4} />{s}</span>
                        ))}
                    </div>
                </div>
            </Window>
        </div>
    );
}

// ── Helm: Northwind Consulting's week, from Helm's own demo company ──────────

export function HelmMiniMock() {
    const { ref, live } = useLive();
    const [w, setW] = useState(12);
    useEvery(live, 2400, () => setW((x) => (x >= 12 ? 8 : x + 1)));
    const rows = SCORECARD.slice(0, 5);
    return (
        <div ref={ref} className="h-full">
            <Window title="helm / northwind-consulting" right={<LivePill label="Week 13" />} className="h-full" bodyClassName="flex flex-col gap-2.5 p-3">
                <div className="flex items-center justify-between rounded-lg px-3 py-2" style={PANEL}>
                    <span className="text-[11px] text-white/80">Monday Pulse Meeting · 9:00</span>
                    <Chip color={CYAN}>90 min</Chip>
                </div>
                <div className="flex flex-col overflow-hidden rounded-xl" style={PANEL}>
                    <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: `1px solid ${LINE}` }}>
                        <Label>Weekly scorecard</Label>
                        <span className="text-[9.5px] text-white/35" style={{ fontFamily: MONO }}>last 5 weeks</span>
                    </div>
                    {rows.map((m) => (
                        <div key={m.name} className="flex items-center gap-2 px-3 py-1.5 text-[10.5px]">
                            <Avatar initials={LEADERS[m.owner].initials} size={18} color={VIOLET} />
                            <span className="min-w-0 flex-1 truncate text-white/70">{m.name}</span>
                            {m.values.slice(w - 4, w + 1).map((v, i) => (
                                <span key={i} className="w-9 rounded py-0.5 text-center tabular-nums transition-colors"
                                    style={{ color: "var(--text-primary)", background: tint(onTarget(m, v) ? STATUS.on : STATUS.off, 14) }}>
                                    {fmt(m, v)}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-3" style={PANEL}>
                    <Label>90-day priorities</Label>
                    {PRIORITIES.slice(0, 3).map((p) => {
                        const done = p.milestones.filter((x) => x.done).length;
                        return (
                            <div key={p.id} className="flex items-center gap-2 text-[10.5px]">
                                <span className="min-w-0 flex-1 truncate text-white/70">{p.title}</span>
                                <div className="w-16"><Meter pct={(done / p.milestones.length) * 100} color={CYAN} /></div>
                                <span className="w-7 text-right tabular-nums text-white/50">{done}/{p.milestones.length}</span>
                            </div>
                        );
                    })}
                </div>
            </Window>
        </div>
    );
}

// ── Sable: Lanka Kitchen, from Sable's own demo restaurant ───────────────────

const BILLS = [
    { t: "T25 · Nugegoda", v: 5079.9 },
    { t: "Takeaway · Colombo 7", v: 2233 },
    { t: "PickMe · Nugegoda", v: 1450 },
    { t: "T8 · Colombo 7", v: 3120 },
    { t: "LankaQR · T12", v: 1850 },
];

export function SableMiniMock() {
    const { ref, live } = useLive();
    const [k, setK] = useState(0);
    useEvery(live, 1800, () => setK((x) => x + 1));
    const bills = [0, 1, 2].map((o) => BILLS[(k - o + BILLS.length * 100) % BILLS.length]);
    return (
        <div ref={ref} className="h-full">
            <Window title="sable / lanka-kitchen" right={<span className="text-[10px] text-white/40" style={{ fontFamily: MONO }}>EN · සිං · தமி</span>} className="h-full" bodyClassName="flex flex-col gap-2.5 p-3">
                <div className="rounded-xl p-3" style={PANEL}>
                    <div className="flex items-center justify-between"><Label>7:00 summary for the owner</Label><Chip color={STATUS.on}>WhatsApp</Chip></div>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-white/75">
                        Yesterday: <span className="text-white">Rs 486,200</span> from 331 covers, 6% above forecast. Food cost 31.4%.
                    </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <Stat label="Cash check" value="Rs 400" sub="short · Till 1" subColor={STATUS.warn} />
                    <Stat label="Waiting" value="Payroll" sub="to approve" />
                    <Stat label="Offline" value="Ready" sub="tills keep billing" subColor={STATUS.on} />
                </div>
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl" style={PANEL}>
                    <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: `1px solid ${LINE}` }}>
                        <Label>Bills closing now</Label><LivePill />
                    </div>
                    <AnimatePresence initial={false}>
                        {bills.map((b, o) => (
                            <motion.div key={`${k - o}`} layout initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }}
                                className="flex items-center gap-2 px-3 py-1.5 text-[10.5px]">
                                <Check size={11} />
                                <span className="min-w-0 flex-1 truncate text-white/70">{b.t}</span>
                                <span className="tabular-nums text-white/85">Rs {b.v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <p className="mt-auto px-3 pb-2 text-[9.5px] text-white/35">VAT and SSCL added in the right order on every bill</p>
                </div>
            </Window>
        </div>
    );
}
