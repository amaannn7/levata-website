"use client";

// Sales Intelligence Platform workspace mockup. One tab per capability on the
// product page. Leads and figures are illustrative.

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Avatar, Caret, Check, Chip, CYAN, Dot, EASE, Label, LINE, LivePill, Meter, MONO, PANEL,
    STATUS, useEvery, useLive, useTyped, VIOLET, Window,
} from "./kit";

export const SALES_TABS = ["Research", "Scoring", "Email", "Call script", "Queue", "CRM sync"] as const;

const LEADS = [
    { co: "Meridian Group", who: "James Chen", role: "VP Sales", score: 94, ind: "SaaS · 220 staff" },
    { co: "Vantage Capital", who: "Ruth Adler", role: "CEO", score: 88, ind: "Finance · 85 staff" },
    { co: "Crestline Corp", who: "Omar Haddad", role: "RevOps Lead", score: 71, ind: "Logistics · 410 staff" },
    { co: "Nexford Ltd", who: "Grace Liu", role: "Dir. Sales", score: 65, ind: "Manufacturing · 150 staff" },
    { co: "Pinnacle Co", who: "Ben Ortiz", role: "Head of BD", score: 58, ind: "Agency · 40 staff" },
];

const scoreColor = (s: number) => (s >= 85 ? STATUS.on : s >= 70 ? CYAN : STATUS.warn);

function Research() {
    const items = [
        { k: "Company", v: "B2B SaaS, 220 staff, raised a $12M Series B in October." },
        { k: "Pain point", v: "Outbound team doubled; reps spend ~3h a day researching." },
        { k: "Buying signal", v: "Hiring 6 SDRs · new VP Sales started 5 weeks ago." },
        { k: "Opening hook", v: "Congrats on the Series B: how are you ramping the new SDRs?" },
        { k: "Discovery questions", v: "How long until a new rep books a first meeting? Who owns lead research today?" },
    ];
    return (
        <div className="flex flex-col gap-1.5">
            {items.map((it, i) => (
                <motion.div key={it.k} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.35, duration: 0.35, ease: EASE }}
                    className="rounded-lg px-3 py-2" style={PANEL}>
                    <Label>{it.k}</Label>
                    <p className="mt-0.5 text-[11px] leading-snug text-white/80">{it.v}</p>
                </motion.div>
            ))}
        </div>
    );
}

function Scoring() {
    const parts = [{ k: "Industry fit", v: 96 }, { k: "Role / seniority", v: 92 }, { k: "Company size", v: 88 }, { k: "Engagement", v: 81 }];
    return (
        <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3 rounded-xl p-3" style={PANEL}>
                <span className="text-[28px] font-light leading-none tabular-nums text-white">94</span>
                <div className="text-[10.5px] leading-snug text-white/55">Matches your ideal customer profile.<br /><span className="text-white/80">Contact first today.</span></div>
            </div>
            {parts.map((p, i) => (
                <div key={p.k}>
                    <div className="mb-1 flex justify-between text-[10.5px]"><span className="text-white/60">{p.k}</span><span className="tabular-nums text-white/85">{p.v}</span></div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.2 }}><Meter pct={p.v} color={CYAN} /></motion.div>
                </div>
            ))}
        </div>
    );
}

const EMAIL = "Hi James, congrats on the Series B. Doubling an outbound team usually means new reps spend their first month researching instead of selling. We cut that to minutes for teams like Northbeam. Worth a 15-minute look next week?";

function Email({ live }: { live: boolean }) {
    const typed = useTyped(EMAIL, live, 70);
    return (
        <div className="flex flex-col gap-2">
            <div className="rounded-lg px-3 py-2 text-[10.5px] text-white/55" style={PANEL}>
                <span className="text-white/35">Subject: </span><span className="text-white/85">Ramping your new SDRs</span>
            </div>
            <p className="min-h-[96px] rounded-lg px-3 py-2 text-[11px] leading-relaxed text-white/80" style={PANEL}>
                {typed}{typed.length < EMAIL.length && <Caret />}
            </p>
            <div className="flex flex-wrap gap-1.5">
                {["Day 1 · Intro", "Day 3 · Follow-up", "Day 7 · Case study", "Day 14 · Breakup"].map((s, i) => (
                    <Chip key={s} color={i === 0 ? CYAN : "var(--text-muted)"}>{s}</Chip>
                ))}
            </div>
        </div>
    );
}

