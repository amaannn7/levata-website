"use client";

// Home page: the three products, each with a live mini screen and links that
// go exactly where they say (our product page, the live app, or a booked call).

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionBeam from "@/app/components/SectionBeam";
import { useBookCall } from "@/app/components/BookCallProvider";
import { SalesWorkspaceMock } from "@/app/components/mockups/SalesMockup";
import { HelmMiniMock, SableMiniMock } from "@/app/components/mockups/HomeMockups";
import { CYAN, EASE, useEvery, useLive } from "@/app/components/mockups/kit";
import { HELM_START_URL } from "@/app/products/helm/helmData";
import { SABLE_SITE_URL } from "@/app/products/sable/sableData";

type Product = {
    key: string;
    name: string;
    for: string;
    title: string;
    body: string;
    points: string[];
    page: { label: string; href: string };
    second: { label: string; href?: string; external?: boolean; bookCall?: boolean };
    Mock: React.ComponentType;
};

const PRODUCTS: Product[] = [
    {
        key: "sales",
        name: "Sales Intelligence",
        for: "For B2B sales teams",
        title: "Pipeline that builds itself.",
        body: "Turn a raw lead list into a researched, prioritised and ready-to-work pipeline, in hours, not days.",
        points: [
            "AI prospect research: company, pain points, buying signals and hooks",
            "Lead scoring against your ideal customer profile",
            "Personalised emails, follow-ups and call scripts in seconds",
            "CRM sync, so qualified opportunities land in your pipeline",
        ],
        page: { label: "Explore the platform", href: "/products/sales-intelligence-platform" },
        second: { label: "Book a demo", bookCall: true },
        Mock: () => <SalesWorkspaceMock compact />,
    },
    {
        key: "helm",
        name: "Helm",
        for: "For leadership teams of 10 to 250",
        title: "Your leadership team, pulling the same way.",
        body: "One shared plan, a weekly scorecard, 90-day priorities and a Monday meeting that solves problems instead of reporting on them.",
        points: [
            "Weekly scorecard: every number with an owner and a goal",
            "90-day priorities with milestones the whole team can see",
            "A 90-minute Monday Pulse Meeting that turns issues into to-dos",
            "Free to start, no credit card",
        ],
        page: { label: "Explore Helm", href: "/products/helm" },
        second: { label: "Start free on helm.levatahq.com", href: HELM_START_URL, external: true },
        Mock: HelmMiniMock,
    },
    {
        key: "sable",
        name: "Sable",
        for: "For restaurants, cafés and hotels in Sri Lanka",
        title: "Every table, every till, every rupee. One system.",
        body: "Billing, the kitchen, guests, stock, staff and accounts in one record, built for the way Sri Lanka eats.",
        points: [
            "Keeps billing when the internet drops",
            "VAT and SSCL ready, with service charge in the right order",
            "Works in Sinhala, Tamil and English",
            "From Rs 15,000 a month per outlet",
        ],
        page: { label: "Explore Sable", href: "/products/sable" },
        second: { label: "Visit sable.levatahq.com", href: SABLE_SITE_URL, external: true },
        Mock: SableMiniMock,
    },
];

const AUTOPLAY_MS = 9000;

