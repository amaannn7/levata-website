"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
    SiReact, SiAngular,
    SiExpress, SiFastapi, SiDjango, SiLaravel, SiShopify,
    SiWordpress, SiPostgresql, SiMysql, SiMongodb, SiSupabase, SiFirebase, SiRedis,
} from "react-icons/si";
import ClientsMarquee from "@/app/components/ClientsMarquee";
import TestimonialsSection from "@/app/components/TestimonialsSection";
import HomeHero from "@/app/components/HomeHero";
import CTAAurora from "@/app/components/CTAAurora";
import SectionLabel from "@/app/components/SectionLabel";
import SectionBeamShared from "@/app/components/SectionBeam";
import SectionLabelSide from "@/app/components/SectionLabelSide";
import { useBookCall } from "@/app/components/BookCallProvider";
import ProductsShowcase from "@/app/components/ProductsShowcase";
import { UnifiedOpsMock } from "@/app/components/mockups/HomeMockups";

// "-"- Count-up hook "-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-
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

// "-"- Animated stat number (extended: animate lead number, static suffix) "-"-"-"-
function StatCounter({ leadNumber, suffix, label, title }: { leadNumber: number; suffix: string; label: string; title: string }) {
    const { count, elRef } = useCountUp(leadNumber, 2000);
    return (
        <div className="flex flex-col items-center gap-2">
            <span className="text-eyebrow text-white/40">{title}</span>
            <span
                ref={elRef}
                className="display-stat"
            >
                {count}
                <span>{suffix}</span>
            </span>
            <span className="max-w-[160px] text-center text-body-sm font-medium leading-snug text-white/40">
                {label}
            </span>
        </div>
    );
}

const SectionBeam = SectionBeamShared;

function SectionDivider() {
    return (
        <div aria-hidden className="px-6">
            <div className="section-gradient-divider" />
        </div>
    );
}

// "-"- Two-row opposing marquee, Tech Stack (replaces the old tab grid) "-"-"-"-"-
type TechItem = {
    name: string;
    Icon: React.ComponentType<{ size?: number; className?: string; color?: string; style?: React.CSSProperties }>;
    color: string;
};

const TECH_ROW_TOP: TechItem[] = [
    { name: "React", Icon: SiReact, color: "#61DAFB" },
    { name: "Angular", Icon: SiAngular, color: "#DD0031" },
    { name: "Express", Icon: SiExpress, color: "#FFFFFF" },
    { name: "FastAPI", Icon: SiFastapi, color: "#009688" },
    { name: "Django", Icon: SiDjango, color: "#44B78B" },
    { name: "Laravel", Icon: SiLaravel, color: "#FF2D20" },
    { name: "Shopify", Icon: SiShopify, color: "#96BE3F" },
];

const TECH_ROW_BOTTOM: TechItem[] = [
    { name: "WordPress", Icon: SiWordpress, color: "#21759B" },
    { name: "PostgreSQL", Icon: SiPostgresql, color: "#4169E1" },
    { name: "MySQL", Icon: SiMysql, color: "#4479A1" },
    { name: "MongoDB", Icon: SiMongodb, color: "#47A248" },
    { name: "Supabase", Icon: SiSupabase, color: "#3FCF8E" },
    { name: "Firebase", Icon: SiFirebase, color: "#FFCA28" },
    { name: "Redis", Icon: SiRedis, color: "#DC382D" },
];

