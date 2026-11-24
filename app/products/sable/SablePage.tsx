"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useBookCall } from "@/app/components/BookCallProvider";
import CTAAurora from "@/app/components/CTAAurora";
import SectionLabel from "@/app/components/SectionLabel";
import SectionLabelSide from "@/app/components/SectionLabelSide";
import {
    AskSable,
    OfflinePanel,
    OneRecord,
    OwnerSummary,
    PermissionsPanel,
    PoyaTill,
} from "./SableInteractive";
import SableDashboard from "./SableDashboard";
import {
    EASE,
    EXTRAS,
    FAQS,
    LOCAL,
    MONO,
    PLANS,
    SABLE_BOOK_DEMO_URL,
    SABLE_DEMO_PIN_URL,
    SABLE_DEMO_URL,
    STATUS,
    STEPS,
    TRUST,
    tint,
    type ExtraIcon,
} from "./sableData";

const HeroHorizon = dynamic(() => import("@/app/components/HeroHorizon"), { ssr: false });

const SECTION = "relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28";
const CARD: React.CSSProperties = { background: "var(--home-card-bg)", border: "1px solid var(--home-card-border)" };

// ── Icons ─────────────────────────────────────────────────────────────────────
function ExtraGlyph({ kind }: { kind: ExtraIcon }) {
    const p = { stroke: "var(--accent-secondary)", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            {kind === "kitchen" && <><rect x="3" y="4" width="18" height="12" rx="2" {...p} /><path d="M8 20h8M12 16v4M7 8h6M7 12h4" {...p} /></>}
            {kind === "guests" && <><circle cx="9" cy="8" r="3.5" {...p} /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 4.5a3.5 3.5 0 010 7M18 14c1.8.8 3 2.6 3 4.7" {...p} /></>}
            {kind === "complaints" && <><path d="M4 5h16v11H9l-5 4V5z" {...p} /><path d="M12 8.5v3M12 14v.01" {...p} /></>}
            {kind === "offers" && <><path d="M3 12V4h8l10 10-8 8L3 12z" {...p} /><circle cx="7.5" cy="8.5" r="1.5" {...p} /></>}
            {kind === "hotel" && <><path d="M3 20V9l9-5 9 5v11M3 20h18" {...p} /><path d="M9 20v-5h6v5M8 11h.01M12 11h.01M16 11h.01" {...p} /></>}
            {kind === "whatsapp" && <><path d="M4 20l1.3-3.9A8 8 0 1112 20a8 8 0 01-4.1-1.1L4 20z" {...p} /><path d="M9 10.5c.5 1.5 1.8 2.8 3.5 3.5" {...p} /></>}
        </svg>
    );
}

function Tick() {
    return (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden className="mt-[5px] flex-shrink-0">
            <path d="M2 5.2l2 2L8 3" stroke="var(--accent-secondary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQItem({ q, a, index, isOpen, onToggle }: { q: string; a: string; index: number; isOpen: boolean; onToggle: () => void }) {
    return (
        <div
            data-reveal
            data-reveal-delay={index * 50}
            className="overflow-hidden rounded-2xl"
            style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${isOpen ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)"}`, transition: "border-color 300ms ease" }}
        >
            <button type="button" onClick={onToggle} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-200 hover:bg-white/[0.02]">
                <span className="display-card-title">{q}</span>
                <span aria-hidden className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-transform duration-300"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.18)", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1v10M1 6h10" stroke="rgba(255,255,255,0.75)" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                </span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} className="overflow-hidden">
                        <p className="px-6 pb-6 text-lead text-white/55">{a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function CTAButtons({ center = true }: { center?: boolean }) {
    return (
        <div className={`flex flex-col items-center gap-4 sm:flex-row ${center ? "justify-center" : "sm:justify-start"}`}>
            <a href={SABLE_BOOK_DEMO_URL} data-cta="primary"
                className="relative inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white">
                Book a demo →
            </a>
            <a href={SABLE_DEMO_URL} target="_blank" rel="noopener noreferrer"
                className="text-sm font-medium text-white/50 transition-colors duration-200 hover:text-white/80">
                Try the live demo →
            </a>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SablePage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const { open: openBookCall } = useBookCall();

    return (
        <main className="home-theme-dark relative min-h-screen overflow-hidden page-dividers">

            {/* ── 1. HERO ─────────────────────────────────── */}
            <section data-hero className="relative flex flex-col items-center overflow-hidden px-5 pb-16 pt-32 text-center sm:px-6 md:pb-20 md:pt-[160px]">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6"
                >
                    <h1 className="display-hero-title max-w-3xl text-center">
                        <span className="display-muted-line sm:whitespace-nowrap">Every table, every till,</span>
                        <span className="display-strong-line sm:whitespace-nowrap">every rupee. One system.</span>
                    </h1>
                    <p className="max-w-2xl text-lead text-white/55">
                        Sable runs billing, the kitchen, guests, stock, staff and accounts for restaurants, cafés and hotels in Sri Lanka, as one system. It handles VAT and SSCL,
                        works in Sinhala, Tamil and English, and keeps billing when the internet drops.
                    </p>
                    <div className="mt-2"><CTAButtons /></div>
                    <ul className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                        {TRUST.map((t) => (
                            <li key={t} className="flex items-center gap-1.5 text-caption text-white/45">
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden><path d="M2 5.2l2 2L8 3" stroke="var(--accent-secondary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                {t}
                            </li>
                        ))}
                    </ul>
                </motion.div>
                <HeroHorizon intensity="strong" />
            </section>

            {/* ── 2. LIVE DEMO ─────────────────────────────── */}
            <section id="features" className="relative w-full scroll-mt-20 px-4 pb-14 pt-10 sm:px-6 sm:pb-20 md:pb-28">
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0 dot-grid-bg" />
                <div className="relative z-10">
                    <div data-reveal className="mb-8 flex flex-col items-center gap-3 text-center md:mb-10">
                        <SectionLabel />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line sm:whitespace-nowrap">Every part of service,</span>
                            <span className="display-strong-line sm:whitespace-nowrap">accounted for.</span>
                        </h2>
                        <p className="max-w-xl text-body-sm text-white/50">
                            A working demo of Sable. Ring up a bill, bump a kitchen ticket, clear the morning list or watch the café screen.
                        </p>
                    </div>
                    <SableDashboard />
                </div>
            </section>

            {/* ── 3. ONE RECORD ───────────────────────────── */}
            <section className={SECTION}>
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{ background: `radial-gradient(ellipse 55% 60% at 50% 40%, ${tint("var(--accent-secondary)", 4)} 0%, transparent 70%)` }} />
                <div className="relative z-10 mx-auto max-w-[1120px]">
                    <div data-reveal className="mb-10 flex flex-col items-center gap-3 text-center md:mb-12">
                        <SectionLabel />
                        <h2 className="display-section-title max-w-3xl text-center">
                            <span className="display-muted-line sm:whitespace-nowrap">Tills, kitchen and books,</span>
                            <span className="display-strong-line sm:whitespace-nowrap">one record of everything.</span>
                        </h2>
                        <p className="max-w-xl text-lead text-white/50">
                            The till, the kitchen screens and the back office share one set of books, so a sale updates stock, food
                            cost and VAT at the same moment. Close the bill below to see it.
                        </p>
                    </div>
                    <OneRecord />
                </div>
            </section>

            {/* ── 5. EVERYTHING ELSE + ASK SABLE ──────────── */}
            <section className={SECTION}>
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{ background: `radial-gradient(ellipse 50% 50% at 20% 30%, ${tint("var(--accent-secondary)", 4)} 0%, transparent 70%)` }} />
                <div className="relative z-10 mx-auto max-w-[1120px]">
                    <div data-reveal className="mb-10 flex flex-col items-center gap-3 text-center md:mb-12">
                        <SectionLabel />
                        <h2 className="display-section-title max-w-3xl text-center">
                            <span className="display-muted-line sm:whitespace-nowrap">And the rest of service,</span>
                            <span className="display-strong-line sm:whitespace-nowrap">already handled.</span>
                        </h2>
                    </div>

                    <div data-reveal className="relative mb-3 grid grid-cols-1 items-center gap-8 overflow-hidden rounded-2xl p-6 md:grid-cols-2 md:gap-12 md:p-9" style={CARD}>
                        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${tint("var(--accent)", 35)}, transparent)` }} />
                        <div>
                            <p className="text-eyebrow text-white/40">Ask Sable</p>
                            <h3 className="mt-2 display-feature-title">Ask, and consider it done.</h3>
                            <p className="mt-3 max-w-md text-body-sm text-white/55">
                                Ask about sales and busy times and get answers from your own data. Make changes by typing what you
                                want. Nothing changes until you confirm, and every change is logged with who made it.
                            </p>
                        </div>
                        <AskSable />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {EXTRAS.map((m, i) => (
                            <div
                                data-reveal
                                data-reveal-delay={(i % 3) * 60}
                                key={m.title}
                                className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl p-6 transition-colors duration-300 hover:border-white/20 md:p-7"
                                style={CARD}
                            >
                                <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
                                    style={{ background: `radial-gradient(circle, ${tint("var(--accent-secondary)", 12)} 0%, transparent 70%)` }} />
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                    <ExtraGlyph kind={m.icon} />
                                </span>
                                <h3 className="text-body font-medium text-white">{m.title}</h3>
                                <p className="text-caption text-white/50">{m.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 6. BUILT FOR SRI LANKA ──────────────────── */}
            <section id="sri-lanka" className={`${SECTION} scroll-mt-20`}>
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{ background: `radial-gradient(ellipse 50% 55% at 80% 50%, ${tint(STATUS.warn, 4)} 0%, transparent 65%)` }} />
                <div className="relative z-10 mx-auto max-w-[1120px]">
                    <div data-reveal className="mb-10 flex flex-col items-center gap-3 text-center md:mb-12">
                        <SectionLabel />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line sm:whitespace-nowrap">Made for the way</span>
                            <span className="display-strong-line sm:whitespace-nowrap">Sri Lanka eats.</span>
                        </h2>
                        <p className="max-w-xl text-lead text-white/50">Local tax, payments, delivery apps, payroll and languages, built in rather than bolted on.</p>
                    </div>
                    <div className="grid grid-cols-1 items-stretch gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {LOCAL.map((l, i) => (
                                <div data-reveal data-reveal-delay={(i % 2) * 60} key={l.title} className="rounded-2xl p-5 md:p-6" style={CARD}>
                                    <p className="flex items-start gap-2 text-body font-medium text-white"><Tick />{l.title}</p>
                                    <p className="mt-1.5 pl-[18px] text-caption text-white/50">{l.body}</p>
                                </div>
                            ))}
                        </div>
                        <div data-reveal data-reveal-delay={120}><PoyaTill /></div>
                    </div>
                </div>
            </section>

            {/* ── 7. OFFLINE ──────────────────────────────── */}
            <section className={SECTION}>
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0 dot-grid-bg" />
                <div className="relative z-10 mx-auto grid max-w-[1120px] grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
                    <div data-reveal className="flex flex-col gap-5">
                        <SectionLabelSide />
                        <h2 className="display-section-title">
                            <span className="display-muted-line">When the internet drops,</span>
                            <span className="display-strong-line">service doesn&apos;t.</span>
                        </h2>
                        <p className="max-w-md text-lead text-white/50">
                            Tills keep billing and printing, and orders reach the kitchen over the restaurant&apos;s own Wi-Fi. When the
                            connection comes back, everything syncs in invoice order.
                        </p>
                        <p className="max-w-md text-caption text-white/40">Pull the plug on the panel to try it.</p>
                    </div>
                    <div data-reveal data-reveal-delay={100}><OfflinePanel /></div>
                </div>
            </section>

            {/* ── 8. OWNERS + PERMISSIONS ─────────────────── */}
            <section className={SECTION}>
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{ background: `radial-gradient(ellipse 50% 50% at 25% 50%, ${tint("var(--accent-secondary)", 4)} 0%, transparent 70%), radial-gradient(ellipse 40% 50% at 80% 60%, ${tint("var(--accent)", 5)} 0%, transparent 70%)` }} />
                <div className="relative z-10 mx-auto max-w-[1120px]">
                    <div data-reveal className="mb-10 flex flex-col items-center gap-3 text-center md:mb-12">
                        <SectionLabel />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line sm:whitespace-nowrap">Owners stay in control</span>
                            <span className="display-strong-line sm:whitespace-nowrap">without being there.</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div data-reveal className="flex flex-col gap-4">
                            <div className="px-1">
                                <h3 className="display-card-title">Yesterday, summed up by 7 am.</h3>
                                <p className="mt-1.5 text-body-sm text-white/50">Sales against forecast, food cost, cash differences and anything waiting on you, on WhatsApp. Approve voids or supplier orders from wherever you are.</p>
                            </div>
                            <div className="flex-1"><OwnerSummary /></div>
                        </div>
                        <div data-reveal data-reveal-delay={100} className="flex flex-col gap-4">
                            <div className="px-1">
                                <h3 className="display-card-title">Everyone sees exactly what they should.</h3>
                                <p className="mt-1.5 text-body-sm text-white/50">A cashier sees the menu and the bill, not your margins or the payroll. Switch roles to compare.</p>
                            </div>
                            <div className="flex-1"><PermissionsPanel /></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 9. PRICING + GETTING STARTED ────────────── */}
            <section id="pricing" className={`${SECTION} scroll-mt-20`}>
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0 dot-grid-bg" />
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{ background: `radial-gradient(ellipse 50% 45% at 50% 45%, ${tint("var(--accent)", 6)} 0%, transparent 70%)` }} />
                <div className="relative z-10 mx-auto max-w-[1120px]">
                    <div data-reveal className="mb-10 flex flex-col items-center gap-3 text-center md:mb-12">
                        <SectionLabel />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line sm:whitespace-nowrap">Simple pricing,</span>
                            <span className="display-strong-line sm:whitespace-nowrap">per outlet.</span>
                        </h2>
                        <p className="max-w-xl text-lead text-white/50">No setup fee, no charge per till or per user. Billed monthly, cancel any time.</p>
                    </div>

                    <div className="grid grid-cols-1 items-stretch gap-3 lg:grid-cols-3">
                        {PLANS.map((p, i) => (
                            <div
                                data-reveal
                                data-reveal-delay={i * 80}
                                key={p.name}
                                className="relative flex flex-col overflow-hidden rounded-2xl p-7 md:p-8"
                                style={{
                                    ...CARD,
                                    border: p.featured ? "1px solid rgba(255,255,255,0.18)" : CARD.border,
                                    boxShadow: p.featured ? `0 24px 70px rgba(0,0,0,0.4), 0 0 60px ${tint("var(--accent)", 8)}` : undefined,
                                }}
                            >
                                {p.featured && <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[2px]" style={{ background: "var(--accent-gradient)" }} />}
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="display-card-title">{p.name}</h3>
                                    {p.featured && <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.14)" }}>Most popular</span>}
                                </div>
                                <p className="mt-1 text-caption text-white/45">{p.for}</p>
                                <p className="mt-6 flex items-baseline gap-2">
                                    <span className="text-4xl font-thin tabular-nums text-white">{p.price}</span>
                                </p>
                                <p className="text-caption text-white/45">{p.per}</p>

                                <div className="my-6 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />

                                {p.intro && <p className="mb-3 text-caption text-white/70">{p.intro}</p>}
                                <ul className="flex flex-1 flex-col gap-2.5">
                                    {p.items.map((it) => (
                                        <li key={it} className="flex items-start gap-2.5 text-caption text-white/60"><Tick />{it}</li>
                                    ))}
                                </ul>

                                <a
                                    href={p.href}
                                    {...(p.featured ? { "data-cta": "primary" } : {})}
                                    className={`relative mt-8 inline-flex cursor-pointer items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white ${p.featured ? "" : "transition-colors duration-200 hover:bg-white/[0.08]"}`}
                                    style={p.featured ? undefined : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.14)" }}
                                >
                                    {p.cta} →
                                </a>
                            </div>
                        ))}
                    </div>
                    <p className="mt-5 text-center text-caption text-white/40">Prices exclude VAT.</p>

                    <div className="mt-16 md:mt-20">
                        <p className="mb-8 text-center text-eyebrow text-white/40">Up and running in a few days</p>
                        <div className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6">
                            <div aria-hidden className="pointer-events-none absolute left-[16%] right-[16%] top-7 hidden h-px md:block" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.18) 10%, rgba(255,255,255,0.18) 90%, transparent)" }} />
                            {STEPS.map((s, i) => (
                                <div data-reveal data-reveal-delay={i * 100} key={s.num} className="flex flex-col items-center text-center">
                                    <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full"
                                        style={{ background: "var(--surface-elevated)", border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 0 0 4px var(--background), 0 0 20px rgba(255,255,255,0.12)" }}>
                                        <span className="text-lg font-thin text-white" style={{ fontFamily: MONO }}>{s.num}</span>
                                    </div>
                                    <h3 className="mt-4 display-card-title">{s.title}</h3>
                                    <p className="mt-2 max-w-[280px] text-caption text-white/55">{s.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 10. FAQ ─────────────────────────────────── */}
            <section id="faq" className={`${SECTION} scroll-mt-20`}>
                <div className="relative z-10 mx-auto max-w-3xl">
                    <div data-reveal className="mb-10 flex flex-col items-center gap-3 text-center">
                        <SectionLabel />
                        <h2 className="display-section-title display-inline max-w-2xl text-center">
                            <span className="display-muted-line">Frequently asked </span><span className="display-strong-line">questions.</span>
                        </h2>
                    </div>
                    <div className="flex flex-col gap-3">
                        {FAQS.map((f, i) => (
                            <FAQItem key={f.q} q={f.q} a={f.a} index={i} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 11. FINAL CTA ───────────────────────────── */}
            <section className={SECTION}>
                <CTAAurora variant={2} />
                <div data-reveal className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
                    <h2 className="display-section-title max-w-2xl text-center">
                        <span className="display-muted-line sm:whitespace-nowrap">See Sable run</span>
                        <span className="display-strong-line sm:whitespace-nowrap">your own menu.</span>
                    </h2>
                    <p className="max-w-xl text-lead text-white/55">
                        Thirty minutes to set up your dishes and walk through a full day, from the first bill to the last report.
                    </p>
                    <CTAButtons />
                    <p className="text-caption text-white/40">
                        The live demo needs a PIN.{" "}
                        <a href={SABLE_DEMO_PIN_URL} className="text-white/60 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white/85">Ask us for one</a>.
                    </p>
                    <button type="button" onClick={openBookCall} className="cursor-pointer text-caption text-white/40 transition-colors duration-200 hover:text-white/70">
                        Want help connecting Sable to your other systems? Book a call with Levata
                    </button>
                </div>
            </section>
        </main>
    );
}
