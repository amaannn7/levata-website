"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

export type AutomationKind = "workflow" | "decision" | "intel";

const EASE = [0.16, 1, 0.3, 1] as const;
const MONO = "var(--font-code), ui-monospace, SFMono-Regular, Menlo, monospace";
const CYAN = "rgba(123, 85, 234";

function Frame({
    children,
    refEl,
    inView,
}: {
    children: React.ReactNode;
    refEl: React.RefObject<HTMLDivElement | null>;
    inView: boolean;
}) {
    return (
        <motion.div
            ref={refEl}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative w-full"
            style={{ aspectRatio: "5 / 4" }}
        >
            {children}
        </motion.div>
    );
}

// -
// 1. WORKFLOW -- horizontal process pipeline with flowing tokens
// -
function WorkflowScene({
    inView,
    reduced,
    refEl,
}: {
    inView: boolean;
    reduced: boolean;
    refEl: React.RefObject<HTMLDivElement | null>;
}) {
    const stages = [
        { x: 50, label: "INTAKE", sub: "form · email" },
        { x: 150, label: "ROUTE", sub: "rules" },
        { x: 250, label: "PROCESS", sub: "actions" },
        { x: 350, label: "DELIVER", sub: "to system" },
    ];

    return (
        <Frame refEl={refEl} inView={inView}>
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <svg viewBox="0 0 400 290" className="h-full w-full" fill="none">
                    {/* Title strip */}
                    <motion.g
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.4, delay: 0.05, ease: EASE }}
                    >
                        <text x="50" y="40" fontFamily={MONO} fontSize="7.5" letterSpacing="0.22em" fill="rgba(255,255,255,0.45)">
                             AUTOMATED WORKFLOW
                        </text>
                        <line x1="50" y1="48" x2="160" y2="48" stroke={`${CYAN}, 0.5)`} strokeWidth="0.8" />
                    </motion.g>

                    {/* Connector spine */}
                    <motion.line
                        x1="68" y1="140" x2="368" y2="140"
                        stroke="rgba(255,255,255,0.18)"
                        strokeWidth="1"
                        initial={{ pathLength: 0 }}
                        animate={inView ? { pathLength: 1 } : {}}
                        transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
                    />

                    {/* Flowing token */}
                    {!reduced && (
                        <motion.circle
                            r="3.5"
                            cy="140"
                            fill={`${CYAN}, 0.95)`}
                            initial={{ opacity: 0 }}
                            animate={inView ? {
                                cx: [68, 368, 68],
                                opacity: [0, 1, 1, 1, 0],
                            } : {}}
                            transition={{
                                cx: { duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
                                opacity: { duration: 4.2, repeat: Infinity, ease: "linear", delay: 0.6, times: [0, 0.05, 0.5, 0.95, 1] },
                            }}
                        />
                    )}

                    {/* Stage nodes */}
                    {stages.map((s, i) => (
                        <motion.g
                            key={s.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.4, delay: 0.18 + i * 0.06, ease: EASE }}
                        >
                            <circle cx={s.x} cy="140" r="22"
                                fill="rgba(20,22,28,0.98)"
                                stroke={`${CYAN}, 0.55)`} strokeWidth="1.4" />
                            <text x={s.x} y="143" textAnchor="middle"
                                fontFamily={MONO} fontSize="8" fontWeight="700" letterSpacing="0.12em" fill="white">
                                {String(i + 1).padStart(2, "0")}
                            </text>
                            <text x={s.x} y="180" textAnchor="middle"
                                fontFamily={MONO} fontSize="8.5" fontWeight="700" letterSpacing="0.18em" fill="rgba(255,255,255,0.85)">
                                {s.label}
                            </text>
                            <text x={s.x} y="192" textAnchor="middle"
                                fontFamily={MONO} fontSize="6.5" letterSpacing="0.14em" fill="rgba(255,255,255,0.4)">
                                {s.sub}
                            </text>
                        </motion.g>
                    ))}

                    {/* "Manual"  "Automated" callout above stages */}
                    <motion.g
                        initial={{ opacity: 0, y: -4 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.5, ease: EASE }}
                    >
                        <line x1="50" y1="100" x2="368" y2="100" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" strokeDasharray="2 4" />
                        <text x="50" y="92" fontFamily={MONO} fontSize="6.5" letterSpacing="0.16em" fill="rgba(255,255,255,0.35)">
                            FROM MANUAL ENTRY . 4 SYSTEMS
                        </text>
                        <text x="368" y="92" textAnchor="end" fontFamily={MONO} fontSize="6.5" letterSpacing="0.16em" fill={`${CYAN}, 0.85)`}>
                            ONE PIPE
                        </text>
                    </motion.g>

                    {/* Output / stats row */}
                    <motion.g
                        initial={{ opacity: 0, y: 6 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.55, ease: EASE }}
                    >
                        <text x="67"  y="240" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.3)">RUNS</text>
                        <text x="67"  y="256" textAnchor="middle" fontFamily={MONO} fontSize="15" fontWeight="700" fill="white">12,480</text>
                        <text x="67"  y="267" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.24)">this month</text>
                        <text x="200" y="240" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.3)">ERROR RATE</text>
                        <text x="200" y="256" textAnchor="middle" fontFamily={MONO} fontSize="15" fontWeight="700" fill={`${CYAN}, 0.95)`}>0.01%</text>
                        <text x="200" y="267" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.24)">auto-retried</text>
                        <text x="333" y="240" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.3)">HUMAN HOURS</text>
                        <text x="333" y="256" textAnchor="middle" fontFamily={MONO} fontSize="15" fontWeight="700" fill="white">420h</text>
                        <text x="333" y="267" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.24)">saved</text>
                    </motion.g>
                </svg>
            </div>
        </Frame>
    );
}

