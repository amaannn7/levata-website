"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    SiReact, SiNextdotjs, SiVuedotjs, SiNuxt, SiSvelte, SiAngular,
    SiExpress, SiNestjs, SiSpring, SiFastapi, SiDjango, SiLaravel,
    SiSanity, SiContentful, SiStrapi, SiWordpress, SiPayloadcms, SiDirectus,
    SiPostgresql, SiMysql, SiMongodb, SiSupabase, SiFirebase, SiRedis,
} from "react-icons/si";
import ClientsMarquee from "@/app/components/ClientsMarquee";
import { CircleArrow } from "@/app/components/ServicesSection";
import TestimonialsSection from "@/app/components/TestimonialsSection";
import HomeHero from "@/app/components/HomeHero";
import { useBookCall } from "@/app/components/BookCallProvider";

// ── Count-up hook ──────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 2000) {
    const [count, setCount] = useState(0);
    const [triggered, setTriggered] = useState(false);
    const elRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const el = elRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setTriggered(true); },
            { threshold: 0.6 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!triggered) return;
        let raf: number;
        let start: number | null = null;
        const step = (ts: number) => {
            if (start === null) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCount(Math.round(eased * target));
            if (progress < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [triggered, target, duration]);

    return { count, elRef };
}

// ── Animated stat number (extended: animate lead number, static suffix) ────
function StatCounter({ leadNumber, suffix, label }: { leadNumber: number; suffix: string; label: string }) {
    const { count, elRef } = useCountUp(leadNumber, 2000);
    return (
        <div className="flex flex-col items-center gap-3">
            <span
                ref={elRef}
                className="text-5xl font-bold leading-none tracking-tight md:text-6xl"
                style={{ color: "var(--text-primary)" }}
            >
                {count}
                <span style={{ color: "var(--text-primary)" }}>{suffix}</span>
            </span>
            <span className="max-w-[180px] text-center text-sm font-medium leading-snug text-white/45 tracking-wide">
                {label}
            </span>
        </div>
    );
}

// ── Section label helper ───────────────────────────────────────────────────
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

function SectionDivider() {
    return (
        <div aria-hidden className="px-6">
            <div className="section-gradient-divider" />
        </div>
    );
}

// ── Two-row opposing marquee — Tech Stack (replaces the old tab grid) ─────
type TechItem = { name: string; Icon: React.ComponentType<{ size?: number; className?: string }> };

const TECH_ROW_TOP: TechItem[] = [
    { name: "Next.js", Icon: SiNextdotjs },
    { name: "React", Icon: SiReact },
    { name: "Vue.js", Icon: SiVuedotjs },
    { name: "Nuxt", Icon: SiNuxt },
    { name: "SvelteKit", Icon: SiSvelte },
    { name: "Angular", Icon: SiAngular },
    { name: "Express", Icon: SiExpress },
    { name: "NestJS", Icon: SiNestjs },
    { name: "Spring Boot", Icon: SiSpring },
    { name: "FastAPI", Icon: SiFastapi },
    { name: "Django", Icon: SiDjango },
    { name: "Laravel", Icon: SiLaravel },
];

const TECH_ROW_BOTTOM: TechItem[] = [
    { name: "Sanity", Icon: SiSanity },
    { name: "Strapi", Icon: SiStrapi },
    { name: "Contentful", Icon: SiContentful },
    { name: "WordPress", Icon: SiWordpress },
    { name: "Payload CMS", Icon: SiPayloadcms },
    { name: "Directus", Icon: SiDirectus },
    { name: "PostgreSQL", Icon: SiPostgresql },
    { name: "MySQL", Icon: SiMysql },
    { name: "MongoDB", Icon: SiMongodb },
    { name: "Supabase", Icon: SiSupabase },
    { name: "Firebase", Icon: SiFirebase },
    { name: "Redis", Icon: SiRedis },
];

