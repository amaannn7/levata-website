"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useBookCall } from "@/app/components/BookCallProvider";

const EASE = [0.16, 1, 0.3, 1] as const;

const SERVICES = [
    {
        label: "AI & Intelligence",
        description: "AI integration, assistants, intelligent automation",
        href: "/products/ai-intelligence",
        accent: "#9B2FFF",
    },
    {
        label: "Digital Products",
        description: "Validated MVPs and scalable platforms",
        href: "/products/digital-products",
        accent: "#BB00FF",
    },
    {
        label: "Digital Services",
        description: "Websites, platforms, e-commerce, custom systems",
        href: "/products/digital-services",
        accent: "#3DFD98",
    },
    {
        label: "Automation & Systems",
        description: "Workflow automation, decision systems, dashboards",
        href: "/products/automation-systems",
        accent: "#72C8F5",
    },
];

const PRODUCTS = [
    {
        label: "Sales Intelligence Platform",
        description: "AI-powered B2B prospecting & outreach workspace",
        href: "/products/sales-intelligence-platform",
        accent: "#72C8F5",
        meta: "Featured",
    },
];

const TOP_LINKS = [
    { label: "About", href: "/about" },
];

const DROPDOWN_STYLE: React.CSSProperties = {
    background: "rgba(7,0,31,0.95)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 24px 56px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.02)",
};

