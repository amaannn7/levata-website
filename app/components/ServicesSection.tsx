"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const BLUE = "#7B55EA";
const EASE = [0.16, 1, 0.3, 1] as const;

// ── Kept exports, used by HeroSection ────────────────────────────────────
export function ArrowIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function CircleArrow({ label = "Learn More", prominent = false }: { accent?: string; label?: string; prominent?: boolean }) {
    return (
        <span className="group/cta inline-flex items-center gap-4">
            <span className={`font-semibold uppercase tracking-[0.22em] text-white transition-colors group-hover/cta:text-white ${prominent ? "text-base" : "text-xs text-white/80"}`}>
                {label}
            </span>
            <span className={`flex items-center justify-center rounded-full border text-white transition-all duration-300 group-hover/cta:border-[#7B55EA]/50 group-hover/cta:shadow-[0_0_18px_rgba(123, 85, 234,0.35)] ${prominent ? "h-12 w-12 border-white/30" : "h-10 w-10 border-white/15"}`}>
                <span className="transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:drop-shadow-[0_0_6px_#7B55EA]">
                    <ArrowIcon />
                </span>
            </span>
        </span>
    );
}

// ── Kept mockup exports, used by HeroSection ─────────────────────────────
export function DashboardMockup({ accent }: { accent: string }) {
    return (
        <div className="relative h-full w-full">
            <div className="absolute right-[-4%] top-[8%] h-[78%] w-[88%] rounded-[14px] border border-white/10 p-3" style={{ background: "rgba(12,4,32,0.95)" }}>
                <div className="flex h-full gap-3">
                    <div className="flex w-[22%] flex-col gap-2 rounded-md p-3" style={{ background: `${accent}10` }}>
                        <div className="h-2 w-full rounded-full bg-white/12" />
                        <div className="h-2 w-3/4 rounded-full bg-white/8" />
                        <div className="mt-2 h-2 w-full rounded-full bg-white/8" />
                        <div className="h-2 w-2/3 rounded-full bg-white/8" />
                        <div className="mt-2 h-2 w-full rounded-full" style={{ background: accent, opacity: 0.6 }} />
                        <div className="h-2 w-3/5 rounded-full bg-white/8" />
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                        <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((i) => (<div key={i} className="h-5 flex-1 rounded-md" style={{ background: i === 3 ? `${accent}80` : "rgba(255,255,255,0.05)" }} />))}
                        </div>
                        <div className="flex flex-1 flex-col gap-1.5 overflow-hidden">
                            {[...Array(7)].map((_, i) => (<div key={i} className="flex h-4 items-center gap-1.5 rounded bg-white/[0.03] px-2"><div className="h-1.5 w-1.5 rounded-full" style={{ background: accent, opacity: 0.5 }} /><div className="h-1.5 flex-1 rounded-full bg-white/8" /><div className="h-1.5 w-10 rounded-full bg-white/8" /></div>))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function AIMockup({ accent }: { accent: string }) {
    return (
        <div className="relative h-full w-full">
            <div className="absolute right-0 top-[6%] h-[80%] w-[82%] rounded-[14px] border border-white/10 p-3" style={{ background: "rgba(12,4,32,0.95)" }}>
                <div className="flex h-full gap-3">
                    <div className="flex w-[40%] flex-col gap-1.5">
                        <div className="h-3 w-1/2 rounded-full bg-white/12" />
                        {[...Array(4)].map((_, i) => (<div key={i} className="flex items-center gap-2 rounded-md p-1.5" style={{ background: i === 1 ? `${accent}18` : "rgba(255,255,255,0.03)" }}><div className="h-5 w-5 rounded-full" style={{ background: `${accent}66` }} /><div className="flex-1 space-y-1"><div className="h-1.5 w-2/3 rounded-full bg-white/15" /><div className="h-1 w-full rounded-full bg-white/8" /></div></div>))}
                    </div>
                    <div className="flex flex-1 flex-col gap-2 rounded-md bg-white/[0.03] p-2">
                        <div className="rounded-md p-2" style={{ background: `${accent}18` }}><div className="mb-1 h-2 w-2/3 rounded-full bg-white/22" /><div className="space-y-1"><div className="h-1.5 w-full rounded-full bg-white/12" /><div className="h-1.5 w-5/6 rounded-full bg-white/12" /><div className="h-1.5 w-3/4 rounded-full bg-white/12" /></div></div>
                        <div className="rounded-md bg-white/[0.04] p-2"><div className="space-y-1"><div className="h-1.5 w-full rounded-full bg-white/12" /><div className="h-1.5 w-4/5 rounded-full bg-white/12" /></div></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function MobileMockup({ accent }: { accent: string }) {
    return (
        <div className="relative h-full w-full">
            <div className="absolute right-[18%] top-[4%] h-[92%] w-[34%] rotate-[-6deg] rounded-[24px] border border-white/12 p-2" style={{ background: "rgba(15,4,40,0.97)" }}>
                <div className="flex h-full flex-col gap-2 overflow-hidden rounded-[18px] bg-black/40 p-2">
                    <div className="h-3 w-1/2 rounded-full bg-white/15" />
                    <div className="h-16 rounded-md" style={{ background: `${accent}30` }} />
                    <div className="grid grid-cols-3 gap-1">{[...Array(6)].map((_, i) => (<div key={i} className="aspect-square rounded-md bg-white/[0.05]" />))}</div>
                </div>
            </div>
        </div>
    );
}

export function AutomationMockup({ accent }: { accent: string }) {
    return (
        <div className="relative h-full w-full">
            <div className="absolute right-0 top-0 h-full w-[88%] rounded-[14px] border border-white/10 p-3" style={{ background: "rgba(12,4,32,0.95)" }}>
                <div className="grid h-full grid-cols-3 gap-2">
                    {["Triggered", "Processing", "Delivered"].map((stage, col) => (
                        <div key={stage} className="flex flex-col gap-1.5 rounded-md p-2" style={{ background: col === 1 ? `${accent}12` : "rgba(255,255,255,0.03)" }}>
                            <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full" style={{ background: col === 1 ? accent : `${accent}55` }} /><div className="h-1.5 w-2/3 rounded-full bg-white/15" /></div>
                            {[...Array(4 - col)].map((_, i) => (<div key={i} className="space-y-1 rounded-md bg-white/[0.04] p-1.5"><div className="h-1 w-3/4 rounded-full bg-white/12" /><div className="h-1 w-1/2 rounded-full bg-white/8" /></div>))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Service icons ─────────────────────────────────────────────────────────
function IconAI() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="3" stroke={BLUE} strokeWidth="1.5" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M5.6 5.6l2 2M16.4 16.4l2 2M5.6 18.4l2-2M16.4 7.6l2-2" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}
function IconTarget() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="9" stroke={BLUE} strokeWidth="1.5" />
            <circle cx="12" cy="12" r="5" stroke={BLUE} strokeWidth="1.5" />
            <circle cx="12" cy="12" r="1.5" fill={BLUE} />
        </svg>
    );
}
function IconBox() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 2L2 7l10 5 10-5-10-5z" stroke={BLUE} strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke={BLUE} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}
function IconGlobe() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="9" stroke={BLUE} strokeWidth="1.5" />
            <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" stroke={BLUE} strokeWidth="1.5" />
        </svg>
    );
}
function IconBolt() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
function IconTrend() {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M3 17l5-5 4 4 9-9" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 7h5v5" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// ── Card motifs (white, geometric, subtle motion) ─────────────────────────
const MOTIF_STROKE = "rgba(255,255,255,0.14)";
const MOTIF_STROKE_SOFT = "rgba(255,255,255,0.08)";
const MOTIF_FILL = "rgba(255,255,255,0.10)";

function MotifWrap({ children }: { children: React.ReactNode }) {
    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 220 180" preserveAspectRatio="xMidYMid slice" fill="none">
                {children}
            </svg>
        </div>
    );
}

// 01 — AI & Intelligence: connected nodes with a pulsing node
function MotifAINodes() {
    const nodes = [
        { cx: 150, cy: 40 }, { cx: 188, cy: 78 }, { cx: 170, cy: 128 },
        { cx: 110, cy: 100 }, { cx: 130, cy: 62 }, { cx: 92, cy: 50 },
    ];
    const edges = [[0, 4], [4, 1], [1, 2], [2, 3], [3, 4], [5, 4], [5, 3]];
    return (
        <MotifWrap>
            {edges.map(([a, b], i) => (
                <line key={i} x1={nodes[a].cx} y1={nodes[a].cy} x2={nodes[b].cx} y2={nodes[b].cy} stroke={MOTIF_STROKE_SOFT} strokeWidth="0.9" />
            ))}
            {nodes.map((n, i) => (
                <motion.circle
                    key={i}
                    cx={n.cx}
                    cy={n.cy}
                    r={2.4}
                    fill={MOTIF_FILL}
                    stroke={MOTIF_STROKE}
                    strokeWidth="0.8"
                    animate={{ opacity: [0.55, 1, 0.55], r: [2.4, 3.2, 2.4] }}
                    transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.55 }}
                />
            ))}
        </MotifWrap>
    );
}

// 02 — Sales Intelligence Platform: concentric rings + rotating crosshair
function MotifTarget() {
    return (
        <MotifWrap>
            <g transform="translate(160 90)">
                <circle r="48" stroke={MOTIF_STROKE_SOFT} strokeWidth="0.9" />
                <circle r="32" stroke={MOTIF_STROKE_SOFT} strokeWidth="0.9" />
                <circle r="16" stroke={MOTIF_STROKE} strokeWidth="1" />
                <circle r="2.4" fill={MOTIF_FILL} stroke={MOTIF_STROKE} strokeWidth="0.8" />
                <motion.g
                    animate={{ rotate: 360 }}
                    transition={{ duration: 5.0, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: "0px 0px" }}
                >
                    <line x1="-52" y1="0" x2="-18" y2="0" stroke={MOTIF_STROKE} strokeWidth="0.9" strokeLinecap="round" />
                    <line x1="18" y1="0" x2="52" y2="0" stroke={MOTIF_STROKE} strokeWidth="0.9" strokeLinecap="round" />
                </motion.g>
            </g>
        </MotifWrap>
    );
}

// 03 — Product Engineering: stacked isometric layers drifting up
function MotifLayers() {
    return (
        <MotifWrap>
            <motion.g
                animate={{ y: [0, -2.5, 0] }}
                transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
            >
                {[0, 1, 2].map((i) => {
                    const y = 60 + i * 22;
                    return (
                        <g key={i} opacity={1 - i * 0.18}>
                            <path d={`M120 ${y} L172 ${y - 14} L196 ${y} L144 ${y + 14} Z`} stroke={MOTIF_STROKE} strokeWidth="0.9" fill={MOTIF_FILL} />
                        </g>
                    );
                })}
            </motion.g>
        </MotifWrap>
    );
}

// 04 — Digital Services: globe meridians + traveling dash
function MotifGlobeArcs() {
    return (
        <MotifWrap>
            <g transform="translate(160 90)">
                <circle r="46" stroke={MOTIF_STROKE_SOFT} strokeWidth="0.9" />
                <ellipse rx="46" ry="18" stroke={MOTIF_STROKE_SOFT} strokeWidth="0.9" />
                <ellipse rx="18" ry="46" stroke={MOTIF_STROKE_SOFT} strokeWidth="0.9" />
                <ellipse rx="46" ry="46" stroke="none" fill="none" />
                <motion.circle
                    r="2.6"
                    fill={MOTIF_FILL}
                    stroke={MOTIF_STROKE}
                    strokeWidth="0.8"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 5.4, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: "0px 0px", transformBox: "fill-box" }}
                    cx="46"
                    cy="0"
                />
            </g>
        </MotifWrap>
    );
}

// 05 — Automation & Systems: parallel pipeline with flowing dashes
function MotifPipeline() {
    return (
        <MotifWrap>
            <g transform="translate(0 78)">
                <line x1="100" y1="0" x2="210" y2="0" stroke={MOTIF_STROKE_SOFT} strokeWidth="0.9" />
                <line x1="100" y1="22" x2="210" y2="22" stroke={MOTIF_STROKE_SOFT} strokeWidth="0.9" />
                <motion.line
                    x1="100" y1="0" x2="210" y2="0"
                    stroke={MOTIF_STROKE}
                    strokeWidth="1.1"
                    strokeDasharray="10 18"
                    animate={{ strokeDashoffset: [0, -28] }}
                    transition={{ duration: 3.8, repeat: Infinity, ease: "linear" }}
                />
                <motion.line
                    x1="100" y1="22" x2="210" y2="22"
                    stroke={MOTIF_STROKE}
                    strokeWidth="1.1"
                    strokeDasharray="6 22"
                    animate={{ strokeDashoffset: [0, -28] }}
                    transition={{ duration: 4.6, repeat: Infinity, ease: "linear" }}
                />
                {[120, 160, 200].map((cx, i) => (
                    <circle key={i} cx={cx} cy={11} r="1.6" fill={MOTIF_FILL} stroke={MOTIF_STROKE} strokeWidth="0.7" />
                ))}
            </g>
        </MotifWrap>
    );
}

// 06 — Growth & Marketing: ascending chart with a traveling dot
function MotifChart() {
    return (
        <MotifWrap>
            {[40, 80, 120].map((y) => (
                <line key={y} x1="100" y1={y} x2="210" y2={y} stroke={MOTIF_STROKE_SOFT} strokeWidth="0.5" strokeDasharray="2 3" />
            ))}
            <path d="M104 132 L130 110 L150 118 L172 84 L204 52" stroke={MOTIF_STROKE} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <motion.circle
                r="2.6"
                fill={MOTIF_FILL}
                stroke={MOTIF_STROKE}
                strokeWidth="0.8"
                animate={{
                    cx: [104, 130, 150, 172, 204],
                    cy: [132, 110, 118, 84, 52],
                }}
                transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
            />
        </MotifWrap>
    );
}

// ── Data ─────────────────────────────────────────────────────────────────
const SERVICES = [
    {
        num: "01",
        name: "AI & Intelligence",
        description: "Embedding AI into business operations through intelligent systems, assistants, and custom AI solutions built for real-world impact.",
        points: ["AI Integration", "Intelligent Workflows", "Custom AI Solutions"],
        href: "/products/ai-intelligence",
        Icon: IconAI,
        Motif: MotifAINodes,
    },
    {
        num: "02",
        name: "Product Engineering",
        description: "Product engineering for founders and businesses — MVPs, SaaS products, and scalable digital systems built for growth.",
        points: ["MVPs", "SaaS", "Scalable Architecture", "User-focused experiences"],
        href: "/products/product-engineering",
        Icon: IconBox,
        Motif: MotifLayers,
    },
    {
        num: "03",
        name: "Digital Infrastructure",
        description: "Building high-performance websites, ecommerce platforms, and digital systems that form the foundation of modern business.",
        points: ["Web", "Ecommerce", "Platforms", "High-performance"],
        href: "/products/digital-infrastructure",
        Icon: IconGlobe,
        Motif: MotifGlobeArcs,
    },
    {
        num: "04",
        name: "Automation & Systems",
        description: "Streamlining operations through connected automations, workflows, and dashboards designed for efficiency and scale.",
        points: ["Automation", "Workflows", "Dashboards", "Connected operations"],
        href: "/products/automation-systems",
        Icon: IconBolt,
        Motif: MotifPipeline,
    },
];

// ── Card ──────────────────────────────────────────────────────────────────
function ServiceCard({ service, index }: { service: typeof SERVICES[number]; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: index * 0.07, ease: EASE }}
        >
            <Link
                href={service.href}
                className="group relative flex flex-col overflow-hidden rounded-2xl p-7 outline-none focus-visible:ring-2 focus-visible:ring-[#7B55EA]/60"
                style={{
                    background: "var(--home-card-bg)",
                    border: "1px solid var(--home-card-border)",
                    transition: "border-color 350ms ease, box-shadow 350ms ease",
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(123,85,234,0.28)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 1px rgba(123,85,234,0.08), 0 8px 32px rgba(0,0,0,0.25)";
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--home-card-border)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "";
                }}
            >
                {/* Subtle glow on hover */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute bottom-0 left-0 right-0 h-2/3 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(123,85,234,0.07) 0%, transparent 70%)" }}
                />

                {/* Always visible: icon + number */}
                <div className="relative z-10 flex items-start justify-between">
                    <span
                        className="flex h-11 w-11 items-center justify-center rounded-xl"
                        style={{ background: "rgba(123,85,234,0.1)", border: "1px solid rgba(123,85,234,0.22)" }}
                    >
                        <service.Icon />
                    </span>
                    <span className="text-[11px] font-bold tracking-[0.18em] text-white/25">{service.num}</span>
                </div>

                {/* Always visible: name */}
                <h3 className="relative z-10 mt-5 text-base font-semibold leading-snug text-white md:text-lg">{service.name}</h3>

                {/* Always visible: bullet points */}
                <ul className="relative z-10 mt-4 flex flex-col gap-2">
                    {service.points.map((pt) => (
                        <li key={pt} className="flex items-center gap-2.5">
                            <span className="h-1 w-1 flex-shrink-0 rounded-full" style={{ background: "rgba(123,85,234,0.7)" }} />
                            <span className="text-[12.5px] font-medium text-white/50">{pt}</span>
                        </li>
                    ))}
                </ul>

                {/* Hover reveal: description + link */}
                <div className="relative z-10 grid grid-rows-[0fr] opacity-0 transition-all duration-[380ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grid-rows-[1fr] group-hover:opacity-100">
                    <div className="overflow-hidden">
                        <div className="mt-5 border-t pt-4" style={{ borderColor: "rgba(123,85,234,0.15)" }}>
                            <p className="text-sm leading-relaxed text-white/55">{service.description}</p>
                            <span
                                className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]"
                                style={{ color: BLUE }}
                            >
                                Explore
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                                    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// ── Section ───────────────────────────────────────────────────────────────
export default function ServicesSection() {
    return (
        <section id="services" className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
            <div className="pointer-events-none absolute inset-0 z-0" style={{
                background: [
                    "radial-gradient(ellipse 55% 50% at 20% 20%, rgba(123, 85, 234,0.06) 0%, transparent 65%)",
                    "radial-gradient(ellipse 45% 50% at 80% 80%, rgba(123, 85, 234,0.05) 0%, transparent 65%)",
                ].join(", "),
            }} />

            <div className="relative z-10 mx-auto max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="mb-12 flex flex-col items-center gap-5 text-center"
                >
                    <h2 className="display-section-title max-w-2xl text-center">
                        <span className="display-muted-line">Four ways we build</span>
                        <span className="display-strong-line">smarter businesses</span>
                    </h2>
                </motion.div>

                {/* Card grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {SERVICES.map((service, i) => (
                        <ServiceCard key={service.num} service={service} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
