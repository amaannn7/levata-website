"use client";

// Product Engineering service mockups. Products and figures are illustrative.

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Check, Chip, CYAN, Dot, EASE, Label, LivePill, Meter, MONO, PANEL,
    Spark, Stat, STATUS, tint, useEvery, useLive, VIOLET, Window,
} from "./kit";

// ── Problem: built for a year before anyone used it ───────────────────────────

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

export function ProductProblemMock() {
    const { ref, live } = useLive();
    const [m, setM] = useState(MONTHS.length);
    useEvery(live, 450, () => setM((x) => (x >= MONTHS.length + 6 ? 1 : x + 1)));
    const shown = Math.min(m, MONTHS.length);
    const spent = Math.round(shown * 28.5);
    const launched = m > MONTHS.length;
    return (
        <div ref={ref}>
            <Window title="project / v1-launch" right={<Chip color={launched ? STATUS.off : STATUS.warn}>{launched ? "Launched" : "In build"}</Chip>} className="w-full" bodyClassName="flex flex-col gap-2.5 p-3">
                <div className="grid grid-cols-3 gap-2">
                    <Stat label="Months building" value={shown} />
                    <Stat label="Budget spent" value={`$${spent}k`} subColor={STATUS.warn} sub="of $300k" />
                    <Stat label="Features" value={Math.round(shown * 4.2)} sub="none tested" />
                </div>
                <div className="rounded-xl p-3" style={PANEL}>
                    <Label className="mb-2">Timeline</Label>
                    <div className="flex gap-1">
                        {MONTHS.map((mo, i) => (
                            <div key={mo} className="flex flex-1 flex-col items-center gap-1">
                                <div className="h-6 w-full rounded transition-colors duration-300" style={{ background: i < shown ? tint(STATUS.warn, 35) : "rgba(255,255,255,0.05)" }} />
                                <span className="text-[8.5px] text-white/30" style={{ fontFamily: MONO }}>{mo}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-white/45">
                        <Dot color={STATUS.off} size={5} /> Customer interviews before building: <span className="text-white/80">0</span>
                    </div>
                </div>
                {/* Always laid out (faded until launch) so the window never changes height. */}
                <motion.div initial={false} animate={{ opacity: launched ? 1 : 0.4 }} transition={{ duration: 0.4, ease: EASE }}
                            className="flex flex-col gap-2 rounded-xl p-3" style={{ background: tint(STATUS.off, 7), border: `1px solid ${tint(STATUS.off, 25)}` }}>
                            <Label>{launched ? "Launch, 30 days later" : "Launch results · not launched yet"}</Label>
                            {[
                                { l: "Signed up", v: 212, pct: 100 },
                                { l: "Used it twice", v: 31, pct: 15 },
                                { l: "Still active", v: 9, pct: 4 },
                            ].map((r) => (
                                <div key={r.l} className="flex items-center gap-2 text-[10.5px]">
                                    <span className="w-24 text-white/60">{r.l}</span>
                                    <div className="flex-1"><Meter pct={launched ? r.pct : 0} color={STATUS.off} /></div>
                                    <span className="w-8 text-right tabular-nums text-white/85">{launched ? r.v : "–"}</span>
                                </div>
                            ))}
                </motion.div>
            </Window>
        </div>
    );
}

// ── 01. MVP Development: validate in weeks, with real usage data ──────────────

const SPRINT = ["Discover", "Prototype", "Build", "Test", "Launch", "Learn"];
const FEEDBACK = [
    { q: "\"I'd pay for this if it synced with our calendar.\"", tag: "Integration" },
    { q: "\"Invites for my team, please.\"", tag: "Team invites" },
    { q: "\"Setup took 3 minutes. Love it.\"", tag: "Onboarding" },
    { q: "\"Can I export the report as PDF?\"", tag: "Export" },
];

export function MVPMock() {
    const { ref, live } = useLive();
    const [k, setK] = useState(0);
    useEvery(live, 1600, () => setK((x) => x + 1));
    const week = 5;
    const signups = 640 + k * 3;
    const fb = FEEDBACK[k % FEEDBACK.length];
    return (
        <div ref={ref}>
            <Window title="mvp / validation · week 5 of 6" right={<LivePill />} className="aspect-[5/4] w-full" bodyClassName="flex flex-col gap-2.5 p-3">
                <div className="flex gap-1">
                    {SPRINT.map((s, i) => (
                        <div key={s} className="flex flex-1 flex-col gap-1">
                            <div className="h-1.5 rounded-full" style={{ background: i < week - 1 ? CYAN : i === week - 1 ? tint(CYAN, 45) : "rgba(255,255,255,0.07)" }} />
                            <span className={`truncate text-[9px] ${i === week - 1 ? "text-white/80" : "text-white/35"}`}>{s}</span>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <Stat label="Waitlist" value={signups.toLocaleString("en-US")} sub="from 2 landing pages" />
                    <Stat label="Activated" value="47%" sub="did the key action" subColor={STATUS.on} />
                    <Stat label="Interviews" value="24" sub="target users" />
                </div>
                <div className="grid min-h-0 flex-1 grid-cols-2 gap-2">
                    <div className="flex flex-col gap-2 rounded-xl p-3" style={PANEL}>
                        <Label>Pricing test</Label>
                        {[{ p: "$29 / mo", v: 6.1, w: false }, { p: "$49 / mo", v: 5.4, w: true }].map((o) => (
                            <div key={o.p}>
                                <div className="mb-1 flex justify-between text-[10.5px]"><span className="text-white/70">{o.p}</span><span className="tabular-nums text-white/85">{o.v}% buy</span></div>
                                <Meter pct={o.v * 12} color={o.w ? CYAN : "rgba(255,255,255,0.25)"} />
                            </div>
                        ))}
                        <p className="mt-auto text-[10px] leading-snug text-white/50">$49 earns <span className="text-white/85">50% more</span> per visitor. Ship $49.</p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-3" style={PANEL}>
                        <Label>User feedback</Label>
                        <AnimatePresence mode="wait">
                            <motion.div key={k} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="flex flex-col gap-1.5">
                                <p className="text-[10.5px] leading-snug text-white/75">{fb.q}</p>
                                <Chip color={VIOLET} className="w-fit">{fb.tag}</Chip>
                            </motion.div>
                        </AnimatePresence>
                        <p className="mt-auto text-[10px] text-white/45">Most asked: <span className="text-white/80">Team invites (64%)</span></p>
                    </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-[10.5px]" style={{ background: tint(CYAN, 6), border: `1px solid ${tint(CYAN, 22)}` }}>
                    <Check />
                    <span className="min-w-0 flex-1 truncate text-white/75">Demand proven. Next sprint: team invites, then calendar sync.</span>
                </div>
            </Window>
        </div>
    );
}

// ── 02. SaaS Product Development: the product, its growth and its health ──────

const MRR = [18, 21, 23, 26, 30, 33, 37, 41, 46, 52, 57, 63];
const DEPLOYS = [
    { v: "v2.4.0", note: "Team workspaces", c: STATUS.on },
    { v: "v2.4.1", note: "Faster report export", c: STATUS.on },
    { v: "v2.5.0", note: "SSO for Enterprise plan", c: CYAN },
];

export function SaaSMock({ compact = false }: { compact?: boolean }) {
    const { ref, live } = useLive();
    const [k, setK] = useState(0);
    const [rollout, setRollout] = useState(25);
    useEvery(live, 1500, () => {
        setK((x) => x + 1);
        setRollout((r) => (r >= 100 ? 25 : r + 25));
    });
    const d = DEPLOYS[k % DEPLOYS.length];
    const mrr = 63_400 + k * 180;
    return (
        <div ref={ref} className={compact ? "h-full" : ""}>
            <Window title="app.fieldnote.io / admin" right={<LivePill />} className={compact ? "h-full" : "aspect-[5/4] w-full"} bodyClassName="flex flex-col gap-2.5 p-3">
                <div className={`grid gap-2 ${compact ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4"}`}>
                    <Stat label="MRR" value={`$${(mrr / 1000).toFixed(1)}k`} sub="+10.6% this month" subColor={STATUS.on} />
                    <Stat label="Accounts" value="1,842" sub="214 on Team" />
                    <Stat label="Churn" value="1.9%" sub="monthly" />
                    {!compact && <Stat label="Uptime" value="99.99%" sub="p95 140ms" subColor={STATUS.on} />}
                </div>
                <div className="flex min-h-0 flex-1 flex-col rounded-xl p-3" style={PANEL}>
                    <div className="flex items-center justify-between"><Label>MRR · 12 months</Label><span className="text-[10px] text-white/40">USD, thousands</span></div>
                    <div className="mt-auto"><Spark values={[...MRR.slice(0, -1), MRR[MRR.length - 1] + (k % 3) * 0.4]} height={compact ? 46 : 70} color={CYAN} /></div>
                </div>
                {!compact && (
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-2 rounded-xl p-3" style={PANEL}>
                            <Label>Feature flag · AI summaries</Label>
                            <div className="flex items-center gap-2">
                                <div className="flex-1"><Meter pct={rollout} color={VIOLET} /></div>
                                <span className="w-9 text-right text-[10.5px] tabular-nums text-white/85">{rollout}%</span>
                            </div>
                            <span className="text-[10px] text-white/45">Rolling out to {rollout === 100 ? "everyone" : "Team plans first"}</span>
                        </div>
                        <div className="flex flex-col gap-1.5 rounded-xl p-3" style={PANEL}>
                            <Label>Plans</Label>
                            {[{ p: "Starter", n: 1210 }, { p: "Team", n: 214 }, { p: "Enterprise", n: 18 }].map((r) => (
                                <span key={r.p} className="flex justify-between text-[10.5px]"><span className="text-white/60">{r.p}</span><span className="tabular-nums text-white/85">{r.n}</span></span>
                            ))}
                        </div>
                    </div>
                )}
                <motion.div key={k} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-[10.5px]" style={PANEL}>
                    <Dot color={d.c} />
                    <span className="text-white/45" style={{ fontFamily: MONO }}>{d.v}</span>
                    <span className="min-w-0 flex-1 truncate text-white/75">deployed · {d.note}</span>
                    <span className="text-[9.5px] text-white/35">0 downtime</span>
                </motion.div>
            </Window>
        </div>
    );
}

