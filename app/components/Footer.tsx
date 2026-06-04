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

const SOCIALS = [
    { icon: <FaLinkedinIn size={13} />, href: "https://www.linkedin.com/company/levatahq/", label: "LinkedIn" },
    { icon: <FaInstagram size={13} />, href: "https://instagram.com/levatahq", label: "Instagram" },
    { icon: <FaFacebookF size={13} />, href: "https://www.facebook.com/levatahq", label: "Facebook" },
];

export default function Footer() {
    const { open: openBookCall } = useBookCall();

    return (
        <footer className="relative w-full overflow-hidden bg-[var(--background)]">

            {/* Top gradient border */}
            <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent 0%, rgba(123, 85, 234,0.5) 30%, rgba(123, 85, 234,0.5) 70%, transparent 100%)" }}
            />

            {/* Subtle ambient glow */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage:
                        "radial-gradient(ellipse 60% 50% at 10% 100%, rgba(123, 85, 234,0.07), transparent 60%), radial-gradient(ellipse 40% 40% at 90% 100%, rgba(123, 85, 234,0.06), transparent 60%)",
                }}
            />

            <div className="relative mx-auto max-w-7xl px-5 sm:px-8 md:px-10">

                {/* Main footer body */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:grid-cols-2 md:grid-cols-[1.7fr_1fr_1fr_1fr_1fr] md:gap-8 md:py-14">

                    {/* Brand column, full width on mobile */}
                    <div className="col-span-2 flex flex-col gap-5 md:col-span-1">
                        <Link href="/" className="flex items-center" style={{ gap: 0 }}>
                            <div style={{ overflow: "hidden", width: 32, height: 32, flexShrink: 0, WebkitMaskImage: "linear-gradient(to right, black 80%, transparent 100%)", maskImage: "linear-gradient(to right, black 80%, transparent 100%)" }}>
                                <img src="/levatalogo.png" alt="" style={{ height: 32, width: "auto", maxWidth: "none", display: "block" }} />
                            </div>
                            <span className="text-lead font-semibold" style={{ color: "#E6E6E6", letterSpacing: "-0.02em", lineHeight: 1 }}>Levata</span>
                        </Link>

                        <p className="max-w-[260px] text-body-sm text-white/45">
                            AI-native systems, platforms, and automation built for businesses that want to compound.
                        </p>

                        <a
                            href="mailto:hello@levatahq.com"
                            className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
                        >
                            <span className="flex h-4 w-4 items-center justify-center" aria-hidden>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    />
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
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] text-white/45 transition-all duration-200 hover:border-white/25 hover:text-white/85 active:bg-white/5"
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
                    <div className="flex flex-col gap-4">
                        <p className="text-eyebrow text-white/35">Connect</p>
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="text-left text-body-sm font-medium text-white/55 transition-colors hover:text-white"
                        >
                            Book a strategy call
                        </button>
                        <a
                            href="mailto:hello@levatahq.com"
                            className="text-body-sm text-white/55 transition-colors hover:text-white"
                        >
                            hello@levatahq.com
                        </a>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="flex items-center justify-center border-t border-white/[0.07] py-6">
                    <p className="text-micro text-white/30">
                        &copy; {new Date().getFullYear()} Levata. All rights reserved.
                    </p>
                </div>

            </div>
        </footer>
    );
}

function FooterColumn({ heading, items }: { heading: string; items: { label: string; href: string }[] }) {
    return (
        <div className="flex flex-col gap-4">
            <p className="text-eyebrow text-white/35">{heading}</p>
            <ul className="flex flex-col gap-2.5">
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
