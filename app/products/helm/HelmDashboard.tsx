"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import {
    AGENDA, EASE, HEALTH_AREAS, ISSUES, LEADERS, MONO, PRIORITIES, SCORECARD, STATUS, TODOS,
    fmt, fmtGoal, onTarget, tint,
    type Issue, type LeaderId, type Priority,
} from "./helmData";

type Todo = (typeof TODOS)[number];
type ViewId = "command" | "scorecard" | "priorities" | "issues" | "pulse";

// The demo sits in week 9 of a 13-week quarter: weeks 1–9 have numbers,
// weeks 10–13 are still ahead.
const WEEKS = 13;
const QUARTER_WEEK = 9;
const NOW = QUARTER_WEEK - 1; // index of the current week
const EXPECTED_PCT = Math.round((QUARTER_WEEK / WEEKS) * 100); // where priorities should be by now
const AUTOPLAY_MS = 9000;

const firstName = (id: LeaderId) => LEADERS[id].name.split(" ")[0];

// Scorecard's frozen first column: opaque, matching the card surface, with an edge.
const STICKY_BG = "color-mix(in srgb, var(--surface), white 2.5%)";
const STICKY_EDGE = "1px 0 0 rgba(255,255,255,0.06)";

const CARD: React.CSSProperties = {
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(255,255,255,0.07)",
};

