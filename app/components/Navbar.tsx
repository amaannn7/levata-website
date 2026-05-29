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
        accent: "#7B55EA",
    },
    {
        label: "Digital Products",
        description: "Validated MVPs and scalable platforms",
        href: "/products/digital-products",
        accent: "#7B55EA",
    },
    {
        label: "Digital Services",
        description: "Websites, platforms, e-commerce, custom systems",
        href: "/products/digital-services",
        accent: "#7B55EA",
    },
    {
        label: "Automation & Systems",
        description: "Workflow automation, decision systems, dashboards",
        href: "/products/automation-systems",
        accent: "#7B55EA",
    },
];

const PRODUCTS = [
    {
        label: "Sales Intelligence Platform",
        description: "AI-powered B2B prospecting & outreach workspace",
        href: "/products/sales-intelligence-platform",
        accent: "#7B55EA",
        meta: "Featured",
    },
];

const TOP_LINKS = [
    { label: "About", href: "/about" },
];

const DROPDOWN_STYLE: React.CSSProperties = {
    background: "rgba(23,26,34,0.96)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(42,47,58,0.92)",
    boxShadow: "0 20px 48px rgba(14,16,20,0.45)",
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

// ── Mobile drawer animation variants ─────────────────────────────────
const drawerContainerVariants = {
    open: { transition: { staggerChildren: 0.055, delayChildren: 0.08 } },
    closed: {},
};

const drawerItemVariants = {
    open: { opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE } },
    closed: { opacity: 0, y: 10 },
};

