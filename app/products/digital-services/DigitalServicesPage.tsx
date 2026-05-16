"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button as NeonButton } from "@/app/components/ui/neon-button";
import PageArcs from "@/app/components/PageArcs";
import HeroBubbles from "@/app/components/HeroBubbles";
import { useBookCall } from "@/app/components/BookCallProvider";

const GREEN = "#3DFD98";
const BLUE = "#72C8F5";
const EASE = [0.16, 1, 0.3, 1] as const;

// ── Section label ─────────────────────────────────────────────────────────
function SectionLabel({ text }: { text: string }) {
    return (
        <div className="inline-flex items-center gap-3">
            <span className="flex items-center">
                <span className="animate-label-line" />
                <span className="animate-label-dot" />
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">{text}</p>
        </div>
    );
}

// ── Count-up hook ─────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 2000) {
    const [count, setCount] = useState(0);
    const [triggered, setTriggered] = useState(false);
    const elRef = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        const el = elRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTriggered(true); }, { threshold: 0.6 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    useEffect(() => {
        if (!triggered) return;
        let raf: number;
        let start: number | null = null;
        const step = (ts: number) => {
            if (start === null) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
            setCount(Math.round(eased * target));
            if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [triggered, target, duration]);
    return { count, elRef };
}

// ── Icons (all blue) ──────────────────────────────────────────────────────
function IconDownArrow() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 4v14M6 12l6 6 6-6" stroke={BLUE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
function IconGlobe() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="9" stroke={BLUE} strokeWidth="1.5" />
            <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" stroke={BLUE} strokeWidth="1.5" />
        </svg>
    );
}
function IconLayers() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 3L3 8l9 5 9-5-9-5z" stroke={BLUE} strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M3 13l9 5 9-5M3 18l9 5 9-5" stroke={BLUE} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}
function IconCart() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M3 4h2l3 12h11l2-8H6" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9" cy="20" r="1.5" stroke={BLUE} strokeWidth="1.5" />
            <circle cx="18" cy="20" r="1.5" stroke={BLUE} strokeWidth="1.5" />
        </svg>
    );
}
function IconCog() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="3" stroke={BLUE} strokeWidth="1.5" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}
function IconCheck() {
    return (
        <svg width="14" height="14" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path d="M2 5l2.2 2.2L8 3.2" stroke={BLUE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
function IconSpark({ flat = false }: { flat?: boolean }) {
    const path = flat
        ? "M2 14 L8 12 L14 13 L20 10 L26 11 L32 8"
        : "M2 14 L8 10 L14 12 L20 6 L26 8 L32 3";
    return (
        <svg width="48" height="20" viewBox="0 0 34 18" fill="none" aria-hidden>
            <path d={path} stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
    );
}

// ── Mini schematic visuals ────────────────────────────────────────────────
function BrowserMock() {
    return (
        <div
            className="relative w-full overflow-hidden rounded-2xl"
            style={{ background: "rgba(8,1,28,0.55)", border: "1px solid rgba(255,255,255,0.08)", aspectRatio: "16 / 10" }}
        >
            <div className="flex items-center gap-1.5 border-b border-white/8 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-white/15" />
                <span className="h-2 w-2 rounded-full bg-white/15" />
                <span className="h-2 w-2 rounded-full bg-white/15" />
                <span className="ml-3 h-2 w-32 rounded-full bg-white/8" />
            </div>
            <div className="grid grid-cols-3 gap-3 p-5">
                <div className="col-span-2 flex flex-col gap-2">
                    <span className="h-3 w-3/4 rounded-full bg-white/10" />
                    <span className="h-3 w-1/2 rounded-full bg-white/8" />
                    <span className="mt-2 h-8 w-28 rounded-md" style={{ background: `${BLUE}22`, border: `1px solid ${BLUE}55` }} />
                </div>
                <div className="rounded-md" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }} />
            </div>
            {/* floating CTA indicator */}
            <div
                className="absolute right-4 top-16 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold"
                style={{ background: `${GREEN}18`, border: `1px solid ${GREEN}55`, color: GREEN }}
            >
                +CTA
            </div>
        </div>
    );
}

function ArchitectureMock() {
    return (
        <div
            className="relative w-full overflow-hidden rounded-2xl p-6"
            style={{ background: "rgba(8,1,28,0.55)", border: "1px solid rgba(255,255,255,0.08)", aspectRatio: "16 / 10" }}
        >
            <svg viewBox="0 0 320 180" className="h-full w-full" fill="none">
                {/* connectors */}
                <path d="M60 90 L130 50 M60 90 L130 90 M60 90 L130 130 M190 50 L260 90 M190 90 L260 90 M190 130 L260 90" stroke={`${BLUE}66`} strokeWidth="1" strokeDasharray="3 3" />
                {/* center api */}
                <rect x="30" y="70" width="60" height="40" rx="6" stroke={BLUE} strokeWidth="1.4" />
                <text x="60" y="95" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9" fontWeight="600">API</text>
                {/* auth */}
                <rect x="130" y="30" width="60" height="40" rx="6" stroke={BLUE} strokeWidth="1.4" />
                <text x="160" y="55" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">AUTH</text>
                {/* db */}
                <rect x="130" y="70" width="60" height="40" rx="6" stroke={BLUE} strokeWidth="1.4" />
                <text x="160" y="95" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">DB</text>
                {/* dash */}
                <rect x="130" y="110" width="60" height="40" rx="6" stroke={BLUE} strokeWidth="1.4" />
                <text x="160" y="135" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">DASH</text>
                {/* server */}
                <rect x="230" y="70" width="60" height="40" rx="6" stroke={BLUE} strokeWidth="1.4" />
                <text x="260" y="95" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">SERVER</text>
            </svg>
        </div>
    );
}

function StorefrontMock() {
    return (
        <div
            className="relative w-full overflow-hidden rounded-2xl p-6"
            style={{ background: "rgba(8,1,28,0.55)", border: "1px solid rgba(255,255,255,0.08)", aspectRatio: "16 / 10" }}
        >
            <div className="grid h-full grid-cols-3 gap-3">
                <div className="rounded-md" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }} />
                <div className="rounded-md" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }} />
                <div className="rounded-md" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }} />
            </div>
            <div
                className="absolute left-4 top-4 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold"
                style={{ background: `${BLUE}18`, border: `1px solid ${BLUE}55`, color: BLUE }}
            >
                AI Search
            </div>
            <div
                className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold"
                style={{ background: `${GREEN}18`, border: `1px solid ${GREEN}55`, color: GREEN }}
            >
                Checkout +
            </div>
        </div>
    );
}

