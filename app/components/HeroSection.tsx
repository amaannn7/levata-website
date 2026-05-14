"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
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
import HeroFloatingCards from "@/app/components/HeroFloatingCards";

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
                className="text-5xl font-extrabold leading-none tracking-tight text-white md:text-6xl"
            >
                {count}
                <span className="text-white">{suffix}</span>
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

// ── Tech Stack (LOCKED — do not modify) ────────────────────────────────────
const TECH_CATEGORIES = [
    {
        label: "Frontend",
        items: [
            { name: "Next.js", color: "#ffffff", Icon: SiNextdotjs },
            { name: "React", color: "#61DAFB", Icon: SiReact },
            { name: "Vue.js", color: "#4FC08D", Icon: SiVuedotjs },
            { name: "Nuxt", color: "#00DC82", Icon: SiNuxt },
            { name: "SvelteKit", color: "#FF3E00", Icon: SiSvelte },
            { name: "Angular", color: "#DD0031", Icon: SiAngular },
        ],
    },
    {
        label: "Backend",
        items: [
            { name: "Express", color: "#ffffff", Icon: SiExpress },
            { name: "NestJS", color: "#E0234E", Icon: SiNestjs },
            { name: "Spring Boot", color: "#6DB33F", Icon: SiSpring },
            { name: "FastAPI", color: "#009688", Icon: SiFastapi },
            { name: "Django", color: "#44B78B", Icon: SiDjango },
            { name: "Laravel", color: "#FF2D20", Icon: SiLaravel },
        ],
    },
    {
        label: "CMS",
        items: [
            { name: "Sanity", color: "#F03E2F", Icon: SiSanity },
            { name: "Strapi", color: "#8C4BFF", Icon: SiStrapi },
            { name: "Contentful", color: "#2478CC", Icon: SiContentful },
            { name: "WordPress", color: "#21759B", Icon: SiWordpress },
            { name: "Payload CMS", color: "#ffffff", Icon: SiPayloadcms },
            { name: "Directus", color: "#6644FF", Icon: SiDirectus },
        ],
    },
    {
        label: "Databases",
        items: [
            { name: "PostgreSQL", color: "#336791", Icon: SiPostgresql },
            { name: "MySQL", color: "#4479A1", Icon: SiMysql },
            { name: "MongoDB", color: "#47A248", Icon: SiMongodb },
            { name: "Supabase", color: "#3ECF8E", Icon: SiSupabase },
            { name: "Firebase", color: "#FFCA28", Icon: SiFirebase },
            { name: "Redis", color: "#DC382D", Icon: SiRedis },
        ],
    },
];

