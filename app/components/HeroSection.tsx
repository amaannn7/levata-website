"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    SiReact, SiNextdotjs, SiVuedotjs, SiNuxt, SiSvelte, SiAngular,
    SiExpress, SiNestjs, SiSpring, SiFastapi, SiDjango, SiLaravel,
    SiSanity, SiContentful, SiStrapi, SiWordpress, SiPayloadcms, SiDirectus,
    SiPostgresql, SiMysql, SiMongodb, SiSupabase, SiFirebase, SiRedis,
} from "react-icons/si";
import { Button as NeonButton } from "@/app/components/ui/neon-button";
import ClientsMarquee from "@/app/components/ClientsMarquee";
import { CircleArrow } from "@/app/components/ServicesSection";
import TestimonialsSection from "@/app/components/TestimonialsSection";
import HomeHero from "@/app/components/HomeHero";
import ProcessTabsSection from "@/app/components/ProcessTabsSection";
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
                className="text-5xl font-extrabold leading-none tracking-tight md:text-6xl"
                style={{ color: "#3DFD98" }}
            >
                {count}
                <span style={{ color: "#3DFD98" }}>{suffix}</span>
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
                        className="group flex flex-shrink-0 items-center justify-center"
                        style={{ width: 44, height: 44 }}
                    >
                        <Icon
                            size={40}
                            className="[filter:grayscale(1)_brightness(0)_invert(1)_opacity(0.55)] transition-[filter,opacity] duration-300 group-hover:[filter:grayscale(1)_brightness(0)_invert(1)_opacity(1)_drop-shadow(0_0_12px_rgba(255,255,255,0.4))]"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