// ── Small shared pieces ───────────────────────────────────────────────────────
function Avatar({ id, size = 22 }: { id: LeaderId; size?: number }) {
    return (
        <span
            title={`${LEADERS[id].name} · ${LEADERS[id].seat}`}
            className="flex flex-shrink-0 items-center justify-center rounded-full text-white/70 font-semibold"
            style={{ width: size, height: size, fontSize: size * 0.38, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", fontFamily: MONO }}
        >
            {LEADERS[id].initials}
        </span>
    );
}

function PanelTitle({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
    return (
        <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40" style={{ fontFamily: MONO }}>{children}</p>
            {right}
        </div>
    );
}

type Status = "on" | "off" | "done";
const priorityPct = (p: Priority) => Math.round((p.milestones.filter((m) => m.done).length / p.milestones.length) * 100);
const priorityStatus = (p: Priority): Status => {
    const pct = priorityPct(p);
    return pct === 100 ? "done" : pct >= EXPECTED_PCT - 10 ? "on" : "off";
};

function StatusMark({ status, size = 14 }: { status: Status; size?: number }) {
    const color = status === "off" ? STATUS.off : STATUS.on;
    return (
        <span className="flex flex-shrink-0 items-center justify-center rounded-full" style={{ width: size, height: size, background: tint(color, 16), border: `1px solid ${tint(color, 55)}` }}>
            <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 10 10" fill="none" aria-hidden>
                {status === "off"
                    ? <path d="M3 3l4 4M7 3l-4 4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
                    : <path d="M2 5.2l2 2L8 3" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />}
            </svg>
        </span>
    );
}

function StatusPill({ status }: { status: Status }) {
    const label = status === "done" ? "Done" : status === "on" ? "On track" : "Off track";
    return (
        <span className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium text-white/70 whitespace-nowrap"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <StatusMark status={status} size={12} />
            {label}
        </span>
    );
}

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
    return (
        <button
            type="button"
            role="checkbox"
            aria-checked={checked}
            aria-label={label}
            onClick={onChange}
            className="flex h-4 w-4 flex-shrink-0 cursor-pointer items-center justify-center rounded transition-colors duration-200"
            style={{ background: checked ? tint(STATUS.on, 18) : "transparent", border: `1px solid ${checked ? tint(STATUS.on, 60) : "rgba(255,255,255,0.22)"}` }}
        >
            {checked && (
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden>
                    <path d="M2 5.2l2 2L8 3" stroke={STATUS.on} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
        </button>
    );
}

// ── Nav icons ─────────────────────────────────────────────────────────────────
function NavIcon({ id }: { id: ViewId }) {
    const p = { stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
            {id === "command" && <><rect x="3" y="3" width="7" height="9" rx="1.5" {...p} /><rect x="14" y="3" width="7" height="5" rx="1.5" {...p} /><rect x="14" y="12" width="7" height="9" rx="1.5" {...p} /><rect x="3" y="16" width="7" height="5" rx="1.5" {...p} /></>}
            {id === "scorecard" && <><rect x="3" y="4" width="18" height="16" rx="2" {...p} /><path d="M3 10h18M9 4v16" {...p} /></>}
            {id === "priorities" && <><circle cx="12" cy="12" r="8" {...p} /><circle cx="12" cy="12" r="4" {...p} /><circle cx="12" cy="12" r="0.8" fill="currentColor" /></>}
            {id === "issues" && <><path d="M12 3l9 16H3L12 3z" {...p} /><path d="M12 10v4M12 17v.01" {...p} /></>}
            {id === "pulse" && <><circle cx="12" cy="13" r="8" {...p} /><path d="M12 9v4l2.5 2M9 2h6" {...p} /></>}
        </svg>
    );
}

// ── View: Command Centre ──────────────────────────────────────────────────────
function RevenueSpark() {
    const m = SCORECARD[0];
    const W = 320, H = 96, PAD = 6;
    const min = 95, max = 150;
    const x = (i: number) => PAD + (i / (WEEKS - 1)) * (W - PAD * 2);
    const y = (v: number) => H - PAD - ((v - min) / (max - min)) * (H - PAD * 2);
    const values = m.values.slice(0, NOW + 1);
    const pts = values.map((v, i) => `${x(i)},${y(v)}`).join(" ");
    const [hover, setHover] = useState<number | null>(null);
    const shown = hover ?? NOW;

    const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        const rel = ((e.clientX - r.left) / r.width) * W;
        setHover(Math.max(0, Math.min(NOW, Math.round(((rel - PAD) / (W - PAD * 2)) * (WEEKS - 1)))));
    };

    return (
        <div className="rounded-xl p-4" style={CARD}>
            <PanelTitle right={<span className="text-[10px] text-white/40" style={{ fontFamily: MONO }}>Goal {fmtGoal(m)} a week</span>}>
                Revenue booked · this quarter
            </PanelTitle>
            <div className="mb-2 flex items-baseline gap-2">
                <span className="text-2xl font-thin text-white tabular-nums">{fmt(m, m.values[shown])}</span>
                <span className="text-[11px] text-white/45">{shown === NOW ? "this week" : `week ${shown + 1}`}</span>
                <span className="ml-auto flex items-center gap-1.5 text-[11px] text-white/55">
                    <StatusMark status={onTarget(m, m.values[shown]) ? "on" : "off"} size={12} />
                    {onTarget(m, m.values[shown]) ? "On target" : "Off target"}
                </span>
            </div>
            <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-full cursor-crosshair touch-none"
                style={{ height: 96 }}
                onPointerMove={onMove}
                onPointerDown={onMove}
                onPointerLeave={() => setHover(null)}
                role="img"
                aria-label="Revenue booked each week this quarter against a goal of $120k"
            >
                <defs>
                    <linearGradient id="helmRevFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--accent-secondary)" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="var(--accent-secondary)" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {/* weeks still to come */}
                <rect x={x(NOW) + 6} y={PAD} width={x(WEEKS - 1) - x(NOW) - 6} height={H - PAD * 2} rx="4" fill="rgba(255,255,255,0.025)" />
                <line x1={PAD} x2={W - PAD} y1={y(m.goal)} y2={y(m.goal)} stroke="rgba(255,255,255,0.28)" strokeWidth="1" strokeDasharray="3 4" />
                <path d={`M${x(0)},${H - PAD} L${pts.replace(/ /g, " L")} L${x(NOW)},${H - PAD} Z`} fill="url(#helmRevFill)" />
                <polyline points={pts} stroke="var(--accent-secondary)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <line x1={x(shown)} x2={x(shown)} y1={PAD} y2={H - PAD} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
                <circle cx={x(shown)} cy={y(m.values[shown])} r="4.5" fill="var(--accent-secondary)" stroke="var(--home-card-bg)" strokeWidth="2" />
            </svg>
            <div className="mt-1.5 flex justify-between text-[10px] text-white/35" style={{ fontFamily: MONO }}>
                <span>W1</span><span>W5</span><span className="text-white/60">W9 · now</span><span>W13</span>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-[10px] text-white/35">
                <span aria-hidden className="inline-block w-4 border-t border-dashed" style={{ borderColor: "rgba(255,255,255,0.4)" }} />
                Dashed line = weekly goal. Shaded area = weeks still to come.
            </p>
        </div>
    );
}

function CommandCentreView({ todos, toggleTodo, issueCount, priorities }: {
    todos: Todo[]; toggleTodo: (id: string) => void; issueCount: number; priorities: Priority[];
}) {
    const health = Math.round(HEALTH_AREAS.reduce((s, a) => s + a.now, 0) / HEALTH_AREAS.length);
    const healthPrev = Math.round(HEALTH_AREAS.reduce((s, a) => s + a.prev, 0) / HEALTH_AREAS.length);
    const onCount = SCORECARD.filter((m) => onTarget(m, m.values[NOW])).length;
    const prOn = priorities.filter((p) => priorityStatus(p) !== "off").length;
    const [hoverArea, setHoverArea] = useState<string | null>(null);

    const kpis = [
        { label: "Company health", value: `${health}`, unit: "/100", sub: `▲ ${health - healthPrev} since last check` },
        { label: "Numbers on target", value: `${onCount}`, unit: `/${SCORECARD.length}`, sub: "This week" },
        { label: "Priorities on track", value: `${prOn}`, unit: `/${priorities.length}`, sub: `Week ${QUARTER_WEEK} of ${WEEKS}` },
        { label: "Last meeting rating", value: "9.2", unit: "/10", sub: "Finished on time" },
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                    <p className="text-[11px] text-white/40" style={{ fontFamily: MONO }}>Friday · Q4 · Week {QUARTER_WEEK} of {WEEKS}</p>
                    <p className="text-lg font-normal text-white">Good afternoon, Sarah</p>
                    <p className="text-[11px] text-white/45">This week&apos;s numbers are in. Here&apos;s where the company stands.</p>
                </div>
                <span className="text-[11px] text-white/40">Northwind Consulting · 25 people</span>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {kpis.map((k) => (
                    <div key={k.label} className="rounded-xl p-3.5" style={CARD}>
                        <p className="text-[10px] font-medium text-white/40">{k.label}</p>
                        <p className="mt-1.5 text-2xl font-thin leading-none text-white tabular-nums">
                            {k.value}<span className="text-sm text-white/35">{k.unit}</span>
                        </p>
                        <p className="mt-1.5 text-[10px] text-white/45" style={{ fontFamily: MONO }}>{k.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_1fr]">
                <div className="flex flex-col gap-4">
                    <div className="rounded-xl p-4" style={CARD}>
                        <PanelTitle right={<span className="text-[10px] text-white/35" style={{ fontFamily: MONO }}>vs last check</span>}>Health by area</PanelTitle>
                        <div className="flex flex-col gap-2.5">
                            {HEALTH_AREAS.map((a) => (
                                <div
                                    key={a.key}
                                    className="grid grid-cols-[64px_1fr_56px] items-center gap-3"
                                    onMouseEnter={() => setHoverArea(a.key)}
                                    onMouseLeave={() => setHoverArea(null)}
                                >
                                    <span className="text-[11px] text-white/60">{a.label}</span>
                                    <div className="relative h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                                        <motion.div
                                            className="absolute inset-y-0 left-0 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${a.now}%` }}
                                            transition={{ duration: 0.9, ease: EASE }}
                                            style={{ background: hoverArea && hoverArea !== a.key ? tint("var(--accent-secondary)", 35) : "var(--accent-secondary)" }}
                                        />
                                        <span className="absolute top-1/2 h-3 w-px -translate-y-1/2" style={{ left: `${a.prev}%`, background: "rgba(255,255,255,0.45)" }} />
                                    </div>
                                    <span className="text-right text-[11px] tabular-nums text-white/70" style={{ fontFamily: MONO }}>
                                        {a.now} <span className="text-white/35">+{a.now - a.prev}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-white/40">
                            <span className="flex items-center gap-1.5"><span aria-hidden className="h-1.5 w-4 rounded-full" style={{ background: "var(--accent-secondary)" }} />Score now (out of 100)</span>
                            <span className="flex items-center gap-1.5"><span aria-hidden className="h-3 w-px" style={{ background: "rgba(255,255,255,0.6)" }} />Last Health Check</span>
                        </p>
                    </div>
                    <RevenueSpark />
                </div>

                <div className="flex flex-col gap-4">
                    <div className="relative overflow-hidden rounded-xl p-4" style={{ background: tint("var(--accent)", 6), border: `1px solid ${tint("var(--accent)", 22)}` }}>
                        <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full" style={{ background: `radial-gradient(circle, ${tint("var(--accent)", 18)} 0%, transparent 70%)` }} />
                        <PanelTitle>Next Pulse Meeting</PanelTitle>
                        <p className="text-xl font-thin text-white">Monday 9:00</p>
                        <p className="mt-0.5 text-[11px] text-white/45" style={{ fontFamily: MONO }}>90 min · in 2 days</p>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                            <div className="rounded-lg px-3 py-2" style={CARD}>
                                <p className="text-lg font-thin text-white tabular-nums">{Math.min(3, issueCount)}</p>
                                <p className="text-[10px] text-white/45">issues to solve</p>
                            </div>
                            <div className="rounded-lg px-3 py-2" style={CARD}>
                                <p className="text-lg font-thin text-white tabular-nums">{todos.length}</p>
                                <p className="text-[10px] text-white/45">to-dos to review</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl p-4" style={CARD}>
                        <PanelTitle right={<span className="text-[10px] text-white/35" style={{ fontFamily: MONO }}>{todos.filter((t) => t.done).length}/{todos.length} done</span>}>
                            To-dos · 7 days
                        </PanelTitle>
                        <ul className="flex flex-col">
                            {todos.slice(0, 6).map((t) => (
                                <li key={t.id} className="flex items-center gap-2.5 border-t py-2 first:border-t-0 first:pt-0" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                                    <Checkbox checked={t.done} onChange={() => toggleTodo(t.id)} label={t.label} />
                                    <span className={`min-w-0 flex-1 truncate text-[12px] transition-colors ${t.done ? "text-white/35 line-through" : "text-white/75"}`}>{t.label}</span>
                                    <span className="flex-shrink-0 text-[11px] text-white/45">{firstName(t.owner)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── View: Scorecard ───────────────────────────────────────────────────────────
function ScorecardView() {
    const [cell, setCell] = useState<{ r: number; c: number } | null>(null);
    const onCount = SCORECARD.filter((m) => onTarget(m, m.values[NOW])).length;
    const scrollRef = useRef<HTMLDivElement>(null);

    // On narrow screens open the table scrolled to the current week, not week 1.
    useEffect(() => {
        const el = scrollRef.current;
        const now = el?.querySelector<HTMLElement>("[data-now]");
        if (!el || !now || el.scrollWidth <= el.clientWidth) return;
        el.scrollLeft = Math.max(0, now.offsetLeft + now.offsetWidth - el.clientWidth + 12);
    }, []);

    let inspector: React.ReactNode = (
        <>Week {QUARTER_WEEK} (this week): <span className="text-white/85">{onCount} of {SCORECARD.length}</span> numbers on target. Anything red goes straight onto Monday&apos;s issues list. Hover a cell for details.</>
    );
    if (cell) {
        const m = SCORECARD[cell.r];
        const v = m.values[cell.c];
        const ok = onTarget(m, v);
        inspector = (
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <StatusMark status={ok ? "on" : "off"} size={12} />
                <span className="text-white/85">{m.name}</span>
                <span>· Week {cell.c + 1} · {fmt(m, v)} against a goal of {fmtGoal(m)} · {ok ? "On target" : "Off target"} · Owner: {firstName(m.owner)}</span>
            </span>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-lg font-normal text-white">Weekly scorecard</p>
                    <p className="text-[11px] text-white/45">{SCORECARD.length} key numbers, one owner each, tracked every week of the quarter</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-white/55">
                    <span className="flex items-center gap-1.5"><StatusMark status="on" size={12} />On target</span>
                    <span className="flex items-center gap-1.5"><StatusMark status="off" size={12} />Off target</span>
                    <span className="flex items-center gap-1.5"><span aria-hidden className="h-3 w-3 rounded-[3px] border border-dashed" style={{ borderColor: "rgba(255,255,255,0.18)" }} />Weeks ahead</span>
                </div>
            </div>

            <p className="text-[10px] text-white/35 sm:hidden">Swipe the table sideways to see earlier weeks.</p>
            <div ref={scrollRef} className="helm-scroll overflow-x-auto rounded-xl" style={CARD} onMouseLeave={() => setCell(null)}>
                <table className="w-full min-w-[780px] border-separate text-[11px]" style={{ borderSpacing: 0 }}>
                    <thead>
                        <tr className="text-white/35" style={{ fontFamily: MONO }}>
                            <th className="sticky left-0 z-10 px-3 py-2.5 text-left font-medium" style={{ background: STICKY_BG, boxShadow: STICKY_EDGE }}>Number · owner · goal</th>
                            {Array.from({ length: WEEKS }, (_, i) => (
                                <th
                                    key={i}
                                    {...(i === NOW ? { "data-now": "" } : {})}
                                    className={`px-1 py-2.5 text-center font-medium ${i === NOW ? "text-white/85" : cell?.c === i ? "text-white/70" : ""}`}
                                >
                                    W{i + 1}{i === NOW && <span className="block text-[9px] text-white/50">now</span>}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {SCORECARD.map((m, r) => (
                            <tr key={m.name}>
                                <td className="sticky left-0 z-10 border-t px-3 py-1.5" style={{ background: STICKY_BG, boxShadow: STICKY_EDGE, borderColor: "rgba(255,255,255,0.05)" }}>
                                    <span className={`block whitespace-nowrap ${cell?.r === r ? "text-white" : "text-white/75"}`}>{m.name}</span>
                                    <span className="block whitespace-nowrap text-[10px] text-white/40">{firstName(m.owner)} · goal {fmtGoal(m)}</span>
                                </td>
                                {m.values.map((v, c) => {
                                    if (c > NOW) {
                                        return (
                                            <td key={c} className="border-t p-[2px]" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                                                <span aria-label={`Week ${c + 1}: not reached yet`} className="flex h-7 w-full min-w-[42px] items-center justify-center rounded-md border border-dashed text-white/20" style={{ borderColor: "rgba(255,255,255,0.08)" }}>–</span>
                                            </td>
                                        );
                                    }
                                    const ok = onTarget(m, v);
                                    const active = cell?.r === r && cell?.c === c;
                                    const color = ok ? STATUS.on : STATUS.off;
                                    return (
                                        <td key={c} className="border-t p-[2px]" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                                            <button
                                                type="button"
                                                onMouseEnter={() => setCell({ r, c })}
                                                onFocus={() => setCell({ r, c })}
                                                onClick={() => setCell({ r, c })}
                                                aria-label={`${m.name} week ${c + 1}: ${fmt(m, v)}, ${ok ? "on target" : "off target"}`}
                                                className="relative flex h-7 w-full min-w-[42px] cursor-default items-center justify-center rounded-md tabular-nums text-white/80 transition-colors duration-150"
                                                style={{
                                                    fontFamily: MONO,
                                                    background: tint(color, ok ? (active ? 22 : 8) : (active ? 34 : 18)),
                                                    outline: active ? `1px solid ${tint(color, 70)}` : c === NOW ? "1px solid rgba(255,255,255,0.22)" : "none",
                                                    opacity: cell && !active && cell.r !== r && cell.c !== c ? 0.5 : 1,
                                                }}
                                            >
                                                {fmt(m, v).replace("$", "")}
                                                {!ok && <span aria-hidden className="absolute right-1 top-1 h-1 w-1 rounded-full" style={{ background: STATUS.off }} />}
                                            </button>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="min-h-[2.5em] text-[11px] leading-relaxed text-white/50" aria-live="polite">{inspector}</p>
        </div>
    );
}

// ── View: Priorities ──────────────────────────────────────────────────────────
function PrioritiesView({ priorities, toggleMilestone }: { priorities: Priority[]; toggleMilestone: (pid: string, idx: number) => void }) {
    const [filter, setFilter] = useState<LeaderId | "all">("all");
    const [open, setOpen] = useState<string | null>("p4");
    const list = priorities.filter((p) => filter === "all" || p.owner === filter);
    const onCount = priorities.filter((p) => priorityStatus(p) !== "off").length;
    const quarterPct = Math.round((QUARTER_WEEK / 13) * 100);

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-lg font-normal text-white">90-day priorities</p>
                    <p className="text-[11px] text-white/45">{onCount} of {priorities.length} on track. The white tick on each bar is where it should be by week {QUARTER_WEEK}. Tap a priority to tick off milestones.</p>
                </div>
                <div className="w-full max-w-[220px]">
                    <div className="mb-1 flex justify-between text-[10px] text-white/40" style={{ fontFamily: MONO }}>
                        <span>Quarter progress</span><span>Week {QUARTER_WEEK} of {WEEKS}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div className="h-full rounded-full" style={{ width: `${quarterPct}%`, background: "rgba(255,255,255,0.5)" }} />
                    </div>
                </div>
            </div>

            <div className="helm-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
                {(["all", "sarah", "daniel", "priya", "marcus"] as const).map((f) => {
                    const active = filter === f;
                    return (
                        <button
                            key={f}
                            type="button"
                            onClick={() => setFilter(f)}
                            className="flex-shrink-0 cursor-pointer rounded-full px-3 py-1 text-[11px] font-medium transition-colors duration-200"
                            style={{
                                background: active ? "rgba(255,255,255,0.1)" : "transparent",
                                border: `1px solid ${active ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)"}`,
                                color: active ? "var(--text-primary)" : "var(--text-secondary)",
                            }}
                        >
                            {f === "all" ? "Everyone" : LEADERS[f].name.split(" ")[0]}
                        </button>
                    );
                })}
            </div>

            <ul className="flex flex-col gap-2">
                <AnimatePresence initial={false}>
                    {list.map((p) => {
                        const pct = priorityPct(p);
                        const st = priorityStatus(p);
                        const isOpen = open === p.id;
                        return (
                            <motion.li
                                key={p.id}
                                layout
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.25, ease: EASE }}
                                className="overflow-hidden rounded-xl"
                                style={{ ...CARD, borderColor: isOpen ? "rgba(255,255,255,0.16)" : CARD.border as string }}
                            >
                                <button type="button" onClick={() => setOpen(isOpen ? null : p.id)} aria-expanded={isOpen}
                                    className="flex w-full cursor-pointer flex-col gap-2.5 px-3.5 py-3 text-left">
                                    <span className="flex items-center gap-2.5">
                                        <span className="flex min-w-0 flex-1 flex-col">
                                            <span className="text-[13px] leading-snug text-white/85">{p.title}</span>
                                            <span className="text-[10px] text-white/40">{firstName(p.owner)} · {LEADERS[p.owner].seat}</span>
                                        </span>
                                        <span className="hidden sm:inline-flex"><StatusPill status={st} /></span>
                                    </span>
                                    <span className="flex items-center gap-3">
                                        <span className="relative h-1.5 flex-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                                            <motion.span
                                                className="absolute inset-y-0 left-0 rounded-full"
                                                animate={{ width: `${pct}%` }}
                                                transition={{ duration: 0.5, ease: EASE }}
                                                style={{ background: st === "off" ? STATUS.off : STATUS.on }}
                                            />
                                            <span aria-hidden title={`Expected by week ${QUARTER_WEEK}`} className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 rounded-full" style={{ left: `${EXPECTED_PCT}%`, background: "rgba(255,255,255,0.7)" }} />
                                        </span>
                                        <span className="w-9 text-right text-[11px] tabular-nums text-white/60" style={{ fontFamily: MONO }}>{pct}%</span>
                                        <span className="sm:hidden"><StatusMark status={st} size={14} /></span>
                                    </span>
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: EASE }} className="overflow-hidden">
                                            <ul className="flex flex-col gap-2 border-t px-3.5 py-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                                                {p.milestones.map((ms, idx) => (
                                                    <li key={ms.label} className="flex items-center gap-2.5">
                                                        <Checkbox checked={ms.done} onChange={() => toggleMilestone(p.id, idx)} label={ms.label} />
                                                        <span className={`text-[12px] ${ms.done ? "text-white/40 line-through" : "text-white/70"}`}>{ms.label}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.li>
                        );
                    })}
                </AnimatePresence>
            </ul>
        </div>
    );
}

// ── View: Issues ──────────────────────────────────────────────────────────────
function IssuesView({ issues, move, solve, reset }: {
    issues: Issue[]; move: (id: string, dir: -1 | 1) => void; solve: (issue: Issue) => void; reset: () => void;
}) {
    const [open, setOpen] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 2600);
        return () => clearTimeout(t);
    }, [toast]);

    const arrowBtn = "flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border border-white/[0.08] text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white disabled:cursor-default disabled:opacity-25 disabled:hover:bg-transparent";

    return (
        <div className="relative flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-lg font-normal text-white">Issues list</p>
                    <p className="text-[11px] text-white/45">Use the arrows to rank what matters most. The top three get solved on Monday, one at a time.</p>
                </div>
                <span className="text-[11px] text-white/40" style={{ fontFamily: MONO }}>{issues.length} open</span>
            </div>

            {issues.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-xl px-4 py-12 text-center" style={CARD}>
                    <StatusMark status="done" size={28} />
                    <p className="text-[13px] text-white/75">Issues list is clear. Every one became a to-do with an owner.</p>
                    <button type="button" onClick={reset} className="cursor-pointer text-[12px] font-medium text-white/50 transition-colors hover:text-white/80">Reset the demo →</button>
                </div>
            ) : (
                <ul className="flex flex-col gap-2">
                    <AnimatePresence initial={false}>
                        {issues.map((iss, i) => {
                            const top = i < 3;
                            const isOpen = open === iss.id;
                            return (
                                <motion.li
                                    key={iss.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, x: 24, transition: { duration: 0.25 } }}
                                    transition={{ layout: { duration: 0.3, ease: EASE } }}
                                    className="relative overflow-hidden rounded-xl"
                                    style={{ ...CARD, borderColor: isOpen ? "rgba(255,255,255,0.16)" : CARD.border as string }}
                                >
                                    {top && <span aria-hidden className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full" style={{ background: "var(--accent-secondary)" }} />}
                                    <div className="flex items-center gap-2 px-3 py-2.5">
                                        <span className="w-5 text-center text-[11px] tabular-nums text-white/40" style={{ fontFamily: MONO }}>{i + 1}</span>
                                        <div className="flex flex-col">
                                            <button type="button" aria-label="Move up" className={arrowBtn} disabled={i === 0} onClick={() => move(iss.id, -1)}>
                                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden><path d="M2 6.5L5 3.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            </button>
                                            <button type="button" aria-label="Move down" className={arrowBtn} disabled={i === issues.length - 1} onClick={() => move(iss.id, 1)}>
                                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden><path d="M2 3.5L5 6.5l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            </button>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[13px] leading-snug text-white/85">{iss.title}</p>
                                            <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-white/40">
                                                Raised by {LEADERS[iss.owner].name.split(" ")[0]}
                                                {top && <><span>·</span><span className="text-white/60">Top 3</span></>}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setOpen(isOpen ? null : iss.id)}
                                            aria-expanded={isOpen}
                                            className="flex-shrink-0 cursor-pointer rounded-full px-3 py-1 text-[11px] font-semibold text-white/80 transition-colors duration-200 hover:bg-white/[0.08]"
                                            style={{ border: "1px solid rgba(255,255,255,0.16)" }}
                                        >
                                            {isOpen ? "Close" : "Solve"}
                                        </button>
                                    </div>
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: EASE }} className="overflow-hidden">
                                                <div className="grid grid-cols-1 gap-2 border-t px-3.5 py-3 sm:grid-cols-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                                                    {[
                                                        { step: "01 Identify", body: iss.cause },
                                                        { step: "02 Discuss", body: "Each leader says it once. No repeating, no speeches." },
                                                        { step: "03 Solve", body: iss.todo },
                                                    ].map((s) => (
                                                        <div key={s.step} className="rounded-lg p-2.5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                                                            <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40" style={{ fontFamily: MONO }}>{s.step}</p>
                                                            <p className="text-[12px] leading-relaxed text-white/65">{s.body}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 pb-3">
                                                    <span className="flex items-center gap-2 text-[11px] text-white/50">
                                                        <Avatar id={iss.todoOwner} size={18} /> To-do for {LEADERS[iss.todoOwner].name.split(" ")[0]} · due in 7 days
                                                    </span>
                                                    <button
                                                        type="button"
                                                        data-cta="primary"
                                                        onClick={() => { solve(iss); setOpen(null); setToast(`To-do created for ${LEADERS[iss.todoOwner].name.split(" ")[0]}, due next Monday`); }}
                                                        className="cursor-pointer rounded-full px-4 py-1.5 text-[11px] font-semibold text-white"
                                                    >
                                                        Mark solved
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.li>
                            );
                        })}
                    </AnimatePresence>
                </ul>
            )}

            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="pointer-events-none absolute bottom-0 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-[11px] text-white/85"
                        style={{ background: "var(--surface-elevated)", border: `1px solid ${tint(STATUS.on, 40)}`, boxShadow: "0 12px 32px rgba(0,0,0,0.5)" }}
                        role="status"
                    >
                        <StatusMark status="done" size={14} /> {toast}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ── View: Pulse Meeting ───────────────────────────────────────────────────────
const TOTAL_MIN = AGENDA.reduce((s, a) => s + a.minutes, 0);
const SIM_MIN_PER_SEC = 3; // 90-minute meeting plays in 30 seconds

function PulseView({ issueCount, todoCount, onCount }: { issueCount: number; todoCount: number; onCount: number }) {
    const [elapsed, setElapsed] = useState(0);
    const [running, setRunning] = useState(false);
    const [rating, setRating] = useState<number | null>(null);
    const finished = elapsed >= TOTAL_MIN;

    useEffect(() => {
        if (!running) return;
        const id = setInterval(() => {
            setElapsed((e) => {
                const next = e + SIM_MIN_PER_SEC / 10;
                if (next >= TOTAL_MIN) { setRunning(false); return TOTAL_MIN; }
                return next;
            });
        }, 100);
        return () => clearInterval(id);
    }, [running]);

    const starts = AGENDA.reduce<number[]>((acc, a, i) => [...acc, i === 0 ? 0 : acc[i - 1] + AGENDA[i - 1].minutes], []);
    const current = finished ? AGENDA.length - 1 : starts.reduce((cur, s, i) => (elapsed >= s ? i : cur), 0);
    const mm = (n: number) => `${String(Math.floor(n)).padStart(2, "0")}:${String(Math.floor((n % 1) * 60)).padStart(2, "0")}`;

    const jump = (i: number) => { setElapsed(starts[i]); setRating(null); };
    const reset = () => { setRunning(false); setElapsed(0); setRating(null); };

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.1fr]">
            <div className="flex flex-col gap-3">
                <div>
                    <p className="text-lg font-normal text-white">Pulse Meeting</p>
                    <p className="text-[11px] text-white/45">Same agenda every Monday. Most of the time goes on solving.</p>
                </div>
                <ol className="flex flex-col gap-1">
                    {AGENDA.map((a, i) => {
                        const segPct = Math.max(0, Math.min(1, (elapsed - starts[i]) / a.minutes));
                        const active = i === current && (running || elapsed > 0) && !finished;
                        return (
                            <li key={a.label}>
                                <button
                                    type="button"
                                    onClick={() => jump(i)}
                                    className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors duration-200 hover:bg-white/[0.03]"
                                    style={{ background: active ? "rgba(255,255,255,0.05)" : undefined, border: `1px solid ${active ? "rgba(255,255,255,0.12)" : "transparent"}` }}
                                >
                                    <span className="w-5 text-[10px] tabular-nums text-white/35" style={{ fontFamily: MONO }}>{String(i + 1).padStart(2, "0")}</span>
                                    <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                                        <span className="flex items-center justify-between gap-2">
                                            <span className={`text-[12px] ${active ? "text-white" : segPct === 1 ? "text-white/45" : "text-white/70"}`}>{a.label}</span>
                                            <span className="text-[10px] tabular-nums text-white/40" style={{ fontFamily: MONO }}>{a.minutes} min</span>
                                        </span>
                                        <span className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                                            <span className="block h-full rounded-full" style={{ width: `${segPct * 100}%`, background: segPct === 1 ? "rgba(255,255,255,0.35)" : "var(--accent-secondary)" }} />
                                        </span>
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ol>
            </div>

            <div className="flex flex-col gap-3">
                <div className="relative overflow-hidden rounded-xl p-5" style={CARD}>
                    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${tint("var(--accent-secondary)", 40)}, transparent)` }} />
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40" style={{ fontFamily: MONO }}>
                            {finished ? "Meeting complete" : running ? "In progress" : elapsed > 0 ? "Paused" : "Ready"}
                        </p>
                        {running && (
                            <span className="flex items-center gap-1.5 text-[10px] text-white/45" style={{ fontFamily: MONO }}>
                                <motion.span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent-secondary)" }} animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
                                Live
                            </span>
                        )}
                    </div>
                    <p className="mt-3 text-4xl font-thin tabular-nums text-white sm:text-5xl">
                        {mm(elapsed)}<span className="text-white/25"> / {TOTAL_MIN}:00</span>
                    </p>
                    <p className="mt-2 text-[13px] text-white/80">{AGENDA[current].label}</p>
                    <p className="mt-0.5 min-h-[2.6em] text-[12px] leading-relaxed text-white/45">{AGENDA[current].note}</p>

                    {/* Whole-meeting bar: segment widths follow the agenda minutes */}
                    <div className="mt-4 flex h-2 gap-[2px]" aria-hidden>
                        {AGENDA.map((a, i) => {
                            const segPct = Math.max(0, Math.min(1, (elapsed - starts[i]) / a.minutes));
                            return (
                                <span key={a.label} className="relative overflow-hidden rounded-full" style={{ flex: a.minutes, background: "rgba(255,255,255,0.07)" }}>
                                    <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${segPct * 100}%`, background: "var(--accent-secondary)" }} />
                                </span>
                            );
                        })}
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                        {!finished && (
                            <button
                                type="button"
                                data-cta="primary"
                                onClick={() => setRunning((r) => !r)}
                                className="cursor-pointer rounded-full px-5 py-2 text-[12px] font-semibold text-white"
                            >
                                {running ? "Pause" : elapsed > 0 ? "Resume" : "Start meeting"}
                            </button>
                        )}
                        {elapsed > 0 && (
                            <button type="button" onClick={reset} className="cursor-pointer text-[12px] font-medium text-white/50 transition-colors hover:text-white/80">
                                Reset
                            </button>
                        )}
                        {!running && elapsed === 0 && <span className="text-[10px] text-white/35">Plays 90 min in 30 sec</span>}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {finished ? (
                        <motion.div key="rate" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} className="rounded-xl p-4" style={CARD}>
                            {rating === null ? (
                                <>
                                    <PanelTitle>Rate this meeting</PanelTitle>
                                    <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-10">
                                        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                                            <button key={n} type="button" onClick={() => setRating(n)}
                                                className="h-8 cursor-pointer rounded-md text-[12px] tabular-nums text-white/70 transition-colors hover:bg-white/[0.1] hover:text-white"
                                                style={{ border: "1px solid rgba(255,255,255,0.1)", fontFamily: MONO }}>
                                                {n}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-start gap-3">
                                    <StatusMark status="done" size={22} />
                                    <div>
                                        <p className="text-[13px] text-white/85">Recap sent to all 4 leaders</p>
                                        <p className="mt-1 text-[12px] leading-relaxed text-white/50">
                                            You rated it {rating}/10. Decisions, new to-dos and owners are written up, so nobody leaves wondering what was agreed.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div key="live" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} className="grid grid-cols-3 gap-2">
                            {[
                                { v: `${onCount}/${SCORECARD.length}`, l: "numbers on target" },
                                { v: Math.min(3, issueCount), l: "issues to solve" },
                                { v: todoCount, l: "to-dos to review" },
                            ].map((s) => (
                                <div key={s.l} className="rounded-xl p-3" style={CARD}>
                                    <p className="text-xl font-thin tabular-nums text-white">{s.v}</p>
                                    <p className="text-[10px] leading-tight text-white/45">{s.l}</p>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// ── App frame ─────────────────────────────────────────────────────────────────
const VIEWS: { id: ViewId; label: string }[] = [
    { id: "command", label: "Command Centre" },
    { id: "scorecard", label: "Scorecard" },
    { id: "priorities", label: "Priorities" },
    { id: "issues", label: "Issues" },
    { id: "pulse", label: "Pulse Meeting" },
];

const clonePriorities = () => PRIORITIES.map((p) => ({ ...p, milestones: p.milestones.map((m) => ({ ...m })) }));

export default function HelmDashboard() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { margin: "-15% 0px" });
    const reduced = !!useReducedMotion();

    const [view, setView] = useState<ViewId>("command");
    // No automatic tour: each view shows in full at its own height, so it may only
    // change size when the visitor picks a view, never on its own while they read.
    const [autoplay, setAutoplay] = useState(false);
    const [todos, setTodos] = useState<Todo[]>(() => TODOS.map((t) => ({ ...t })));
    const [priorities, setPriorities] = useState<Priority[]>(clonePriorities);
    const [issues, setIssues] = useState<Issue[]>(ISSUES);

    const touring = autoplay && inView && !reduced;
    useEffect(() => {
        if (!touring) return;
        const t = setTimeout(() => {
            setView((v) => VIEWS[(VIEWS.findIndex((x) => x.id === v) + 1) % VIEWS.length].id);
        }, AUTOPLAY_MS);
        return () => clearTimeout(t);
    }, [touring, view]);

    const stopTour = () => setAutoplay(false);
    const pick = (id: ViewId) => { stopTour(); setView(id); };

    const onCount = useMemo(() => SCORECARD.filter((m) => onTarget(m, m.values[NOW])).length, []);

    const toggleTodo = (id: string) => setTodos((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    const toggleMilestone = (pid: string, idx: number) =>
        setPriorities((ps) => ps.map((p) => (p.id !== pid ? p : { ...p, milestones: p.milestones.map((m, i) => (i === idx ? { ...m, done: !m.done } : m)) })));
    const moveIssue = (id: string, dir: -1 | 1) => setIssues((list) => {
        const i = list.findIndex((x) => x.id === id);
        const j = i + dir;
        if (j < 0 || j >= list.length) return list;
        const next = [...list];
        [next[i], next[j]] = [next[j], next[i]];
        return next;
    });
    const solveIssue = (iss: Issue) => {
        setIssues((list) => list.filter((x) => x.id !== iss.id));
        setTodos((ts) => [{ id: `todo-${iss.id}`, label: iss.todo, owner: iss.todoOwner, due: "Due Mon", done: false }, ...ts]);
    };
    const resetIssues = () => {
        setIssues(ISSUES);
        setTodos(TODOS.map((t) => ({ ...t })));
    };

    return (
        <div
            data-reveal
            ref={ref}
            className="relative mx-auto w-full max-w-[1120px]"
            data-no-reveal
        >
            <div aria-hidden className="pointer-events-none absolute -inset-x-10 -top-10 bottom-0 -z-10 rounded-[40px]"
                style={{ background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${tint("var(--accent)", 14)} 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 90%, ${tint("var(--accent-secondary)", 7)} 0%, transparent 70%)` }} />

            <div
                className="relative overflow-hidden rounded-2xl"
                style={{ background: "var(--home-card-bg)", border: "1px solid rgba(255,255,255,0.09)", boxShadow: `0 30px 90px rgba(0,0,0,0.55), 0 0 0 1px ${tint("var(--accent)", 6)}` }}
                onPointerDown={stopTour}
            >
                {/* Window bar */}
                <div className="flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="hidden gap-1.5 sm:flex">
                            {[0, 1, 2].map((i) => <span key={i} className="h-2.5 w-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />)}
                        </div>
                        <span className="flex items-center gap-2 truncate text-[11px] text-white/50" style={{ fontFamily: MONO }}>
                            <span className="text-white/80">helm</span>
                            <span className="text-white/25">/</span>
                            <span className="truncate">northwind-consulting</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hidden text-[10px] text-white/40 md:inline" style={{ fontFamily: MONO }}>Q4 · Week {QUARTER_WEEK} of 13</span>
                        <div className="flex -space-x-1.5">
                            {(Object.keys(LEADERS) as LeaderId[]).map((id) => <Avatar key={id} id={id} size={20} />)}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[196px_1fr]">
                    {/* Sidebar (desktop) / tab strip (mobile) */}
                    <nav aria-label="Helm demo views" className="border-b md:border-b-0 md:border-r" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                        <div className="helm-scroll flex gap-1 overflow-x-auto p-2 md:flex-col md:p-3" role="tablist">
                            {VIEWS.map((v) => {
                                const active = v.id === view;
                                return (
                                    <button
                                        key={v.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={active}
                                        onClick={() => pick(v.id)}
                                        className="relative flex flex-shrink-0 cursor-pointer items-center gap-2.5 overflow-hidden rounded-lg px-3 py-2 text-left text-[12px] font-medium transition-colors duration-200"
                                        style={{
                                            background: active ? "rgba(255,255,255,0.06)" : "transparent",
                                            color: active ? "var(--text-primary)" : "var(--text-muted)",
                                        }}
                                    >
                                        {active && <motion.span layoutId="helm-nav-marker" aria-hidden className="absolute left-0 top-1/2 hidden h-4 w-[3px] -translate-y-1/2 rounded-r-full md:block" style={{ background: "var(--accent-secondary)" }} />}
                                        <NavIcon id={v.id} />
                                        <span className="whitespace-nowrap">{v.label}</span>
                                        {active && touring && (
                                            <motion.span
                                                key={`${v.id}-progress`}
                                                aria-hidden
                                                className="absolute bottom-0 left-0 h-px"
                                                style={{ background: tint("var(--accent-secondary)", 70) }}
                                                initial={{ width: "0%" }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="hidden px-5 pb-4 pt-6 md:block">
                            <p className="text-[10px] leading-relaxed text-white/30">
                                {autoplay ? "Touring the demo. Click anything to take over." : "Demo data for Northwind Consulting, a made-up 25-person consultancy."}
                            </p>
                        </div>
                    </nav>

                    {/* Content */}
                    <div className="relative min-h-[560px] p-4 sm:p-5 md:p-6" role="tabpanel">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={view}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.3, ease: EASE }}
                            >
                                {view === "command" && <CommandCentreView todos={todos} toggleTodo={toggleTodo} issueCount={issues.length} priorities={priorities} />}
                                {view === "scorecard" && <ScorecardView />}
                                {view === "priorities" && <PrioritiesView priorities={priorities} toggleMilestone={toggleMilestone} />}
                                {view === "issues" && <IssuesView issues={issues} move={moveIssue} solve={solveIssue} reset={resetIssues} />}
                                {view === "pulse" && <PulseView issueCount={issues.length} todoCount={todos.length} onCount={onCount} />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