function Script() {
    const lines = [
        { k: "Opener", v: "\"James, it's Sam at Fieldnote. You're scaling the SDR team after the raise, right?\"" },
        { k: "Discovery", v: "How long until a new rep books their first meeting today?" },
        { k: "Objection", v: "\"We already have a data tool.\" → Data isn't research. Show a brief side by side." },
        { k: "Close", v: "Offer a 2-week pilot with 3 of the new reps." },
    ];
    return (
        <div className="flex flex-col gap-1.5">
            {lines.map((l, i) => (
                <motion.div key={l.k} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.3, duration: 0.35 }}
                    className="flex gap-2.5 rounded-lg px-3 py-2" style={PANEL}>
                    <span className="w-16 flex-shrink-0 text-[9.5px] uppercase tracking-[0.12em] text-white/35" style={{ fontFamily: MONO }}>{l.k}</span>
                    <span className="text-[11px] leading-snug text-white/80">{l.v}</span>
                </motion.div>
            ))}
        </div>
    );
}

function Queue() {
    const rows = [
        { t: "Call James Chen · Meridian", why: "Opened email 3x today", c: STATUS.on },
        { t: "Follow up Ruth Adler · Vantage", why: "Day 3 follow-up due", c: CYAN },
        { t: "Email Omar Haddad · Crestline", why: "New: hiring RevOps", c: CYAN },
        { t: "Send case study · Nexford", why: "Asked for proof", c: STATUS.warn },
        { t: "Breakup email · Pinnacle", why: "No reply in 14 days", c: "var(--text-muted)" },
    ];
    return (
        <div className="flex flex-col gap-1.5">
            <div className="grid grid-cols-3 gap-2 text-center">
                {[{ l: "Calls", v: 6 }, { l: "Emails", v: 14 }, { l: "Follow-ups", v: 5 }].map((s) => (
                    <div key={s.l} className="rounded-lg py-1.5" style={PANEL}><p className="text-[15px] tabular-nums text-white">{s.v}</p><Label>{s.l}</Label></div>
                ))}
            </div>
            {rows.map((r, i) => (
                <motion.div key={r.t} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 }}
                    className="flex items-center gap-2 rounded-lg px-3 py-1.5" style={PANEL}>
                    <span className="w-4 text-[10px] tabular-nums text-white/35">{i + 1}</span>
                    <span className="min-w-0 flex-1 truncate text-[11px] text-white/80">{r.t}</span>
                    <span className="hidden truncate text-[9.5px] sm:inline" style={{ color: r.c }}>{r.why}</span>
                </motion.div>
            ))}
        </div>
    );
}

function Sync({ live }: { live: boolean }) {
    const [n, setN] = useState(0);
    useEvery(live && n < 4, 600, () => setN((x) => x + 1));
    const recs = ["Meridian Group · deal $42k · Proposal", "Vantage Capital · deal $18k · Discovery", "Crestline Corp · contact + notes", "Call logged · 14 min · James Chen"];
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between rounded-lg px-3 py-2" style={PANEL}>
                <span className="text-[11px] text-white/80">Pushing to your CRM</span>
                <span className="text-[10px] tabular-nums text-white/45">{n}/4</span>
            </div>
            {recs.map((r, i) => (
                <div key={r} className="flex items-center gap-2 rounded-lg px-3 py-2 transition-opacity" style={{ ...PANEL, opacity: i < (live ? n : 4) ? 1 : 0.3 }}>
                    {i < (live ? n : 4) ? <Check /> : <span className="h-3 w-3 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.2)" }} />}
                    <span className="min-w-0 flex-1 truncate text-[11px] text-white/75">{r}</span>
                </div>
            ))}
            <p className="mt-1 text-[10px] text-white/40">Two-way sync · no copy and paste</p>
        </div>
    );
}