function TechStackSection() {
    return (
        <section className="relative w-full px-5 py-14 sm:px-6 sm:py-20 md:py-24 overflow-hidden">
            <div className="relative z-10 mx-auto max-w-6xl">
                <div className="mb-12 flex flex-col items-center text-center gap-5">
                    <SectionLabel text="Our stack" />
                    <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-white md:text-4xl leading-[1.1]">
                        Built on tech that compounds.
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
function ServiceIcon({ kind }: { kind: IconKind; accent?: string }) {
    const ICON_COLOR = "#72C8F5";
    const sparkle = (
        <path
            d="M26 4L27 6L29 7L27 8L26 10L25 8L23 7L25 6Z"
            fill={ICON_COLOR}
        />
    );
    const stroke = { stroke: ICON_COLOR, strokeWidth: 1.8, fill: "none" as const, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
    if (kind === "ai") {
        return (
            <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden>
                <rect x="8" y="8" width="16" height="16" rx="2.5" {...stroke} />
                <rect x="12" y="12" width="8" height="8" rx="1" {...stroke} />
                <path d="M14 8V5M18 8V5M14 27V24M18 27V24M5 14H8M5 18H8M27 14H24M27 18H24" {...stroke} />
                {sparkle}
            </svg>
        );
    }
    if (kind === "sales") {
        return (
            <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden>
                <circle cx="14" cy="15" r="7" {...stroke} />
                <path d="M19.5 20.5L24 25" {...stroke} />
                {sparkle}
            </svg>
        );
    }
    if (kind === "products") {
        return (
            <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden>
                <path d="M16 7L25 11.5V20.5L16 25L7 20.5V11.5L16 7Z" {...stroke} />
                <path d="M16 7V16M16 16L25 11.5M16 16L7 11.5" {...stroke} />
                {sparkle}
            </svg>
        );
    }
    if (kind === "services") {
        return (
            <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden>
                <circle cx="15" cy="16" r="9" {...stroke} />
                <ellipse cx="15" cy="16" rx="9" ry="4.5" {...stroke} />
                <path d="M15 7V25" {...stroke} />
                {sparkle}
            </svg>
        );
    }
    if (kind === "automation") {
        return (
            <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden>
                <circle cx="15" cy="16" r="4" {...stroke} />
                <path d="M15 7V4M15 28V25M22 16H25M5 16H8M19.9 10.1L22 8M8 24L10.1 21.9M19.9 21.9L22 24M8 8L10.1 10.1" {...stroke} />
                {sparkle}
            </svg>
        );
    }
    // growth
    return (
        <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden>
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
            title: "AI & Intelligence",
            description: "AI-native systems and intelligent automation woven into every layer of your business — not bolted on.",
            subServices: [
                "AI integration & assistants",
                "Custom model deployment",
                "Intelligent automation workflows",
            ],
            learnMore: "Explore AI & intelligence",
            href: "/products/ai-intelligence",
            accent: "#9B2FFF",
            icon: "ai",
        },
        {
            title: "Digital Products",
            description: "Validated MVPs and scalable platforms engineered to ship fast and compound value over time.",
            subServices: [
                "MVP development with AI",
                "Validated product launches",
                "Scalable platform architecture",
            ],
            learnMore: "Build a digital product",
            href: "/products/digital-products",
            accent: "#BB00FF",
            icon: "products",
        },
        {
            title: "Digital Services",
            description: "Conversion-optimised websites, web platforms, and e-commerce — built to capture and qualify pipeline.",
            subServices: [
                "Websites & web platforms",
                "E-commerce & portals",
                "Conversion-optimized builds",
            ],
            learnMore: "Explore digital services",
            href: "/products/digital-services",
            accent: "#3DFD98",
            icon: "services",
        },
        {
            title: "Automation & Systems",
            description: "Operations infrastructure that runs itself — workflows, reporting, and back-office automation that scale with you.",
            subServices: [
                "Workflow & back-office automation",
                "Real-time reporting & BI",
                "Operations infrastructure",
            ],
            learnMore: "Automate your operations",
            href: "/products/automation-systems",
            accent: "#72C8F5",
            icon: "automation",
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
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
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
                                    background: "linear-gradient(180deg, #9B2FFF, #72C8F5)",
                                    opacity: isActive ? 1 : 0,
                                }}
                            />
                            <span
                                className="text-[10px] font-bold uppercase tracking-[0.18em] transition-colors duration-200"
                                style={{ color: isActive ? s.accent : "rgba(255,255,255,0.4)" }}
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
                    background: "rgba(8,1,28,0.55)",
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
                                        style={{ background: card.accent }}
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

// ── Services Carousel (canonical §5 layout — horizontal scroll-snap) ─────
// Section header on top-left, prev/next arrows top-right, cards scroll horizontally.
function ServicesCarousel() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(true);
    const { open: openBookCall } = useBookCall();

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const update = () => {
            setCanPrev(el.scrollLeft > 4);
            setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
        };
        update();
        el.addEventListener("scroll", update, { passive: true });
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => {
            el.removeEventListener("scroll", update);
            ro.disconnect();
        };
    }, []);

    const scrollBy = (dir: 1 | -1) => {
        const el = scrollRef.current;
        if (!el) return;
        const first = el.querySelector("[data-card]") as HTMLElement | null;
        const step = first ? first.offsetWidth + 16 : el.clientWidth * 0.85;
        el.scrollBy({ left: step * dir, behavior: "smooth" });
    };

    return (
        <div>
            {/* Header row — title left, arrows right */}
            <div className="mb-8 flex items-end justify-between gap-6 px-1 md:mb-12">
                <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
                        What we do
                    </span>
                    <h2 className="text-3xl font-extrabold leading-[1.05] tracking-tight text-white md:text-4xl">
                        Four capabilities.<br />One unified system.
                    </h2>
                    <button
                        type="button"
                        onClick={openBookCall}
                        className="group mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white md:text-base cursor-pointer"
                    >
                        Book a strategy call
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            aria-hidden
                        >
                            <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2">
                    <button
                        type="button"
                        aria-label="Previous service"
                        disabled={!canPrev}
                        onClick={() => scrollBy(-1)}
                        className="flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 disabled:opacity-30 disabled:pointer-events-auto"
                        style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.12)",
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        aria-label="Next service"
                        disabled={!canNext}
                        onClick={() => scrollBy(1)}
                        className="flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 disabled:opacity-30 disabled:pointer-events-auto"
                        style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.12)",
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Scroll track */}
            <div
                ref={scrollRef}
                className="-mx-1 flex gap-4 overflow-x-auto pb-4 pt-1 services-carousel-scroll"
                style={{
                    scrollSnapType: "x mandatory",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    WebkitOverflowScrolling: "touch",
                }}
            >
                {SERVICE_CARDS.map((card, i) => (
                    <a
                        key={card.title}
                        data-card
                        href={card.href}
                        className="group flex flex-shrink-0 flex-col gap-5 rounded-2xl p-6 md:p-7 transition-colors duration-300 hover:bg-white/[0.03]"
                        style={{
                            background: "rgba(8,1,28,0.55)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            scrollSnapAlign: "start",
                            width: "min(85vw, 360px)",
                        }}
                    >
                        {/* Image placeholder per service — BLUE tint */}
                        <ImagePlaceholder
                            aspect="3 / 2"
                            label={`${card.title} mockup`}
                            accent="#72C8F5"
                        />

                        {/* Per-service number eyebrow + title */}
                        <div className="flex items-baseline gap-3">
                            <span
                                className="text-[10px] font-bold uppercase tracking-[0.22em]"
                                style={{ color: "#3DFD98" }}
                            >
                                Service {String(i + 1).padStart(2, "0")}
                            </span>
                        </div>
                        <h3 className="text-[1.3rem] font-bold leading-snug tracking-tight text-white md:text-[1.4rem]">
                            {card.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-white/55 md:text-[15px]">
                            {card.description}
                        </p>

                        {/* Sub-services (compact bullets) */}
                        <ul className="mt-auto flex flex-col gap-2.5">
                            {card.subServices.map((s) => (
                                <li
                                    key={s}
                                    className="flex items-start gap-3 text-sm leading-relaxed text-white"
                                >
                                    <span
                                        aria-hidden
                                        className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rotate-45"
                                        style={{ background: "#72C8F5" }}
                                    />
                                    <span className="leading-snug">{s}</span>
                                </li>
                            ))}
                        </ul>

                        <span
                            className="inline-flex items-center gap-2 text-sm font-semibold text-white transition-opacity group-hover:opacity-80"
                        >
                            Learn more
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="transition-transform duration-300 group-hover:translate-x-0.5"
                                aria-hidden
                            >
                                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
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
const MONO_STROKE = "rgba(255,255,255,0.65)";
const MONO_FILL = "rgba(255,255,255,0.08)";

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
            <circle cx="14" cy="18" r="7" fill="rgba(8,1,28,0.95)" stroke={MONO_STROKE} strokeWidth="1.4" />
            <circle cx="14" cy="18" r="2.5" fill={MONO_STROKE} />
            <circle cx="40" cy="18" r="7" fill="rgba(8,1,28,0.95)" stroke={MONO_STROKE} strokeWidth="1.4" />
            <circle cx="40" cy="18" r="2.5" fill={MONO_STROKE} />
            <circle cx="66" cy="18" r="7" fill="rgba(8,1,28,0.95)" stroke={MONO_STROKE} strokeWidth="1.4" />
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

function WhyVisualHint({ title }: { title: string }) {
    const t = title.toLowerCase();
    if (t.includes("ai-native")) return <IconLayersDiagram />;
    if (t.includes("end-to-end")) return <IconE2EDiagram />;
    if (t.includes("continuous")) return <IconLoopDiagram />;
    if (t.includes("outcomes")) return <IconBarsDiagram />;
    return <IconLayersDiagram />;
}

const WHY_LEVATA: Array<{ title: string; body: string; icon: IconKind; accent: string; featured?: boolean }> = [
    {
        title: "AI-Native From the Ground Up",
        body: "Every system we ship is designed with AI at its core — not bolted on as an afterthought. Strategy, architecture, and execution are all informed by what AI can compound over time.",
        icon: "ai",
        accent: "#9B2FFF",
        featured: true,
    },
    {
        title: "End-to-End Under One Roof",
        body: "Strategy, design, engineering, automation, and growth — all coordinated under one accountable team.",
        icon: "services",
        accent: "#72C8F5",
    },
    {
        title: "Continuous Optimisation",
        body: "We don't disappear after launch. We measure, iterate, and compound results month over month.",
        icon: "automation",
        accent: "#3DFD98",
    },
    {
        title: "Outcomes Over Outputs",
        body: "We commit to measurable business results — pipeline, conversion, ops cost — not deliverables in a Notion doc.",
        icon: "growth",
        accent: "#BB00FF",
    },
];

// ── Problem section: before/after transformation pairs ────────────────────
const TRANSFORMATIONS: Array<{ pain: string; win: string }> = [
    { pain: "Manual operations bleeding hours", win: "Automation reclaiming days" },
    { pain: "Digital presence that doesn't convert", win: "Conversion infrastructure built-in" },
    { pain: "Disconnected tools, fragmented data", win: "Unified intelligence layer" },
];

// ── Solution section: 4-node delivery flow ────────────────────────────────
const FLOW_NODES: Array<{ num: string; title: string; caption: string; icon: IconKind; accent: string }> = [
    { num: "01", title: "Diagnose", caption: "Map operations, surface friction, identify ROI opportunities.", icon: "sales", accent: "#72C8F5" },
    { num: "02", title: "Architect", caption: "Design AI-native systems matched to your business model.", icon: "ai", accent: "#9B2FFF" },
    { num: "03", title: "Build", caption: "Ship integrated products, automation, and intelligence layers.", icon: "products", accent: "#BB00FF" },
    { num: "04", title: "Compound", caption: "Measure, iterate, and grow returns month over month.", icon: "growth", accent: "#3DFD98" },
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
        : "linear-gradient(135deg, rgba(155,47,255,0.10), rgba(114,200,245,0.06))";
    const border = accent ? `1px solid ${accent}33` : "1px solid rgba(255,255,255,0.06)";
    const glow = accent
        ? `radial-gradient(ellipse 60% 60% at 50% 50%, ${accent}33 0%, transparent 70%)`
        : "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(155,47,255,0.18) 0%, transparent 70%)";
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
        <div className="flex flex-col items-center gap-3 text-center">
            <div
                className="rounded-2xl p-px"
                style={{
                    background: `linear-gradient(135deg, #72C8F588, rgba(255,255,255,0.08), rgba(155,47,255,0.4))`,
                    boxShadow: `0 16px 40px #72C8F51F`,
                }}
            >
                <div
                    className="relative flex h-20 w-20 items-center justify-center rounded-[15px]"
                    style={{ background: "rgba(8,1,28,0.95)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                    <span
                        className="absolute left-3 top-2 text-[9px] font-bold uppercase tracking-[0.18em]"
                        style={{ color: "#3DFD98" }}
                    >
                        {num}
                    </span>
                    <ServiceIcon kind={icon} accent={accent} />
                </div>
            </div>
            <h3 className="text-base font-bold tracking-tight text-white md:text-lg">{title}</h3>
            <p className="max-w-[180px] text-xs leading-relaxed text-white/50 md:text-sm">{caption}</p>
        </div>
    );
}

function FlowConnector({ vertical = false }: { vertical?: boolean }) {
    if (vertical) {
        return (
            <div className="flex justify-center" aria-hidden>
                <svg width="2" height="48" viewBox="0 0 2 48" fill="none">
                    <defs>
                        <linearGradient id="flowConnV" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#9B2FFF" />
                            <stop offset="100%" stopColor="#72C8F5" />
                        </linearGradient>
                    </defs>
                    <line x1="1" y1="0" x2="1" y2="48" stroke="url(#flowConnV)" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
                    <motion.circle
                        cx="1"
                        r="2"
                        fill="#72C8F5"
                        initial={{ cy: 0 }}
                        animate={{ cy: 48 }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    />
                </svg>
            </div>
        );
    }
    return (
        <div className="flex flex-1 items-center px-2" aria-hidden>
            <svg viewBox="0 0 200 4" preserveAspectRatio="none" className="block h-1 w-full">
                <defs>
                    <linearGradient id="flowConnH" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#9B2FFF" />
                        <stop offset="100%" stopColor="#72C8F5" />
                    </linearGradient>
                </defs>
                <line x1="0" y1="2" x2="200" y2="2" stroke="url(#flowConnH)" strokeWidth="1" strokeDasharray="4 4" opacity="0.55" />
                <motion.circle
                    cy="2"
                    r="2"
                    fill="#72C8F5"
                    initial={{ cx: 0 }}
                    animate={{ cx: 200 }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
            </svg>
        </div>
    );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function HeroSection() {
    const { open: openBookCall } = useBookCall();
    return (
        <main className="relative min-h-screen bg-[#07001F] flex flex-col">

            {/* ── 1. HERO (cinematic) ──────────────────────────── */}
            <HomeHero />

            {/* ── 2. THE PROBLEM (Before / After split) ────────── */}
            <section id="problem" className="relative w-full px-6 pt-20 pb-10 md:pt-32 md:pb-14">
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
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-10 flex flex-col items-center md:mb-14 text-center gap-5"
                    >
                        <SectionLabel text="The problem" />
                        <h2 className="max-w-3xl text-3xl font-extrabold tracking-tight text-white md:text-4xl leading-[1.1]">
                            Most businesses are running on <span className="jakarta-italic">duct tape and spreadsheets.</span>
                        </h2>
                        <p className="max-w-xl text-base text-white/45 md:text-lg leading-relaxed">
                            Levata replaces the chaos with infrastructure.
                        </p>
                    </motion.div>

                    {/* Before / After split */}
                    <div className="relative grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                        {/* BEFORE card */}
                        <motion.div
                            initial={{ opacity: 0, x: -24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col gap-5 rounded-2xl p-7 md:p-8"
                            style={{
                                background: "rgba(8,1,28,0.7)",
                                border: "1px solid rgba(255,255,255,0.07)",
                            }}
                        >
                            {/* Header row */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: "rgba(255,60,60,0.7)" }} />
                                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: "rgba(255,180,0,0.55)" }} />
                                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">Before Levata</span>
                            </div>

                            <h3 className="text-xl font-bold leading-snug tracking-tight text-white/60 md:text-2xl">
                                Operating in the fog
                            </h3>

                            <ul className="flex flex-col gap-2.5">
                                {TRANSFORMATIONS.map(({ pain }) => (
                                    <li key={pain} className="flex items-start gap-3 text-sm leading-relaxed text-white/40 md:text-[15px]">
                                        <span
                                            aria-hidden
                                            className="mt-[6px] flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full"
                                            style={{ background: "rgba(255,60,60,0.08)", border: "1px solid rgba(255,60,60,0.25)" }}
                                        >
                                            <svg viewBox="0 0 8 8" fill="none" className="h-2 w-2">
                                                <line x1="2" y1="2" x2="6" y2="6" stroke="rgba(255,100,100,0.7)" strokeWidth="1.4" strokeLinecap="round" />
                                                <line x1="6" y1="2" x2="2" y2="6" stroke="rgba(255,100,100,0.7)" strokeWidth="1.4" strokeLinecap="round" />
                                            </svg>
                                        </span>
                                        <span>{pain}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Fake error terminal */}
                            <div
                                className="mt-auto rounded-xl p-4 font-mono"
                                style={{
                                    background: "rgba(0,0,0,0.4)",
                                    border: "1px solid rgba(255,255,255,0.05)",
                                }}
                            >
                                <p className="text-[10px] text-white/20 mb-2">system_log.txt</p>
                                {[
                                    { tag: "ERR", msg: "Data sync failed — 3 sources disconnected", color: "rgba(255,80,80,0.75)" },
                                    { tag: "WARN", msg: "Manual export overdue by 4 days", color: "rgba(255,180,0,0.65)" },
                                    { tag: "ERR", msg: "Pipeline report: incomplete data", color: "rgba(255,80,80,0.75)" },
                                ].map(({ tag, msg, color }) => (
                                    <div key={msg} className="flex items-start gap-2 py-0.5">
                                        <span className="mt-px flex-shrink-0 text-[9px] font-bold" style={{ color }}>[{tag}]</span>
                                        <span className="text-[10px] leading-relaxed text-white/30">{msg}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Connector arrow (md+ only) */}
                        <div
                            aria-hidden
                            className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block"
                            style={{ zIndex: 1 }}
                        >
                            <div
                                className="flex h-10 w-10 items-center justify-center rounded-full"
                                style={{
                                    background: "rgba(7,0,31,0.95)",
                                    border: "1px solid rgba(155,47,255,0.45)",
                                    boxShadow: "0 0 24px rgba(155,47,255,0.4)",
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                    <path
                                        d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5"
                                        stroke="#9B2FFF"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* AFTER card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                            className="rounded-2xl p-px"
                            style={{
                                background: "linear-gradient(135deg, rgba(114,200,245,0.5) 0%, rgba(255,255,255,0.08) 50%, rgba(155,47,255,0.5) 100%)",
                                boxShadow: "0 20px 60px rgba(155,47,255,0.18)",
                            }}
                        >
                            <div
                                className="flex h-full flex-col gap-6 rounded-[15px] p-7 md:p-9"
                                style={{ background: "rgba(8,1,28,0.96)", border: "1px solid rgba(255,255,255,0.06)" }}
                            >
                                <div className="flex items-center gap-2.5">
                                    <span
                                        className="h-2 w-2 rounded-full"
                                        style={{ background: "#3DFD98", boxShadow: "0 0 12px #3DFD98" }}
                                    />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#3DFD98" }}>
                                        After
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold leading-snug text-white md:text-2xl">
                                    Operating as infrastructure
                                </h3>
                                <ul className="flex flex-col gap-3">
                                    {TRANSFORMATIONS.map(({ win }) => (
                                        <li key={win} className="flex items-start gap-3 text-sm leading-relaxed text-white md:text-base">
                                            <span
                                                aria-hidden
                                                className="mt-[6px] flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full"
                                                style={{
                                                    background: "rgba(61,253,152,0.14)",
                                                    border: "1px solid rgba(61,253,152,0.45)",
                                                }}
                                            >
                                                <svg viewBox="0 0 10 10" fill="none" className="h-2.5 w-2.5">
                                                    <path d="M2 5l2.2 2.2L8 3.2" stroke="#3DFD98" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span>
                                            <span>{win}</span>
                                        </li>
                                    ))}
                                </ul>
                                {/* Live metric mini-dashboard */}
                                <div className="mt-auto grid grid-cols-3 gap-2.5">
                                    {[
                                        { label: "Ops automated", value: "84%", color: "#3DFD98" },
                                        { label: "Pipeline CVR", value: "+3.2×", color: "#72C8F5" },
                                        { label: "Manual hrs", value: "−61%", color: "#3DFD98" },
                                    ].map(({ label, value, color }) => (
                                        <div
                                            key={label}
                                            className="flex flex-col items-center gap-1 rounded-xl py-3 px-2"
                                            style={{
                                                background: "rgba(255,255,255,0.03)",
                                                border: "1px solid rgba(255,255,255,0.06)",
                                            }}
                                        >
                                            <span className="text-lg font-bold leading-none tracking-tight" style={{ color }}>{value}</span>
                                            <span className="text-center text-[9px] leading-tight text-white/35">{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── §2 → §3 vertical connector ────────────────────── */}
            <div aria-hidden className="relative flex justify-center" style={{ height: "80px" }}>
                <FlowConnector vertical />
            </div>

            {/* ── 3. OUR SOLUTION (with 4-node flow diagram) ───── */}
            <section className="relative w-full px-6 pt-10 pb-24 md:pt-14 md:pb-28">
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="mx-auto mb-16 flex max-w-4xl flex-col items-center text-center gap-5"
                    >
                        <SectionLabel text="Our solution" />
                        <p className="text-sm italic text-white/45 md:text-base">
                            This is the system that replaces the duct tape.
                        </p>
                        <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl leading-[1.1]">
                            We don&apos;t sell services. <span className="jakarta-italic">We build intelligence infrastructure.</span>
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
                        {/* Desktop: horizontal */}
                        <div className="hidden md:flex items-start justify-between gap-2">
                            {FLOW_NODES.map((node, i) => (
                                <div key={node.num} className="flex flex-1 items-start">
                                    <FlowNode {...node} />
                                    {i < FLOW_NODES.length - 1 && (
                                        <div className="mt-10 flex-1">
                                            <FlowConnector />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {/* Mobile: vertical */}
                        <div className="flex flex-col items-center gap-3 md:hidden">
                            {FLOW_NODES.map((node, i) => (
                                <div key={node.num} className="flex flex-col items-center gap-3">
                                    <FlowNode {...node} />
                                    {i < FLOW_NODES.length - 1 && <FlowConnector vertical />}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* §5 Featured Product moved to §7 — see below */}

            {/* ── 4. SERVICE CATEGORIES (Horizontal carousel) ──── */}
            <section id="services" className="relative w-full px-5 py-14 sm:px-6 sm:py-20 md:py-28 overflow-hidden">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: "radial-gradient(ellipse 60% 70% at 50% 40%, rgba(114,200,245,0.05) 0%, transparent 70%)",
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

            {/* ── 5. OUR PROCESS (Tabbed stepper) ──────────────── */}
            <ProcessTabsSection />

            {/* ── 6. CLIENTS MARQUEE ─────────────────── */}
            <div className="relative z-10 py-4 md:py-6">
                <ClientsMarquee />
            </div>

            {/* ── 7. FEATURED PRODUCT — Sales Intelligence Platform ── */}
            <section className="relative w-full px-6 pt-20 pb-10 md:pt-24 md:pb-14">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 mx-auto mb-12 flex max-w-3xl flex-col items-center text-center gap-5"
                >
                    <SectionLabel text="Featured product" />
                    <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl leading-[1.12]">
                        Introducing: The AI Sales Workspace<br /><span className="jakarta-italic">Built for B2B Teams.</span>
                    </h2>
                    <p className="max-w-xl text-sm leading-relaxed text-white/45 md:text-base">
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
                        background: "linear-gradient(105deg, rgba(61,253,152,0.45) 0%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.06) 60%, rgba(160,80,255,0.4) 100%)",
                        boxShadow: "-8px 0 40px rgba(61,253,152,0.12), 8px 0 40px rgba(160,80,255,0.12)",
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
                                            style={{ background: "rgba(155,47,255,0.08)", color: "rgba(155,47,255,0.8)", border: "1px solid rgba(155,47,255,0.22)" }}
                                        >
                                            Sales Intelligence Platform
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl leading-tight">
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
                                                    style={{ background: "rgba(114,200,245,0.15)", border: "1px solid rgba(114,200,245,0.3)" }}>
                                                    <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5" aria-hidden="true">
                                                        <path d="M2 5l2.5 2.5L8 3" stroke="#72C8F5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                                                "radial-gradient(ellipse 55% 55% at 10% 85%, rgba(61,253,152,0.22) 0%, transparent 65%)",
                                                "radial-gradient(ellipse 45% 50% at 90% 20%, rgba(160,80,255,0.18) 0%, transparent 65%)",
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
                                                    style={{ background: active ? "rgba(114,200,245,0.08)" : "transparent" }}>
                                                    <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                                                        style={{ background: active ? "rgba(114,200,245,0.5)" : "rgba(255,255,255,0.12)" }} />
                                                    <span style={{ color: active ? "rgba(114,200,245,0.9)" : "rgba(255,255,255,0.3)", fontSize: "9px", fontWeight: active ? 600 : 400 }}>{label}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex flex-col gap-3 flex-1 min-w-0">
                                            <div className="grid grid-cols-3 gap-2">
                                                {[
                                                    { label: "Pipeline Value", value: "$284k", sub: "+12% this month", c: "#72C8F5" },
                                                    { label: "Leads Scored", value: "1,048", sub: "94 high-intent", c: "#9B2FFF" },
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
                                                                <div className="w-2 h-0.5 rounded" style={{ background: i === 0 ? "#72C8F5" : "rgba(155,47,255,0.5)" }} />
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
                                                        fill="none" stroke="rgba(155,47,255,0.35)" strokeWidth="1.5" strokeDasharray="4 3"
                                                    />
                                                    <polygon
                                                        points="0,70 0,58 40,52 80,40 120,48 160,35 200,28 240,32 280,22 280,70"
                                                        fill="url(#chartFillFeatured)" opacity="0.4"
                                                    />
                                                    <polyline
                                                        points="0,58 40,52 80,40 120,48 160,35 200,28 240,32 280,22"
                                                        fill="none" stroke="#72C8F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                                    />
                                                    <circle cx="200" cy="28" r="3" fill="#72C8F5" />
                                                    <circle cx="200" cy="28" r="5" fill="rgba(114,200,245,0.2)" />
                                                    <defs>
                                                        <linearGradient id="chartFillFeatured" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="#72C8F5" />
                                                            <stop offset="100%" stopColor="#72C8F5" stopOpacity="0" />
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
                                                    { lead: "Vertex AI", score: "87", stage: "Discovery", value: "$18k", sc: "#72C8F5" },
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

            {/* §6 ↔ §7 horizontal divider — bridges Featured Product into the numbers */}
            <div aria-hidden className="relative mx-auto h-px w-32"
                style={{ background: "linear-gradient(to right, transparent, rgba(155,47,255,0.5), transparent)" }} />

            {/* ── 8. BY THE NUMBERS (clean 4-counter row) ──────── */}
            <section className="relative w-full px-6 pt-10 pb-20 md:pt-14 md:pb-24">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background:
                        "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(155,47,255,0.06) 0%, transparent 65%)",
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
                        <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-white md:text-4xl leading-[1.1]">
                            The outcomes speak for themselves.
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-y-12 gap-x-8 md:grid-cols-4 md:gap-x-12 text-center">
                        {KEY_RESULTS.map((r) => (
                            <StatCounter key={r.label} {...r} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 9. TESTIMONIALS ─────────────────────────────── */}
            <TestimonialsSection />

            {/* ── 10. TECH STACK (LOCKED) ──────────────────────── */}
            <TechStackSection />

            {/* ── 11. WHY CHOOSE LEVATA (flat 2×2 equal-cards grid) ── */}
            <section className="relative w-full px-5 py-14 sm:px-6 sm:py-20 md:py-24">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: [
                        "radial-gradient(ellipse 50% 50% at 20% 50%, rgba(155,47,255,0.07) 0%, transparent 70%)",
                        "radial-gradient(ellipse 50% 50% at 80% 50%, rgba(114,200,245,0.06) 0%, transparent 70%)",
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
                        <h2 className="max-w-3xl text-3xl font-extrabold tracking-tight text-white md:text-4xl leading-[1.1]">
                            AI-native. End-to-end. Always-on.
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:auto-rows-fr">
                        {WHY_LEVATA.map((w, i) => (
                            <motion.div
                                key={w.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.6, delay: (i % 2) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                whileHover={{ y: -4 }}
                                className="flex h-full flex-col gap-6 rounded-2xl p-7 md:p-9 transition-colors duration-300 hover:bg-white/[0.03]"
                                style={{
                                    background: "rgba(8,1,28,0.55)",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                }}
                            >
                                <WhyVisualHint title={w.title} />
                                <h3 className="text-xl font-bold leading-snug tracking-tight text-white md:text-2xl">
                                    {w.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-white/55 md:text-[15px]">{w.body}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 12. FINAL CTA ──────────────────────────────── */}
            <section className="relative w-full overflow-hidden px-5 py-16 sm:px-6 sm:py-24 md:py-32">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: [
                        "radial-gradient(ellipse 60% 70% at 50% 100%, rgba(155,47,255,0.18) 0%, transparent 65%)",
                        "radial-gradient(ellipse 40% 50% at 20% 0%, rgba(114,200,245,0.1) 0%, transparent 60%)",
                    ].join(", "),
                }} />
                <div aria-hidden className="absolute left-1/2 top-0 h-px w-32 -translate-x-1/2" style={{ background: "linear-gradient(to right, transparent, rgba(155,47,255,0.5), transparent)" }} />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-8 text-center"
                >
                    <SectionLabel text="Get started" />
                    <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl leading-[1.1]">
                        Ready to build intelligence into your operations?
                    </h2>
                    <p className="max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
                        Book a free strategy call. We&apos;ll map out the system your business needs.
                    </p>
                    <div className="flex flex-col items-center gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="relative px-4 py-2 rounded-full sm:px-6 sm:py-3 text-sm font-semibold text-white transition-all duration-200 cursor-pointer"
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

                    </div>
                </motion.div>
            </section>

        </main>
    );
}