function BlueprintMock() {
    return (
        <div
            className="relative w-full overflow-hidden rounded-2xl p-6"
            style={{ background: "rgba(8,1,28,0.55)", border: "1px solid rgba(255,255,255,0.08)", aspectRatio: "16 / 10" }}
        >
            <svg viewBox="0 0 320 180" className="h-full w-full" fill="none">
                {/* grid background */}
                {Array.from({ length: 8 }).map((_, i) => (
                    <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="180" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                ))}
                {Array.from({ length: 5 }).map((_, i) => (
                    <line key={`h${i}`} x1="0" y1={i * 40} x2="320" y2={i * 40} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                ))}
                <path d="M40 60 L120 60 L120 120 L240 120 L240 60 L280 60" stroke={BLUE} strokeWidth="1.4" strokeDasharray="4 3" />
                <rect x="30" y="50" width="40" height="22" rx="3" stroke={BLUE} strokeWidth="1.2" />
                <rect x="110" y="110" width="40" height="22" rx="3" stroke={BLUE} strokeWidth="1.2" />
                <rect x="230" y="50" width="40" height="22" rx="3" stroke={BLUE} strokeWidth="1.2" />
                <text x="50" y="65" textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="8">ADMIN</text>
                <text x="130" y="125" textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="8">DB</text>
                <text x="250" y="65" textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="8">FLOW</text>
            </svg>
        </div>
    );
}