// ── Mobile menu item components ───────────────────────────────────────
function DrawerItem({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex w-full items-center justify-between py-[18px] text-[1.15rem] font-semibold text-[#E8E8EA] transition-colors active:text-white"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
            {children}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden style={{ opacity: 0.3 }}>
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </Link>
    );
}

function DrawerExpandable({
    label,
    expanded,
    onToggle,
    children,
}: {
    label: string;
    expanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    return (
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={expanded}
                className="flex w-full items-center justify-between py-[18px] text-left text-[1.15rem] font-semibold text-[#E8E8EA] transition-colors active:text-white"
            >
                {label}
                <svg
                    width="15"
                    height="15"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden
                    style={{
                        transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 280ms cubic-bezier(0.16,1,0.3,1)",
                        opacity: 0.35,
                    }}
                >
                    <path d="M2 4.5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        key="sub"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ height: { duration: 0.3, ease: EASE }, opacity: { duration: 0.2, ease: "easeOut" } }}
                        style={{ overflow: "hidden" }}
                    >
                        <div className="pb-4 pl-1">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
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
    const [mobileExpanded, setMobileExpanded] = useState<Section>(null);
    const dropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { open: openBookCall } = useBookCall();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!mobileOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = prev; };
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
        <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 sm:px-6">
            {/*
              overflow-hidden on mobile so the expanding drawer is clipped to the pill's
              rounded corners. overflow-visible on md+ so desktop dropdowns can escape the pill.
            */}
            <div
                className="mx-auto overflow-hidden rounded-2xl transition-all duration-300 md:overflow-visible"
                style={{
                    maxWidth: "1120px",
                    background: scrolled ? "rgba(23,26,34,0.94)" : "rgba(23,26,34,0.88)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: scrolled ? "1px solid rgba(42,47,58,1)" : "1px solid rgba(42,47,58,0.88)",
                    boxShadow: "0 12px 30px rgba(14,16,20,0.35)",
                }}
            >
                {/* ── Main nav row ── */}
                <nav className="flex items-center justify-between px-5 py-2 md:px-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center" style={{ gap: 0 }} onClick={() => setMobileOpen(false)}>
                        <div
                            style={{
                                overflow: "hidden",
                                width: 40,
                                height: 40,
                                flexShrink: 0,
                                WebkitMaskImage: "linear-gradient(to right, black 80%, transparent 100%)",
                                maskImage: "linear-gradient(to right, black 80%, transparent 100%)",
                            }}
                        >
                            <img
                                src="/levatalogo.png"
                                alt=""
                                style={{ height: 40, width: "auto", maxWidth: "none", display: "block" }}
                            />
                        </div>
                        <span
                            style={{
                                color: "#E6E6E6",
                                fontWeight: 700,
                                fontSize: "1.25rem",
                                letterSpacing: "-0.02em",
                                lineHeight: 1,
                            }}
                        >
                            Levata
                        </span>
                    </Link>

                    {/* Center links, desktop only */}
                    <div className="hidden md:flex items-center gap-8">

                        {/* Services dropdown trigger */}
                        <div className="relative" onMouseEnter={() => openDropdown("services")} onMouseLeave={closeDropdown}>
                            <button
                                type="button"
                                aria-expanded={dropdown === "services"}
                                aria-haspopup="true"
                                className="group relative flex items-center gap-1.5 text-sm font-medium text-[#E6E6E6] transition-colors duration-200 hover:text-white"
                            >
                                <span>Services</span>
                                <ChevronIcon open={dropdown === "services"} />
                                <span
                                    aria-hidden
                                    className="pointer-events-none absolute -bottom-1.5 left-0 h-px w-0 bg-[#7B55EA] transition-all duration-300 group-hover:w-[calc(100%-14px)]"
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
                                                        className="group/item flex items-start gap-3 rounded-xl px-3.5 py-3 transition-colors duration-200 hover:bg-[#20242d]"
                                                    >
                                                        <span
                                                            className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                                                            style={{ background: s.accent }}
                                                        />
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-sm font-semibold text-[#E6E6E6] transition-colors duration-200 group-hover/item:text-white">
                                                                {s.label}
                                                            </span>
                                                            <span className="text-[12px] leading-snug text-[#71717A]">
                                                                {s.description}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between border-t border-[#2A2F3A] px-4 py-3">
                                                <span className="text-[12px] font-medium uppercase tracking-[0.14em] text-[#71717A]">
                                                    4 service practices
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => { setDropdown(null); openBookCall(); }}
                                                    className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#E6E6E6] transition-colors hover:text-white"
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
                                className="group relative flex items-center gap-1.5 text-sm font-medium text-[#E6E6E6] transition-colors duration-200 hover:text-white"
                            >
                                <span>Products</span>
                                <ChevronIcon open={dropdown === "products"} />
                                <span
                                    aria-hidden
                                    className="pointer-events-none absolute -bottom-1.5 left-0 h-px w-0 bg-[#7B55EA] transition-all duration-300 group-hover:w-[calc(100%-14px)]"
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
                                                        className="group/item flex items-start gap-3 rounded-xl px-3.5 py-3 transition-colors duration-200 hover:bg-[#20242d]"
                                                    >
                                                        <span
                                                            className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                                                            style={{ background: p.accent }}
                                                        />
                                                        <div className="flex flex-1 flex-col gap-0.5">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-semibold text-[#E6E6E6] transition-colors duration-200 group-hover/item:text-white">
                                                                    {p.label}
                                                                </span>
                                                                <span
                                                                    className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]"
                                                                    style={{ background: "rgba(123, 85, 234,0.12)", border: "1px solid rgba(123, 85, 234,0.35)", color: p.accent }}
                                                                >
                                                                    {p.meta}
                                                                </span>
                                                            </div>
                                                            <span className="text-[12px] leading-snug text-[#71717A]">
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
                                className="group relative text-sm font-medium text-[#E6E6E6] transition-colors duration-200 hover:text-white"
                            >
                                <span>{l.label}</span>
                                <span
                                    aria-hidden
                                    className="pointer-events-none absolute -bottom-1.5 left-0 h-px w-0 bg-[#7B55EA] transition-all duration-300 group-hover:w-full"
                                />
                            </Link>
                        ))}
                    </div>

                    {/* Right, Contact (desktop) + Hamburger (mobile) */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/contact"
                            className="hidden md:inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90"
                            data-cta="primary"
                        >
                            Contact Us
                        </Link>

                        {/* Hamburger, mobile only, animates to X */}
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

                {/* ── Mobile menu, drops down inside the pill ── */}
                <AnimatePresence initial={false}>
                    {mobileOpen && (
                        <motion.div
                            key="mobile-drawer"
                            className="md:hidden overflow-hidden"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                                height: { duration: 0.42, ease: EASE },
                                opacity: { duration: 0.22, ease: "easeOut" },
                            }}
                            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                        >
                            <motion.div
                                className="flex flex-col overflow-y-auto px-5"
                                style={{
                                    maxHeight: "calc(100svh - 60px)",
                                    paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)",
                                }}
                                variants={drawerContainerVariants}
                                initial="closed"
                                animate="open"
                            >
                                {/* Services, expandable */}
                                <motion.div variants={drawerItemVariants}>
                                    <DrawerExpandable
                                        label="Services"
                                        expanded={mobileExpanded === "services"}
                                        onToggle={() => setMobileExpanded(mobileExpanded === "services" ? null : "services")}
                                    >
                                        {SERVICES.map((s) => (
                                            <Link
                                                key={s.label}
                                                href={s.href}
                                                onClick={() => setMobileOpen(false)}
                                                className="flex items-center justify-between py-2.5 text-[15px] font-medium text-[#888896] transition-colors active:text-white hover:text-[#C0C0CC]"
                                            >
                                                {s.label}
                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden style={{ opacity: 0.3 }}>
                                                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </Link>
                                        ))}
                                    </DrawerExpandable>
                                </motion.div>

                                {/* Products, expandable */}
                                <motion.div variants={drawerItemVariants}>
                                    <DrawerExpandable
                                        label="Products"
                                        expanded={mobileExpanded === "products"}
                                        onToggle={() => setMobileExpanded(mobileExpanded === "products" ? null : "products")}
                                    >
                                        {PRODUCTS.map((p) => (
                                            <Link
                                                key={p.label}
                                                href={p.href}
                                                onClick={() => setMobileOpen(false)}
                                                className="flex items-center justify-between py-2.5 text-[15px] font-medium text-[#888896] transition-colors active:text-white hover:text-[#C0C0CC]"
                                            >
                                                <span className="flex items-center gap-2">
                                                    {p.label}
                                                    <span
                                                        className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em]"
                                                        style={{ background: "rgba(123, 85, 234,0.12)", border: "1px solid rgba(123, 85, 234,0.3)", color: "#7B55EA" }}
                                                    >
                                                        {p.meta}
                                                    </span>
                                                </span>
                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden style={{ opacity: 0.3 }}>
                                                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </Link>
                                        ))}
                                    </DrawerExpandable>
                                </motion.div>

                                {/* About */}
                                <motion.div variants={drawerItemVariants}>
                                    <DrawerItem href="/about" onClick={() => setMobileOpen(false)}>
                                        About
                                    </DrawerItem>
                                </motion.div>

                                {/* Contact */}
                                <motion.div variants={drawerItemVariants}>
                                    <DrawerItem href="/contact" onClick={() => setMobileOpen(false)}>
                                        Contact
                                    </DrawerItem>
                                </motion.div>

                                {/* Bottom CTA */}
                                <motion.div variants={drawerItemVariants} className="mt-6 pb-1">
                                    <button
                                        type="button"
                                        onClick={triggerBookCall}
                                        className="w-full rounded-2xl py-4 text-center text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
                                        data-cta="primary"
                                    >
                                        Book a Strategy Call
                                    </button>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </header>
    );
}
