"use client";

import Link from "next/link";
import { FaLinkedinIn, FaInstagram, FaFacebookF } from "react-icons/fa6";
import { useBookCall } from "@/app/components/BookCallProvider";

const SERVICES = [
    { label: "AI & Intelligence", href: "/products/ai-intelligence" },
    { label: "Product Engineering", href: "/products/product-engineering" },
    { label: "Digital Infrastructure", href: "/products/digital-infrastructure" },
    { label: "Automation & Systems", href: "/products/automation-systems" },
];

const PRODUCTS = [
    { label: "Sales Intelligence Platform", href: "/products/sales-intelligence-platform" },
];

const COMPANY = [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

const LEGAL = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "Refund Policy", href: "/refund-policy" },
];

const SOCIALS = [
    { icon: <FaLinkedinIn size={13} />, href: "https://www.linkedin.com/company/levatahq/", label: "LinkedIn" },
    { icon: <FaInstagram size={13} />, href: "https://instagram.com/levatahq", label: "Instagram" },
    { icon: <FaFacebookF size={13} />, href: "https://www.facebook.com/levatahq", label: "Facebook" },
];

export default function Footer() {
    const { open: openBookCall } = useBookCall();

    return (
        <footer className="relative w-full overflow-hidden bg-[var(--background)] pt-10 md:pt-16">

            {/* Top gradient border -- cyanpurplecyan */}
            <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent 0%, rgba(0,255,221,0.35) 20%, rgba(123,85,234,0.7) 50%, rgba(0,255,221,0.35) 80%, transparent 100%)" }}
            />

            {/* Ambient glows */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage: [
                        "radial-gradient(ellipse 55% 45% at 50% 0%, rgba(123,85,234,0.09) 0%, transparent 65%)",
                        "radial-gradient(ellipse 40% 50% at 8% 100%, rgba(123,85,234,0.08) 0%, transparent 60%)",
                        "radial-gradient(ellipse 35% 45% at 92% 100%, rgba(0,255,221,0.05) 0%, transparent 60%)",
                    ].join(", "),
                }}
            />

            <div className="relative mx-auto max-w-[1120px] px-5 sm:px-8 md:px-10">

                {/* Main footer body */}
                <div className="grid grid-cols-1 gap-y-10 py-12 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 md:grid-cols-[1.7fr_1fr_1fr_1fr_1fr] md:gap-8 md:py-14">

                    {/* Brand column — centred on mobile, left-aligned from sm up */}
                    <div className="flex flex-col items-center text-center gap-5 sm:col-span-2 sm:items-start sm:text-left md:col-span-1">
                        <Link href="/" className="flex items-center gap-1.5">
                            <div style={{ overflow: "hidden", width: 34, height: 34, flexShrink: 0, WebkitMaskImage: "linear-gradient(to right, black 80%, transparent 100%)", maskImage: "linear-gradient(to right, black 80%, transparent 100%)" }}>
                                <img src="/levatalogo.png" alt="" style={{ height: 34, width: "auto", maxWidth: "none", display: "block" }} />
                            </div>
                            <span className="text-lead font-semibold" style={{ color: "#E6E6E6", letterSpacing: "-0.02em", lineHeight: 1 }}>Levata</span>
                        </Link>

                        <p className="max-w-[260px] text-body-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                            AI-native systems, platforms, and automation built for businesses that want to compound.
                        </p>

                        <a
                            href="mailto:hello@levatahq.com"
                            className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200"
                            style={{ color: "var(--text-secondary)" }}
                            onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
                        >
                            <span className="flex h-4 w-4 items-center justify-center" aria-hidden>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M2 6L12 13L22 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </span>
                            hello@levatahq.com
                        </a>

                        {/* Socials */}
                        <div className="mt-1 flex items-center gap-2">
                            {SOCIALS.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={s.label}
                                    className="group flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200"
                                    style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = "rgba(123,85,234,0.5)";
                                        e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                                        e.currentTarget.style.boxShadow = "0 0 12px rgba(123,85,234,0.2)";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                        e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                                        e.currentTarget.style.boxShadow = "";
                                    }}
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Services */}
                    <FooterColumn heading="Services" items={SERVICES} />

                    {/* Products */}
                    <FooterColumn heading="Products" items={PRODUCTS} />

                    {/* Company */}
                    <FooterColumn heading="Company" items={COMPANY} />

                    {/* Connect */}
                    <div className="flex flex-col items-center gap-4 sm:items-start">
                        <p className="text-eyebrow text-white/35">Connect</p>
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="group inline-flex items-center gap-1.5 text-left text-body-sm font-semibold transition-opacity duration-200 hover:opacity-80 cursor-pointer"
                            style={{ background: "linear-gradient(135deg, #00FFDD 0%, #CC01FF 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
                        >
                            Book a strategy call →
                        </button>
                        <a
                            href="mailto:hello@levatahq.com"
                            className="text-body-sm text-white/50 transition-colors duration-200 hover:text-white"
                        >
                            hello@levatahq.com
                        </a>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col items-center gap-4 border-t border-white/[0.06] py-6 sm:flex-row sm:justify-between sm:gap-2">
                    <p className="text-micro text-white/30">
                        &copy; {new Date().getFullYear()} Levata. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        {LEGAL.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-micro text-white/30 transition-colors duration-200 hover:text-white/60"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <p className="text-micro text-white/20 sm:block" style={{ letterSpacing: "0.15em" }}>
                        INTELLIGENCE, BUILT.
                    </p>
                </div>

            </div>
        </footer>
    );
}

function FooterColumn({ heading, items }: { heading: string; items: { label: string; href: string }[] }) {
    return (
        <div className="flex flex-col items-center gap-4 sm:items-start">
            <p className="text-eyebrow text-white/35">{heading}</p>
            <ul className="flex flex-col items-center gap-2.5 sm:items-start">
                {items.map((link) => (
                    <li key={link.label}>
                        <Link
                            href={link.href}
                            className="text-body-sm text-white/55 transition-colors duration-200 hover:text-white"
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