// ── Data ──────────────────────────────────────────────────────────────────
const LEAKAGE = [
    { num: "01", title: "Passive websites", body: "Pretty brochures that look good and sell nothing. No conversion logic, no instrumentation, no compounding learning loop." },
    { num: "02", title: "Scaling failures", body: "Stacks that collapse the moment traffic spikes. Slow APIs, runaway costs, downtime during the windows that matter most." },
    { num: "03", title: "Lost e-commerce revenue", body: "Generic storefronts that don't merchandise, don't recommend, and don't recover abandoned carts. Money walks out the door." },
];

const REVENUE_FLOW = [
    { num: "01", title: "Strategy", body: "Define the revenue thesis before a single pixel is drawn." },
    { num: "02", title: "UX", body: "Flows engineered for action — not aesthetics for their own sake." },
    { num: "03", title: "Development", body: "Production-grade build on a stack that scales without surprises." },
    { num: "04", title: "AI", body: "Search, recommendations, personalisation — intelligence in the user path." },
    { num: "05", title: "Optimisation", body: "Continuous experimentation against revenue metrics." },
];

const SUB_SERVICES = [
    {
        num: "01",
        title: "Website Development",
        eyebrow: "Conversion-first",
        body: "Revenue-engineered sites that earn attention and convert it. Heatmap-driven UX, instrumented funnels, AI-assisted personalisation, and a CMS your team can actually use.",
        bullets: ["Conversion-rate engineering", "Headless CMS (Sanity / Payload / Strapi)", "Edge rendering & Core Web Vitals", "Built-in experimentation"],
        visual: "browser",
    },
    {
        num: "02",
        title: "Platform Development",
        eyebrow: "Scale-ready",
        body: "Multi-tenant SaaS, internal platforms, member portals — built with the auth, observability, and API design you need to scale without rewriting in a year.",
        bullets: ["Multi-tenant architecture", "RBAC + SSO", "Observability & alerting", "API versioning strategy"],
        visual: "architecture",
    },
    {
        num: "03",
        title: "E-commerce Development",
        eyebrow: "Revenue engine",
        body: "Storefronts that merchandise, recommend, and recover. AI search, smart bundling, abandoned-cart automation, checkout flows tuned to your conversion data.",
        bullets: ["AI search & recommendations", "Headless commerce (Shopify / Medusa)", "Checkout optimisation", "Subscription & retention loops"],
        visual: "storefront",
    },
    {
        num: "04",
        title: "Custom Systems",
        eyebrow: "Bespoke infrastructure",
        body: "Internal tools, operational dashboards, custom workflows — engineered for the parts of your business off-the-shelf software doesn't fit.",
        bullets: ["Workflow & approval engines", "Admin & operational dashboards", "Data pipelines & ETL", "Integration layer & APIs"],
        visual: "blueprint",
    },
];

const OUTCOME_METRICS = [
    { value: 40, suffix: "%", label: "Avg. conversion lift" },
    { value: 2.4, suffix: "×", label: "Faster time to launch", decimals: 1 },
    { value: 99.9, suffix: "%", label: "Platform uptime", decimals: 1 },
    { value: 2, prefix: "<", suffix: "s", label: "Median page load" },
];

const PIPELINE = [
    { num: "01", title: "Strategy", body: "Revenue thesis, target metrics, scope of work." },
    { num: "02", title: "UX", body: "Flows, prototype, conversion design." },
    { num: "03", title: "Build", body: "Production sprints with continuous deploy." },
    { num: "04", title: "QA", body: "Performance, accessibility, security passes." },
    { num: "05", title: "Launch", body: "Go-live, instrumentation, and a 30-day stabilisation window." },
];