// -
// 2. DECISION -- AI branching tree with weighted paths
// -
function DecisionScene({
    inView,
    reduced,
    refEl,
}: {
    inView: boolean;
    reduced: boolean;
    refEl: React.RefObject<HTMLDivElement | null>;
}) {
    return (
        <Frame refEl={refEl} inView={inView}>
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <svg viewBox="0 0 400 340" className="h-full w-full" fill="none">
                    {/* Header label */}
                    <motion.g
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.4, delay: 0.05, ease: EASE }}
                    >
                        <text x="36" y="32" fontFamily={MONO} fontSize="7.5" letterSpacing="0.22em" fill="rgba(255,255,255,0.45)">
                             AI DECISION ENGINE
                        </text>
                        <line x1="36" y1="40" x2="180" y2="40" stroke={`${CYAN}, 0.5)`} strokeWidth="0.8" />
                    </motion.g>

                    {/* Input node */}
                    <motion.g
                        initial={{ opacity: 0, x: -8 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.45, delay: 0.12, ease: EASE }}
                    >
                        <rect x="34" y="138" width="80" height="36" rx="6"
                            fill="rgba(20,22,28,0.98)" stroke="rgba(255,255,255,0.36)" strokeWidth="1.2" />
                        <text x="74" y="155" textAnchor="middle" fontFamily={MONO} fontSize="8.5" fontWeight="700" letterSpacing="0.16em" fill="white">
                            EVENT IN
                        </text>
                        <text x="74" y="166" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.12em" fill="rgba(255,255,255,0.45)">
                            lead . ticket . alert
                        </text>
                    </motion.g>

                    {/* Decision diamond */}
                    <motion.g
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.5, delay: 0.22, ease: EASE }}
                        style={{ transformOrigin: "180px 156px" }}
                    >
                        {/* Pulsing aura */}
                        {!reduced && (
                            <motion.path
                                d="M180 116 L228 156 L180 196 L132 156 Z"
                                stroke={`${CYAN}, 0.5)`}
                                strokeWidth="1.2"
                                fill="none"
                                animate={{ opacity: [0.3, 0.8, 0.3] }}
                                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                            />
                        )}
                        <path d="M180 122 L222 156 L180 190 L138 156 Z"
                            fill={`${CYAN}, 0.1)`}
                            stroke={`${CYAN}, 0.85)`}
                            strokeWidth="1.5" strokeLinejoin="round" />
                        <text x="180" y="152" textAnchor="middle" fontFamily={MONO} fontSize="8.5" fontWeight="700" letterSpacing="0.16em" fill={`${CYAN}, 0.95)`}>
                            SCORE
                        </text>
                        <text x="180" y="166" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.14em" fill="rgba(255,255,255,0.5)">
                            + classify
                        </text>
                    </motion.g>

                    {/* Connector: input  diamond */}
                    <motion.line
                        x1="114" y1="156" x2="138" y2="156"
                        stroke="rgba(255,255,255,0.35)"
                        strokeWidth="1.2"
                        strokeDasharray="3 3"
                        initial={{ pathLength: 0 }}
                        animate={inView ? { pathLength: 1 } : {}}
                        transition={{ duration: 0.4, delay: 0.28, ease: EASE }}
                    />

                    {/* Three branches: priority / nurture / escalate */}
                    {[
                        { y: 56, label: "PRIORITY", sub: "hot · score ≥ 80", weight: "62%", accent: true },
                        { y: 142, label: "NURTURE", sub: "warm · 40–80", weight: "31%", accent: false },
                        { y: 228, label: "ESCALATE", sub: "needs review", weight: "7%", accent: false, warn: true },
                    ].map((b, i) => (
                        <motion.g
                            key={b.label}
                            initial={{ opacity: 0, x: 10 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.45, delay: 0.34 + i * 0.06, ease: EASE }}
                        >
                            {/* Path from diamond */}
                            <path
                                d={`M222 156 Q 260 156, 280 ${b.y + 18}`}
                                stroke={b.accent ? `${CYAN}, 0.7)` : "rgba(255,255,255,0.22)"}
                                strokeWidth={b.accent ? 1.4 : 1}
                                fill="none"
                                strokeDasharray={b.accent ? "0" : "3 4"}
                            />
                            {/* Branch box */}
                            <rect x="280" y={b.y} width="92" height="36" rx="6"
                                fill="rgba(20,22,28,0.98)"
                                stroke={b.accent ? `${CYAN}, 0.6)` : "rgba(255,255,255,0.28)"}
                                strokeWidth={b.accent ? 1.3 : 1} />
                            <text x="326" y={b.y + 16} textAnchor="middle"
                                fontFamily={MONO} fontSize="8" fontWeight="700" letterSpacing="0.16em"
                                fill={b.accent ? `${CYAN}, 0.95)` : (b.warn ? "rgba(255,168,72,0.92)" : "white")}>
                                {b.label}
                            </text>
                            <text x="326" y={b.y + 27} textAnchor="middle"
                                fontFamily={MONO} fontSize="6" letterSpacing="0.14em" fill="rgba(255,255,255,0.45)">
                                {b.sub}
                            </text>
                            {/* Weight badge */}
                            <rect x={b.accent ? 376 : 376} y={b.y + 4} width="20" height="12" rx="3"
                                fill={b.accent ? `${CYAN}, 0.15)` : "rgba(255,255,255,0.04)"}
                                stroke={b.accent ? `${CYAN}, 0.4)` : "rgba(255,255,255,0.12)"}
                                strokeWidth="0.7" />
                            <text x="386" y={b.y + 13} textAnchor="middle"
                                fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em"
                                fill={b.accent ? `${CYAN}, 0.95)` : "rgba(255,255,255,0.55)"}>
                                {b.weight}
                            </text>
                        </motion.g>
                    ))}

                    {/* Stat strip */}
                    <motion.g initial={{ opacity: 0, y: 5 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.65, ease: EASE }}>
                        <line x1="8" y1="276" x2="392" y2="276" stroke="rgba(255,255,255,0.05)" strokeWidth="0.7" />
                        <text x="67"  y="290" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.3)">DECISION TIME</text>
                        <text x="67"  y="306" textAnchor="middle" fontFamily={MONO} fontSize="15" fontWeight="700" fill="white">&lt;50ms</text>
                        <text x="67"  y="317" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.24)">per event</text>
                        <text x="200" y="290" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.3)">ROUTING ACCURACY</text>
                        <text x="200" y="306" textAnchor="middle" fontFamily={MONO} fontSize="15" fontWeight="700" fill={`${CYAN}, 0.9)`}>97%</text>
                        <text x="200" y="317" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.24)">correct first time</text>
                        <text x="333" y="290" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.3)">MANUAL REVIEW</text>
                        <text x="333" y="306" textAnchor="middle" fontFamily={MONO} fontSize="15" fontWeight="700" fill="white">7%</text>
                        <text x="333" y="317" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.24)">escalated only</text>
                    </motion.g>
                </svg>
            </div>
        </Frame>
    );
}