function ChevronIcon({ open }: { open: boolean }) {
    return (
        <svg
            width="10"
            height="10"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden
            style={{
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 300ms ease",
                opacity: 0.6,
                flexShrink: 0,
            }}
        >
            <path d="M2 4.5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ArrowRight({ color, opacity = 0 }: { color: string; opacity?: number }) {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            className="flex-shrink-0 transition-all duration-200 group-hover/item:opacity-100 group-hover/item:translate-x-0.5"
            style={{ color, opacity }}
        >
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

type Section = "services" | "products" | null;

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [dropdown, setDropdown] = useState<Section>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileSection, setMobileSection] = useState<Section>("services");
    const dropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { open: openBookCall } = useBookCall();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Lock body scroll while mobile menu is open
    useEffect(() => {
        if (!mobileOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [mobileOpen]);

    const openDropdown = (s: Section) => {
        if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
        setDropdown(s);
    };
    const closeDropdown = () => {
        dropdownTimer.current = setTimeout(() => setDropdown(null), 120);
    };

    const triggerBookCall = () => {
        setMobileOpen(false);
        openBookCall();
    };

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
            style={{
                background: scrolled || mobileOpen ? "rgba(7,0,31,0.95)" : "transparent",
                backdropFilter: scrolled || mobileOpen ? "blur(16px)" : "none",
                borderBottom: scrolled || mobileOpen ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
            }}
        >
            <nav className="mx-auto flex items-center justify-between max-w-7xl px-5 py-3.5 sm:px-8 md:px-10 md:py-5">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 md:gap-3" onClick={() => setMobileOpen(false)}>
                    <div className="overflow-hidden rounded-lg flex-shrink-0 md:rounded-xl" style={{ width: 36, height: 36 }}>
                        <img
                            src="/levatalogo.png"
                            alt="Levata logo"
                            style={{ height: 36, width: "auto", maxWidth: "none", display: "block" }}
                        />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-white md:text-xl">Levata</span>
                </Link>

                {/* Center links — desktop */}
                <div className="hidden md:flex items-center gap-8">

                    {/* Services dropdown trigger */}
                    <div className="relative" onMouseEnter={() => openDropdown("services")} onMouseLeave={closeDropdown}>
                        <button
                            type="button"
                            aria-expanded={dropdown === "services"}
                            aria-haspopup="true"
                            className="group relative flex items-center gap-1.5 text-sm font-medium text-white transition-opacity duration-300 hover:opacity-80"
                        >
                            <span>Services</span>
                            <ChevronIcon open={dropdown === "services"} />
                            <span
                                aria-hidden
                                className="pointer-events-none absolute -bottom-1.5 left-0 h-px w-0 bg-white/80 transition-all duration-500 group-hover:w-[calc(100%-14px)]"
                            />
                        </button>
                        <AnimatePresence>
                            {dropdown === "services" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 6 }}
                                    transition={{ duration: 0.18, ease: EASE }}
                                    className="absolute left-1/2 top-full -translate-x-1/2 pt-4"
                                >
                                    <div className="w-[520px] overflow-hidden rounded-2xl" style={DROPDOWN_STYLE}>
                                        <div className="grid grid-cols-2 gap-1 p-2">
                                            {SERVICES.map((s) => (
                                                <Link
                                                    key={s.label}
                                                    href={s.href}
                                                    onClick={() => setDropdown(null)}
                                                    className="group/item flex items-start gap-3 rounded-xl px-3.5 py-3 transition-colors duration-200 hover:bg-white/[0.04]"
                                                >
                                                    <span
                                                        className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                                                        style={{ background: s.accent, boxShadow: `0 0 8px ${s.accent}99` }}
                                                    />
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-sm font-semibold text-white/85 transition-colors duration-200 group-hover/item:text-white">
                                                            {s.label}
                                                        </span>
                                                        <span className="text-[11px] leading-snug text-white/40">
                                                            {s.description}
                                                        </span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-3">
                                            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                                                4 service practices
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => { setDropdown(null); openBookCall(); }}
                                                className="inline-flex items-center gap-1 text-[12px] font-semibold text-white/80 transition-colors hover:text-white"
                                            >
                                                Book a strategy call <span aria-hidden>→</span>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Products dropdown trigger */}
                    <div className="relative" onMouseEnter={() => openDropdown("products")} onMouseLeave={closeDropdown}>
                        <button
                            type="button"
                            aria-expanded={dropdown === "products"}
                            aria-haspopup="true"
                            className="group relative flex items-center gap-1.5 text-sm font-medium text-white transition-opacity duration-300 hover:opacity-80"
                        >
                            <span>Products</span>
                            <ChevronIcon open={dropdown === "products"} />
                            <span
                                aria-hidden
                                className="pointer-events-none absolute -bottom-1.5 left-0 h-px w-0 bg-white/80 transition-all duration-500 group-hover:w-[calc(100%-14px)]"
                            />
                        </button>
                        <AnimatePresence>
                            {dropdown === "products" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 6 }}
                                    transition={{ duration: 0.18, ease: EASE }}
                                    className="absolute left-1/2 top-full -translate-x-1/2 pt-4"
                                >
                                    <div className="w-[340px] overflow-hidden rounded-2xl" style={DROPDOWN_STYLE}>
                                        <div className="flex flex-col gap-1 p-2">
                                            {PRODUCTS.map((p) => (
                                                <Link
                                                    key={p.label}
                                                    href={p.href}
                                                    onClick={() => setDropdown(null)}
                                                    className="group/item flex items-start gap-3 rounded-xl px-3.5 py-3 transition-colors duration-200 hover:bg-white/[0.04]"
                                                >
                                                    <span
                                                        className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                                                        style={{ background: p.accent, boxShadow: `0 0 8px ${p.accent}99` }}
                                                    />
                                                    <div className="flex flex-1 flex-col gap-0.5">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-semibold text-white/85 transition-colors duration-200 group-hover/item:text-white">
                                                                {p.label}
                                                            </span>
                                                            <span
                                                                className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                                                                style={{ background: `${p.accent}18`, border: `1px solid ${p.accent}55`, color: p.accent }}
                                                            >
                                                                {p.meta}
                                                            </span>
                                                        </div>
                                                        <span className="text-[11px] leading-snug text-white/40">
                                                            {p.description}
                                                        </span>
                                                    </div>
                                                    <ArrowRight color={p.accent} opacity={0.4} />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Plain top-level links */}
                    {TOP_LINKS.map((l) => (
                        <Link
                            key={l.label}
                            href={l.href}
                            className="group relative text-sm font-medium text-white transition-opacity duration-300 hover:opacity-80"
                        >
                            <span>{l.label}</span>
                            <span
                                aria-hidden
                                className="pointer-events-none absolute -bottom-1.5 left-0 h-px w-0 bg-white/80 transition-all duration-500 group-hover:w-full"
                            />
                        </Link>
                    ))}
                </div>

                {/* Right — Contact (desktop) + Hamburger (mobile) */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={openBookCall}
                        className="hidden md:block relative px-5 py-2 rounded-full text-sm font-semibold text-white transition-all duration-200 cursor-pointer"
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
                        Book a Call
                    </button>

                    {/* Hamburger — mobile only */}
                    <button
                        type="button"
                        className="md:hidden flex h-10 w-10 flex-col items-center justify-center gap-[5px] -mr-1.5"
                        onClick={() => setMobileOpen((v) => !v)}
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileOpen}
                    >
                        <span
                            className="block h-0.5 w-5 bg-white/85 transition-transform duration-300 origin-center"
                            style={{ transform: mobileOpen ? "translateY(7px) rotate(45deg)" : "none" }}
                        />
                        <span
                            className="block h-0.5 w-5 bg-white/85 transition-opacity duration-300"
                            style={{ opacity: mobileOpen ? 0 : 1 }}
                        />
                        <span
                            className="block h-0.5 w-5 bg-white/85 transition-transform duration-300 origin-center"
                            style={{ transform: mobileOpen ? "translateY(-7px) rotate(-45deg)" : "none" }}
                        />
                    </button>
                </div>
            </nav>

            {/* Mobile menu — full-screen drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden fixed inset-x-0 bottom-0 overflow-hidden"
                        style={{
                            top: "60px",
                            background: "rgba(7,0,31,0.98)",
                            backdropFilter: "blur(20px)",
                            WebkitBackdropFilter: "blur(20px)",
                            borderTop: "1px solid rgba(255,255,255,0.07)",
                        }}
                    >
                        <div className="flex h-full flex-col overflow-y-auto px-5 pb-10 pt-4">
                            {/* Segmented section tabs */}
                            <div
                                className="mb-4 flex items-center gap-1 rounded-full p-1"
                                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                            >
                                {(["services", "products"] as const).map((sec) => {
                                    const active = mobileSection === sec;
                                    return (
                                        <button
                                            key={sec}
                                            type="button"
                                            onClick={() => setMobileSection(sec)}
                                            className="flex-1 rounded-full py-2 text-xs font-semibold capitalize tracking-wide transition-all duration-200"
                                            style={{
                                                background: active ? "rgba(255,255,255,0.06)" : "transparent",
                                                color: active ? "#fff" : "rgba(255,255,255,0.55)",
                                                border: active ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
                                            }}
                                        >
                                            {sec}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Active section list */}
                            <div className="flex flex-col gap-1.5">
                                {(mobileSection === "services" ? SERVICES : PRODUCTS).map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="group/item flex items-start gap-3 rounded-2xl px-4 py-3.5 transition-colors duration-200 active:bg-white/[0.05]"
                                        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                                    >
                                        <span
                                            className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                                            style={{ background: item.accent, boxShadow: `0 0 8px ${item.accent}99` }}
                                        />
                                        <div className="flex flex-1 flex-col gap-0.5">
                                            <span className="text-[15px] font-semibold text-white">{item.label}</span>
                                            <span className="text-xs leading-snug text-white/45">{item.description}</span>
                                        </div>
                                        <span className="self-center text-base text-white/40" style={{ color: item.accent }}>
                                            →
                                        </span>
                                    </Link>
                                ))}
                            </div>

                            {/* Divider */}
                            <div className="my-6 h-px bg-white/[0.07]" />

                            {/* Plain links */}
                            <div className="flex flex-col gap-1">
                                {TOP_LINKS.map((l) => (
                                    <Link
                                        key={l.label}
                                        href={l.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-medium text-white/80 transition-colors active:bg-white/[0.04]"
                                    >
                                        {l.label}
                                        <span aria-hidden className="text-white/30">→</span>
                                    </Link>
                                ))}
                                <Link
                                    href="/contact"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-medium text-white/80 transition-colors active:bg-white/[0.04]"
                                >
                                    Contact
                                    <span aria-hidden className="text-white/30">→</span>
                                </Link>
                            </div>

                            {/* Spacer */}
                            <div className="flex-1" />

                            {/* CTA pinned at bottom */}
                            <button
                                type="button"
                                onClick={triggerBookCall}
                                className="mt-6 w-full rounded-full px-5 py-3.5 text-sm font-semibold text-white transition-all duration-200"
                                style={{
                                    background: "linear-gradient(135deg, rgba(114,200,245,0.14), rgba(155,47,255,0.14))",
                                    boxShadow: "0 0 14px rgba(114,200,245,0.18), 0 0 14px rgba(155,47,255,0.14), inset 0 0 0 1px rgba(114,200,245,0.28)",
                                }}
                            >
                                Book a Strategy Call
                            </button>
                            <p className="mt-3 text-center text-[11px] text-white/35">
                                We reply within 48 hours.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
