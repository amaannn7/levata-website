"use client";

import Link from "next/link";
import {
    FaFacebookF,
    FaLinkedinIn,
    FaInstagram,
} from "react-icons/fa";

const NAV_COLUMNS = [
    {
        heading: "Services",
        links: [
            { label: "AI & Intelligence", href: "/#services" },
            { label: "Digital Products", href: "/#services" },
            { label: "Automation & Systems", href: "/#services" },
            { label: "Digital Services", href: "/#services" },
        ],
    },
    {
        heading: "Company",
        links: [
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact" },
        ],
    },
    {
        heading: "Connect",
        links: [
            { label: "Book a Call", href: "/contact#book" },
            { label: "hello@levata.io", href: "mailto:hello@levata.io" },
        ],
    },
];

const SOCIALS = [
    { icon: <FaFacebookF size={14} />, href: "https://www.facebook.com/levatahq", label: "Facebook" },
    { icon: <FaInstagram size={14} />, href: "https://instagram.com/levatahq", label: "Instagram" },
    { icon: <FaLinkedinIn size={14} />, href: "https://www.linkedin.com/company/levatahq/", label: "LinkedIn" },
];

export default function Footer() {
    return (
        <footer className="relative w-full bg-[#07001F] overflow-hidden">

            {/* Top gradient border */}
            <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent 0%, rgba(114,200,245,0.5) 30%, rgba(155,47,255,0.5) 70%, transparent 100%)" }}
            />

            {/* Subtle background glow */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage:
                        "radial-gradient(ellipse 60% 50% at 10% 100%, rgba(155,47,255,0.07), transparent 60%), radial-gradient(ellipse 40% 40% at 90% 100%, rgba(114,200,245,0.06), transparent 60%)",
                }}
            />

            <div className="relative mx-auto max-w-7xl px-6 sm:px-10">

                {/* Main footer body */}
                <div className="grid grid-cols-1 gap-10 py-10 md:grid-cols-[1.8fr_1fr_1fr_1fr] md:gap-8 lg:py-14">

                    {/* Brand column */}
                    <div className="flex flex-col gap-6">
                        <Link href="/" className="flex items-center gap-3 w-fit">
                            <div className="overflow-hidden rounded-xl flex-shrink-0" style={{ width: 40, height: 40 }}>
                                <img
                                    src="/levatalogo.png"
                                    alt="Levata logo"
                                    style={{ height: 40, width: "auto", maxWidth: "none", display: "block" }}
                                />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">Levata</span>
                        </Link>

                        <p className="max-w-[260px] text-sm leading-relaxed text-white/40">
                            We build AI systems, digital products, and automation that move businesses forward.
                        </p>

                        {/* Social links */}
                        <div className="flex items-center gap-2 mt-1">
                            {SOCIALS.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    aria-label={s.label}
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/35 transition-all duration-200 hover:border-white/25 hover:text-white/70"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Nav columns */}
                    {NAV_COLUMNS.map((col) => (
                        <div key={col.heading} className="flex flex-col gap-4">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30">
                                {col.heading}
                            </p>
                            <ul className="flex flex-col gap-3">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-white/50 transition-colors duration-200 hover:text-white/90"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div
                    className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.07] py-6 sm:flex-row"
                >
                    <p className="text-xs text-white/25">
                        &copy; {new Date().getFullYear()} Levata. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-xs text-white/25 transition-colors hover:text-white/50">Privacy Policy</a>
                        <a href="#" className="text-xs text-white/25 transition-colors hover:text-white/50">Terms of Service</a>
                        <a href="#" className="text-xs text-white/25 transition-colors hover:text-white/50">Cookie Policy</a>
                    </div>
                </div>

            </div>
        </footer>
    );
}