function TechStackSection() {
    const [activeCategory, setActiveCategory] = useState(0);
    const cat = TECH_CATEGORIES[activeCategory];
    const sectionRef = useRef<HTMLElement>(null);

    return (
        <section ref={sectionRef} className="relative w-full px-6 py-14 md:py-20 overflow-hidden">
            <div className="pointer-events-none absolute z-0" style={{
                top: "20%", left: "50%", transform: "translateX(-50%)",
                width: "120vw", height: "500px",
                background: [
                    "radial-gradient(ellipse 30% 50% at 25% 50%, rgba(114,200,245,0.06) 0%, transparent 70%)",
                    "radial-gradient(ellipse 30% 50% at 75% 50%, rgba(155,47,255,0.07) 0%, transparent 70%)",
                ].join(", "),
            }} />
            <div className="relative z-10 mx-auto max-w-6xl">
                <div className="mb-3 inline-flex items-center gap-3">
                    <span className="flex items-center">
                        <span className="animate-label-line" />
                        <span className="animate-label-dot" />
                    </span>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Our stack</p>
                </div>
                <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-white md:text-4xl" data-reveal>Tech that stacks up</h2>
                <p className="mb-10 max-w-xl text-sm text-white/40 leading-relaxed" data-reveal>
                    We use the best technology for your product &mdash; whether it&apos;s cutting-edge AI or battle-tested infrastructure.
                </p>
                <div className="mb-10 flex flex-wrap justify-center gap-2">
                    {TECH_CATEGORIES.map((c, i) => {
                        const active = activeCategory === i;
                        return (
                            <button
                                key={c.label}
                                onClick={() => setActiveCategory(i)}
                                className="rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-500"
                                style={{
                                    background: active ? "rgba(155,47,255,0.12)" : "transparent",
                                    border: active ? "1px solid rgba(155,47,255,0.35)" : "1px solid rgba(255,255,255,0.08)",
                                    color: active ? "#ffffff" : "rgba(255,255,255,0.45)",
                                    boxShadow: active ? "0 0 24px rgba(155,47,255,0.18)" : "none",
                                }}
                            >
                                {c.label}
                            </button>
                        );
                    })}
                </div>

                <div
                    key={activeCategory}
                    className="grid grid-cols-2 md:grid-cols-3 animate-tech-fade-in"
                    style={{
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                        borderLeft: "1px solid rgba(255,255,255,0.06)",
                    }}
                >
                    {cat.items.map(({ name, color, Icon }) => (
                        <div
                            key={name}
                            className="group relative flex items-center justify-center gap-5 py-12 px-6 transition-colors duration-500 cursor-default"
                            style={{
                                borderRight: "1px solid rgba(255,255,255,0.06)",
                                borderBottom: "1px solid rgba(255,255,255,0.06)",
                                ["--tech-glow" as string]: color,
                            }}
                        >
                            <Icon
                                size={32}
                                color={color}
                                className="[filter:grayscale(1)_brightness(0)_invert(1)_opacity(0.55)] group-hover:[filter:drop-shadow(0_0_12px_var(--tech-glow))] transition-[filter] duration-500 flex-shrink-0"
                            />
                            <span className="text-base font-medium text-white/45 group-hover:text-white transition-colors duration-500">
                                {name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ── Content data ───────────────────────────────────────────────────────────
const SERVICES_TICKER = [
    "AI & Intelligence Systems",
    "Digital Products",
    "Automation & Systems",
    "Growth & Marketing",
];
const TICKER_ITEMS = [
    SERVICES_TICKER[3], SERVICES_TICKER[0], SERVICES_TICKER[1], SERVICES_TICKER[2],
    SERVICES_TICKER[3], SERVICES_TICKER[0], SERVICES_TICKER[1],
];
const ITEM_H = 56;

const PAIN_POINTS = [
    {
        title: "Manual operations bleeding hours",
        body: "Reporting, follow-ups, data entry, and approvals are consuming time that should be driving growth.",
        accent: "#9B2FFF",
    },
    {
        title: "Digital presence that doesn't convert",
        body: "Your website looks fine — but it's not designed to capture, qualify, and close. It's a brochure, not a revenue engine.",
        accent: "#72C8F5",
    },
    {
        title: "Disconnected tools, fragmented data",
        body: "Your CRM doesn't talk to your platform. Your platform doesn't talk to your ops. Every tool creates a new silo.",
        accent: "#3DFD98",
    },
];

const PRODUCT_FEATURES = [
    "AI-powered prospect research: company profiles, pain points, buying signals, and opening hooks",
    "Lead scoring and prioritization against your ideal customer profile",
    "Personalized cold email and follow-up generation in seconds",
    "Call scripts tailored to prospect, role, and industry",
    "Work queues that surface the right leads at the right time",
    "CRM sync — push qualified opportunities directly into your pipeline",
];

// ── Service icons (colored square with line-art glyph + sparkle) ──────────
function ServiceIcon({ kind, accent }: { kind: IconKind; accent: string }) {
    const sparkle = (
        <path
            d="M26 4L27 6L29 7L27 8L26 10L25 8L23 7L25 6Z"
            fill={accent}
        />
    );
    const stroke = { stroke: accent, strokeWidth: 1.8, fill: "none" as const, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
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
    subServices: string[];
    learnMore: string;
    href: string;
    accent: string;
    icon: IconKind;
    featured: boolean;
}> = [
        {
            title: "AI & Intelligence",
            subServices: [
                "AI integration & assistants",
                "Custom model deployment",
                "Intelligent automation workflows",
            ],
            learnMore: "Explore AI & intelligence",
            href: "/products/ai-intelligence",
            accent: "#9B2FFF",
            icon: "ai",
            featured: true,
        },
        {
            title: "Sales Intelligence Platform",
            subServices: [
                "AI-powered prospect research",
                "Lead scoring & prioritization",
                "Outreach automation & CRM sync",
            ],
            learnMore: "Discover Sales Intelligence",
            href: "/products/sales-intelligence-platform",
            accent: "#72C8F5",
            icon: "sales",
            featured: false,
        },
        {
            title: "Digital Products",
            subServices: [
                "MVP development with AI",
                "Validated product launches",
                "Scalable platform architecture",
            ],
            learnMore: "Build a digital product",
            href: "/contact",
            accent: "#BB00FF",
            icon: "products",
            featured: false,
        },
        {
            title: "Digital Services",
            subServices: [
                "Websites & web platforms",
                "E-commerce & portals",
                "Conversion-optimized builds",
            ],
            learnMore: "Explore digital services",
            href: "/contact",
            accent: "#3DFD98",
            icon: "services",
            featured: false,
        },
        {
            title: "Automation & Systems",
            subServices: [
                "Workflow & back-office automation",
                "Real-time reporting & BI",
                "Operations infrastructure",
            ],
            learnMore: "Automate your operations",
            href: "/contact",
            accent: "#72C8F5",
            icon: "automation",
            featured: false,
        },
        {
            title: "Growth & Marketing",
            subServices: [
                "AI-driven acquisition",
                "Content & SEO systems",
                "Conversion rate optimization",
            ],
            learnMore: "Scale your growth",
            href: "/contact",
            accent: "#9B2FFF",
            icon: "growth",
            featured: false,
        },
    ];

function ServiceCard({ card }: { card: typeof SERVICE_CARDS[number] }) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex h-full flex-col gap-6 rounded-2xl p-7"
            style={{
                background: card.featured
                    ? "linear-gradient(145deg, rgba(155,47,255,0.13) 0%, rgba(7,0,31,0.97) 100%)"
                    : "rgba(8,1,28,0.55)",
                border: card.featured
                    ? "1px solid rgba(155,47,255,0.3)"
                    : "1px solid rgba(255,255,255,0.07)",
            }}
        >
            {/* Hover border glow */}
            <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    boxShadow: `inset 0 0 0 1px ${card.accent}40`,
                    background: `radial-gradient(ellipse 80% 50% at 0% 0%, ${card.accent}0F 0%, transparent 60%)`,
                }}
            />

            {/* Icon square with glow */}
            <div className="relative">
                <div
                    aria-hidden
                    className="pointer-events-none absolute -inset-3 rounded-2xl blur-xl"
                    style={{ background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${card.accent}40 0%, transparent 70%)` }}
                />
                <div
                    className="relative flex h-14 w-14 items-center justify-center rounded-xl"
                    style={{
                        background: `linear-gradient(135deg, ${card.accent}3B 0%, ${card.accent}14 100%)`,
                        border: `1px solid ${card.accent}50`,
                        boxShadow: `0 0 20px ${card.accent}30, inset 0 0 10px ${card.accent}15`,
                    }}
                >
                    <ServiceIcon kind={card.icon} accent={card.accent} />
                </div>
            </div>

            {/* Title — pure white */}
            <h3 className="text-[1.4rem] font-bold leading-snug tracking-tight text-white">
                {card.title}
            </h3>

            {/* Bulleted sub-services — pure white text, accent-colored diamonds */}
            <ul className="flex flex-1 flex-col gap-3">
                {card.subServices.map((s) => (
                    <li key={s} className="flex items-start gap-3 text-sm leading-relaxed text-white">
                        <span
                            aria-hidden
                            className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rotate-45"
                            style={{ background: card.accent }}
                        />
                        <span>{s}</span>
                    </li>
                ))}
            </ul>

            {/* Learn-more link — white text, accent-colored on hover */}
            <a
                href={card.href}
                className="group/lm inline-flex items-center gap-2 self-start text-sm font-semibold text-white transition-opacity hover:opacity-80"
            >
                {card.learnMore}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="transition-transform duration-300 group-hover/lm:translate-x-0.5" aria-hidden>
                    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </a>
        </motion.div>
    );
}

function ServiceCardsTrack() {
    return (
        <div className="mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {SERVICE_CARDS.map((card, i) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <ServiceCard card={card} />
                    </motion.div>
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

// ── Process steps data ────────────────────────────────────────────────────

const PROCESS_STEPS = [
    {
        num: "01",
        accent: "#9B2FFF",
        title: "Discovery & Audit",
        bullets: [
            "Map your business model, data flows, and existing systems.",
            "Identify the highest-leverage AI and automation opportunities.",
            "Align technical capability with your commercial goals.",
        ],
        result: "A clear opportunity map and prioritised roadmap — before a single line of code is written.",
    },
    {
        num: "02",
        accent: "#72C8F5",
        title: "Architecture & Strategy",
        bullets: [
            "Design your custom AI ecosystem and integration architecture.",
            "Define measurable KPIs and success criteria for each initiative.",
            "Validate the roadmap against real business constraints.",
        ],
        result: "A battle-tested blueprint your team can execute against with full confidence.",
    },
    {
        num: "03",
        accent: "#3DFD98",
        title: "Build, Launch & Optimise",
        bullets: [
            "Ship in focused engineering sprints with full progress visibility.",
            "Managed launch with onboarding, documentation, and support.",
            "Continuous iteration: measure results and compound improvements.",
        ],
        result: "A system that keeps getting smarter — delivering increasing ROI month over month.",
    },
];

const WHY_LEVATA = [
    {
        title: "AI-Native From the Ground Up",
        body: "Every system we ship is designed with AI at its core — not bolted on as an afterthought.",
    },
    {
        title: "End-to-End Under One Roof",
        body: "Strategy, design, engineering, automation, and growth — all coordinated under one accountable team.",
    },
    {
        title: "Continuous Optimisation Model",
        body: "We don't disappear after launch. We measure, iterate, and compound results month over month.",
    },
];

// ── Page ───────────────────────────────────────────────────────────────────
export default function HeroSection() {
    const outerRef = useRef<HTMLImageElement>(null);
    const innerRef = useRef<HTMLImageElement>(null);
    const tickerTrack = useRef<HTMLDivElement>(null);
    const step = useRef(0);

    useEffect(() => {
        if (!outerRef.current || !innerRef.current) return;

        const t1 = gsap.to(outerRef.current, {
            rotation: -360,
            duration: 45,
            ease: "none",
            repeat: -1,
            transformOrigin: "center center",
        });

        const t2 = gsap.to(innerRef.current, {
            rotation: 360,
            duration: 45,
            ease: "none",
            repeat: -1,
            transformOrigin: "center center",
        });

        const setRowStyles = (s: number, instant = false) => {
            const rows = tickerTrack.current?.children;
            if (!rows) return;
            for (let i = 0; i < rows.length; i++) {
                const isMiddle = i === s + 1;
                const isAdjacent = i === s || i === s + 2;
                const opacity = isMiddle ? 1 : isAdjacent ? 0.25 : 0;
                if (instant) {
                    gsap.set(rows[i], { opacity });
                } else {
                    gsap.to(rows[i], { opacity, duration: 0.4, ease: "power2.out" });
                }
            }
        };

        step.current = 0;
        gsap.set(tickerTrack.current, { y: 0 });
        setRowStyles(0, true);

        const tick = () => {
            step.current += 1;
            setRowStyles(step.current);
            gsap.to(tickerTrack.current, {
                y: -(step.current * ITEM_H),
                duration: 0.65,
                ease: "power2.inOut",
                onComplete: () => {
                    if (step.current === 4) {
                        gsap.set(tickerTrack.current, { y: 0 });
                        step.current = 0;
                        setRowStyles(0, true);
                    }
                },
            });
        };

        let interval = setInterval(tick, 2800);

        const handleVisibilityChange = () => {
            if (document.hidden) {
                clearInterval(interval);
            } else {
                gsap.killTweensOf(tickerTrack.current);
                step.current = 0;
                gsap.set(tickerTrack.current, { y: 0 });
                setRowStyles(0, true);
                interval = setInterval(tick, 2800);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            t1.kill();
            t2.kill();
            clearInterval(interval);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    return (
        <main className="relative min-h-screen bg-[#07001F] flex flex-col">

            {/* ── 1. HERO ──────────────────────────────────────── */}
            <div
                className="pointer-events-none absolute z-0"
                style={{
                    top: "calc(100vh - 260px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "140vw",
                    height: "520px",
                    background: [
                        "radial-gradient(ellipse 30% 60% at 35% 80%, rgba(61,253,152,0.18) 0%, transparent 70%)",
                        "radial-gradient(ellipse 30% 60% at 65% 80%, rgba(160,133,254,0.22) 0%, transparent 70%)",
                    ].join(", "),
                }}
            />

            <div className="pointer-events-none absolute inset-0 z-0">
                <div style={{
                    position: "absolute",
                    top: "100px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "160vw",
                    height: "160vw",
                }}>
                    <img
                        ref={outerRef}
                        src="/circular-hero-out.svg"
                        alt=""
                        aria-hidden="true"
                        style={{ display: "block", width: "100%", height: "100%" }}
                    />
                </div>
                <div style={{
                    position: "absolute",
                    top: "calc(100px + 16vw)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "128vw",
                    height: "128vw",
                }}>
                    <img
                        ref={innerRef}
                        src="/688ce43e4092c9990ed4a821_hero-circular-in.svg"
                        alt=""
                        aria-hidden="true"
                        style={{ display: "block", width: "100%", height: "100%" }}
                    />
                </div>
            </div>

            <section
                data-hero
                className="relative z-10 flex flex-1 flex-col items-center justify-start text-center px-6"
                style={{ paddingTop: 'clamp(120px, calc(50px + 9.5vw - 30px), 155px)' }}
            >
                <HeroFloatingCards />

                <h1
                    className="mb-7 max-w-3xl text-balance text-[1.9rem] font-semibold leading-[1.06] tracking-[-0.02em] text-white sm:text-[2.25rem] md:text-[2.7rem] lg:text-[3rem]"
                    style={{ fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif" }}
                >
                    Your Business Deserves Intelligence,
                    <br />Not Just Software.
                </h1>


                {/* Services ticker */}
                <div className="delay-150 mb-10 flex flex-col items-center gap-2">
                    <p className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.18em]">What we build</p>
                    <div style={{ overflow: "hidden", height: `${ITEM_H * 3}px` }}>
                        <div ref={tickerTrack}>
                            {TICKER_ITEMS.map((service, i) => (
                                <div key={i} style={{
                                    height: `${ITEM_H}px`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    opacity: i === 1 ? 1 : (i === 0 || i === 2) ? 0.25 : 0,
                                }}>
                                    <span style={{
                                        fontSize: "clamp(18px, 2.2vw, 26px)",
                                        fontWeight: 700,
                                        background: "linear-gradient(90deg, #9B2FFF, #72C8F5)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        backgroundClip: "text",
                                        whiteSpace: "nowrap",
                                        letterSpacing: "-0.01em",
                                    }}>
                                        {service}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col items-center gap-3 sm:flex-row">
                    <a href="/contact">
                        <NeonButton variant="solid" size="lg" className="font-semibold tracking-wide">
                            Book a Free Strategy Call
                        </NeonButton>
                    </a>
                    <a href="#services">
                        <NeonButton variant="ghost" size="lg" className="font-semibold tracking-wide">
                            Explore Our Services
                        </NeonButton>
                    </a>
                </div>
            </section>

            {/* ── 2. CLIENTS MARQUEE (LOCKED) ─────────────────── */}
            <div className="relative z-10 mt-auto pb-10 pt-16 md:pt-24">
                <div className="mx-auto mb-0 h-px w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <ClientsMarquee />
            </div>

            {/* ── 3. THE PROBLEM ───────────────────────────────── */}
            <section id="problem" className="relative w-full px-6 pt-20 pb-0 md:pt-40 md:pb-0">
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
                        className="mb-14 flex flex-col items-center text-center gap-5"
                    >
                        <SectionLabel text="The problem" />
                        <h2 className="max-w-3xl text-3xl font-extrabold tracking-tight text-white md:text-4xl leading-[1.1]">
                            Most businesses are running on duct tape and spreadsheets.
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {PAIN_POINTS.map((pp, i) => (
                            <motion.div
                                key={pp.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                                className="group rounded-2xl p-px"
                                style={{
                                    background: `linear-gradient(160deg, ${pp.accent}33 0%, rgba(255,255,255,0.05) 60%)`,
                                }}
                            >
                                <div
                                    className="h-full rounded-[15px] p-7"
                                    style={{ background: "rgba(8,1,28,0.98)", border: "1px solid rgba(255,255,255,0.04)" }}
                                >
                                    <div
                                        className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl"
                                        style={{ background: `${pp.accent}1A`, border: `1px solid ${pp.accent}55` }}
                                    >
                                        <span
                                            className="h-2 w-2 rounded-full"
                                            style={{ background: pp.accent, boxShadow: `0 0 12px ${pp.accent}` }}
                                        />
                                    </div>
                                    <h3 className="mb-3 text-lg font-bold leading-snug text-white md:text-xl">
                                        {pp.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-white/50">{pp.body}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 4. OUR SOLUTION ──────────────────────────────── */}
            <section className="relative w-full px-6 py-28 md:py-70">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background:
                        "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(155,47,255,0.09) 0%, transparent 65%)",
                }} />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center gap-6"
                >
                    <SectionLabel text="Our solution" />
                    <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl leading-[1.1]">
                        We don&apos;t sell services. We build intelligence infrastructure.
                    </h2>
                    <p className="max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
                        Levata designs and operates integrated AI systems built specifically for your business model
                        and growth trajectory. Strategy, technology, automation, and digital experience — all
                        coordinated under one team, one vision, and one accountability structure.
                    </p>
                </motion.div>
            </section>

            {/* ── 5. FEATURED PRODUCT — Sales Intelligence Platform ── */}
            <section className="relative w-full px-6 pt-24 pb-16 md:pt-5 md:pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 mx-auto mb-12 flex max-w-3xl flex-col items-center text-center gap-5"
                >
                    <SectionLabel text="Featured product" />
                    <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl leading-[1.12]">
                        Introducing: The AI Sales Workspace<br />Built for B2B Teams.
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

                                {/* Dashboard mockup (preserved from previous arc-end block) */}
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

            {/* ── 6. SERVICE CATEGORIES ────────────────────────── */}
            <section id="services" className="relative w-full py-20 md:py-28 overflow-hidden">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: "radial-gradient(ellipse 60% 70% at 50% 40%, rgba(114,200,245,0.05) 0%, transparent 70%)",
                }} />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 mb-14 flex flex-col items-center text-center gap-5 px-6"
                >
                    <SectionLabel text="Services" />
                    <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-white md:text-4xl leading-[1.08]">
                        Six capabilities. One unified system.
                    </h2>
                </motion.div>

                <div className="relative z-10">
                    <ServiceCardsTrack />
                </div>
            </section>

            {/* ── 7. KEY RESULTS ───────────────────────────────── */}
            <section className="relative w-full px-6 py-20 md:py-24">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background:
                        "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(155,47,255,0.08) 0%, transparent 65%)",
                }} />
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-14 flex flex-col items-center text-center gap-5"
                    >
                        <SectionLabel text="By the numbers" />
                        <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-white md:text-4xl leading-[1.1]">
                            The outcomes speak for themselves.
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-14 md:grid-cols-4 md:gap-x-12 text-center">
                        {KEY_RESULTS.map((r) => (
                            <StatCounter key={r.label} {...r} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 8. OUR PROCESS ───────────────────────────────── */}
            <section className="relative w-full py-20 md:py-28">
                <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
                    <div className="grid grid-cols-1 gap-16 md:grid-cols-[0.65fr_1fr] md:gap-20 items-start">

                        {/* LEFT — sticky on desktop */}
                        <div className="md:sticky md:top-[30%] flex flex-col gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-80px" }}
                                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                className="flex flex-col gap-5"
                            >
                                <SectionLabel text="How we work" />
                                <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl leading-[1.1]">
                                    From strategy to compounding success.
                                </h2>
                                <p className="text-base leading-relaxed text-white/40 md:text-lg">
                                    A repeatable system that turns strategic clarity into measurable outcomes — fast.
                                </p>
                            </motion.div>
                        </div>

                        {/* RIGHT — stacking cards */}
                        <div className="flex flex-col gap-8">
                            {PROCESS_STEPS.map((step, i) => (
                                <div
                                    key={step.num}
                                    className="md:sticky"
                                    style={{
                                        top: `${30 + i * 2}%`,
                                        // gradient border: 1px padding wrapping a solid-bg inner card
                                        background: "linear-gradient(315deg, #9B2FFF44, #3a3550)",
                                        borderRadius: 18,
                                        padding: 1,
                                        boxShadow: "rgba(6,0,28,0.85) 0px -60px 80px",
                                        zIndex: i + 1,
                                    }}
                                >
                                    {/* inner card */}
                                    <div
                                        className="flex flex-col gap-5 rounded-[17px] p-8"
                                        style={{ background: "#07001F" }}
                                    >
                                        {/* number */}
                                        <div
                                            className="text-[2.5rem] font-black leading-none"
                                            style={{
                                                color: step.accent,
                                                textShadow: `${step.accent}B3 0px 0px 10px`,
                                            }}
                                        >
                                            {step.num}.
                                        </div>

                                        {/* title */}
                                        <h3 className="text-xl font-bold text-white md:text-2xl">
                                            {step.title}
                                        </h3>

                                        {/* bullets */}
                                        <ul className="flex flex-col gap-3">
                                            {step.bullets.map((b) => (
                                                <li key={b} className="flex items-start gap-3 text-sm leading-relaxed text-white/60 md:text-base">
                                                    <span
                                                        className="mt-[6px] h-2 w-2 shrink-0 rounded-full"
                                                        style={{
                                                            background: step.accent,
                                                            boxShadow: `${step.accent}80 0px 0px 6px`,
                                                        }}
                                                    />
                                                    {b}
                                                </li>
                                            ))}
                                        </ul>

                                        {/* result */}
                                        <p className="text-sm leading-relaxed text-white/40 md:text-base">
                                            <span className="font-semibold text-white/70">Result: </span>
                                            {step.result}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </section>

            {/* ── 9. WHY CHOOSE LEVATA ─────────────────────────── */}
            <section className="relative w-full px-6 py-20 md:py-24">
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
                        className="mb-14 flex flex-col items-center text-center gap-5"
                    >
                        <SectionLabel text="Why Levata" />
                        <h2 className="max-w-3xl text-3xl font-extrabold tracking-tight text-white md:text-4xl leading-[1.1]">
                            AI-native. End-to-end. Always-on.
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {WHY_LEVATA.map((w, i) => (
                            <motion.div
                                key={w.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                                className="rounded-2xl p-7"
                                style={{
                                    background: "rgba(255,255,255,0.02)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                }}
                            >
                                <h3 className="mb-3 text-lg font-bold leading-snug text-white md:text-xl">
                                    {w.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-white/50">{w.body}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 10. TECH STACK (LOCKED) ──────────────────────── */}
            <TechStackSection />

            {/* ── 11. TESTIMONIALS ─────────────────────────────── */}
            <TestimonialsSection />

            {/* ── 12. FINAL CTA ────────────────────────────────── */}
            <section className="relative w-full px-6 py-24 md:py-32 overflow-hidden">
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{
                    background: [
                        "radial-gradient(ellipse 60% 70% at 50% 100%, rgba(155,47,255,0.18) 0%, transparent 65%)",
                        "radial-gradient(ellipse 40% 50% at 20% 0%, rgba(114,200,245,0.1) 0%, transparent 60%)",
                        "radial-gradient(ellipse 40% 50% at 80% 0%, rgba(155,47,255,0.08) 0%, transparent 60%)",
                    ].join(", "),
                }} />
                <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-32"
                    style={{ background: "linear-gradient(to right, transparent, rgba(155,47,255,0.5), transparent)" }} />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center gap-8"
                >
                    <SectionLabel text="Last call" />
                    <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-[2.8rem] leading-[1.08]">
                        Your competitors are building intelligence systems right now.
                    </h2>
                    <p className="max-w-xl text-base leading-relaxed text-white/55 md:text-lg">
                        The question is whether you&apos;ll be leading — or catching up.
                    </p>
                    <div className="flex flex-col items-center gap-3 sm:flex-row">
                        <a href="/contact">
                            <NeonButton variant="solid" size="lg" className="font-semibold tracking-wide">
                                Book Your Free AI Strategy Call
                            </NeonButton>
                        </a>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}
