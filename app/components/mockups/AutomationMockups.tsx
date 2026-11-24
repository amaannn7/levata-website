"use client";

// Automation & Systems service mockups. Company names and figures are illustrative.

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Avatar, Check, Chip, CYAN, Dot, EASE, Label, LINE, LivePill, Meter, MONO, PANEL,
    Spark, Stat, STATUS, tint, useEvery, useLive, VIOLET, Window,
} from "./kit";

// ── Problem: one customer, five systems, five different answers ───────────────

const SILOS = [
    { app: "CRM", says: "Active customer · renewal due", note: "Updated by Sam, 3 days ago", c: STATUS.on },
    { app: "Finance", says: "Invoice $4,200 overdue 31 days", note: "Export from accounting, Monday", c: STATUS.off },
    { app: "Support", says: "3 open tickets · 1 urgent", note: "Nobody in sales can see this", c: STATUS.warn },
    { app: "Ops", says: "Order #5521 on hold", note: "Spreadsheet, copied by hand", c: STATUS.warn },
    { app: "Reporting", says: "Revenue: last refreshed 6 days ago", note: "Built manually every Friday", c: STATUS.off },
];

export function AutomationSilosMock() {
    const { ref, live } = useLive();
    const [hl, setHl] = useState(0);
    useEvery(live, 1400, () => setHl((x) => (x + 1) % SILOS.length));
    return (
        <div ref={ref}>
            <Window title="customer: halden & co · 5 tabs open" className="w-full" bodyClassName="flex flex-col gap-2 p-3">
                <div className="flex items-center gap-1 overflow-hidden" style={{ fontFamily: MONO }}>
                    {SILOS.map((s, i) => (
                        <span key={s.app} className="truncate rounded-t-md px-2 py-1 text-[9.5px] transition-colors"
                            style={{ background: i === hl ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.025)", color: i === hl ? "var(--text-primary)" : "var(--text-muted)" }}>
                            {s.app}
                        </span>
                    ))}
                </div>
                {SILOS.map((s, i) => (
                    <motion.div key={s.app} animate={{ opacity: i === hl ? 1 : 0.55, x: i === hl ? 4 : 0 }} transition={{ duration: 0.35, ease: EASE }}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5" style={{ ...PANEL, borderColor: i === hl ? tint(s.c, 35) : LINE }}>
                        <span className="w-16 flex-shrink-0 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45" style={{ fontFamily: MONO }}>{s.app}</span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-[11.5px] text-white/85">{s.says}</p>
                            <p className="truncate text-[9.5px] text-white/35">{s.note}</p>
                        </div>
                        <Dot color={s.c} />
                    </motion.div>
                ))}
                <div className="mt-1 flex items-center justify-between rounded-lg px-3 py-2 text-[10.5px]" style={{ background: tint(STATUS.off, 8), border: `1px solid ${tint(STATUS.off, 25)}` }}>
                    <span className="text-white/70">Same customer. Five systems. No one sees the whole picture.</span>
                    <span className="flex-shrink-0 pl-2 tabular-nums text-white/55">0 synced</span>
                </div>
            </Window>
        </div>
    );
}

// ── 01. Workflow Automation: a new lead runs through the whole flow ───────────

const STEPS = [
    { t: "New enquiry from website form", d: "Trigger", ms: "0.0s" },
    { t: "Company enriched · 48 staff, logistics", d: "Enrich", ms: "0.6s" },
    { t: "Scored 86 / 100 against your ICP", d: "Score", ms: "0.9s" },
    { t: "Deal created in CRM · $18k", d: "CRM", ms: "1.2s" },
    { t: "Assigned to Daniel (Sales, EMEA)", d: "Route", ms: "1.3s" },
    { t: "Personal follow-up email sent", d: "Email", ms: "1.8s" },
    { t: "Team alerted in Slack #new-deals", d: "Alert", ms: "1.9s" },
];
const LEADS = ["Brightline Logistics", "Orbis Dental Group", "Kestrel Foods", "Marlow Architects"];

export function WorkflowAutomationMock({ compact = false }: { compact?: boolean }) {
    const { ref, live } = useLive();
    const [step, setStep] = useState(STEPS.length);
    const [run, setRun] = useState(2817);
    const [approved, setApproved] = useState(false);
    useEvery(live, 650, () => {
        if (step >= STEPS.length + 4) {
            setRun((r) => r + 1);
            setApproved(false);
            setStep(0);
            return;
        }
        if (step === STEPS.length + 1) setApproved(true);
        setStep(step + 1);
    });
    const lead = LEADS[run % LEADS.length];
    const visible = compact ? STEPS.slice(0, 5) : STEPS;

    return (
        <div ref={ref} className={compact ? "h-full" : ""}>
            <Window title={`automations / new-lead-flow · run #${run}`} right={<LivePill label="Running" />}
                className={compact ? "h-full" : "w-full"} bodyClassName="flex flex-col">
                <div className="flex items-center gap-2 px-3.5 py-2.5" style={{ borderBottom: `1px solid ${LINE}` }}>
                    <Avatar initials={lead.slice(0, 2).toUpperCase()} color={VIOLET} />
                    <span className="truncate text-[11.5px] text-white/85">{lead}</span>
                    <span className="ml-auto text-[10px] tabular-nums text-white/40" style={{ fontFamily: MONO }}>
                        {Math.min(step, STEPS.length)}/{STEPS.length} steps
                    </span>
                </div>
                <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-hidden p-3">
                    {visible.map((s, i) => {
                        const state = i < step ? "done" : i === step ? "run" : "wait";
                        return (
                            <div key={s.d} className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 transition-colors"
                                style={{ background: state === "run" ? tint(CYAN, 7) : "transparent" }}>
                                <span className="relative flex h-4 w-4 flex-shrink-0 items-center justify-center">
                                    {state === "done" ? <Check size={14} /> : state === "run" ? <Dot pulse color={CYAN} size={7} /> :
                                        <span className="h-2 w-2 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.2)" }} />}
                                </span>
                                <span className="w-12 flex-shrink-0 text-[9.5px] uppercase tracking-[0.1em] text-white/35" style={{ fontFamily: MONO }}>{s.d}</span>
                                <span className={`min-w-0 flex-1 truncate text-[11px] ${state === "wait" ? "text-white/30" : "text-white/80"}`}>{s.t}</span>
                                {!compact && <span className="text-[9.5px] tabular-nums text-white/30" style={{ fontFamily: MONO }}>{state === "done" ? s.ms : ""}</span>}
                            </div>
                        );
                    })}
                </div>
                {!compact && (
                    <div className="flex flex-col gap-2 p-3 pt-0">
                        <div className="flex h-10 items-center gap-2 rounded-lg px-3" style={{ ...PANEL, borderColor: tint(STATUS.warn, 30) }}>
                            <Dot color={STATUS.warn} />
                            <span className="min-w-0 flex-1 truncate text-[10.5px] text-white/70">Approval: 15% discount asked on this deal</span>
                            <AnimatePresence mode="wait">
                                {approved ? (
                                    <motion.span key="a" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Chip><Check size={10} />Approved by manager</Chip></motion.span>
                                ) : (
                                    <motion.span key="b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-md px-2 py-0.5 text-[10px] font-semibold text-white" style={{ background: "var(--accent-gradient)" }}>Approve</motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <Stat label="Runs this month" value={run.toLocaleString("en-US")} />
                            <Stat label="Success" value="99.6%" sub="errors retry + alert" />
                            <Stat label="Hours saved" value="212h" sub="this month" />
                        </div>
                    </div>
                )}
            </Window>
        </div>
    );
}

// ── 02. Dashboard Systems: leadership dashboard fed by every system ───────────

const REV = [182, 188, 185, 196, 203, 199, 214, 221, 218, 232, 241, 248];

export function DashboardSystemMock() {
    const { ref, live } = useLive();
    const [t, setT] = useState(0);
    const [alert, setAlert] = useState(false);
    useEvery(live, 1800, () => {
        setT((x) => x + 1);
        setAlert((a) => !a);
    });
    const revenue = 248_300 + t * 1_240;
    const sla = alert ? 88 : 93;

    return (
        <div ref={ref}>
            <Window title="dashboards / leadership" right={<span className="flex items-center gap-2 text-[10px] text-white/40"><span className="hidden sm:inline">Viewing as: Leadership</span><LivePill /></span>}
                className="aspect-[5/4] w-full" bodyClassName="flex flex-col gap-2.5 p-3">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <Stat label="Revenue MTD" value={`$${Math.round(revenue / 1000)}k`} sub="103% of target" subColor={STATUS.on} />
                    <Stat label="Gross margin" value="41.8%" sub="+1.2 pts" subColor={STATUS.on} />
                    <Stat label="Cash" value="$1.42M" sub="6.8 months runway" />
                    <Stat label="Pipeline" value="$3.1M" sub="146 open deals" />
                </div>
                <div className="grid min-h-0 flex-1 grid-cols-5 gap-2">
                    <div className="col-span-3 flex flex-col rounded-xl p-3" style={PANEL}>
                        <div className="flex items-center justify-between"><Label>Revenue · 12 months</Label><span className="text-[10px] text-white/40">USD</span></div>
                        <div className="mt-auto"><Spark values={[...REV.slice(0, -1), REV[REV.length - 1] + (t % 3)]} height={78} /></div>
                    </div>
                    <div className="col-span-2 flex flex-col gap-2 rounded-xl p-3" style={PANEL}>
                        <Label>Operations</Label>
                        {[
                            { l: "Orders shipped on time", v: 97, c: STATUS.on },
                            { l: "Support within SLA", v: sla, c: sla < 90 ? STATUS.warn : STATUS.on },
                            { l: "Stock accuracy", v: 95, c: STATUS.on },
                        ].map((m) => (
                            <div key={m.l}>
                                <div className="mb-1 flex justify-between text-[10px]"><span className="truncate text-white/55">{m.l}</span><span className="tabular-nums text-white/80">{m.v}%</span></div>
                                <Meter pct={m.v} color={m.c} />
                            </div>
                        ))}
                    </div>
                </div>
                <AnimatePresence>
                    {alert && (
                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-[10.5px]" style={{ background: tint(STATUS.warn, 8), border: `1px solid ${tint(STATUS.warn, 28)}` }}>
                            <Dot color={STATUS.warn} pulse />
                            <span className="min-w-0 flex-1 truncate text-white/75">Support SLA fell below 90%. Alert sent to the Ops lead.</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="flex items-center justify-between text-[9.5px] text-white/35" style={{ fontFamily: MONO }}>
                    <span className="truncate">CRM · Accounting · Store · Support desk</span>
                    <span className="flex-shrink-0 pl-2">synced {t % 2 ? "just now" : "1 min ago"}</span>
                </div>
            </Window>
        </div>
    );
}