const STACK_BADGES = [
    "Next.js", "Sanity", "Payload", "Strapi", "Shopify", "Medusa", "Postgres", "Vercel",
];

const UPTIME_BADGES = [
    { label: "99.9% uptime SLO" },
    { label: "Edge-first delivery" },
    { label: "Auto-scaling infra" },
    { label: "Zero-downtime deploys" },
];

const FAQS = [
    { q: "How long does a build take?", a: "Marketing sites land in 4–8 weeks. Platforms and bespoke systems run 10–20 weeks depending on scope and the integration surface." },
    { q: "Do you migrate from an existing site?", a: "Yes — full redirects mapping, SEO continuity, and content migration. We've moved sites off WordPress, Webflow, Wix, and bespoke legacy stacks." },
    { q: "Which CMS do you use?", a: "We pair the right CMS to the team. Sanity for editorial-heavy sites, Payload for owned-stack flexibility, Strapi for self-hosted setups, Shopify/Medusa for commerce." },
    { q: "Do you handle hosting & ops?", a: "Yes. Managed hosting on Vercel/AWS with monitoring, alerting, and a clear SLO. Or we hand off cleanly to your platform team." },
    { q: "Can AI be added later?", a: "Yes — the architecture is designed for it. Search, recommendations, copilots, and personalisation are common phase-two additions." },
];