// -
// 3. INTEL -- live ops "command panel" with status indicators (no charts)
// -
function IntelScene({
    inView,
    reduced,
    refEl,
}: {
    inView: boolean;
    reduced: boolean;
    refEl: React.RefObject<HTMLDivElement | null>;
}) {
    const services = [
        { x: 36, y: 80, label: "PAYMENTS", status: "OK", ok: true },
        { x: 36, y: 130, label: "ORDERS", status: "OK", ok: true },
        { x: 36, y: 180, label: "INVENTORY", status: "WARN", ok: false },
        { x: 36, y: 230, label: "EMAIL", status: "OK", ok: true },
    ];

    return (
        <Frame refEl={refEl} inView={inView}>
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <svg viewBox="0 0 400 320" className="h-full w-full" fill="none">
                    {/* Header */}
                    <motion.g
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.4, delay: 0.05, ease: EASE }}
                    >
                        <text x="36" y="34" fontFamily={MONO} fontSize="7.5" letterSpacing="0.22em" fill="rgba(255,255,255,0.45)">
                             LIVE OPS . 24/7
                        </text>
                        <line x1="36" y1="42" x2="200" y2="42" stroke={`${CYAN}, 0.5)`} strokeWidth="0.8" />
                    </motion.g>

                    {/* Top-right live indicator */}
                    <motion.g
                        initial={{ opacity: 0, x: 6 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
                    >
                        {!reduced && (
                            <motion.circle
                                cx="338" cy="30" r="3"
                                fill={`${CYAN}, 0.95)`}
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                            />
                        )}
                        <text x="348" y="33" fontFamily={MONO} fontSize="7.5" fontWeight="700" letterSpacing="0.2em" fill="white">
                            LIVE
                        </text>
                    </motion.g>

                    {/* Left: service status list */}
                    {services.map((s, i) => (
                        <motion.g
                            key={s.label}
                            initial={{ opacity: 0, x: -8 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.4, delay: 0.14 + i * 0.05, ease: EASE }}
                        >
                            {/* Status dot */}
                            {!reduced ? (
                                <motion.circle
                                    cx={s.x + 6} cy={s.y + 12} r="3"
                                    fill={s.ok ? `${CYAN}, 0.95)` : "rgba(255,168,72,0.95)"}
                                    animate={{ opacity: [0.55, 1, 0.55] }}
                                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                                />
                            ) : (
                                <circle cx={s.x + 6} cy={s.y + 12} r="3" fill={s.ok ? `${CYAN}, 0.95)` : "rgba(255,168,72,0.95)"} />
                            )}
                            <text x={s.x + 18} y={s.y + 11} fontFamily={MONO} fontSize="9" fontWeight="700" letterSpacing="0.16em" fill="white">
                                {s.label}
                            </text>
                            <text x={s.x + 18} y={s.y + 22} fontFamily={MONO} fontSize="6.5" letterSpacing="0.14em" fill="rgba(255,255,255,0.4)">
                                {s.ok ? "all systems nominal" : "auto-retry in progress"}
                            </text>
                            <text x={s.x + 130} y={s.y + 13} fontFamily={MONO} fontSize="7" fontWeight="700" letterSpacing="0.12em" fill={s.ok ? `${CYAN}, 0.85)` : "rgba(255,168,72,0.85)"}>
                                {s.status}
                            </text>
                        </motion.g>
                    ))}

                    {/* Vertical divider */}
                    <motion.line
                        x1="206" y1="68" x2="206" y2="266"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="0.7"
                        initial={{ pathLength: 0 }}
                        animate={inView ? { pathLength: 1 } : {}}
                        transition={{ duration: 0.5, delay: 0.34, ease: EASE }}
                    />

                    {/* Right: alert / event log */}
                    <motion.g
                        initial={{ opacity: 0, x: 8 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.45, delay: 0.4, ease: EASE }}
                    >
                        <text x="222" y="80" fontFamily={MONO} fontSize="7" letterSpacing="0.22em" fill="rgba(255,255,255,0.45)">
                            EVENT FEED
                        </text>
                        {[
                            { t: "14:02", msg: "ORDER #4821 processed", ok: true },
                            { t: "14:01", msg: "INV-3992 paid . $1.2k", ok: true },
                            { t: "13:58", msg: "TICKET routed  tier-2", ok: true },
                            { t: "13:55", msg: "STOCK low . auto-PO sent", ok: false },
                            { t: "13:51", msg: "USER onboarded", ok: true },
                        ].map((e, i) => (
                            <g key={i}>
                                <text x="222" y={104 + i * 22} fontFamily={MONO} fontSize="6.5" letterSpacing="0.12em" fill="rgba(255,255,255,0.4)">
                                    {e.t}
                                </text>
                                <text x="252" y={104 + i * 22} fontFamily={MONO} fontSize="7" letterSpacing="0.06em" fill={e.ok ? "rgba(255,255,255,0.78)" : "rgba(255,168,72,0.85)"}>
                                    {e.msg}
                                </text>
                                <line x1="222" y1={108 + i * 22} x2="372" y2={108 + i * 22} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                            </g>
                        ))}
                    </motion.g>

                    {/* Bottom stat strip */}
                    <motion.g
                        initial={{ opacity: 0, y: 6 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.55, ease: EASE }}
                    >
                        <line x1="8" y1="268" x2="392" y2="268" stroke="rgba(255,255,255,0.05)" strokeWidth="0.7" />
                        <text x="67"  y="281" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.3)">UPTIME</text>
                        <text x="67"  y="297" textAnchor="middle" fontFamily={MONO} fontSize="15" fontWeight="700" fill={`${CYAN}, 0.95)`}>99.99%</text>
                        <text x="67"  y="308" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.24)">30-day avg</text>
                        <text x="200" y="281" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.3)">EVENTS/DAY</text>
                        <text x="200" y="297" textAnchor="middle" fontFamily={MONO} fontSize="15" fontWeight="700" fill="white">12,400</text>
                        <text x="200" y="308" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.24)">processed</text>
                        <text x="333" y="281" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.3)">AUTO-RESOLVED</text>
                        <text x="333" y="297" textAnchor="middle" fontFamily={MONO} fontSize="15" fontWeight="700" fill={`${CYAN}, 0.9)`}>94%</text>
                        <text x="333" y="308" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.24)">no human needed</text>
                    </motion.g>
                </svg>
            </div>
        </Frame>
    );
}

// - Public component -
export default function AutomationVisual({ kind }: { kind: AutomationKind }) {
    const ref = useRef<HTMLDivElement>(null);
    const observed = useInView(ref, { once: true, margin: "200px" });
    // Fallback: reveal even if the observer never fires (iOS Safari + smooth scroll).
    const [forced, setForced] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setForced(true), 600);
        return () => clearTimeout(t);
    }, []);
    const inView = observed || forced;
    const prefersReducedMotion = useReducedMotion();
    const reduced = !!prefersReducedMotion;

    if (kind === "workflow") return <WorkflowScene inView={inView} reduced={reduced} refEl={ref} />;
    if (kind === "decision") return <DecisionScene inView={inView} reduced={reduced} refEl={ref} />;
    return <IntelScene inView={inView} reduced={reduced} refEl={ref} />;
}