function TechMarqueeRow({ items, direction, duration }: { items: TechItem[]; direction: "left" | "right"; duration: number }) {
    const doubled = [...items, ...items];
    return (
        <div className="tech-marquee-mask relative w-full overflow-hidden">
            <div
                className="flex items-center whitespace-nowrap"
                style={{
                    width: "max-content",
                    gap: "clamp(56px, 8vw, 120px)",
                    animation: `marquee ${duration}s linear infinite`,
                    animationDirection: direction === "left" ? "normal" : "reverse",
                }}
            >
                {doubled.map(({ name, Icon, color }, i) => (
                    <div
                        key={`${name}-${i}`}
                        title={name}
                        className="group flex flex-shrink-0 items-center justify-center"
                        style={{ width: 44, height: 44 }}
                    >
                        <Icon
                            size={40}
                            color={color}
                            className="transition-all duration-200 group-hover:scale-110"
                            style={{ opacity: 0.85, filter: "saturate(0.85)" }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

function TechStackSection() {
    return (
        <section className="home-theme-dark relative w-full px-5 py-14 sm:px-6 md:py-20 overflow-hidden">
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute inset-0" style={{
                    background: [
                        "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(123, 85, 234,0.07) 0%, transparent 65%)",
                        "radial-gradient(ellipse 40% 40% at 85% 20%, rgba(0, 255, 221,0.04) 0%, transparent 60%)",
                    ].join(", ")
                }} />
            </div>
            <div className="relative z-10 mx-auto max-w-[1120px]">
                <div className="mb-10 flex flex-col items-center text-center gap-3">
                    <SectionBeam />
                    <h2 className="display-section-title display-inline max-w-2xl text-center">
                        <span className="display-muted-line">Built on tech that </span><span className="display-strong-line">compounds.</span>
                    </h2>
                    <p className="max-w-xl text-lead text-white/45">
                        Battle-tested infrastructure paired with cutting-edge AI, chosen for longevity, not novelty.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <TechMarqueeRow items={TECH_ROW_TOP} direction="left" duration={54} />
                    <TechMarqueeRow items={TECH_ROW_BOTTOM} direction="right" duration={52} />
                </div>
            </div>
        </section>
    );
}

// "-"- Content data "-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-
// "-"- Service icons (monochrome line-art glyph + sparkle) "-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-
// `accent` prop kept for backwards compat but ignored, all homepage icons render in white.
function ServiceIcon({ kind, size = 26 }: { kind: IconKind; accent?: string; size?: number }) {
    const ICON_COLOR = "var(--home-accent-cyan, #7B55EA)";
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
    image: string;
}> = [
        {
            title: "AI & Intelligence",
            description: "Embedding AI into business operations through intelligent systems, workflows, and custom AI solutions built for real-world impact.",
            subServices: [
                "AI Integration",
                "Intelligent Workflows",
                "Custom AI Solutions",
            ],
            learnMore: "Explore AI & intelligence",
            href: "/products/ai-intelligence",
            accent: "#7B55EA",
            icon: "ai",
            image: "/services-5-web.jpg",
        },
        {
            title: "Digital Infrastructure",
            description: "Building high-performance websites, ecommerce platforms, and digital systems that form the foundation of modern business.",
            subServices: [
                "Web",
                "Ecommerce",
                "Platforms",
            ],
            learnMore: "Build digital infrastructure",
            href: "/products/digital-infrastructure",
            accent: "#7B55EA",
            icon: "services",
            image: "/services-3-web.jpg",
        },
        {
            title: "Automation & Systems",
            description: "Streamlining operations through connected automations, workflows, and dashboards designed for efficiency and scale.",
            subServices: [
                "Automation",
                "Workflows",
                "Dashboards",
            ],
            learnMore: "Automate your operations",
            href: "/products/automation-systems",
            accent: "#7B55EA",
            icon: "automation",
            image: "/services-6-web.jpg",
        },
        {
            title: "Product Engineering",
            description: "Product engineering for founders and businesses: MVPs, SaaS products, and scalable digital systems built for growth.",
            subServices: [
                "MVPs",
                "SaaS",
            ],
            learnMore: "Engineer a product",
            href: "/products/product-engineering",
            accent: "#7B55EA",
            icon: "products",
            image: "/services-1-web.jpg",
        },
    ];

// "-"- Service card primitives (icon square + sub-services + learn-more) "-"-"-"-
// Monochrome icon square, no accent color, no radial-glow halo, no boxShadow.
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

// Featured 2-2 card, split content (text left, image placeholder right on lg+)
// "-"- Services accordion (Joidy-style: image left, expandable list right) "-"-
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
                            <span className="flex-1 display-card-title text-white">
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
                                                    className="flex items-start gap-3 text-body-sm text-white"
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

// "-"- Services Explorer (canonical -5 layout) "-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-
// Left = clickable numbered list, right = active service detail panel.
function ServicesExplorer() {
    const [active, setActive] = useState(0);
    const card = SERVICE_CARDS[active];
    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[0.7fr_1.3fr] md:gap-12 lg:gap-16 items-start">
            {/* LEFT, clickable list */}
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

            {/* RIGHT, active detail panel */}
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
                            className="text-eyebrow"
                            style={{ color: `${card.accent}CC` }}
                        >
                            Service {String(active + 1).padStart(2, "0")}
                        </span>
                        <h3 className="display-feature-title">
                            {card.title}
                        </h3>
                        <p className="text-body-sm text-white/55">
                            {card.description}
                        </p>
                        <ul className="flex flex-col gap-3">
                            {card.subServices.map((s) => (
                                <li
                                    key={s}
                                    className="flex items-start gap-3 text-body-sm text-white"
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

// "-"- Services card background visuals (white-only, subtle continuous motion) "-
function CubeVisual() {
    return (
        <svg width="180" height="180" viewBox="0 0 200 200" fill="none" aria-hidden>
            <motion.g
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
                {/* Top face */}
                <path d="M100 50 L150 75 L100 100 L50 75 Z" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" fill="none" strokeLinejoin="round" />
                {/* Front-left face */}
                <path d="M50 75 L50 135 L100 160 L100 100 Z" stroke="rgba(255,255,255,0.38)" strokeWidth="1.2" fill="none" strokeLinejoin="round" />
                {/* Front-right face */}
                <path d="M150 75 L150 135 L100 160 L100 100 Z" stroke="rgba(255,255,255,0.32)" strokeWidth="1.2" fill="none" strokeLinejoin="round" />
                {/* Vertical edges (back) */}
                <line x1="50" y1="75" x2="50" y2="135" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
                <line x1="150" y1="75" x2="150" y2="135" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
                <line x1="100" y1="100" x2="100" y2="160" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
                {/* Corner dots */}
                {[
                    { cx: 100, cy: 50, delay: 0 },
                    { cx: 150, cy: 75, delay: 0.6 },
                    { cx: 50, cy: 75, delay: 1.2 },
                    { cx: 100, cy: 160, delay: 1.8 },
                ].map((d, i) => (
                    <motion.circle
                        key={i}
                        cx={d.cx}
                        cy={d.cy}
                        r="2.5"
                        fill="rgba(255,255,255,0.85)"
                        animate={{ opacity: [0.45, 0.95, 0.45] }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: d.delay }}
                    />
                ))}
            </motion.g>
        </svg>
    );
}

function OrbitVisual() {
    return (
        <svg width="180" height="180" viewBox="0 0 200 200" fill="none" aria-hidden>
            {/* Center node */}
            <circle cx="100" cy="100" r="3.5" fill="rgba(255,255,255,0.9)" />
            <circle cx="100" cy="100" r="7" stroke="rgba(255,255,255,0.32)" strokeWidth="1" fill="none" />

            {/* Three rotating dashed orbits */}
            <motion.circle
                cx="100" cy="100" r="36"
                stroke="rgba(255,255,255,0.32)" strokeWidth="1" fill="none"
                strokeDasharray="50 30"
                animate={{ rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "100px 100px" }}
            />
            <motion.circle
                cx="100" cy="100" r="54"
                stroke="rgba(255,255,255,0.22)" strokeWidth="1" fill="none"
                strokeDasharray="40 90"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "100px 100px" }}
            />
            <motion.circle
                cx="100" cy="100" r="74"
                stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none"
                strokeDasharray="20 70"
                animate={{ rotate: 360 }}
                transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "100px 100px" }}
            />

            {/* Traveling satellite on outer orbit */}
            <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "100px 100px" }}
            >
                <circle cx="174" cy="100" r="3" fill="rgba(255,255,255,0.95)" />
            </motion.g>
        </svg>
    );
}

function GearsVisual() {
    const gearTeeth = (cx: number, cy: number, count: number, innerR: number, outerR: number) =>
        Array.from({ length: count }).map((_, i) => {
            const angle = (i / count) * Math.PI * 2;
            const x1 = cx + Math.cos(angle) * innerR;
            const y1 = cy + Math.sin(angle) * innerR;
            const x2 = cx + Math.cos(angle) * outerR;
            const y2 = cy + Math.sin(angle) * outerR;
            return (
                <line
                    key={i}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                />
            );
        });

    return (
        <svg width="180" height="180" viewBox="0 0 200 200" fill="none" aria-hidden>
            {/* Big gear (lower-left) */}
            <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "78px 112px" }}
            >
                <circle cx="78" cy="112" r="32" stroke="rgba(255,255,255,0.4)" strokeWidth="1.3" fill="none" />
                <circle cx="78" cy="112" r="14" stroke="rgba(255,255,255,0.35)" strokeWidth="1" fill="none" />
                <circle cx="78" cy="112" r="3" fill="rgba(255,255,255,0.55)" />
                {gearTeeth(78, 112, 12, 32, 39)}
            </motion.g>
            {/* Small gear (upper-right) */}
            <motion.g
                animate={{ rotate: -360 }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "138px 76px" }}
            >
                <circle cx="138" cy="76" r="22" stroke="rgba(255,255,255,0.4)" strokeWidth="1.3" fill="none" />
                <circle cx="138" cy="76" r="9" stroke="rgba(255,255,255,0.35)" strokeWidth="1" fill="none" />
                <circle cx="138" cy="76" r="2.5" fill="rgba(255,255,255,0.55)" />
                {gearTeeth(138, 76, 8, 22, 28)}
            </motion.g>
        </svg>
    );
}