function Tick() {
    return (
        <svg viewBox="0 0 10 10" fill="none" className="mt-[3px] h-3 w-3 flex-shrink-0" aria-hidden>
            <path d="M2 5l2.5 2.5L8 3" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function ProductsShowcase() {
    const { open: openBookCall } = useBookCall();
    const { ref, live } = useLive<HTMLDivElement>();
    const [active, setActive] = useState(0);
    const [auto, setAuto] = useState(true);
    useEvery(live && auto, AUTOPLAY_MS, () => setActive((a) => (a + 1) % PRODUCTS.length));
    const p = PRODUCTS[active];

    return (
        <section className="home-theme-dark relative w-full overflow-hidden px-5 py-14 sm:px-6 md:py-20">
            <div aria-hidden className="pointer-events-none absolute inset-0" style={{
                background: "radial-gradient(ellipse 60% 50% at 50% 30%, color-mix(in srgb, var(--accent) 7%, transparent) 0%, transparent 65%)",
            }} />
            <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid-bg" />

            <div className="relative z-10 mx-auto max-w-[1120px]">
                <div data-reveal className="mx-auto mb-10 flex max-w-3xl flex-col items-center gap-3 text-center">
                    <SectionBeam />
                    <h2 className="display-section-title max-w-2xl text-center">
                        <span className="display-muted-line sm:whitespace-nowrap">Products we&apos;ve built,</span>
                        <span className="display-strong-line sm:whitespace-nowrap">ready to use today.</span>
                    </h2>
                    <p className="max-w-2xl text-lead text-white/45">
                        The same engineering we bring to client work, packaged as software you can start with now.
                    </p>
                </div>

                <div ref={ref} data-reveal>
                    {/* tabs */}
                    <div className="mx-auto mb-6 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full p-1" role="tablist"
                        style={{ background: "var(--home-control-bg)", border: "1px solid var(--home-control-border)", scrollbarWidth: "none" }}>
                        {PRODUCTS.map((x, i) => (
                            <button key={x.key} type="button" role="tab" aria-selected={active === i}
                                onClick={() => { setActive(i); setAuto(false); }}
                                className="relative flex-shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors"
                                style={{ color: active === i ? "var(--text-primary)" : "var(--text-muted)" }}>
                                {active === i && (
                                    <motion.span layoutId="products-tab" className="absolute inset-0 rounded-full"
                                        style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                                        transition={{ duration: 0.4, ease: EASE }} />
                                )}
                                <span className="relative">{x.name}</span>
                                {active === i && auto && live && (
                                    <motion.span key={`bar-${i}`} className="absolute inset-x-4 bottom-1 h-px origin-left" style={{ background: CYAN }}
                                        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }} />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="rounded-3xl p-px" style={{ background: "linear-gradient(120deg, color-mix(in srgb, var(--accent) 35%, transparent), rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.06) 60%, color-mix(in srgb, var(--accent-secondary) 28%, transparent))" }}>
                        <div className="grid overflow-hidden rounded-3xl lg:grid-cols-[0.9fr_1.1fr]" style={{ background: "var(--background)" }}>
                            {/* All three panels share one grid cell, so the box is always as tall as the
                                longest one and the page never jumps when the tab changes. */}
                            <div className="grid">
                                {PRODUCTS.map((x, i) => (
                                    <motion.div key={x.key} initial={false}
                                        animate={{ opacity: active === i ? 1 : 0, y: active === i ? 0 : 8 }}
                                        transition={{ duration: 0.4, ease: EASE }}
                                        aria-hidden={active !== i}
                                        className={`flex flex-col gap-5 p-6 [grid-area:1/1] sm:p-8 lg:p-12 ${active === i ? "" : "pointer-events-none invisible"}`}>
                                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">{x.for}</p>
                                        <h3 className="display-feature-title">{x.title}</h3>
                                        <p className="text-body-sm leading-relaxed text-white/55">{x.body}</p>
                                        <ul className="flex flex-col gap-2.5">
                                            {x.points.map((pt) => (
                                                <li key={pt} className="flex items-start gap-2.5 text-body-sm text-white/70"><Tick /><span className="leading-snug">{pt}</span></li>
                                            ))}
                                        </ul>
                                        <div className="mt-2 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                                            <a href={x.page.href} data-cta="primary" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white">
                                                {x.page.label} →
                                            </a>
                                            {x.second.bookCall ? (
                                                <button type="button" onClick={openBookCall} className="cursor-pointer text-sm font-medium text-white/50 transition-colors duration-200 hover:text-white/80">
                                                    {x.second.label} →
                                                </button>
                                            ) : (
                                                <a href={x.second.href} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white/50 transition-colors duration-200 hover:text-white/80">
                                                    {x.second.label} ↗
                                                </a>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="relative min-h-[420px] p-4 sm:p-6 lg:min-h-[520px] lg:p-8" style={{ borderLeft: "1px solid rgba(255,255,255,0.06)", background: "radial-gradient(ellipse 70% 60% at 70% 20%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 65%), radial-gradient(ellipse 60% 60% at 10% 100%, color-mix(in srgb, var(--accent-secondary) 7%, transparent), transparent 60%)" }}>
                                <AnimatePresence mode="wait">
                                    <motion.div key={p.key} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                        transition={{ duration: 0.45, ease: EASE }} className="absolute inset-4 sm:inset-6 lg:inset-8">
                                        <p.Mock />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