export function SalesWorkspaceMock({
    compact = false,
    active,
    onChange,
    autoplay = true,
    className = "",
}: {
    compact?: boolean;
    active?: number;
    onChange?: (i: number) => void;
    autoplay?: boolean;
    className?: string;
}) {
    const { ref, live } = useLive();
    const [own, setOwn] = useState(0);
    const [auto, setAuto] = useState(true);
    const tab = active ?? own;
    const setTab = (i: number) => {
        setAuto(false);
        if (onChange) onChange(i);
        else setOwn(i);
    };
    const touring = live && auto && autoplay;
    useEvery(touring, 5200, () => {
        const next = (tab + 1) % SALES_TABS.length;
        if (onChange) onChange(next);
        else setOwn(next);
    });
    const lead = LEADS[0];

    return (
        <div ref={ref} className={`${compact ? "h-full" : ""} ${className}`}>
            <Window title="sales-intelligence / workspace" right={<LivePill />} className={compact ? "h-full" : "w-full"} bodyClassName="flex">
                {/* lead queue */}
                <div className={`${compact ? "hidden" : "hidden md:flex"} w-[34%] flex-shrink-0 flex-col`} style={{ borderRight: `1px solid ${LINE}` }}>
                    <div className="px-3 py-2.5"><Label>Lead queue · by score</Label></div>
                    {LEADS.map((l, i) => (
                        <div key={l.co} className="flex items-center gap-2 px-3 py-2" style={{ background: i === 0 ? "rgba(255,255,255,0.05)" : "transparent", borderLeft: `2px solid ${i === 0 ? CYAN : "transparent"}` }}>
                            <Avatar initials={l.co[0]} color={VIOLET} />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-[11px] text-white/85">{l.co}</p>
                                <p className="truncate text-[9.5px] text-white/35">{l.role}</p>
                            </div>
                            <span className="text-[11px] tabular-nums" style={{ color: scoreColor(l.score) }}>{l.score}</span>
                        </div>
                    ))}
                    <div className="mt-auto grid grid-cols-2 gap-2 p-3">
                        <div className="rounded-lg px-2 py-1.5" style={PANEL}><Label>Researched</Label><p className="text-[14px] tabular-nums text-white">148</p></div>
                        <div className="rounded-lg px-2 py-1.5" style={PANEL}><Label>Replies</Label><p className="text-[14px] tabular-nums text-white">12.4%</p></div>
                    </div>
                </div>
                {/* workspace */}
                <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-center gap-2.5 px-3.5 py-2.5" style={{ borderBottom: `1px solid ${LINE}` }}>
                        <Avatar initials={lead.co[0]} color={VIOLET} size={26} />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-[12px] text-white/90">{lead.co} · {lead.who}</p>
                            <p className="truncate text-[10px] text-white/40">{lead.role} · {lead.ind}</p>
                        </div>
                        <Chip color={STATUS.on}><Dot size={4} />Score {lead.score}</Chip>
                    </div>
                    <div className="flex gap-1 overflow-x-auto px-2.5 pt-2" role="tablist" style={{ scrollbarWidth: "none" }}>
                        {SALES_TABS.map((t, i) => (
                            <button key={t} type="button" role="tab" aria-selected={tab === i} onClick={() => setTab(i)}
                                className="relative flex-shrink-0 rounded-md px-2 py-1 text-[10.5px] transition-colors"
                                style={{ background: tab === i ? "rgba(255,255,255,0.07)" : "transparent", color: tab === i ? "var(--text-primary)" : "var(--text-muted)" }}>
                                {t}
                                {tab === i && touring && (
                                    <motion.span key={`p${i}`} className="absolute inset-x-1 -bottom-px h-px origin-left" style={{ background: CYAN }}
                                        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 5.2, ease: "linear" }} />
                                )}
                            </button>
                        ))}
                    </div>
                    <div className={`relative min-h-0 flex-1 overflow-hidden p-3 ${compact ? "" : "h-[340px] flex-none"}`}>
                        <AnimatePresence mode="wait">
                            <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
                                {tab === 0 && <Research />}
                                {tab === 1 && <Scoring />}
                                {tab === 2 && <Email live={live} />}
                                {tab === 3 && <Script />}
                                {tab === 4 && <Queue />}
                                {tab === 5 && <Sync live={live} />}
                            </motion.div>
                        </AnimatePresence>
                        {compact && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8" style={{ background: "linear-gradient(transparent, var(--surface))" }} />}
                    </div>
                </div>
            </Window>
        </div>
    );
}