function NeuralVisual() {
    const lineProps = { stroke: "rgba(255,255,255,0.22)", strokeWidth: 1 };
    const nodeAnim = (delay: number, base: number, peak: number) => ({
        animate: { r: [base, peak, base] },
        transition: { duration: 1.9, repeat: Infinity, ease: "easeInOut" as const, delay },
    });

    return (
        <svg width="180" height="180" viewBox="0 0 200 200" fill="none" aria-hidden>
            {/* Connections L1'L2 */}
            <line x1="50" y1="55" x2="100" y2="85" {...lineProps} />
            <line x1="50" y1="55" x2="100" y2="125" {...lineProps} />
            <line x1="50" y1="100" x2="100" y2="85" {...lineProps} />
            <line x1="50" y1="100" x2="100" y2="125" {...lineProps} />
            <line x1="50" y1="145" x2="100" y2="85" {...lineProps} />
            <line x1="50" y1="145" x2="100" y2="125" {...lineProps} />
            {/* Connections L2'L3 */}
            <line x1="100" y1="85" x2="150" y2="105" {...lineProps} stroke="rgba(255,255,255,0.3)" />
            <line x1="100" y1="125" x2="150" y2="105" {...lineProps} stroke="rgba(255,255,255,0.3)" />

            {/* Layer 1: 3 input nodes */}
            <motion.circle cx="50" cy="55" fill="rgba(255,255,255,0.75)" {...nodeAnim(0, 4, 5.5)} />
            <motion.circle cx="50" cy="100" fill="rgba(255,255,255,0.75)" {...nodeAnim(0.2, 4, 5.5)} />
            <motion.circle cx="50" cy="145" fill="rgba(255,255,255,0.75)" {...nodeAnim(0.4, 4, 5.5)} />
            {/* Layer 2: 2 hidden nodes */}
            <motion.circle cx="100" cy="85" fill="rgba(255,255,255,0.88)" {...nodeAnim(0.7, 4.5, 6)} />
            <motion.circle cx="100" cy="125" fill="rgba(255,255,255,0.88)" {...nodeAnim(0.9, 4.5, 6)} />
            {/* Layer 3: output node */}
            <motion.circle cx="150" cy="105" fill="rgba(255,255,255,0.95)" {...nodeAnim(1.2, 5, 7)} />
        </svg>
    );
}

function CardVisual({ kind }: { kind: IconKind }) {
    if (kind === "products") return <CubeVisual />;
    if (kind === "services") return <OrbitVisual />;
    if (kind === "automation") return <GearsVisual />;
    if (kind === "ai") return <NeuralVisual />;
    return null;
}

// "-"- Services Grid "-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-
function ServicesCarousel() {
    const BLUE = "#7B55EA";

    return (
        <div>
            {/* Header */}
            <div className="mb-10 flex flex-col items-center gap-3 text-center md:mb-12">
                <SectionBeam />
                <h2 className="display-section-title display-inline max-w-2xl text-center">
                    <span className="display-muted-line">Four ways we build </span><span className="display-strong-line">smarter businesses</span>
                </h2>
            </div>

            {/* 2x2 grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                {SERVICE_CARDS.map((card, i) => (
                    <a
                        key={card.title}
                        href={card.href}
                        className="group relative flex h-[280px] flex-col overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#7B55EA]/60 sm:h-[300px] md:h-[340px]"
                        style={{
                            background: "var(--home-card-bg, rgba(21,24,34,0.94))",
                            border: "1px solid var(--home-card-border, rgba(255,255,255,0.07))",
                            transition: "border-color 400ms ease, box-shadow 400ms ease",
                        }}
                        onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.borderColor = "rgba(123, 85, 234,0.35)";
                            el.style.boxShadow = "inset 0 0 0 1px rgba(123, 85, 234,0.1), 0 24px 60px rgba(0,0,0,0.4)";
                        }}
                        onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.borderColor = "var(--home-card-border, rgba(255,255,255,0.07))";
                            el.style.boxShadow = "";
                        }}
                    >
                        {/* Background image "" slightly more visible so the image reads clearly */}
                        <Image
                            src={card.image}
                            alt={card.title}
                            fill
                            sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover opacity-[0.6] transition-all duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-[0.75] group-hover:scale-[1.06]"
                            // Web-sized copies served as-is: no on-the-fly resizing, and all four load up front.
                            unoptimized
                            loading="eager"
                        />

                        {/* Dark vertical gradient "" strong at bottom for text legibility, light at top */}
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0"
                            style={{
                                background:
                                    "linear-gradient(180deg, rgba(7,8,15,0.4) 0%, rgba(7,8,15,0.25) 35%, rgba(7,8,15,0.85) 75%, rgba(7,8,15,0.96) 100%)",
                            }}
                        />

                        {/* Cyan'purple hover sheen, fades in */}
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                            style={{
                                background:
                                    "radial-gradient(ellipse 80% 60% at 30% 100%, rgba(123, 85, 234,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 0%, rgba(0, 255, 221,0.12) 0%, transparent 65%)",
                            }}
                        />

                        {/* Top bar: circular brand-tinted icon + editorial number marker */}
                        <div className="relative z-10 flex items-start justify-between p-6 md:p-7">
                            <div
                                className="flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 group-hover:scale-105"
                                style={{
                                    background:
                                        "linear-gradient(135deg, rgba(204,1,255,0.28) 0%, rgba(0,255,221,0.16) 100%)",
                                    border: "1px solid rgba(255,255,255,0.28)",
                                    boxShadow: "0 4px 14px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
                                }}
                            >
                                <ServiceIcon kind={card.icon} size={20} />
                            </div>
                            <div className="flex items-center gap-2 pt-3">
                                <span
                                    aria-hidden
                                    className="h-px w-6"
                                    style={{
                                        background:
                                            "linear-gradient(to right, transparent, rgba(255,255,255,0.55))",
                                    }}
                                />
                                <span
                                    className="text-[10.5px] font-semibold tabular-nums tracking-[0.24em] text-white/75"
                                    style={{
                                        fontFamily:
                                            "var(--font-code), ui-monospace, SFMono-Regular, Menlo, monospace",
                                    }}
                                >
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                            </div>
                        </div>

                        {/* Bottom content */}
                        <div className="relative z-10 mt-auto p-6 md:p-7">
                            {/* Title "" always visible, no lift */}
                            <h3 className="display-feature-title">
                                {card.title}
                            </h3>

                            {/* Sub-service chips "" always visible */}
                            <ul className="mt-3 flex flex-wrap gap-1.5">
                                {card.subServices.map((s) => (
                                    <li key={s}>
                                        <span
                                            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium leading-none text-white/90"
                                            style={{
                                                background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)",
                                                border: "1px solid rgba(255,255,255,0.14)",
                                                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 2px 10px rgba(0,0,0,0.35)",
                                                backdropFilter: "blur(6px)",
                                                WebkitBackdropFilter: "blur(6px)",
                                            }}
                                        >
                                            <span
                                                aria-hidden
                                                className="inline-block h-1 w-1 flex-shrink-0 rounded-full"
                                                style={{ background: "linear-gradient(135deg, #00FFDD 0%, #CC01FF 100%)" }}
                                            />
                                            {s}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* Hover reveal: description + Explore link (always shown on touch screens, which have no hover) */}
                            <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grid-rows-[1fr] group-hover:opacity-100 [@media(hover:none)]:grid-rows-[1fr] [@media(hover:none)]:opacity-100">
                                <div className="overflow-hidden">
                                    <p className="mt-4 text-caption text-white/60">
                                        {card.description}
                                    </p>
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
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

const KEY_RESULTS: Array<{ leadNumber: number; suffix: string; label: string; title: string }> = [
    { leadNumber: 3, suffix: "–5×", title: "More Revenue",      label: "Pipeline performance" },
    { leadNumber: 60, suffix: "%",  title: "Less Admin",        label: "Reduction in manual work" },
    { leadNumber: 4, suffix: "–6wk", title: "Faster Execution", label: "Weeks to launch" },
    { leadNumber: 12, suffix: "mo", title: "Clearer Returns",   label: "Average ROI timeline" },
];

// "-"- Why Choose Levata visual hints (monochrome schematic SVGs) "-"-"-"-"-"-"-"-"-"-"-"-
const MONO_STROKE = "var(--home-diagram-stroke, rgba(255,255,255,0.65))";
const MONO_FILL = "var(--home-diagram-fill, rgba(255,255,255,0.08))";

function IconLayersDiagram() {
    // 3 stacked horizontal layers with embedded nodes, represents AI-native foundation
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
            body: "Every system we build has AI at its core, not bolted on later. Strategy, architecture, and execution all compound over time.",
            tags: ["INTELLIGENT SYSTEMS", "AI STRATEGY", "NO CODE LIMITS"],
        },
        {
            num: "02",
            title: "End-to-End, One Team",
            body: "Strategy, design, engineering, and growth, all under one roof with one shared goal. No handoffs. No gaps.",
            tags: ["FULL-STACK", "ONE TEAM", "NO HAND-OFFS"],
            featured: true,
        },
        {
            num: "03",
            title: "Outcomes Over Outputs",
            body: "We commit to measurable results, pipeline growth, conversion lift, ops cost reduction. Not deliverables. Not sprints.",
            tags: ["PIPELINE GROWTH", "ROI-DRIVEN", "ALWAYS-ON"],
        },
        {
            num: "04",
            title: "Continuous Optimisation",
            body: "We don't disappear after launch. We measure, iterate, and compound results every month.",
            tags: ["MONTHLY REVIEW", "COMPOUND GROWTH", "ALWAYS-ON"],
        },
    ];

// "-"- WhyLevataDeck: sticky heading + scroll-driven single-card reveal "-"-"-"-"-"-
function WhyLevataProgress({ active, total }: { active: number; total: number }) {
    return (
        <div className="flex items-center gap-2 mt-2" aria-hidden>
            {Array.from({ length: total }).map((_, i) => (
                <span
                    key={i}
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                        width: i === active ? "28px" : "8px",
                        background: i === active
                            ? "linear-gradient(90deg, #7B55EA 0%, #CC01FF 100%)"
                            : "rgba(255,255,255,0.15)",
                    }}
                />
            ))}
        </div>
    );
}

