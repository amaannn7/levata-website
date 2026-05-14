"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const SERVICES = [
    { label: "AI & Intelligence", href: "/products/ai-intelligence", accent: "#9B2FFF" },
    { label: "Digital Products", href: "/#services", accent: "#BB00FF" },
    { label: "Digital Services", href: "/#services", accent: "#3DFD98" },
    { label: "Automation & Systems", href: "/#services", accent: "#72C8F5" },
    { label: "Growth & Marketing", href: "/#services", accent: "#9B2FFF" },
];

const PRODUCTS = [
    {
        label: "Sales Intelligence Platform",
        description: "AI-powered B2B prospecting & outreach workspace",
        href: "/products/sales-intelligence-platform",
        accent: "#72C8F5",
    },
];

const DROPDOWN_STYLE: React.CSSProperties = {
    background: "rgba(7,0,31,0.92)",
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

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [productsOpen, setProductsOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const servicesTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const productsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 20);
            if (mobileOpen) setMobileOpen(false);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [mobileOpen]);

    const openServices = () => { if (servicesTimer.current) clearTimeout(servicesTimer.current); setServicesOpen(true); };
    const closeServices = () => { servicesTimer.current = setTimeout(() => setServicesOpen(false), 120); };
    const openProducts = () => { if (productsTimer.current) clearTimeout(productsTimer.current); setProductsOpen(true); };
    const closeProducts = () => { productsTimer.current = setTimeout(() => setProductsOpen(false), 120); };

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
            style={{
                background: scrolled || mobileOpen ? "rgba(7,0,31,0.95)" : "transparent",
                backdropFilter: scrolled || mobileOpen ? "blur(16px)" : "none",
                borderBottom: scrolled || mobileOpen ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
            }}
        >
            <nav
                className="mx-auto flex items-center justify-between max-w-7xl px-6 py-4 sm:px-10 md:py-5 md:grid"
                style={{ gridTemplateColumns: "1fr auto 1fr" }}
            >
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
                    <div className="overflow-hidden rounded-xl flex-shrink-0" style={{ width: 44, height: 44 }}>
                        <img
                            src="/levatalogo.png"
                            alt="Levata logo"
                            style={{ height: 44, width: "auto", maxWidth: "none", display: "block" }}
                        />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">Levata</span>
                </Link>

                {/* Center links — desktop */}
                <div className="hidden md:flex items-center gap-8">

                    {/* Services dropdown */}
                    <div className="relative" onMouseEnter={openServices} onMouseLeave={closeServices}>
                        <button
                            type="button"
                            aria-expanded={servicesOpen}
                            aria-haspopup="true"
                            className="group relative flex items-center gap-1.5 text-sm font-medium text-white transition-opacity duration-500 hover:opacity-80"
                        >
                            <span>Services</span>
                            <ChevronIcon open={servicesOpen} />
                            <span
                                aria-hidden
                                className="pointer-events-none absolute -bottom-1.5 left-0 h-px w-0 bg-white/80 transition-all duration-500 group-hover:w-[calc(100%-14px)]"
                            />
                        </button>
                        <AnimatePresence>
                            {servicesOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 6 }}
                                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                                    className="absolute left-1/2 top-full -translate-x-1/2 pt-4"
                                >
                                    <div className="w-[260px] rounded-2xl overflow-hidden" style={DROPDOWN_STYLE}>
                                        {SERVICES.map((s, i) => (
                                            <Link
                                                key={s.label}
                                                href={s.href}
                                                onClick={() => setServicesOpen(false)}
                                                className="group/item flex items-center justify-between gap-3 px-4 py-3.5 transition-colors duration-200 hover:bg-white/[0.04]"
                                                style={{ borderBottom: i < SERVICES.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                                            >
                                                <span className="text-sm font-medium text-white/70 transition-colors duration-200 group-hover/item:text-white">
                                                    {s.label}
                                                </span>
                                                <span
                                                    className="flex-shrink-0 text-sm opacity-0 transition-all duration-200 group-hover/item:opacity-100 group-hover/item:translate-x-0.5"
                                                    style={{ color: s.accent }}
                                                >
                                                    &#x2192;
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Products dropdown */}
                    <div className="relative" onMouseEnter={openProducts} onMouseLeave={closeProducts}>
                        <button
                            type="button"
                            aria-expanded={productsOpen}
                            aria-haspopup="true"
                            className="group relative flex items-center gap-1.5 text-sm font-medium text-white transition-opacity duration-500 hover:opacity-80"
                        >
                            <span>Products</span>
                            <ChevronIcon open={productsOpen} />
                            <span
                                aria-hidden
                                className="pointer-events-none absolute -bottom-1.5 left-0 h-px w-0 bg-white/80 transition-all duration-500 group-hover:w-[calc(100%-14px)]"
                            />
                        </button>
                        <AnimatePresence>
                            {productsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 6 }}
                                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                                    className="absolute left-1/2 top-full -translate-x-1/2 pt-4"
                                >
                                    <div className="w-[300px] rounded-2xl overflow-hidden" style={DROPDOWN_STYLE}>
                                        {PRODUCTS.map((p, i) => (
                                            <Link
                                                key={p.label}
                                                href={p.href}
                                                onClick={() => setProductsOpen(false)}
                                                className="group/item flex items-center justify-between gap-4 px-4 py-4 transition-colors duration-200 hover:bg-white/[0.04]"
                                                style={{ borderBottom: i < PRODUCTS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-white/85 transition-colors duration-200 group-hover/item:text-white">
                                                        {p.label}
                                                    </p>
                                                    <p className="mt-0.5 text-xs leading-snug text-white/35">
                                                        {p.description}
                                                    </p>
                                                </div>
                                                <span
                                                    className="flex-shrink-0 text-sm opacity-40 transition-all duration-200 group-hover/item:opacity-100 group-hover/item:translate-x-0.5"
                                                    style={{ color: p.accent }}
                                                >
                                                    &#x2192;
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* About */}
                    <Link
                        href="/about"
                        className="group relative text-sm font-medium text-white transition-opacity duration-500 hover:opacity-80"
                    >
                        <span>About</span>
                        <span
                            aria-hidden
                            className="pointer-events-none absolute -bottom-1.5 left-0 h-px w-0 bg-white/80 transition-all duration-500 group-hover:w-full"
                        />
                    </Link>
                </div>

                {/* Right — Contact (desktop) + Hamburger (mobile) */}
                <div className="flex items-center justify-end gap-3">
                    <Link
                        href="/contact"
                        className="hidden md:block relative px-5 py-2 rounded-full text-sm font-semibold text-white transition-all duration-200"
                        style={{
                            background: "linear-gradient(135deg, rgba(114,200,245,0.08), rgba(155,47,255,0.08))",
                            border: "1px solid transparent",
                            backgroundClip: "padding-box",
                            boxShadow: "0 0 10px rgba(114,200,245,0.1), 0 0 10px rgba(155,47,255,0.08), inset 0 0 0 1px rgba(114,200,245,0.18)",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                                "0 0 20px rgba(114,200,245,0.28), 0 0 20px rgba(155,47,255,0.22), inset 0 0 0 1px rgba(114,200,245,0.4)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                                "0 0 10px rgba(114,200,245,0.1), 0 0 10px rgba(155,47,255,0.08), inset 0 0 0 1px rgba(114,200,245,0.18)";
                        }}
                    >
                        Contact Us
                    </Link>

                    {/* Hamburger — mobile only */}
                    <button
                        type="button"
                        className="md:hidden flex flex-col items-center justify-center gap-[5px] p-2 -mr-2"
                        onClick={() => setMobileOpen((v) => !v)}
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileOpen}
                    >
                        <span
                            className="block h-0.5 w-5 bg-white/80 transition-transform duration-300 origin-center"
                            style={{ transform: mobileOpen ? "translateY(7px) rotate(45deg)" : "none" }}
                        />
                        <span
                            className="block h-0.5 w-5 bg-white/80 transition-opacity duration-300"
                            style={{ opacity: mobileOpen ? 0 : 1 }}
                        />
                        <span
                            className="block h-0.5 w-5 bg-white/80 transition-transform duration-300 origin-center"
                            style={{ transform: mobileOpen ? "translateY(-7px) rotate(-45deg)" : "none" }}
                        />
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="md:hidden overflow-hidden"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
                    >
                        <div className="flex flex-col px-6 py-4 overflow-y-auto" style={{ maxHeight: "calc(100svh - 68px)" }}>
                            <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30">
                                Services
                            </p>
                            {SERVICES.map((s) => (
                                <Link
                                    key={s.label}
                                    href={s.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="group/item flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors duration-200 hover:bg-white/[0.04]"
                                >
                                    <span className="text-sm font-medium text-white/70 transition-colors duration-200 group-hover/item:text-white">
                                        {s.label}
                                    </span>
                                    <span
                                        className="text-sm opacity-50 transition-all duration-200 group-hover/item:opacity-100"
                                        style={{ color: s.accent }}
                                    >
                                        &#x2192;
                                    </span>
                                </Link>
                            ))}

                            <div className="my-3 h-px bg-white/[0.07]" />

                            <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30">
                                Products
                            </p>
                            {PRODUCTS.map((p) => (
                                <Link
                                    key={p.label}
                                    href={p.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="group/item flex items-center justify-between gap-4 rounded-xl px-3 py-3 transition-colors duration-200 hover:bg-white/[0.04]"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-white/85 transition-colors duration-200 group-hover/item:text-white">
                                            {p.label}
                                        </p>
                                        <p className="mt-0.5 text-xs text-white/35 leading-snug">{p.description}</p>
                                    </div>
                                    <span
                                        className="flex-shrink-0 text-sm opacity-40 transition-all duration-200 group-hover/item:opacity-100"
                                        style={{ color: p.accent }}
                                    >
                                        &#x2192;
                                    </span>
                                </Link>
                            ))}

                            <div className="my-3 h-px bg-white/[0.07]" />

                            <Link
                                href="/about"
                                onClick={() => setMobileOpen(false)}
                                className="rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition-colors duration-200 hover:bg-white/[0.04] hover:text-white"
                            >
                                About
                            </Link>

                            <div className="my-3 h-px bg-white/[0.07]" />

                            <Link
                                href="/contact"
                                onClick={() => setMobileOpen(false)}
                                className="rounded-xl px-3 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/[0.04]"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

