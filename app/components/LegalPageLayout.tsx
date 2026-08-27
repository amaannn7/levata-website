"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}

export default function LegalPageLayout({
    eyebrow,
    title,
    lastUpdated,
    children,
}: {
    eyebrow: string;
    title: string;
    lastUpdated: string;
    children: ReactNode;
}) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [sections, setSections] = useState<{ id: string; text: string }[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const container = contentRef.current;
        if (!container) return;

        const headings = Array.from(container.querySelectorAll("h2"));
        const found = headings.map((h) => {
            const text = h.textContent ?? "";
            const id = slugify(text);
            h.id = id;
            return { id, text };
        });
        setSections(found);

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((e) => e.isIntersecting);
                if (visible.length > 0) {
                    setActiveId(visible[0].target.id);
                }
            },
            { rootMargin: "-15% 0px -70% 0px" }
        );
        headings.forEach((h) => observer.observe(h));
        return () => observer.disconnect();
    }, []);

    return (
        <main className="home-theme-dark relative w-full bg-[var(--background)]">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 overflow-hidden"
                style={{
                    backgroundImage:
                        "radial-gradient(ellipse 50% 40% at 50% 0%, rgba(123,85,234,0.08) 0%, transparent 65%)",
                }}
            />

            <div className="relative mx-auto max-w-5xl px-5 pb-24 pt-28 sm:px-8 sm:pt-32 md:pb-32">
                <div className="inline-flex items-center gap-3">
                    <span className="flex items-center">
                        <span className="animate-label-line" />
                        <span className="animate-label-dot" />
                    </span>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">{eyebrow}</p>
                </div>

                <h1 className="display-section-title mt-5 max-w-2xl">
                    <span className="display-strong-line">{title}</span>
                </h1>

                <p className="mt-3 text-sm text-white/40">Last updated: {lastUpdated}</p>

                <div className="legal-divider mt-8" />

                <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
                    {sections.length > 0 && (
                        <nav aria-label="Table of contents" className="hidden lg:block">
                            <div className="sticky top-28">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/30">
                                    On this page
                                </p>
                                <ul className="mt-4 flex flex-col gap-1 border-l" style={{ borderColor: "var(--home-card-border)" }}>
                                    {sections.map((s) => (
                                        <li key={s.id}>
                                            <a
                                                href={`#${s.id}`}
                                                className="legal-toc-link block py-1.5 pl-4 text-[13px] leading-snug transition-colors duration-200"
                                                data-active={activeId === s.id}
                                            >
                                                {s.text}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </nav>
                    )}

                    <div ref={contentRef} className="legal-content min-w-0 text-white/65">
                        {children}
                    </div>
                </div>
            </div>
        </main>
    );
}