// ── FAQ item ──────────────────────────────────────────────────────────────
function FAQItem({ q, a, index, isOpen, onToggle }: { q: string; a: string; index: number; isOpen: boolean; onToggle: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: EASE }}
            className="overflow-hidden rounded-2xl"
            style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${isOpen ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)"}`,
                transition: "border-color 300ms ease",
            }}
        >
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-200 hover:bg-white/[0.02]"
            >
                <span className="text-base font-semibold text-white md:text-lg">{q}</span>
                <span
                    aria-hidden
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-transform duration-300"
                    style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1v10M1 6h10" stroke="rgba(255,255,255,0.75)" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                </span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="overflow-hidden"
                    >
                        <p className="px-6 pb-6 text-sm leading-relaxed text-white/55 md:text-base">{a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ── Animated metric tile ─────────────────────────────────────────────────
function MetricTile({ value, suffix = "", prefix = "", decimals = 0, label, index }: { value: number; suffix?: string; prefix?: string; decimals?: number; label: string; index: number }) {
    const intTarget = Math.round(value * Math.pow(10, decimals));
    const { count, elRef } = useCountUp(intTarget, 1800);
    const display = decimals > 0 ? (count / Math.pow(10, decimals)).toFixed(decimals) : count.toString();
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
            className="flex flex-col items-center gap-3 px-4 py-8 text-center md:gap-4"
        >
            <IconSpark />
            <span ref={elRef} className="text-5xl font-extrabold leading-none tracking-tight md:text-6xl" style={{ color: GREEN }}>
                {prefix}{display}{suffix}
            </span>
            <span className="text-sm font-medium leading-snug text-white/55">{label}</span>
        </motion.div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function DigitalServicesPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const heroRef = useRef<HTMLElement>(null);
    const { open: openBookCall } = useBookCall();

    return (
        <main className="relative min-h-screen bg-[#07001F] overflow-hidden">
            <PageArcs />

            {/* ── 1. HERO ───────────────────────────────────── */}
            <section
                ref={heroRef}
                data-hero
                className="relative flex flex-col items-center justify-center overflow-hidden px-5 pb-20 pt-28 text-center sm:px-6 md:pb-[100px] md:pt-[150px]"
            >
                <HeroBubbles containerRef={heroRef} />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: EASE }}
                    className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6"
                >
                    <SectionLabel text="Digital Services" />
                    <h1
                        className="text-balance text-[2rem] font-semibold leading-[1.05] tracking-[-0.025em] text-white sm:text-[2.5rem] md:text-[2.75rem] lg:text-[3rem]"
                        style={{ fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif" }}
                    >
                        Revenue-engineered websites.<br /><span className="jakarta-italic">Not brochureware.</span>
                    </h1>
                    <p className="max-w-xl text-base leading-relaxed text-white/55 md:text-[1.05rem]">
                        Websites, platforms, e-commerce, and custom systems — built to convert, scale, and compound.
                    </p>
                    <div className="mt-2 flex flex-col items-center gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="relative px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 cursor-pointer"
                            style={{
                                background: "linear-gradient(135deg, rgba(114,200,245,0.08), rgba(155,47,255,0.08))",
                                boxShadow: "0 0 10px rgba(114,200,245,0.1), 0 0 10px rgba(155,47,255,0.08), inset 0 0 0 1px rgba(114,200,245,0.18)",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                                    "0 0 20px rgba(114,200,245,0.28), 0 0 20px rgba(155,47,255,0.22), inset 0 0 0 1px rgba(114,200,245,0.4)";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                                    "0 0 10px rgba(114,200,245,0.1), 0 0 10px rgba(155,47,255,0.08), inset 0 0 0 1px rgba(114,200,245,0.18)";
                            }}
                        >
                            Book a Strategy Call
                        </button>
                        <a href="#sub-services">
                            <NeonButton variant="ghost" size="default" className="text-sm font-semibold tracking-wide px-6 py-2.5">
                                Explore Services
                            </NeonButton>
                        </a>
                    </div>
                </motion.div>
            </section>

            {/* ── 2. PROBLEM — Revenue leakage panels ── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: [
                        "radial-gradient(ellipse 50% 50% at 20% 30%, rgba(155,47,255,0.06) 0%, transparent 70%)",
                        "radial-gradient(ellipse 40% 50% at 80% 70%, rgba(114,200,245,0.05) 0%, transparent 70%)",
                    ].join(", "),
                }} />
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-14 flex flex-col items-center gap-5 text-center"
                    >
                        <SectionLabel text="The problem" />
                        <h2 className="max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-white md:text-4xl">
                            Where revenue leaks out of digital.
                        </h2>
                        <p className="max-w-xl text-base leading-relaxed text-white/55">
                            Three patterns we see in almost every audit. Each one quietly bleeds revenue you've already earned.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                        {LEAKAGE.map((item, i) => (
                            <motion.div
                                key={item.num}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                                whileHover={{ y: -4 }}
                                className="flex flex-col gap-5 rounded-2xl p-7 transition-colors duration-300 hover:bg-white/[0.03]"
                                style={{ background: "rgba(8,1,28,0.55)", border: "1px solid rgba(255,255,255,0.07)" }}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-extrabold leading-none" style={{ color: GREEN }}>{item.num}</span>
                                    <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${BLUE}14`, border: `1px solid ${BLUE}40` }}>
                                        <IconDownArrow />
                                    </span>
                                </div>
                                {/* before/after mini bars */}
                                <div className="flex items-end gap-3">
                                    <div className="flex flex-1 flex-col gap-1.5">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Before</span>
                                        <span className="h-12 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
                                    </div>
                                    <div className="flex flex-1 flex-col gap-1.5">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">After</span>
                                        <span className="h-20 rounded" style={{ background: `${GREEN}22`, border: `1px solid ${GREEN}55` }} />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                                <p className="text-sm leading-relaxed text-white/55">{item.body}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 3. APPROACH — Revenue engineering vertical flow ── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(155,47,255,0.06) 0%, transparent 65%)",
                }} />
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-16 flex flex-col items-center gap-5 text-center"
                    >
                        <SectionLabel text="Our approach" />
                        <h2 className="max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-white md:text-4xl">
                            Revenue engineering, end to end.
                        </h2>
                        <p className="max-w-xl text-base leading-relaxed text-white/55">
                            One framework. Five layers. Every decision tied back to a revenue thesis.
                        </p>
                    </motion.div>

                    <div className="relative mx-auto max-w-2xl">
                        {/* vertical spine */}
                        <div
                            aria-hidden
                            className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2"
                            style={{
                                width: "1px",
                                background: `linear-gradient(to bottom, transparent, ${BLUE}55 8%, ${BLUE}55 92%, transparent)`,
                            }}
                        />
                        <div className="flex flex-col gap-12">
                            {REVENUE_FLOW.map((node, i) => (
                                <motion.div
                                    key={node.num}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-60px" }}
                                    transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                                    className="relative flex items-center gap-6"
                                >
                                    {/* left metric */}
                                    <div className={`hidden flex-1 md:block ${i % 2 === 0 ? "" : "opacity-0 pointer-events-none"} text-right`}>
                                        {i % 2 === 0 && (
                                            <p className="text-sm text-white/55">{node.body}</p>
                                        )}
                                    </div>
                                    {/* node */}
                                    <div className="relative z-10 flex flex-col items-center">
                                        <div
                                            className="flex h-14 w-14 items-center justify-center rounded-full md:h-16 md:w-16"
                                            style={{
                                                background: "rgba(8,1,28,1)",
                                                border: `1.5px solid ${BLUE}`,
                                                boxShadow: `0 0 0 6px #07001F, 0 0 22px ${BLUE}33`,
                                            }}
                                        >
                                            <span className="text-base font-bold md:text-lg" style={{ color: GREEN }}>{node.num}</span>
                                        </div>
                                        <h3 className="mt-3 text-center text-lg font-bold text-white md:text-xl">{node.title}</h3>
                                    </div>
                                    {/* right metric */}
                                    <div className={`flex-1 ${i % 2 === 1 ? "md:block" : "md:opacity-0 md:pointer-events-none"}`}>
                                        {i % 2 === 1 ? (
                                            <p className="text-sm text-white/55">{node.body}</p>
                                        ) : (
                                            <p className="text-sm text-white/55 md:hidden">{node.body}</p>
                                        )}
                                        {/* mobile only show on every row */}
                                        {i % 2 === 0 && (
                                            <p className="text-sm text-white/55 md:hidden">{node.body}</p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 4. SUB-SERVICES — Alternating enterprise sections ── */}
            <section id="sub-services" className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-16 flex flex-col items-center gap-5 text-center"
                    >
                        <SectionLabel text="What we build" />
                        <h2 className="max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-white md:text-4xl">
                            Four practices. One delivery standard.
                        </h2>
                    </motion.div>

                    <div className="flex flex-col gap-20 md:gap-28">
                        {SUB_SERVICES.map((svc, i) => {
                            const isOdd = i % 2 === 1;
                            const Visual = svc.visual === "browser" ? BrowserMock : svc.visual === "architecture" ? ArchitectureMock : svc.visual === "storefront" ? StorefrontMock : BlueprintMock;
                            const IconForRow = i === 0 ? IconGlobe : i === 1 ? IconLayers : i === 2 ? IconCart : IconCog;
                            return (
                                <motion.div
                                    key={svc.num}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-80px" }}
                                    transition={{ duration: 0.7, ease: EASE }}
                                    className={`grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-14 ${isOdd ? "md:[&>div:first-child]:order-2" : ""}`}
                                >
                                    {/* text */}
                                    <div className="flex flex-col gap-5">
                                        <div className="flex items-center gap-4">
                                            <span className="text-5xl font-extrabold leading-none md:text-6xl" style={{ color: GREEN }}>{svc.num}</span>
                                            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">{svc.eyebrow}</span>
                                        </div>
                                        <h3 className="text-2xl font-extrabold leading-tight text-white md:text-3xl">
                                            {svc.title}
                                        </h3>
                                        <p className="max-w-md text-base leading-relaxed text-white/55 md:text-[1.05rem]">{svc.body}</p>
                                        <ul className="mt-2 flex flex-col gap-2.5">
                                            {svc.bullets.map((b) => (
                                                <li key={b} className="flex items-center gap-3 text-sm text-white md:text-[15px]">
                                                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full" style={{ background: `${BLUE}18`, border: `1px solid ${BLUE}55` }}>
                                                        <IconCheck />
                                                    </span>
                                                    {b}
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="mt-3 flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${BLUE}14`, border: `1px solid ${BLUE}40` }}>
                                            <IconForRow />
                                        </div>
                                    </div>
                                    {/* visual */}
                                    <div>
                                        <Visual />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── 5. OUTCOMES — Horizontal metrics strip ── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-14 flex flex-col items-center gap-5 text-center"
                    >
                        <SectionLabel text="Outcomes" />
                        <h2 className="max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-white md:text-4xl">
                            What the numbers look like.
                        </h2>
                    </motion.div>

                    <div
                        className="grid grid-cols-2 rounded-2xl md:grid-cols-4"
                        style={{ background: "rgba(8,1,28,0.55)", border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                        {OUTCOME_METRICS.map((m, i) => {
                            // mobile (2-col): all but last two get bottom-border; right column also gets a left-border
                            // desktop (4-col): all but first get a left-border (no bottom borders)
                            const mobileBottom = i < OUTCOME_METRICS.length - 2 ? "border-b border-white/[0.07]" : "";
                            const mobileLeft = i % 2 === 1 ? "border-l border-white/[0.07]" : "";
                            return (
                                <div
                                    key={m.label}
                                    className={`relative ${mobileBottom} ${mobileLeft} md:border-b-0 md:border-l md:border-white/[0.07] md:first:border-l-0`}
                                >
                                    <MetricTile {...m} index={i} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── 6. DELIVERY PROCESS — Pipeline ── */}
            <section id="process" className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-14 flex flex-col items-center gap-5 text-center"
                    >
                        <SectionLabel text="Delivery process" />
                        <h2 className="max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-white md:text-4xl">
                            A pipeline, not a sprint.
                        </h2>
                    </motion.div>

                    <div className="relative">
                        <div
                            aria-hidden
                            className="pointer-events-none absolute hidden lg:block lg:left-0 lg:right-0"
                            style={{
                                top: "32px",
                                height: "1px",
                                background: `linear-gradient(to right, transparent, ${BLUE}55 6%, ${BLUE}55 94%, transparent)`,
                            }}
                        />
                        <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
                            {PIPELINE.map((step, i) => (
                                <motion.div
                                    key={step.num}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-60px" }}
                                    transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                                    className="flex flex-col items-center text-center"
                                >
                                    <div
                                        className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full"
                                        style={{
                                            background: "rgba(8,1,28,1)",
                                            border: `1.5px solid ${BLUE}`,
                                            boxShadow: `0 0 0 6px #07001F, 0 0 22px ${BLUE}33`,
                                        }}
                                    >
                                        <span className="text-sm font-bold md:text-base" style={{ color: GREEN }}>{step.num}</span>
                                    </div>
                                    <h3 className="mt-4 text-base font-bold text-white md:text-lg">{step.title}</h3>
                                    <p className="mt-2 max-w-[200px] text-xs leading-relaxed text-white/55 md:text-sm">{step.body}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 7. FAQ — 2-column with stack badges ── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-14 flex flex-col items-center gap-5 text-center"
                    >
                        <SectionLabel text="FAQ" />
                        <h2 className="max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-white md:text-4xl">
                            The common questions.
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr] md:gap-14">
                        <div className="flex flex-col gap-3">
                            {FAQS.map((f, i) => (
                                <FAQItem
                                    key={f.q}
                                    q={f.q}
                                    a={f.a}
                                    index={i}
                                    isOpen={openFaq === i}
                                    onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                                />
                            ))}
                        </div>

                        <aside className="flex flex-col gap-5">
                            <div
                                className="flex flex-col gap-4 rounded-2xl p-6"
                                style={{ background: "rgba(8,1,28,0.55)", border: "1px solid rgba(255,255,255,0.07)" }}
                            >
                                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Stack</span>
                                <div className="flex flex-wrap gap-2">
                                    {STACK_BADGES.map((s) => (
                                        <span key={s} className="rounded-full px-3 py-1 text-xs font-medium text-white/70" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>{s}</span>
                                    ))}
                                </div>
                            </div>

                            <div
                                className="flex flex-col gap-4 rounded-2xl p-6"
                                style={{ background: "rgba(8,1,28,0.55)", border: "1px solid rgba(255,255,255,0.07)" }}
                            >
                                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Reliability</span>
                                <ul className="flex flex-col gap-3">
                                    {UPTIME_BADGES.map((b) => (
                                        <li key={b.label} className="flex items-center gap-3 text-sm text-white">
                                            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full" style={{ background: `${GREEN}18`, border: `1px solid ${GREEN}55` }}>
                                                <span className="h-1.5 w-1.5 rounded-full" style={{ background: GREEN }} />
                                            </span>
                                            {b.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* ── 8. FINAL CTA ── */}
            <section className="relative w-full overflow-hidden px-5 py-16 sm:px-6 sm:py-24 md:py-32">
                <div
                    aria-hidden
                    className="pointer-events-none absolute left-0 right-0 top-0 mx-auto h-px max-w-3xl"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }}
                />
                <div className="pointer-events-none absolute inset-0 opacity-30">
                    <svg viewBox="0 0 1200 400" className="h-full w-full" fill="none" preserveAspectRatio="xMidYMid slice">
                        <path d="M0 200 Q300 100 600 200 T1200 200" stroke={`${BLUE}33`} strokeWidth="1" />
                        <path d="M0 250 Q300 350 600 250 T1200 250" stroke={`${BLUE}22`} strokeWidth="1" />
                        {[200, 400, 600, 800, 1000].map((x) => (
                            <circle key={x} cx={x} cy="200" r="3" fill={GREEN} opacity="0.5" />
                        ))}
                    </svg>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: EASE }}
                    className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 text-center"
                >
                    <h2 className="text-3xl font-extrabold leading-[1.05] tracking-tight text-white md:text-5xl">
                        Build a digital surface that <span className="jakarta-italic">earns revenue.</span>
                    </h2>
                    <p className="max-w-xl text-base leading-relaxed text-white/55 md:text-[1.05rem]">
                        Pretty doesn't move the number. Engineered does. Let's design the system that compounds.
                    </p>
                    <div className="mt-2 flex flex-col items-center gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="relative px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 cursor-pointer"
                            style={{
                                background: "linear-gradient(135deg, rgba(114,200,245,0.08), rgba(155,47,255,0.08))",
                                boxShadow: "0 0 10px rgba(114,200,245,0.1), 0 0 10px rgba(155,47,255,0.08), inset 0 0 0 1px rgba(114,200,245,0.18)",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                                    "0 0 20px rgba(114,200,245,0.28), 0 0 20px rgba(155,47,255,0.22), inset 0 0 0 1px rgba(114,200,245,0.4)";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                                    "0 0 10px rgba(114,200,245,0.1), 0 0 10px rgba(155,47,255,0.08), inset 0 0 0 1px rgba(114,200,245,0.18)";
                            }}
                        >
                            Book a Strategy Call
                        </button>
                        <a href="/products/sales-intelligence-platform">
                            <NeonButton variant="ghost" size="default" className="text-sm font-semibold tracking-wide px-6 py-2.5">
                                Explore More
                            </NeonButton>
                        </a>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}