function TechMarqueeRow({ items, direction, duration }: { items: TechItem[]; direction: "left" | "right"; duration: number }) {
    const doubled = [...items, ...items];
    return (
        <div className="tech-marquee-mask relative w-full overflow-hidden">
            <div
                className="flex items-center whitespace-nowrap"
                style={{
                    width: "max-content",
                    gap: "clamp(32px, 5vw, 72px)",
                    animation: `marquee ${duration}s linear infinite`,
                    animationDirection: direction === "left" ? "normal" : "reverse",
                }}
            >
                {doubled.map(({ name, Icon }, i) => (
                    <div
                        key={`${name}-${i}`}
                        title={name}
                        className="home-tech-icon-wrap group flex flex-shrink-0 items-center justify-center"
                        style={{ width: 44, height: 44 }}
                    >
                        <Icon
                            size={40}
                            className="home-tech-icon"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

function TechStackSection() {
    return (
        <section className="home-theme-dark relative w-full px-5 py-14 sm:px-6 sm:py-20 md:py-24 overflow-hidden">
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute inset-0" style={{
                    background: [
                        "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(75,145,247,0.07) 0%, transparent 65%)",
                        "radial-gradient(ellipse 40% 40% at 85% 20%, rgba(75,145,247,0.04) 0%, transparent 60%)",
                    ].join(", ")
                }} />
            </div>
            <div className="relative z-10 mx-auto max-w-6xl">
                <div className="mb-12 flex flex-col items-center text-center gap-5">
                    <SectionLabel text="Our stack" />
                    <h2 className="display-section-title max-w-2xl text-center">
                        <span className="display-muted-line">Built on tech that</span>
                        <span className="display-strong-line">compounds.</span>
                    </h2>
                    <p className="max-w-xl text-base leading-relaxed text-white/45 md:text-[1.05rem]">
                        Battle-tested infrastructure paired with cutting-edge AI — chosen for longevity, not novelty.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <TechMarqueeRow items={TECH_ROW_TOP} direction="left" duration={40} />
                    <TechMarqueeRow items={TECH_ROW_BOTTOM} direction="right" duration={36} />
                </div>
            </div>
        </section>
    );
}

// ── Content data ───────────────────────────────────────────────────────────
const PRODUCT_FEATURES = [
    "AI-powered prospect research: company profiles, pain points, buying signals, and opening hooks",
    "Lead scoring and prioritization against your ideal customer profile",
    "Personalized cold email and follow-up generation in seconds",
    "Call scripts tailored to prospect, role, and industry",
    "Work queues that surface the right leads at the right time",
    "CRM sync — push qualified opportunities directly into your pipeline",
];

// ── Service icons (monochrome line-art glyph + sparkle) ───────────────────
// `accent` prop kept for backwards compat but ignored — all homepage icons render in white.
function ServiceIcon({ kind, size = 26 }: { kind: IconKind; accent?: string; size?: number }) {
    const ICON_COLOR = "var(--home-accent-cyan, #4B91F7)";
    const sparkle = (
        <path
            d="M26 4L27 6L29 7L27 8L26 10L25 8L23 7L25 6Z"
            fill={ICON_COLOR}
        />
    );
    const stroke = { stroke: ICON_COLOR, strokeWidth: 1.8, fill: "none" as const, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
    if (kind === "ai") {
        return (
            <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
                <rect x="8" y="8" width="16" height="16" rx="2.5" {...stroke} />
                <rect x="12" y="12" width="8" height="8" rx="1" {...stroke} />
                <path d="M14 8V5M18 8V5M14 27V24M18 27V24M5 14H8M5 18H8M27 14H24M27 18H24" {...stroke} />
                {sparkle}
            </svg>
        );
    }
    if (kind === "sales") {
        return (
            <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
                <circle cx="14" cy="15" r="7" {...stroke} />
                <path d="M19.5 20.5L24 25" {...stroke} />
                {sparkle}
            </svg>
        );
    }
    if (kind === "products") {
        return (
            <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
                <path d="M16 7L25 11.5V20.5L16 25L7 20.5V11.5L16 7Z" {...stroke} />
                <path d="M16 7V16M16 16L25 11.5M16 16L7 11.5" {...stroke} />
                {sparkle}
            </svg>
        );
    }
    if (kind === "services") {
        return (
            <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
                <circle cx="15" cy="16" r="9" {...stroke} />
                <ellipse cx="15" cy="16" rx="9" ry="4.5" {...stroke} />
                <path d="M15 7V25" {...stroke} />
                {sparkle}
            </svg>
        );
    }
    if (kind === "automation") {
        return (
            <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
                <circle cx="15" cy="16" r="4" {...stroke} />
                <path d="M15 7V4M15 28V25M22 16H25M5 16H8M19.9 10.1L22 8M8 24L10.1 21.9M19.9 21.9L22 24M8 8L10.1 10.1" {...stroke} />
                {sparkle}
            </svg>
        );
    }
    // growth
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
            <path d="M6 22L12 16L16 20L24 12" {...stroke} />
            <path d="M19 12H24V17" {...stroke} />
            {sparkle}
        </svg>
    );
}

type IconKind = "ai" | "sales" | "products" | "services" | "automation" | "growth";

const SERVICE_CARDS: Array<{
    title: string;
    description: string;
    subServices: string[];
    learnMore: string;
    href: string;
    accent: string;
    icon: IconKind;
}> = [
        {
            title: "Digital Products",
            description: "MVP development with AI built in from day one — validated and launched in weeks.",
            subServices: [
                "AI-native MVP development",
                "Validated product launches",
                "Scalable platform architecture",
            ],
            learnMore: "Build a digital product",
            href: "/products/digital-products",
            accent: "#4B91F7",
            icon: "products",
        },
        {
            title: "Digital Services",
            description: "Websites, platforms, and e-commerce engineered to convert and scale.",
            subServices: [
                "Websites & web platforms",
                "E-commerce & portals",
                "Conversion-optimized builds",
            ],
            learnMore: "Explore digital services",
            href: "/products/digital-services",
            accent: "#4B91F7",
            icon: "services",
        },
        {
            title: "Automation & Systems",
            description: "Eliminate manual operations and get real-time visibility across your entire business.",
            subServices: [
                "Workflow & back-office automation",
                "Real-time reporting & BI",
                "Operations infrastructure",
            ],
            learnMore: "Automate your operations",
            href: "/products/automation-systems",
            accent: "#4B91F7",
            icon: "automation",
        },
        {
            title: "AI and Intelligence",
            description: "AI-enhanced acquisition systems that scale without scaling headcount.",
            subServices: [
                "AI integration & assistants",
                "Custom model deployment",
                "Intelligent automation workflows",
            ],
            learnMore: "Explore AI & intelligence",
            href: "/products/ai-intelligence",
            accent: "#4B91F7",
            icon: "ai",
        },
    ];

// ── Service card primitives (icon square + sub-services + learn-more) ────
// Monochrome icon square — no accent color, no radial-glow halo, no boxShadow.
// `accent` prop kept for backwards compat but ignored.
function ServiceIconSquare({ icon, size = "md" }: { icon: IconKind; accent?: string; size?: "sm" | "md" }) {
    const dims = size === "sm" ? "h-11 w-11" : "h-14 w-14";
    return (
        <div
            className={`flex ${dims} items-center justify-center rounded-xl`}
            style={{
                background: "var(--home-control-bg, rgba(255,255,255,0.03))",
                border: "1px solid var(--home-control-border, rgba(255,255,255,0.08))",
            }}
        >
            <ServiceIcon kind={icon} />
        </div>
    );
}

function ServiceLearnMore({ label, href }: { label: string; href: string }) {
    return (
        <a
            href={href}
            className="group/lm inline-flex items-center gap-2 self-start text-sm font-semibold text-white transition-opacity hover:opacity-80"
        >
            {label}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="transition-transform duration-300 group-hover/lm:translate-x-0.5" aria-hidden>
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </a>
    );
}

// Featured 2×2 card — split content (text left, image placeholder right on lg+)
// ── Services accordion (Joidy-style: image left, expandable list right) ──
function ServicesAccordion() {
    const [active, setActive] = useState<number | null>(0);
    return (
        <div className="flex flex-col">
            {SERVICE_CARDS.map((card, i) => {
                const isOpen = active === i;
                const isLast = i === SERVICE_CARDS.length - 1;
                return (
                    <div
                        key={card.title}
                        className="transition-colors duration-300"
                        style={{
                            borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.08)",
                            background: isOpen ? "rgba(255,255,255,0.02)" : "transparent",
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setActive(isOpen ? null : i)}
                            aria-expanded={isOpen}
                            className="flex w-full items-center gap-5 py-6 text-left transition-colors duration-200 hover:bg-white/[0.02] md:py-7"
                        >
                            <span className="flex-shrink-0">
                                <ServiceIconSquare icon={card.icon} accent={card.accent} size="sm" />
                            </span>
                            <span className="flex-1 text-[1.25rem] font-bold leading-tight tracking-tight text-white md:text-[1.4rem]">
                                {card.title}
                            </span>
                            <span
                                aria-hidden
                                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-transform duration-300"
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
                                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                    className="overflow-hidden"
                                >
                                    <div className="flex flex-col gap-5 pb-6 pl-[60px] pr-4 md:pl-[68px]">
                                        <ul className="flex flex-col gap-3">
                                            {card.subServices.map((s) => (
                                                <li
                                                    key={s}
                                                    className="flex items-start gap-3 text-sm leading-relaxed text-white md:text-[15px]"
                                                >
                                                    <span
                                                        aria-hidden
                                                        className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rotate-45"
                                                        style={{ background: "rgba(255,255,255,0.6)" }}
                                                    />
                                                    <span>{s}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <ServiceLearnMore label={card.learnMore} href={card.href} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}

// ── Services Explorer (canonical §5 layout) ──────────────────────────────
// Left = clickable numbered list, right = active service detail panel.
function ServicesExplorer() {
    const [active, setActive] = useState(0);
    const card = SERVICE_CARDS[active];
    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[0.7fr_1.3fr] md:gap-12 lg:gap-16 items-start">
            {/* LEFT — clickable list */}
            <div className="flex flex-col">
                {SERVICE_CARDS.map((s, i) => {
                    const isActive = active === i;
                    return (
                        <button
                            key={s.title}
                            type="button"
                            onClick={() => setActive(i)}
                            aria-pressed={isActive}
                            className="group relative flex items-baseline gap-4 py-4 pl-5 pr-3 text-left transition-colors duration-200 hover:bg-white/[0.02]"
                            style={{
                                background: isActive ? "rgba(255,255,255,0.03)" : "transparent",
                            }}
                        >
                            {/* Active gradient left border */}
                            <span
                                aria-hidden
                                className="absolute left-0 top-0 bottom-0 w-[2px] transition-opacity duration-300"
                                style={{
                                    background: "linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.55))",
                                    opacity: isActive ? 1 : 0,
                                }}
                            />
                            <span
                                className="text-[10px] font-bold uppercase tracking-[0.18em] transition-colors duration-200"
                                style={{ color: isActive ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.4)" }}
                            >
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <span
                                className="flex-1 text-base font-bold tracking-tight transition-colors duration-200 md:text-lg"
                                style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.55)" }}
                            >
                                {s.title}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* RIGHT — active detail panel */}
            <div
                className="rounded-2xl p-7 md:p-9"
                style={{
                    background: "rgba(23,26,34,0.92)",
                    border: "1px solid rgba(255,255,255,0.07)",
                }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col gap-5"
                    >
                        <div className="mx-auto w-full max-w-sm">
                            <ImagePlaceholder
                                aspect="3 / 2"
                                label={`${card.title} mockup`}
                                accent={card.accent}
                            />
                        </div>
                        <span
                            className="text-[10px] font-bold uppercase tracking-[0.22em]"
                            style={{ color: `${card.accent}CC` }}
                        >
                            Service {String(active + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-[1.5rem] font-bold leading-snug tracking-tight text-white md:text-[1.75rem]">
                            {card.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-white/55 md:text-[15px]">
                            {card.description}
                        </p>
                        <ul className="flex flex-col gap-3">
                            {card.subServices.map((s) => (
                                <li
                                    key={s}
                                    className="flex items-start gap-3 text-sm leading-relaxed text-white md:text-[15px]"
                                >
                                    <span
                                        aria-hidden
                                        className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rotate-45"
                                        style={{ background: "rgba(255,255,255,0.55)" }}
                                    />
                                    <span>{s}</span>
                                </li>
                            ))}
                        </ul>
                        <ServiceLearnMore label={card.learnMore} href={card.href} />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

// ── Services Grid ─────────────────────────────────────────────────────────
function ServicesCarousel() {
    const BLUE = "#4B91F7";

    return (
        <div>
            {/* Header */}
            <div className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
                <div className="inline-flex items-center gap-3">
                    <span className="flex items-center">
                        <span className="animate-label-line" />
                        <span className="animate-label-dot" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">What we do</span>
                </div>
                <h2 className="display-section-title max-w-2xl text-center">
                    <span className="display-muted-line">Four capabilities.</span>
                    <span className="display-strong-line">One unified system.</span>
                </h2>
            </div>

            {/* 2×2 grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                {SERVICE_CARDS.map((card, i) => (
                    <a
                        key={card.title}
                        href={card.href}
                        className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl p-7 outline-none focus-visible:ring-2 focus-visible:ring-[#4B91F7]/60 md:block md:h-[300px] md:p-0"
                        style={{
                            background: "var(--home-card-bg, rgba(21,24,34,0.94))",
                            border: "1px solid var(--home-card-border, rgba(255,255,255,0.07))",
                            transition: "border-color 400ms ease, box-shadow 400ms ease",
                        }}
                        onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.borderColor = "rgba(75,145,247,0.3)";
                            el.style.boxShadow = "inset 0 0 0 1px rgba(75,145,247,0.08), 0 24px 60px rgba(0,0,0,0.35)";
                        }}
                        onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.borderColor = "var(--home-card-border, rgba(255,255,255,0.07))";
                            el.style.boxShadow = "";
                        }}
                    >
                        {/* Large watermark number */}
                        <span
                            aria-hidden
                            className="pointer-events-none absolute right-5 top-2 select-none font-bold leading-none text-white transition-opacity duration-500 group-hover:opacity-[0.02]"
                            style={{ fontSize: "140px", opacity: 0.035, letterSpacing: "-0.06em" }}
                        >
                            {String(i + 1).padStart(2, "0")}
                        </span>

                        {/* Radial glow — fades in on hover */}
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                            style={{ background: "radial-gradient(ellipse 70% 55% at 30% 100%, rgba(75,145,247,0.09) 0%, transparent 65%)" }}
                        />

                        {/* Top bar — icon + number badge */}
                        <div className="relative z-10 flex items-center justify-between md:absolute md:left-7 md:right-7 md:top-7">
                            <div
                                className="flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-400"
                                style={{
                                    background: "rgba(75,145,247,0.09)",
                                    border: "1px solid rgba(75,145,247,0.2)",
                                }}
                            >
                                <ServiceIcon kind={card.icon} size={22} />
                            </div>
                            <span className="text-[10px] font-bold tracking-[0.2em] text-white/20">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                        </div>

                        {/* Title — lifts on hover at md+; in normal flow on mobile */}
                        <div
                            className="relative z-10 mt-auto md:absolute md:bottom-7 md:left-7 md:right-7 md:mt-0 md:transition-transform md:duration-[400ms] md:ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover:-translate-y-[76px]"
                        >
                            <h3 className="text-[1.35rem] font-semibold leading-snug tracking-tight text-white md:text-[1.45rem]">
                                {card.title}
                            </h3>
                        </div>

                        {/* Description + CTA — always visible on mobile; hover-reveal on md+ */}
                        <div
                            className="relative z-10 md:absolute md:bottom-7 md:left-7 md:right-7 md:translate-y-3 md:opacity-0 md:transition-all md:duration-[400ms] md:ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover:translate-y-0 md:group-hover:opacity-100"
                        >
                            <p className="text-sm leading-relaxed text-white/55">{card.description}</p>
                            <span
                                className="mt-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]"
                                style={{ color: BLUE }}
                            >
                                Explore
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                                    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke={BLUE} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

const KEY_RESULTS: Array<{ leadNumber: number; suffix: string; label: string }> = [
    { leadNumber: 3, suffix: "–5×", label: "Increase in lead conversion" },
    { leadNumber: 60, suffix: "%", label: "Reduction in manual ops" },
    { leadNumber: 6, suffix: "–12wk", label: "To MVP launch" },
    { leadNumber: 12, suffix: "mo", label: "Average ROI timeline" },
];

// ── Why Choose Levata visual hints (monochrome schematic SVGs) ────────────
const MONO_STROKE = "var(--home-diagram-stroke, rgba(255,255,255,0.65))";
const MONO_FILL = "var(--home-diagram-fill, rgba(255,255,255,0.08))";

function IconLayersDiagram() {
    // 3 stacked horizontal layers with embedded nodes — represents AI-native foundation
    return (
        <svg width="80" height="36" viewBox="0 0 80 36" fill="none" aria-hidden>
            <rect x="10" y="6" width="60" height="6" rx="2" fill={MONO_FILL} stroke={MONO_STROKE} strokeWidth="1.2" />
            <rect x="10" y="15" width="60" height="6" rx="2" fill={MONO_FILL} stroke={MONO_STROKE} strokeWidth="1.2" />
            <rect x="10" y="24" width="60" height="6" rx="2" fill={MONO_FILL} stroke={MONO_STROKE} strokeWidth="1.2" />
            <circle cx="22" cy="9" r="1.5" fill={MONO_STROKE} />
            <circle cx="40" cy="18" r="1.5" fill={MONO_STROKE} />
            <circle cx="58" cy="27" r="1.5" fill={MONO_STROKE} />
        </svg>
    );
}

function IconE2EDiagram() {
    return (
        <svg width="80" height="36" viewBox="0 0 80 36" fill="none" aria-hidden>
            <line x1="14" y1="18" x2="40" y2="18" stroke={MONO_STROKE} strokeWidth="1.4" strokeDasharray="3 3" opacity="0.6" />
            <line x1="40" y1="18" x2="66" y2="18" stroke={MONO_STROKE} strokeWidth="1.4" strokeDasharray="3 3" opacity="0.6" />
            <circle cx="14" cy="18" r="7" fill="rgba(23,26,34,0.98)" stroke={MONO_STROKE} strokeWidth="1.4" />
            <circle cx="14" cy="18" r="2.5" fill={MONO_STROKE} />
            <circle cx="40" cy="18" r="7" fill="rgba(23,26,34,0.98)" stroke={MONO_STROKE} strokeWidth="1.4" />
            <circle cx="40" cy="18" r="2.5" fill={MONO_STROKE} />
            <circle cx="66" cy="18" r="7" fill="rgba(23,26,34,0.98)" stroke={MONO_STROKE} strokeWidth="1.4" />
            <circle cx="66" cy="18" r="2.5" fill={MONO_STROKE} />
        </svg>
    );
}

function IconLoopDiagram() {
    return (
        <svg width="80" height="36" viewBox="0 0 80 36" fill="none" aria-hidden>
            <path d="M14 22 Q 40 -2, 66 22" stroke={MONO_STROKE} strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M66 22 Q 40 38, 14 22" stroke={MONO_STROKE} strokeWidth="1.5" strokeDasharray="3 3" fill="none" strokeLinecap="round" opacity="0.55" />
            <path d="M58 16 L 66 22 L 60 28" stroke={MONO_STROKE} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="14" cy="22" r="3" fill={MONO_STROKE} />
        </svg>
    );
}

function IconBarsDiagram() {
    return (
        <svg width="80" height="36" viewBox="0 0 80 36" fill="none" aria-hidden>
            <rect x="10" y="22" width="10" height="10" rx="1.5" fill={MONO_FILL} stroke={MONO_STROKE} strokeWidth="1.2" />
            <rect x="26" y="16" width="10" height="16" rx="1.5" fill={MONO_FILL} stroke={MONO_STROKE} strokeWidth="1.2" />
            <rect x="42" y="10" width="10" height="22" rx="1.5" fill={MONO_FILL} stroke={MONO_STROKE} strokeWidth="1.2" />
            <rect x="58" y="4" width="10" height="28" rx="1.5" fill={MONO_FILL} stroke={MONO_STROKE} strokeWidth="1.2" />
            <path d="M15 24 L 31 18 L 47 12 L 63 6" stroke={MONO_STROKE} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function WhyCardIcon({ idx }: { idx: number }) {
    if (idx === 0) return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="2" y="3" width="20" height="5" rx="1.5" />
            <rect x="2" y="10" width="20" height="5" rx="1.5" />
            <rect x="2" y="17" width="20" height="5" rx="1.5" />
        </svg>
    );
    if (idx === 1) return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="5" cy="12" r="2.5" />
            <circle cx="19" cy="12" r="2.5" />
            <circle cx="12" cy="6" r="2.5" />
            <line x1="7.2" y1="10.9" x2="10" y2="7.9" />
            <line x1="14" y1="7.9" x2="16.8" y2="10.9" />
            <line x1="7.5" y1="12" x2="9.5" y2="12" />
            <line x1="14.5" y1="12" x2="16.5" y2="12" />
        </svg>
    );
    if (idx === 2) return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
    );
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
    );
}

const WHY_LEVATA: Array<{
    num: string; title: string; body: string;
    tags: string[]; featured?: boolean;
}> = [
    {
        num: "01",
        title: "AI-Native From Day One",
        body: "Every system we build has AI at its core — not bolted on later. Strategy, architecture, and execution all compound over time.",
        tags: ["INTELLIGENT SYSTEMS", "AI STRATEGY", "NO CODE LIMITS"],
    },
    {
        num: "02",
        title: "End-to-End, One Team",
        body: "Strategy, design, engineering, and growth — all under one roof with one shared goal. No handoffs. No gaps.",
        tags: ["FULL-STACK", "ONE TEAM", "NO HAND-OFFS"],
        featured: true,
    },
    {
        num: "03",
        title: "Outcomes Over Outputs",
        body: "We commit to measurable results — pipeline growth, conversion lift, ops cost reduction. Not deliverables. Not sprints.",
        tags: ["PIPELINE GROWTH", "ROI-DRIVEN", "ALWAYS-ON"],
    },
    {
        num: "04",
        title: "Continuous Optimisation",
        body: "We don't disappear after launch. We measure, iterate, and compound results every month.",
        tags: ["MONTHLY REVIEW", "COMPOUND GROWTH", "ALWAYS-ON"],
    },
];

// ── Problem section: pain points ──────────────────────────────────────────
const PAIN_POINTS: Array<{ title: string; desc: string }> = [
    {
        title: "Manual operations bleeding hours",
        desc: "Your team spends their best hours on tasks that should run automatically — reporting, data entry, follow-ups.",
    },
    {
        title: "No single source of truth",
        desc: "Disconnected tools and siloed data mean decisions get made on guesswork and outdated exports.",
    },
    {
        title: "Digital presence that doesn't convert",
        desc: "Traffic comes in but doesn't qualify. No pipeline infrastructure means no compounding growth.",
    },
    {
        title: "AI adoption without a system",
        desc: "Off-the-shelf AI tools create more overhead than they remove without proper integration and strategy.",
    },
];

// ── Solution section: 4-node delivery flow ────────────────────────────────
const FLOW_NODES: Array<{ num: string; title: string; caption: string; icon: IconKind; accent: string }> = [
    { num: "01", title: "Diagnose", caption: "Map operations, surface friction, identify ROI opportunities.", icon: "sales", accent: "#4B91F7" },
    { num: "02", title: "Architect", caption: "Design AI-native systems matched to your business model.", icon: "ai", accent: "#4B91F7" },
    { num: "03", title: "Build", caption: "Ship integrated products, automation, and intelligence layers.", icon: "products", accent: "#4B91F7" },
    { num: "04", title: "Compound", caption: "Measure, iterate, and grow returns month over month.", icon: "growth", accent: "#4B91F7" },
];

// ── Reusable inline helpers ───────────────────────────────────────────────

function ImagePlaceholder({
    aspect = "16 / 9",
    label = "Image placeholder",
    className = "",
    accent,
}: {
    aspect?: string;
    label?: string;
    className?: string;
    accent?: string;
}) {
    const bg = accent
        ? `linear-gradient(135deg, ${accent}1F, ${accent}08)`
        : "linear-gradient(135deg, rgba(75,145,247,0.10), rgba(75,145,247,0.06))";
    const border = accent ? `1px solid ${accent}33` : "1px solid rgba(255,255,255,0.06)";
    const glow = accent
        ? `radial-gradient(ellipse 60% 60% at 50% 50%, ${accent}33 0%, transparent 70%)`
        : "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(75,145,247,0.18) 0%, transparent 70%)";
    return (
        <div
            className={`relative w-full overflow-hidden rounded-xl ${className}`}
            style={{ aspectRatio: aspect, background: bg, border }}
            aria-hidden
        >
            <div className="hero-grid-bg absolute inset-0 opacity-50" />
            <div className="absolute inset-0" style={{ background: glow }} />
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                    {label}
                </span>
            </div>
        </div>
    );
}

// ── §4 SOLUTION: flow node + animated connector ──
function FlowNode({ num, title, caption, icon, accent }: typeof FLOW_NODES[number]) {
    return (
        <div className="flex flex-col items-center gap-4 text-center w-36">
            {/* Number badge above node */}
            <span
                className="text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: "rgba(75,145,247,0.6)" }}
            >
                {num}
            </span>
            {/* Node */}
            <div
                className="rounded-2xl p-px"
                style={{
                    background: "linear-gradient(135deg, rgba(75,145,247,0.55) 0%, rgba(255,255,255,0.06) 50%, rgba(75,145,247,0.45) 100%)",
                    boxShadow: "0 12px 36px rgba(75,145,247,0.15)",
                }}
            >
                <div
                    className="flex h-24 w-24 items-center justify-center rounded-[15px]"
                    style={{ background: "rgba(10,14,28,0.98)" }}
                >
                    <ServiceIcon kind={icon} accent={accent} size={36} />
                </div>
            </div>
            <h3 className="text-sm font-semibold tracking-tight text-white md:text-base">{title}</h3>
            <p className="text-xs leading-relaxed md:text-sm" style={{ color: "rgba(255,255,255,0.45)", maxWidth: "140px" }}>{caption}</p>
        </div>
    );
}

function FlowConnector({ vertical = false }: { vertical?: boolean }) {
    if (vertical) {
        return (
            <div className="flex justify-center py-1" aria-hidden>
                <div className="relative flex flex-col items-center" style={{ height: "52px", width: "2px" }}>
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(75,145,247,0.15), rgba(75,145,247,0.35), rgba(75,145,247,0.15))" }} />
                    <motion.div
                        className="absolute w-2 h-2 rounded-full -left-[3px]"
                        style={{ background: "rgba(75,145,247,0.9)", boxShadow: "0 0 8px rgba(75,145,247,0.7)" }}
                        initial={{ top: 0 }}
                        animate={{ top: "calc(100% - 8px)" }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                    />
                </div>
            </div>
        );
    }
    return (
        <div className="flex items-center w-16 flex-shrink-0" aria-hidden style={{ marginTop: "52px" }}>
            <div className="relative flex w-full items-center">
                <div className="h-px w-full" style={{ background: "linear-gradient(to right, rgba(75,145,247,0.25), rgba(75,145,247,0.5), rgba(75,145,247,0.25))" }} />
                <svg className="flex-shrink-0 -ml-px" width="7" height="12" viewBox="0 0 7 12" fill="none">
                    <path d="M1 1L6 6L1 11" stroke="rgba(75,145,247,0.55)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <motion.div
                    className="absolute h-1.5 w-1.5 rounded-full"
                    style={{ top: "50%", marginTop: "-3px", background: "rgba(75,145,247,0.9)", boxShadow: "0 0 6px rgba(75,145,247,0.7)" }}
                    initial={{ left: 0 }}
                    animate={{ left: "calc(100% - 8px)" }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                />
            </div>
        </div>
    );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function HeroSection() {
    const { open: openBookCall } = useBookCall();
    return (
        <main className="relative min-h-screen bg-[var(--background)] flex flex-col">

            {/* ── 1. HERO (cinematic) ──────────────────────────── */}
            <HomeHero />
            <SectionDivider />

            {/* ── 2. THE PROBLEM ────────── */}
            <section id="problem" className="home-theme-dark relative w-full px-6 py-20 md:py-28 overflow-hidden">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: [
                        "radial-gradient(ellipse 50% 50% at 20% 30%, rgba(75,145,247,0.06) 0%, transparent 70%)",
                        "radial-gradient(ellipse 40% 50% at 80% 70%, rgba(75,145,247,0.05) 0%, transparent 70%)",
                    ].join(", "),
                }} />
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-14 flex flex-col items-center text-center gap-5"
                    >
                        <SectionLabel text="The problem" />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">Most businesses run on</span>
                            <span className="display-strong-line">duct tape and spreadsheets.</span>
                        </h2>
                        <p className="max-w-xl text-base text-white/45 md:text-lg leading-relaxed">
                            Levata replaces the chaos with infrastructure.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14 items-center">
                        {/* Left: Pain points list */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col divide-y"
                            style={{ borderColor: "rgba(255,255,255,0.06)" }}
                        >
                            {PAIN_POINTS.map((p, i) => (
                                <div key={i} className="flex items-start gap-5 py-5 first:pt-0 last:pb-0">
                                    <span
                                        className="flex-shrink-0 mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-bold tabular-nums"
                                        style={{
                                            background: "rgba(255,255,255,0.04)",
                                            border: "1px solid rgba(255,255,255,0.08)",
                                            color: "rgba(255,255,255,0.3)",
                                        }}
                                    >
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-white mb-1.5 md:text-base">{p.title}</p>
                                        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>{p.desc}</p>
                                    </div>
                                    <span
                                        aria-hidden
                                        className="flex-shrink-0 mt-1 flex h-5 w-5 items-center justify-center rounded-full"
                                        style={{ background: "rgba(255,60,60,0.08)", border: "1px solid rgba(255,60,60,0.22)" }}
                                    >
                                        <svg viewBox="0 0 8 8" fill="none" className="h-2 w-2">
                                            <line x1="2" y1="2" x2="6" y2="6" stroke="rgba(255,90,90,0.7)" strokeWidth="1.5" strokeLinecap="round" />
                                            <line x1="6" y1="2" x2="2" y2="6" stroke="rgba(255,90,90,0.7)" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </span>
                                </div>
                            ))}
                        </motion.div>

                        {/* Right: Placeholder visual */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <ImagePlaceholder aspect="4/3" label="Operations before Levata" accent="#4B91F7" className="min-h-[300px]" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Problem → Solution editorial break ──────────── */}
            <div className="home-theme-dark w-full px-6 py-16 md:py-24 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center"
                >
                    <p
                        className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-6xl"
                        style={{ color: "var(--text-muted)" }}
                    >
                        So we built
                    </p>
                    <p
                        className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-6xl"
                        style={{ color: "var(--text-primary)" }}
                    >
                        the fix.
                    </p>
                </motion.div>
            </div>

            {/* ── 3. OUR SOLUTION (with 4-node flow diagram) ───── */}
            <section id="solution" className="home-theme-dark relative w-full px-6 pt-10 pb-24 md:pt-14 md:pb-28 overflow-hidden">
                <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0" style={{
                        background: [
                            "radial-gradient(ellipse 55% 50% at 50% 25%, rgba(75,145,247,0.08) 0%, transparent 65%)",
                            "radial-gradient(ellipse 40% 45% at 15% 75%, rgba(75,145,247,0.05) 0%, transparent 60%)",
                        ].join(", ")
                    }} />
                </div>
                <div aria-hidden className="pointer-events-none absolute inset-0 home-ai-grid opacity-[0.3]" />
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="mx-auto mb-16 flex max-w-4xl flex-col items-center text-center gap-5"
                    >
                        <SectionLabel text="Our solution" />
                        <p className="text-sm text-white/45 md:text-base">
                            This is the system that replaces the duct tape.
                        </p>
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">We don&apos;t sell services.</span>
                            <span className="display-strong-line">We build infrastructure.</span>
                        </h2>
                        <p className="max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
                            Levata designs and operates integrated AI systems built specifically for your business model
                            and growth trajectory. Strategy, technology, automation, and digital experience — all
                            coordinated under one team, one vision, and one accountability structure.
                        </p>
                    </motion.div>

                    {/* Flow diagram — horizontal on md+, vertical on mobile */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Desktop: horizontal centered */}
                        <div className="hidden md:flex items-start justify-center gap-0">
                            {FLOW_NODES.map((node, i) => (
                                <div key={node.num} className="flex items-start">
                                    <FlowNode {...node} />
                                    {i < FLOW_NODES.length - 1 && <FlowConnector />}
                                </div>
                            ))}
                        </div>
                        {/* Mobile: vertical */}
                        <div className="flex flex-col items-center gap-2 md:hidden">
                            {FLOW_NODES.map((node, i) => (
                                <div key={node.num} className="flex flex-col items-center">
                                    <FlowNode {...node} />
                                    {i < FLOW_NODES.length - 1 && <FlowConnector vertical />}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            <SectionDivider />

            {/* §5 Featured Product moved to §7 — see below */}

            {/* ── 4. SERVICE CATEGORIES (Horizontal carousel) ──── */}
            <section id="services" className="home-theme-dark relative w-full px-5 py-14 sm:px-6 sm:py-20 md:py-28 overflow-hidden">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: "radial-gradient(ellipse 60% 70% at 50% 40%, rgba(75,145,247,0.05) 0%, transparent 70%)",
                }} />

                <div className="relative z-10 mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <ServicesCarousel />
                    </motion.div>
                </div>
            </section>

            <SectionDivider />

            {/* ── 5. MID-PAGE CTA ──────────────────────────────── */}
            <section className="home-theme-dark relative w-full px-5 py-16 sm:px-6 sm:py-20 overflow-hidden">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: "radial-gradient(ellipse 55% 65% at 50% 100%, rgba(75,145,247,0.07) 0%, transparent 65%)",
                }} />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-7 text-center"
                >
                    <h2 className="display-section-title max-w-2xl text-center">
                        <span className="display-muted-line">See how it all fits</span>
                        <span className="display-strong-line">into your business.</span>
                    </h2>
                    <p className="max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
                        Book a free strategy call. We&apos;ll map out exactly what your business needs — no commitment required.
                    </p>
                    <div className="flex flex-col items-center gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90 cursor-pointer"
                            style={{ background: "linear-gradient(135deg, #4B91F7 0%, #7B55EA 100%)" }}
                        >
                            Book a Strategy Call
                            <span aria-hidden className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                        </button>
                        <a
                            href="/contact"
                            className="text-sm font-medium text-white/50 transition-colors duration-200 hover:text-white/80"
                        >
                            Or send us a message →
                        </a>
                    </div>
                </motion.div>
            </section>

            <SectionDivider />

            {/* ── 6. CLIENTS MARQUEE ─────────────────── */}
            <div className="relative z-10">
                <ClientsMarquee />
            </div>

            <SectionDivider />

            {/* ── 7. FEATURED PRODUCT — Sales Intelligence Platform ── */}
            <section className="home-theme-dark relative w-full px-6 pt-20 pb-10 md:pt-24 md:pb-14 overflow-hidden">
                <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0" style={{
                        background: [
                            "radial-gradient(ellipse 65% 55% at 50% 30%, rgba(75,145,247,0.09) 0%, transparent 65%)",
                            "radial-gradient(ellipse 40% 50% at 85% 70%, rgba(123,85,234,0.07) 0%, transparent 60%)",
                        ].join(", ")
                    }} />
                </div>
                <div aria-hidden className="pointer-events-none absolute inset-0 home-ai-grid opacity-[0.25]" />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 mx-auto mb-12 flex max-w-3xl flex-col items-center text-center gap-5"
                >
                    <SectionLabel text="Featured product" />
                    <h2 className="display-section-title max-w-2xl text-center">
                        <span className="display-muted-line">The AI Sales Workspace</span>
                        <span className="display-strong-line">Built for B2B Teams.</span>
                    </h2>
                    <p className="max-w-2xl text-sm leading-relaxed text-white/45 md:text-base">
                        Turn your raw lead list into a researched, prioritized, and actionable pipeline — in hours,
                        not days.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="mx-auto w-full max-w-5xl"
                >
                    <div className="rounded-3xl p-px" style={{
                        background: "linear-gradient(105deg, rgba(75,145,247,0.45) 0%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.06) 60%, rgba(75,145,247,0.4) 100%)",
                        boxShadow: "-8px 0 40px rgba(75,145,247,0.12), 8px 0 40px rgba(75,145,247,0.12)",
                    }}>
                        <div
                            className="relative rounded-3xl overflow-hidden"
                            style={{ background: "rgba(6,0,20,0.98)" }}
                        >
                            <div className="relative flex flex-col lg:flex-row">
                                <div className="flex flex-col justify-center gap-6 p-10 lg:p-14 lg:w-[48%]">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
                                            style={{ background: "rgba(75,145,247,0.08)", color: "rgba(75,145,247,0.8)", border: "1px solid rgba(75,145,247,0.22)" }}
                                        >
                                            Sales Intelligence Platform
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-semibold tracking-tight text-white md:text-3xl leading-tight">
                                        Pipeline that builds itself.
                                    </h3>
                                    <p className="text-sm text-white/50 leading-relaxed">
                                        Perfect for B2B sales teams, founder-led outbound, and agencies running
                                        lead generation campaigns.
                                    </p>
                                    <ul className="flex flex-col gap-2.5">
                                        {PRODUCT_FEATURES.map((feat) => (
                                            <li key={feat} className="flex items-start gap-3 text-sm text-white/65">
                                                <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                                                    style={{ background: "rgba(75,145,247,0.15)", border: "1px solid rgba(75,145,247,0.3)" }}>
                                                    <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5" aria-hidden="true">
                                                        <path d="M2 5l2.5 2.5L8 3" stroke="#4B91F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </span>
                                                <span className="leading-snug">{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <a href="/products/sales-intelligence-platform" className="mt-2 inline-flex w-fit items-center">
                                        <CircleArrow label="Explore the platform" />
                                    </a>
                                </div>

                                {/* Dashboard mockup */}
                                <div className="relative flex-1 min-h-[360px] lg:min-h-0 overflow-hidden"
                                    style={{ borderLeft: "1px solid rgba(255,255,255,0.06)", background: "#06001a" }}>
                                    <div className="pointer-events-none absolute inset-0"
                                        style={{
                                            background: [
                                                "radial-gradient(ellipse 55% 55% at 10% 85%, rgba(75,145,247,0.22) 0%, transparent 65%)",
                                                "radial-gradient(ellipse 45% 50% at 90% 20%, rgba(75,145,247,0.18) 0%, transparent 65%)",
                                            ].join(", ")
                                        }} />
                                    <div className="absolute inset-0 p-5 flex gap-3 text-[10px]">
                                        <div className="flex flex-col gap-1 w-28 flex-shrink-0" style={{ borderRight: "1px solid rgba(255,255,255,0.06)", paddingRight: "10px" }}>
                                            <div className="mb-3">
                                                <div className="h-2 w-16 rounded" style={{ background: "rgba(255,255,255,0.5)" }} />
                                                <div className="mt-1 h-1.5 w-10 rounded" style={{ background: "rgba(255,255,255,0.15)" }} />
                                            </div>
                                            {[
                                                { label: "Dashboard", active: true },
                                                { label: "Leads", active: false },
                                                { label: "Pipeline", active: false },
                                                { label: "Outreach", active: false },
                                                { label: "Analytics", active: false },
                                                { label: "Settings", active: false },
                                            ].map(({ label, active }) => (
                                                <div key={label} className="flex items-center gap-2 rounded-md px-2 py-1.5"
                                                    style={{ background: active ? "rgba(75,145,247,0.08)" : "transparent" }}>
                                                    <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                                                        style={{ background: active ? "rgba(75,145,247,0.5)" : "rgba(255,255,255,0.12)" }} />
                                                    <span style={{ color: active ? "rgba(75,145,247,0.9)" : "rgba(255,255,255,0.3)", fontSize: "9px", fontWeight: active ? 600 : 400 }}>{label}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex flex-col gap-3 flex-1 min-w-0">
                                            <div className="grid grid-cols-3 gap-2">
                                                {[
                                                    { label: "Pipeline Value", value: "$284k", sub: "+12% this month", c: "#4B91F7" },
                                                    { label: "Leads Scored", value: "1,048", sub: "94 high-intent", c: "#4B91F7" },
                                                    { label: "Deals Closed", value: "37", sub: "↑ 8 from last mo.", c: "#3ECF8E" },
                                                ].map(({ label, value, sub, c }) => (
                                                    <div key={label} className="rounded-xl p-2.5"
                                                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                                        <p style={{ color: c, fontSize: "8px", fontWeight: 600, marginBottom: "3px" }}>{label}</p>
                                                        <p style={{ color: "#fff", fontSize: "13px", fontWeight: 700, lineHeight: 1 }}>{value}</p>
                                                        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "8px", marginTop: "3px" }}>{sub}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="rounded-xl p-3 flex-1"
                                                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "9px", fontWeight: 600 }}>Revenue vs Forecast</p>
                                                    <div className="flex gap-2">
                                                        {["Actual", "Forecast"].map((l, i) => (
                                                            <div key={l} className="flex items-center gap-1">
                                                                <div className="w-2 h-0.5 rounded" style={{ background: i === 0 ? "#4B91F7" : "rgba(75,145,247,0.5)" }} />
                                                                <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "8px" }}>{l}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <svg viewBox="0 0 280 70" className="w-full" style={{ height: "70px" }} aria-hidden="true">
                                                    {[0, 1, 2, 3].map(i => (
                                                        <line key={i} x1="0" y1={i * 22 + 4} x2="280" y2={i * 22 + 4}
                                                            stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                                                    ))}
                                                    <polyline
                                                        points="0,55 40,50 80,45 120,42 160,38 200,35 240,33 280,30"
                                                        fill="none" stroke="rgba(75,145,247,0.35)" strokeWidth="1.5" strokeDasharray="4 3"
                                                    />
                                                    <polygon
                                                        points="0,70 0,58 40,52 80,40 120,48 160,35 200,28 240,32 280,22 280,70"
                                                        fill="url(#chartFillFeatured)" opacity="0.4"
                                                    />
                                                    <polyline
                                                        points="0,58 40,52 80,40 120,48 160,35 200,28 240,32 280,22"
                                                        fill="none" stroke="#4B91F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                                    />
                                                    <circle cx="200" cy="28" r="3" fill="#4B91F7" />
                                                    <circle cx="200" cy="28" r="5" fill="rgba(75,145,247,0.2)" />
                                                    <defs>
                                                        <linearGradient id="chartFillFeatured" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="#4B91F7" />
                                                            <stop offset="100%" stopColor="#4B91F7" stopOpacity="0" />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                                <div className="flex justify-between mt-1">
                                                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map(m => (
                                                        <span key={m} style={{ color: "rgba(255,255,255,0.2)", fontSize: "7px" }}>{m}</span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="rounded-xl overflow-hidden"
                                                style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
                                                <div className="grid grid-cols-4 px-3 py-1.5"
                                                    style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                                    {["Lead", "Score", "Stage", "Value"].map(h => (
                                                        <span key={h} style={{ color: "rgba(255,255,255,0.25)", fontSize: "8px", fontWeight: 600 }}>{h}</span>
                                                    ))}
                                                </div>
                                                {[
                                                    { lead: "Acme Corp", score: "94", stage: "Proposal", value: "$42k", sc: "#3ECF8E" },
                                                    { lead: "Vertex AI", score: "87", stage: "Discovery", value: "$18k", sc: "#4B91F7" },
                                                    { lead: "Nexus Ltd", score: "71", stage: "Qualified", value: "$29k", sc: "#FFD21E" },
                                                ].map((row, i) => (
                                                    <div key={i} className="grid grid-cols-4 px-3 py-1.5"
                                                        style={{ borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.03)" : "none", background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                                                        <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "8px" }}>{row.lead}</span>
                                                        <span style={{ color: row.sc, fontSize: "8px", fontWeight: 700 }}>{row.score}</span>
                                                        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "8px" }}>{row.stage}</span>
                                                        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "8px" }}>{row.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            <SectionDivider />

            {/* ── 8. BY THE NUMBERS (clean 4-counter row) ──────── */}
            <section id="numbers" className="home-theme-dark relative w-full px-6 pt-10 pb-20 md:pt-14 md:pb-24">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background:
                        "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(75,145,247,0.06) 0%, transparent 65%)",
                }} />
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-10 flex flex-col items-center md:mb-14 text-center gap-5"
                    >
                        <SectionLabel text="By the numbers" />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">The outcomes speak</span>
                            <span className="display-strong-line">for themselves.</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-y-12 gap-x-8 md:grid-cols-4 md:gap-x-12 text-center">
                        {KEY_RESULTS.map((r) => (
                            <StatCounter key={r.label} {...r} />
                        ))}
                    </div>
                </div>
            </section>

            <SectionDivider />

            {/* ── 9. TESTIMONIALS ─────────────────────────────── */}
            <TestimonialsSection />

            <SectionDivider />

            {/* ── 10. TECH STACK (LOCKED) ──────────────────────── */}
            <TechStackSection />

            <SectionDivider />

            {/* ── 11. WHY CHOOSE LEVATA (3-column feature cards) ── */}
            <section className="home-theme-dark relative w-full px-5 py-14 sm:px-6 sm:py-20 md:py-24 overflow-hidden">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: [
                        "radial-gradient(ellipse 50% 50% at 20% 50%, rgba(75,145,247,0.07) 0%, transparent 70%)",
                        "radial-gradient(ellipse 50% 50% at 80% 50%, rgba(75,145,247,0.06) 0%, transparent 70%)",
                    ].join(", "),
                }} />
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-10 flex flex-col items-center md:mb-14 text-center gap-5"
                    >
                        <SectionLabel text="Why Levata" />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">AI-native.</span>
                            <span className="display-strong-line">End-to-end. Always-on.</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
                        {WHY_LEVATA.map((w, i) => (
                            <motion.div
                                key={w.num}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                                className="relative flex flex-col rounded-2xl p-8 md:p-9 overflow-hidden"
                                style={w.featured ? {
                                    background: "rgba(10,14,28,0.98)",
                                    border: "1px solid rgba(75,145,247,0.22)",
                                } : {
                                    background: "var(--home-card-bg)",
                                    border: "1px solid var(--home-card-border)",
                                }}
                            >
                                {w.featured && (
                                    <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl" style={{
                                        background: "radial-gradient(ellipse 80% 45% at 50% -5%, rgba(75,145,247,0.16) 0%, transparent 70%)",
                                    }} />
                                )}

                                {/* Icon + number row */}
                                <div className="relative flex items-start justify-between mb-8">
                                    <div className="flex items-center justify-center rounded-xl w-11 h-11" style={{
                                        background: "rgba(255,255,255,0.04)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        color: "rgba(255,255,255,0.55)",
                                    }}>
                                        <WhyCardIcon idx={i} />
                                    </div>
                                    <span className="text-sm font-semibold tabular-nums" style={{ color: "rgba(255,255,255,0.18)" }}>{w.num}</span>
                                </div>

                                {/* Title + body */}
                                <div className="relative flex flex-col gap-3 flex-1 mb-8">
                                    <h3 className="text-xl font-semibold leading-snug tracking-tight text-white md:text-2xl">{w.title}</h3>
                                    <p className="text-sm leading-relaxed md:text-[15px]" style={{ color: "rgba(255,255,255,0.5)" }}>{w.body}</p>
                                </div>

                                {/* Tags */}
                                <div className="relative flex flex-wrap gap-2">
                                    {w.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em]"
                                            style={{
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                background: "rgba(255,255,255,0.03)",
                                                color: "rgba(255,255,255,0.4)",
                                            }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <SectionDivider />

            {/* ── 12. FINAL CTA ──────────────────────────────── */}
            <section className="home-theme-dark relative w-full overflow-hidden px-5 py-16 sm:px-6 sm:py-24 md:py-32">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: [
                        "radial-gradient(ellipse 80% 70% at 50% 110%, rgba(75,145,247,0.22) 0%, rgba(75,145,247,0.1) 45%, transparent 70%)",
                        "radial-gradient(ellipse 50% 40% at 50% 0%, rgba(75,145,247,0.06) 0%, transparent 60%)",
                    ].join(", "),
                }} />
                <div aria-hidden className="absolute left-1/2 top-0 h-px w-32 -translate-x-1/2" style={{ background: "linear-gradient(to right, transparent, rgba(75,145,247,0.5), transparent)" }} />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-8 text-center"
                >
                    <SectionLabel text="Get started" />
                    <h2 className="display-section-title max-w-2xl text-center">
                        <span className="display-muted-line">Ready to build intelligence</span>
                        <span className="display-strong-line">into your operations?</span>
                    </h2>
                    <p className="max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
                        Book a free strategy call. We&apos;ll map out the system your business needs.
                    </p>
                    <div className="flex flex-col items-center gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="group inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90 cursor-pointer sm:py-3.5"
                            style={{ background: "linear-gradient(135deg, #4B91F7 0%, #7B55EA 100%)" }}
                        >
                            Book a Strategy Call
                            <span aria-hidden className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                        </button>
                    </div>
                </motion.div>
            </section>

        </main>
    );
}