function WhyLevataCard({ active }: { active: number }) {
    const w = WHY_LEVATA[active];
    return (
        <div className="relative w-full" style={{ height: "440px" }}>
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={w.num}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 flex flex-col justify-center"
                >
                    {/* Huge editorial number */}
                    <span
                        className="block font-semibold leading-none tabular-nums tracking-tight"
                        style={{
                            color: "var(--text-primary)",
                            fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                        }}
                    >
                        {w.num}
                    </span>

                    {/* Hairline rule */}
                    <span
                        className="block h-px w-24 mt-2 mb-7"
                        style={{ background: "linear-gradient(90deg, rgba(123,85,234,0.6) 0%, transparent 100%)" }}
                    />

                    {/* Big bold title */}
                    <h3 className="display-feature-title max-w-lg">
                        {w.title}
                    </h3>

                    {/* Body */}
                    <p className="mt-5 text-lead max-w-md" style={{ color: "rgba(255,255,255,0.55)" }}>
                        {w.body}
                    </p>

                    {/* Eyebrow tags at bottom */}
                    <p className="mt-7 font-mono text-eyebrow" style={{ color: "rgba(255,255,255,0.38)" }}>
                        {w.tags.join("  ·  ")}
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function WhyLevataDeck() {
    const [active, setActive] = useState(0);
    return (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-8 md:gap-16 items-center">
            {/* Left: heading + body */}
            <div className="flex flex-col gap-4">
                <SectionLabelSide />
                <h2 className="display-section-title display-inline">
                    <span className="display-muted-line">Why teams pick Levata.</span>
                    <span className="display-strong-line">Outcomes, not outputs.</span>
                </h2>
                <p className="text-lead text-white/45 max-w-sm">
                    Strategy, design, engineering, and growth, all under one roof with one shared goal. We commit to measurable results, not deliverables.
                </p>
            </div>

            {/* Right: stacked accordion cards */}
            <div className="flex flex-col" style={{ gap: 0 }}>
                {WHY_LEVATA.map((w, i) => {
                    const isActive = active === i;
                    return (
                        <motion.div
                            key={w.num}
                            onClick={() => setActive(i)}
                            className="rounded-2xl overflow-hidden cursor-pointer relative"
                            animate={{ y: isActive ? -4 : 0, zIndex: isActive ? 10 : WHY_LEVATA.length - i }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                background: isActive
                                    ? "rgba(18,16,32,0.98)"
                                    : `rgba(${10 + i * 3},${10 + i * 3},${20 + i * 3},0.97)`,
                                border: `1px solid ${isActive ? "rgba(123,85,234,0.3)" : "rgba(255,255,255,0.07)"}`,
                                boxShadow: isActive ? "0 -4px 0 0 rgba(123,85,234,0.35), 0 16px 48px rgba(0,0,0,0.5)" : "none",
                                marginTop: i === 0 ? 0 : -12,
                            }}
                        >
                            {/* Header row */}
                            <div className="flex items-center gap-4 px-6 py-5">
                                <span
                                    className="text-[10px] font-bold tabular-nums flex-shrink-0"
                                    style={{ fontFamily: "var(--font-code), ui-monospace, monospace", letterSpacing: "0.22em", color: isActive ? "rgba(123,85,234,0.85)" : "rgba(255,255,255,0.28)" }}
                                >
                                    {w.num}
                                </span>
                                <span
                                    className="flex-1 font-semibold leading-snug text-[15px]"
                                    style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.6)" }}
                                >
                                    {w.title}
                                </span>
                                <motion.span
                                    animate={{ rotate: isActive ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    style={{ color: isActive ? "rgba(123,85,234,0.7)" : "rgba(255,255,255,0.2)" }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </motion.span>
                            </div>

                            {/* Expandable body */}
                            <AnimatePresence initial={false}>
                                {isActive && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-6 flex flex-col gap-3">
                                            <div className="h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                                            <p className="text-body-sm text-white/55">{w.body}</p>
                                            <p className="font-mono text-eyebrow" style={{ color: "rgba(255,255,255,0.25)" }}>{w.tags.join("  ·  ")}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

// "-"- Problem section: pain points "-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-
const PAIN_POINTS: Array<{ title: string; desc: string }> = [
    {
        title: "Manual operations bleeding hours",
        desc: "Your team spends their best hours on tasks that should run automatically, reporting, data entry, follow-ups.",
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

// "-"- Solution section: 4-node delivery flow "-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-
const FLOW_NODES: Array<{ num: string; title: string; caption: string; icon: IconKind; accent: string }> = [
    { num: "01", title: "Diagnose", caption: "Map operations, surface friction, identify ROI opportunities.", icon: "sales", accent: "#7B55EA" },
    { num: "02", title: "Architect", caption: "Design AI-native systems matched to your business model.", icon: "ai", accent: "#7B55EA" },
    { num: "03", title: "Build", caption: "Ship integrated products, automation, and intelligence layers.", icon: "products", accent: "#7B55EA" },
    { num: "04", title: "Compound", caption: "Measure, iterate, and grow returns month over month.", icon: "growth", accent: "#7B55EA" },
];

// "-"- Reusable inline helpers "-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-

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
        : "linear-gradient(135deg, rgba(123, 85, 234,0.10), rgba(123, 85, 234,0.06))";
    const border = accent ? `1px solid ${accent}33` : "1px solid rgba(255,255,255,0.06)";
    const glow = accent
        ? `radial-gradient(ellipse 60% 60% at 50% 50%, ${accent}33 0%, transparent 70%)`
        : "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(123, 85, 234,0.18) 0%, transparent 70%)";
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

// "-"- -4 SOLUTION: flow node + animated connector "-"-
function FlowNode({ num, title, caption, icon, accent }: typeof FLOW_NODES[number]) {
    return (
        <div className="flex flex-col items-center gap-3 text-center w-36">
            {/* Number badge above node */}
            <span
                className="text-eyebrow"
                style={{ color: "rgba(123, 85, 234,0.6)" }}
            >
                {num}
            </span>
            {/* Node */}
            <div
                className="rounded-2xl p-px"
                style={{
                    background: "linear-gradient(135deg, rgba(123, 85, 234,0.55) 0%, rgba(255,255,255,0.06) 50%, rgba(123, 85, 234,0.45) 100%)",
                    boxShadow: "0 12px 36px rgba(123, 85, 234,0.15)",
                }}
            >
                <div
                    className="flex h-24 w-24 items-center justify-center rounded-[15px]"
                    style={{ background: "rgba(10,14,28,0.98)" }}
                >
                    <ServiceIcon kind={icon} accent={accent} size={36} />
                </div>
            </div>
            <h3 className="display-card-title" style={{ fontWeight: 500 }}>{title}</h3>
            <p className="text-caption leading-relaxed" style={{ color: "rgba(255,255,255,0.45)", maxWidth: "140px" }}>{caption}</p>
        </div>
    );
}

function FlowConnector({ vertical = false }: { vertical?: boolean }) {
    if (vertical) {
        return (
            <div className="flex justify-center py-1" aria-hidden>
                <div className="relative flex flex-col items-center" style={{ height: "52px", width: "2px" }}>
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(123, 85, 234,0.15), rgba(123, 85, 234,0.35), rgba(123, 85, 234,0.15))" }} />
                    <motion.div
                        className="absolute w-2 h-2 rounded-full -left-[3px]"
                        style={{ background: "rgba(123, 85, 234,0.9)", boxShadow: "0 0 8px rgba(123, 85, 234,0.7)" }}
                        initial={{ top: 0 }}
                        animate={{ top: "calc(100% - 8px)" }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                    />
                </div>
            </div>
        );
    }
    return (
        <div className="flex items-center w-16 flex-shrink-0" aria-hidden style={{ marginTop: "74px" }}>
            <div className="relative flex w-full items-center">
                <div className="h-px w-full" style={{ background: "linear-gradient(to right, rgba(123, 85, 234,0.25), rgba(123, 85, 234,0.5), rgba(123, 85, 234,0.25))" }} />
                <svg className="flex-shrink-0 -ml-px" width="7" height="12" viewBox="0 0 7 12" fill="none">
                    <path d="M1 1L6 6L1 11" stroke="rgba(123, 85, 234,0.55)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <motion.div
                    className="absolute h-1.5 w-1.5 rounded-full"
                    style={{ top: "50%", marginTop: "-3px", background: "rgba(123, 85, 234,0.9)", boxShadow: "0 0 6px rgba(123, 85, 234,0.7)" }}
                    initial={{ left: 0 }}
                    animate={{ left: "calc(100% - 8px)" }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                />
            </div>
        </div>
    );
}

// "-"- Problem spider: hub-and-spoke layout (desktop only) "-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-
// Canvas: 960 - 440. Center: (480, 220).
// Pain-point copy renders as HTML cards anchored at the spoke tips, so the
// tips are pulled inward to leave card room between them and the edges.
const SPIDER_W = 960, SPIDER_H = 440, SPIDER_CX = 480, SPIDER_CY = 220;
// Spoke tips "" lines terminate here, node dot sits exactly here.
const SPOKE_ENDS = [
    { x: 272, y: 72 },   // TL
    { x: 688, y: 72 },   // TR
    { x: 272, y: 340 },  // BL
    { x: 688, y: 340 },  // BR
] as const;

// A concrete, live symptom under each pain point (illustrative figures).
const PAIN_SIGNALS = [
    { value: (t: number) => `${(11.5 + (t % 6) * 0.25).toFixed(2)}h`, label: "a week on manual reports" },
    { value: () => "3", label: "revenue numbers, none agree" },
    { value: (t: number) => `${(12480 + t * 7).toLocaleString("en-US")} → 3`, label: "visits to qualified leads" },
    { value: () => "7", label: "AI tools, none connected" },
]

function usePainTicker() {
    const [t, setT] = useState(0);
    const reduced = useReducedMotion();
    useEffect(() => {
        if (reduced) return;
        const id = window.setInterval(() => setT((x) => x + 1), 1600);
        return () => window.clearInterval(id);
    }, [reduced]);
    return t;
}

function PainCard({ i, t }: { i: number; t: number }) {
    const sig = PAIN_SIGNALS[i];
    return (
        <div
            className="rounded-2xl p-px"
            style={{
                background: "linear-gradient(135deg, rgba(255,90,110,0.36) 0%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.05) 100%)",
                boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
            }}
        >
            <div
                className="flex flex-col gap-1.5 rounded-[15px] px-5 py-4"
                style={{ background: "linear-gradient(180deg, rgba(19,16,30,0.96) 0%, rgba(11,9,20,0.98) 100%)" }}
            >
                <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-semibold tabular-nums tracking-[0.2em]" style={{ color: "var(--status-off)", fontFamily: "var(--font-code), ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                        {String(i + 1).padStart(2, "0")}
                    </span>
                    <span aria-hidden className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.14), transparent)" }} />
                </div>
                <p className="text-[15px] font-medium leading-snug tracking-[-0.01em] text-white/90">{PAIN_POINTS[i].title}</p>
                <p className="text-[12.5px] leading-relaxed text-white/55">{PAIN_POINTS[i].desc}</p>
                <div className="mt-1.5 flex items-center gap-2 border-t pt-2.5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <span className="relative flex h-1.5 w-1.5 flex-shrink-0" aria-hidden>
                        <span className="absolute inset-0 animate-ping rounded-full opacity-60" style={{ background: "var(--status-off)" }} />
                        <span className="relative h-1.5 w-1.5 rounded-full" style={{ background: "var(--status-off)" }} />
                    </span>
                    <span className="flex-shrink-0 whitespace-nowrap text-[12px] tabular-nums text-white/90" style={{ fontFamily: "var(--font-code), ui-monospace, SFMono-Regular, Menlo, monospace" }}>{sig.value(t)}</span>
                    <span className="min-w-0 truncate text-[12px] text-white/45">{sig.label}</span>
                </div>
            </div>
        </div>
    );
}

// "-"- Problem core: an overloaded system with its tools cut off (shared mobile + desktop) "-"-
const CORE_TOOLS = [
    { label: "CRM", x: 120, y: 18 },
    { label: "Sheets", x: 222, y: 120 },
    { label: "Inbox", x: 120, y: 222 },
    { label: "AI tools", x: 18, y: 120 },
];

function ProblemCore({ size = 230 }: { size?: number }) {
    const MONO_FONT = "var(--font-code), ui-monospace, SFMono-Regular, Menlo, monospace";
    const R = 58; // gauge radius
    const C = 2 * Math.PI * R;
    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <div aria-hidden className="pointer-events-none absolute inset-0" style={{
                borderRadius: "50%",
                background: "radial-gradient(circle at 50% 50%, rgba(255,90,110,0.12) 0%, rgba(123,85,234,0.07) 42%, transparent 70%)",
                transform: "scale(1.6)",
            }} />
            <svg width={size} height={size} viewBox="0 0 240 240" fill="none" className="relative z-10 overflow-visible" aria-hidden>
                <defs>
                    <radialGradient id="pcore_fill" cx="50%" cy="38%" r="65%">
                        <stop offset="0%" stopColor="rgba(123,85,234,0.22)" />
                        <stop offset="60%" stopColor="rgba(30,18,52,0.85)" />
                        <stop offset="100%" stopColor="rgba(12,8,24,0.98)" />
                    </radialGradient>
                    <filter id="pcore_glow" x="-80%" y="-80%" width="260%" height="260%">
                        <feGaussianBlur stdDeviation="3.5" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                {/* Broken tethers to each tool: they flicker and never connect */}
                {CORE_TOOLS.map((t, i) => {
                    const dx = t.x - 120, dy = t.y - 120;
                    const len = Math.hypot(dx, dy);
                    const ux = dx / len, uy = dy / len;
                    const a1 = { x: 120 + ux * 74, y: 120 + uy * 74 };
                    const b1 = { x: 120 + ux * 84, y: 120 + uy * 84 };
                    const b2 = { x: 120 + ux * 90, y: 120 + uy * 90 };
                    const a2 = { x: t.x - ux * 16, y: t.y - uy * 16 };
                    return (
                        <motion.g key={t.label} animate={{ opacity: [0.35, 0.9, 0.35] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}>
                            <line x1={a1.x} y1={a1.y} x2={b1.x} y2={b1.y} stroke="rgba(255,90,110,0.7)" strokeWidth="1.2" strokeDasharray="2 3" />
                            <line x1={b2.x} y1={b2.y} x2={a2.x} y2={a2.y} stroke="rgba(255,90,110,0.7)" strokeWidth="1.2" strokeDasharray="2 3" />
                        </motion.g>
                    );
                })}

                {/* Expanding pulse rings */}
                {[0, 1.3].map((delay) => (
                    <motion.circle key={delay} cx="120" cy="120" r="70" fill="none" stroke="rgba(255,90,110,0.3)" strokeWidth="1"
                        initial={{ opacity: 0 }} animate={{ r: [66, 98], opacity: [0.4, 0] }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut", delay }} />
                ))}

                {/* Core */}
                <circle cx="120" cy="120" r="70" fill="url(#pcore_fill)" stroke="rgba(123,85,234,0.35)" strokeWidth="1.2" />

                {/* Load gauge: red arc straining near the top */}
                <circle cx="120" cy="120" r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
                <g filter="url(#pcore_glow)" transform="rotate(-90 120 120)">
                    <motion.circle cx="120" cy="120" r={R} fill="none" stroke="rgba(255,90,110,0.95)" strokeWidth="5" strokeLinecap="round"
                        strokeDasharray={C}
                        animate={{ strokeDashoffset: [C * 0.06, C * 0.02, C * 0.045, C * 0.015, C * 0.06] }}
                        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }} />
                </g>

                {/* Readout */}
                <text x="120" y="117" textAnchor="middle" fill="rgba(240,240,242,0.95)" style={{ fontSize: 26, fontWeight: 300, letterSpacing: "-0.02em" }}>97%</text>
                <text x="120" y="133" textAnchor="middle" fill="rgba(163,163,172,0.75)" style={{ fontSize: 7.5, letterSpacing: "0.22em", fontFamily: MONO_FONT }}>SYSTEM LOAD</text>
                <motion.g animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
                    <rect x="97" y="141" width="46" height="13" rx="6.5" fill="rgba(255,90,110,0.12)" stroke="rgba(255,90,110,0.5)" strokeWidth="0.8" />
                    <text x="120" y="150.5" textAnchor="middle" fill="rgba(255,120,135,0.95)" style={{ fontSize: 7, fontWeight: 600, letterSpacing: "0.1em", fontFamily: MONO_FONT }}>4 ALERTS</text>
                </motion.g>

                {/* The tools, cut off from the core */}
                {CORE_TOOLS.map((t) => {
                    const w = t.label.length * 5.4 + 16;
                    return (
                        <g key={t.label}>
                            <rect x={t.x - w / 2} y={t.y - 9} width={w} height="18" rx="9" fill="rgba(14,12,24,0.96)" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
                            <circle cx={t.x - w / 2 + 8} cy={t.y} r="2" fill="rgba(255,90,110,0.95)" />
                            <text x={t.x + 3} y={t.y + 3} textAnchor="middle" fill="rgba(240,240,242,0.8)" style={{ fontSize: 8, fontFamily: MONO_FONT }}>{t.label}</text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

function ProblemSpider() {
    const W = SPIDER_W, H = SPIDER_H, cx = SPIDER_CX, cy = SPIDER_CY;
    const t = usePainTicker();
    // Spokes run from each pain point into the hub: the chaos converges on the business.
    const spokes = SPOKE_ENDS.map((e, i) => ({ d: `M${e.x} ${e.y} L${cx} ${cy}`, grad: `psp_${i}`, e, i }));

    return (
        <div className="relative mx-auto w-full max-w-5xl" style={{ aspectRatio: `${W} / ${H}` }}>
            <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
                <defs>
                    <filter id="prob_node_glow" x="-150%" y="-150%" width="400%" height="400%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    {spokes.map(({ e, grad }) => (
                        <linearGradient key={grad} id={grad} x1={e.x} y1={e.y} x2={cx} y2={cy} gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="rgba(255,90,110,0.45)" />
                            <stop offset="75%" stopColor="rgba(255,90,110,0.18)" />
                            <stop offset="100%" stopColor="rgba(123,85,234,0)" />
                        </linearGradient>
                    ))}
                </defs>

                {[150, 185].map((r, i) => (
                    <motion.circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="rgba(123,85,234,0.07)" strokeWidth="1" strokeDasharray="4 8"
                        animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                        transition={{ duration: 22 + i * 8, repeat: Infinity, ease: "linear" }}
                        style={{ transformOrigin: `${cx}px ${cy}px` }} />
                ))}

                {/* Spoke + flowing dashes heading into the hub */}
                {spokes.map(({ d, grad, i }) => (
                    <g key={grad}>
                        <path d={d} stroke={`url(#${grad})`} strokeWidth="1.5" fill="none" />
                        <motion.path d={d} stroke="rgba(255,110,125,0.85)" strokeWidth="1.6" strokeLinecap="round" fill="none" strokeDasharray="3 14"
                            animate={{ strokeDashoffset: [0, -68] }}
                            transition={{ duration: 2.2 + i * 0.25, repeat: Infinity, ease: "linear" }} />
                    </g>
                ))}

                {/* Pain point nodes */}
                {SPOKE_ENDS.map((end, i) => (
                    <g key={i}>
                        <g filter="url(#prob_node_glow)">
                            <motion.circle cx={end.x} cy={end.y} r="10" fill="none" stroke="rgba(255,90,110,0.5)" strokeWidth="1"
                                animate={{ r: [8, 14, 8], opacity: [0.6, 0.1, 0.6] }}
                                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }} />
                        </g>
                        <circle cx={end.x} cy={end.y} r="6" fill="rgba(255,90,110,0.95)" opacity="0.15" />
                        <circle cx={end.x} cy={end.y} r="4" fill="rgba(255,90,110,0.95)" />
                        <circle cx={end.x} cy={end.y} r="2" fill="rgba(255,255,255,0.9)" />
                    </g>
                ))}
            </svg>

            {/* Pain point cards, HTML for crisp text */}
            {SPOKE_ENDS.map((end, i) => {
                const isLeft = end.x < cx;
                const xPct = (end.x / W) * 100;
                const yPct = (end.y / H) * 100;
                return (
                    <div key={i} className="absolute" style={{
                        top: `${yPct}%`,
                        transform: "translateY(-50%)",
                        ...(isLeft ? { left: 0, width: `calc(${xPct}% - 24px)` } : { right: 0, width: `calc(${100 - xPct}% - 24px)` }),
                    }}>
                        <div data-reveal data-reveal-delay={Math.round((0.35 + i * 0.1) * 1000)}>
                            <PainCard i={i} t={t} />
                        </div>
                    </div>
                );
            })}

            {/* Center: the overloaded system */}
            <div data-reveal data-reveal-delay="200" className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                <ProblemCore size={250} />
            </div>
        </div>
    );
}

function ProblemMobile() {
    const t = usePainTicker();
    return (
        <div className="flex flex-col gap-4 lg:hidden">
            {PAIN_POINTS.map((_, i) => (
                <div data-reveal data-reveal-delay={i * 80} key={i}>
                    <PainCard i={i} t={t} />
                </div>
            ))}
            <div data-reveal data-reveal-delay="200" className="mt-6 flex justify-center">
                <ProblemCore size={230} />
            </div>
        </div>
    );
}

// "-"- Page "-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-
export default function HeroSection() {
    const { open: openBookCall } = useBookCall();
    return (
        <main className="relative min-h-screen bg-[var(--background)] flex flex-col">

            {/* "" 1. HERO (cinematic) """""""""""""""""""""""""""" */}
            <HomeHero />
            <SectionDivider />

            {/* "" 2. THE PROBLEM """""""""" */}
            <section id="problem" className="home-theme-dark relative w-full px-6 py-14 md:py-20 overflow-hidden">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: [
                        "radial-gradient(ellipse 50% 55% at 50% 45%, rgba(255,80,80,0.06) 0%, transparent 65%)",
                        "radial-gradient(ellipse 45% 50% at 50% 50%, rgba(123, 85, 234,0.05) 0%, transparent 70%)",
                    ].join(", "),
                }} />
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0 dot-grid-bg" />
                <div className="relative z-10 mx-auto max-w-[1120px]">
                    <div
                        data-reveal
                        className="mb-10 flex flex-col items-center text-center gap-3 md:mb-12"
                    >
                        <SectionBeam />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">Most businesses are</span>
                            <span className="display-strong-line">scaling chaos, not systems.</span>
                        </h2>
                    </div>

                    {/* Mobile: stacked pain point cards + the overloaded core */}
                    <ProblemMobile />

                    {/* "" Desktop: spider / hub layout "" */}
                    <div className="hidden lg:block">
                        <ProblemSpider />
                    </div>
                </div>
            </section>

            <SectionDivider />

            {/* "" 3. OUR SOLUTION (with 4-node flow diagram) """"" */}
            <section id="solution" className="home-theme-dark relative w-full px-6 py-14 md:py-20 overflow-hidden">
                <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0" style={{
                        background: [
                            "radial-gradient(ellipse 55% 50% at 50% 25%, rgba(123, 85, 234,0.08) 0%, transparent 65%)",
                            "radial-gradient(ellipse 40% 45% at 15% 75%, rgba(123, 85, 234,0.05) 0%, transparent 60%)",
                        ].join(", ")
                    }} />
                </div>
                <div aria-hidden className="pointer-events-none absolute inset-0 home-ai-grid opacity-[0.3]" />
                <div className="relative z-10 mx-auto max-w-[1120px]">
                    <div
                        data-reveal
                        className="mx-auto mb-10 flex max-w-4xl flex-col items-center text-center gap-3"
                    >
                        <SectionBeam />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">We don&apos;t sell services.</span>
                            <span className="display-strong-line">We build infrastructure.</span>
                        </h2>
                        <p className="max-w-2xl text-lead text-white/55">
                            Levata designs and operates custom intelligence systems built for your business. Strategy, automation, technology, and digital experience, all aligned under one team, one vision.
                        </p>
                    </div>

                    {/* Flow diagram, horizontal on md+, vertical on mobile */}
                    <div
                        data-reveal
                        data-reveal-delay="150"
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
                    </div>

                    <div data-reveal data-reveal-delay="200" className="mx-auto mt-12 max-w-4xl md:mt-14">
                        <UnifiedOpsMock />
                    </div>
                </div>
            </section>

            <SectionDivider />

            {/* 5 Featured Product moved to 7, see below */}

            {/* "" 4. SERVICE CATEGORIES (Horizontal carousel) """" */}
            <section id="services" className="home-theme-dark relative w-full px-5 py-14 sm:px-6 md:py-20 overflow-hidden">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: "radial-gradient(ellipse 60% 70% at 50% 40%, rgba(123, 85, 234,0.05) 0%, transparent 70%)",
                }} />

                <div className="relative z-10 mx-auto max-w-[1120px]">
                    <div
                        data-reveal
                    >
                        <ServicesCarousel />
                    </div>
                </div>
            </section>

            <SectionDivider />

            {/* "" 5. MID-PAGE CTA """""""""""""""""""""""""""""""" */}
            <section className="home-theme-dark relative w-full px-5 py-14 sm:px-6 md:py-20 overflow-hidden">
                <CTAAurora variant={2} />
                <div
                    data-reveal
                    className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-7 text-center"
                >
                    <h2 className="display-section-title display-inline max-w-2xl text-center">
                        <span className="display-muted-line">Your next level </span><span className="display-strong-line">starts here.</span>
                    </h2>
                    <p className="max-w-xl text-lead text-white/55">
                        Let&apos;s uncover what&apos;s slowing your growth, and what fixes it.
                    </p>
                    <div className="flex flex-col items-center gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white cursor-pointer"
                            data-cta="primary"
                        >
                            Book your call
                            <span aria-hidden className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                        </button>
                    </div>
                </div>
            </section>

            <SectionDivider />

            {/* "" 6. CLIENTS MARQUEE """"""""""""""""""" */}
            <div className="relative z-10">
                <ClientsMarquee />
            </div>

            <SectionDivider />

            {/* "" 7. PRODUCTS: Sales Intelligence, Helm, Sable "" */}
            <ProductsShowcase />

            {/* "" 8. BY THE NUMBERS "" no divider, flows from Featured Product above "" */}
            <section id="numbers" className="home-theme-dark relative w-full px-6 py-14 md:py-20">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background:
                        "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(123, 85, 234,0.06) 0%, transparent 65%)",
                }} />
                <div className="relative z-10 mx-auto max-w-[1120px]">
                    <div
                        data-reveal
                        className="mb-10 flex flex-col items-center md:mb-12 text-center gap-3"
                    >
                        <SectionBeam />
                        <h2 className="display-section-title display-inline max-w-2xl text-center">
                            <span className="display-muted-line">What smarter operations </span><span className="display-strong-line">deliver.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-y-10 gap-x-5 sm:gap-y-12 sm:gap-x-8 md:grid-cols-4 md:gap-x-12 text-center">
                        {KEY_RESULTS.map((r) => (
                            <StatCounter key={r.label} {...r} />
                        ))}
                    </div>
                </div>
            </section>

            <SectionDivider />

            {/* "" 9. TESTIMONIALS """"""""""""""""""""""""""""""" */}
            <TestimonialsSection />

            <SectionDivider />

            {/* "" 10. TECH STACK (LOCKED) """""""""""""""""""""""" */}
            <TechStackSection />

            <SectionDivider />

            {/* "" 11. WHY CHOOSE LEVATA "" */}
            <section className="home-theme-dark relative w-full px-5 py-14 sm:px-6 md:py-20">
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" style={{
                    background: [
                        "radial-gradient(ellipse 50% 60% at 15% 50%, rgba(123,85,234,0.07) 0%, transparent 70%)",
                        "radial-gradient(ellipse 40% 50% at 85% 50%, rgba(123,85,234,0.05) 0%, transparent 70%)",
                    ].join(", "),
                }} />

                <div className="relative z-10 mx-auto max-w-[1120px]">
                    <WhyLevataDeck />
                </div>
            </section>

            <SectionDivider />

            {/* "" 12. FINAL CTA """""""""""""""""""""""""""""""" */}
            <section className="home-theme-dark relative w-full overflow-hidden px-5 py-14 sm:px-6 md:py-20">
                <CTAAurora variant={1} />
                <div aria-hidden className="absolute left-1/2 top-0 h-px w-32 -translate-x-1/2" style={{ background: "linear-gradient(to right, transparent, rgba(123, 85, 234,0.5), transparent)" }} />
                <div
                    data-reveal
                    className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center"
                >
                    <h2 className="display-section-title max-w-2xl text-center">
                        <span className="display-muted-line">Ready to build intelligence</span>
                        <span className="display-strong-line">into your operations?</span>
                    </h2>
                    <p className="mt-4 max-w-md text-body-sm text-white/55">
                        Book a free strategy call. We&apos;ll map out the system your business needs.
                    </p>
                    <button
                        type="button"
                        onClick={openBookCall}
                        className="group mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white cursor-pointer"
                        data-cta="primary"
                    >
                        Book a Strategy Call
                        <span aria-hidden className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                    </button>
                </div>
            </section>

        </main>
    );
}
