"use client";

import { useRef } from "react";

const SERVICES = [
    {
        name: "AI and Intelligence Solutions",
        description:
            "From AI assistants that automate routing tasks or improve customer services to a game-changing data-lake-sourced business intelligence. These technologies are finally ripe enough to be efficiently implemented in a business of any scale.",
        accent: "#9B2FFF",
        mockup: "ai" as const,
    },
    {
        name: "Digital Services",
        description:
            "Cut 3rd-party expenses, raise sales, improve customer retention, gain control over your data and unlock infinite scaling potential. From ordering and delivery routing to data-driven loyalty systems and AI-driven business insights.",
        accent: "#72C8F5",
        mockup: "dashboard" as const,
    },
    {
        name: "Digital Products",
        description:
            "Web and mobile products built to scale. Cut 3rd-party expenses, raise conversion, improve retention, and unlock infinite scaling, from MVP to multi-region platforms users actually return to.",
        accent: "#BB00FF",
        mockup: "mobile" as const,
    },
    {
        name: "Automation and systems",
        description:
            "Booking platforms, workflow engines, and back-office automations that replace manual work with reliable systems. Operational structure, ordering, routing, loyalty, and reporting, all in one.",
        accent: "#3DFD98",
        mockup: "automation" as const,
    },
];

export function ArrowIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M5 12H19M19 12L13 6M19 12L13 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function CircleArrow({ label = "Learn More", prominent = false }: { accent?: string; label?: string; prominent?: boolean }) {
    return (
        <span className="group/cta inline-flex items-center gap-4">
            <span className={`font-semibold uppercase tracking-[0.22em] text-white transition-colors group-hover/cta:text-white ${prominent ? "text-base font-[family-name:var(--font-space-grotesk)]" : "text-xs text-white/80"}`}>
                {label}
            </span>
            <span className={`flex items-center justify-center rounded-full border text-white transition-all duration-300 group-hover/cta:border-[#72C8F5]/50 group-hover/cta:shadow-[0_0_18px_rgba(114,200,245,0.35)] ${prominent ? "h-12 w-12 border-white/30" : "h-10 w-10 border-white/15"}`}>
                <span className="transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:drop-shadow-[0_0_6px_#72C8F5]">
                    <ArrowIcon />
                </span>
            </span>
        </span>
    );
}

// Mockup placeholders (clean, no heavy glows)
export function DashboardMockup({ accent }: { accent: string }) {
    return (
        <div className="relative h-full w-full">
            <div
                className="absolute right-[-4%] top-[8%] h-[78%] w-[88%] rounded-[14px] border border-white/10 p-3"
                style={{ background: "rgba(12,4,32,0.95)" }}
            >
                <div className="flex h-full gap-3">
                    <div
                        className="flex w-[22%] flex-col gap-2 rounded-md p-3"
                        style={{ background: `${accent}10` }}
                    >
                        <div className="h-2 w-full rounded-full bg-white/12" />
                        <div className="h-2 w-3/4 rounded-full bg-white/8" />
                        <div className="mt-2 h-2 w-full rounded-full bg-white/8" />
                        <div className="h-2 w-2/3 rounded-full bg-white/8" />
                        <div
                            className="mt-2 h-2 w-full rounded-full"
                            style={{ background: accent, opacity: 0.6 }}
                        />
                        <div className="h-2 w-3/5 rounded-full bg-white/8" />
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                        <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className="h-5 flex-1 rounded-md"
                                    style={{
                                        background:
                                            i === 3 ? `${accent}80` : "rgba(255,255,255,0.05)",
                                    }}
                                />
                            ))}
                        </div>
                        <div className="flex flex-1 flex-col gap-1.5 overflow-hidden">
                            {[...Array(7)].map((_, i) => (
                                <div
                                    key={i}
                                    className="flex h-4 items-center gap-1.5 rounded bg-white/[0.03] px-2"
                                >
                                    <div
                                        className="h-1.5 w-1.5 rounded-full"
                                        style={{ background: accent, opacity: 0.5 }}
                                    />
                                    <div className="h-1.5 flex-1 rounded-full bg-white/8" />
                                    <div className="h-1.5 w-10 rounded-full bg-white/8" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="absolute bottom-[-4%] left-[8%] h-[60%] w-[28%] rounded-[22px] border border-white/12 p-2"
                style={{ background: "rgba(15,4,40,0.97)" }}
            >
                <div className="flex h-full flex-col gap-1.5 overflow-hidden rounded-[16px] bg-black/40 p-2">
                    <div className="h-3 w-2/3 rounded-full bg-white/12" />
                    <div className="grid grid-cols-2 gap-1">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="aspect-square rounded-md"
                                style={{ background: `${accent}25` }}
                            />
                        ))}
                    </div>
                    <div className="mt-auto flex justify-around border-t border-white/8 pt-1.5">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="h-1.5 w-1.5 rounded-full"
                                style={{
                                    background: i === 0 ? accent : "rgba(255,255,255,0.25)",
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function AIMockup({ accent }: { accent: string }) {
    return (
        <div className="relative h-full w-full">
            <div
                className="absolute right-0 top-[6%] h-[80%] w-[82%] rounded-[14px] border border-white/10 p-3"
                style={{ background: "rgba(12,4,32,0.95)" }}
            >
                <div className="flex h-full gap-3">
                    <div className="flex w-[40%] flex-col gap-1.5">
                        <div className="h-3 w-1/2 rounded-full bg-white/12" />
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2 rounded-md p-1.5"
                                style={{
                                    background:
                                        i === 1 ? `${accent}18` : "rgba(255,255,255,0.03)",
                                }}
                            >
                                <div
                                    className="h-5 w-5 rounded-full"
                                    style={{ background: `${accent}66` }}
                                />
                                <div className="flex-1 space-y-1">
                                    <div className="h-1.5 w-2/3 rounded-full bg-white/15" />
                                    <div className="h-1 w-full rounded-full bg-white/8" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-1 flex-col gap-2 rounded-md bg-white/[0.03] p-2">
                        <div
                            className="rounded-md p-2"
                            style={{ background: `${accent}18` }}
                        >
                            <div className="mb-1 h-2 w-2/3 rounded-full bg-white/22" />
                            <div className="space-y-1">
                                <div className="h-1.5 w-full rounded-full bg-white/12" />
                                <div className="h-1.5 w-5/6 rounded-full bg-white/12" />
                                <div className="h-1.5 w-3/4 rounded-full bg-white/12" />
                            </div>
                        </div>
                        <div className="rounded-md bg-white/[0.04] p-2">
                            <div className="space-y-1">
                                <div className="h-1.5 w-full rounded-full bg-white/12" />
                                <div className="h-1.5 w-4/5 rounded-full bg-white/12" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="absolute bottom-0 left-[2%] h-[68%] w-[30%] rounded-[20px] border border-white/12 p-2"
                style={{ background: "rgba(15,4,40,0.97)" }}
            >
                <div className="flex h-full flex-col gap-1.5 overflow-hidden rounded-[14px] bg-black/40 p-2">
                    <div className="flex items-center gap-1.5">
                        <div
                            className="h-3 w-3 rounded-full"
                            style={{ background: `${accent}aa` }}
                        />
                        <div className="h-2 w-1/2 rounded-full bg-white/15" />
                    </div>
                    <div className="space-y-1 rounded-md bg-white/5 p-1.5">
                        <div className="h-1 w-full rounded-full bg-white/12" />
                        <div className="h-1 w-4/5 rounded-full bg-white/12" />
                        <div className="h-1 w-3/4 rounded-full bg-white/12" />
                    </div>
                    <div
                        className="mt-auto h-6 rounded-md"
                        style={{ background: `${accent}30` }}
                    />
                </div>
            </div>
        </div>
    );
}

export function MobileMockup({ accent }: { accent: string }) {
    return (
        <div className="relative h-full w-full">
            <div
                className="absolute right-[18%] top-[4%] h-[92%] w-[34%] rotate-[-6deg] rounded-[24px] border border-white/12 p-2"
                style={{ background: "rgba(15,4,40,0.97)" }}
            >
                <div className="flex h-full flex-col gap-2 overflow-hidden rounded-[18px] bg-black/40 p-2">
                    <div className="h-3 w-1/2 rounded-full bg-white/15" />
                    <div
                        className="h-16 rounded-md"
                        style={{ background: `${accent}30` }}
                    />
                    <div className="grid grid-cols-3 gap-1">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="aspect-square rounded-md bg-white/[0.05]"
                            />
                        ))}
                    </div>
                    <div className="space-y-1">
                        <div className="h-1.5 w-full rounded-full bg-white/12" />
                        <div className="h-1.5 w-3/4 rounded-full bg-white/12" />
                    </div>
                </div>
            </div>
            <div
                className="absolute right-[2%] top-[10%] h-[86%] w-[32%] rotate-[6deg] rounded-[22px] border border-white/12 p-2"
                style={{ background: "rgba(18,5,48,0.97)" }}
            >
                <div className="flex h-full flex-col gap-2 overflow-hidden rounded-[16px] bg-black/40 p-2">
                    <div className="flex items-center gap-1.5">
                        <div
                            className="h-4 w-4 rounded-full"
                            style={{ background: `${accent}aa` }}
                        />
                        <div className="h-2 flex-1 rounded-full bg-white/12" />
                    </div>
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-1.5 rounded-md bg-white/[0.04] p-1.5"
                        >
                            <div
                                className="h-3 w-3 rounded-full"
                                style={{ background: `${accent}66` }}
                            />
                            <div className="flex-1 space-y-0.5">
                                <div className="h-1 w-2/3 rounded-full bg-white/15" />
                                <div className="h-1 w-1/2 rounded-full bg-white/8" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div
                className="absolute left-0 top-[20%] h-[60%] w-[55%] rounded-[12px] border border-white/8 p-2 opacity-60"
                style={{ background: "rgba(8,2,28,0.9)" }}
            >
                <div className="flex h-full gap-1.5">
                    <div
                        className="w-[20%] rounded"
                        style={{ background: `${accent}12` }}
                    />
                    <div className="flex-1 space-y-1">
                        <div className="h-2 w-1/2 rounded-full bg-white/12" />
                        <div className="grid grid-cols-2 gap-1">
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-6 rounded"
                                    style={{
                                        background: `${accent}${i % 2 ? "18" : "10"}`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function AutomationMockup({ accent }: { accent: string }) {
    return (
        <div className="relative h-full w-full">
            <div
                className="absolute right-0 top-0 h-full w-[88%] rounded-[14px] border border-white/10 p-3"
                style={{ background: "rgba(12,4,32,0.95)" }}
            >
                <div className="grid h-full grid-cols-3 gap-2">
                    {["Triggered", "Processing", "Delivered"].map((stage, col) => (
                        <div
                            key={stage}
                            className="flex flex-col gap-1.5 rounded-md p-2"
                            style={{
                                background:
                                    col === 1 ? `${accent}12` : "rgba(255,255,255,0.03)",
                            }}
                        >
                            <div className="flex items-center gap-1.5">
                                <div
                                    className="h-2 w-2 rounded-full"
                                    style={{
                                        background: col === 1 ? accent : `${accent}55`,
                                    }}
                                />
                                <div className="h-1.5 w-2/3 rounded-full bg-white/15" />
                            </div>
                            {[...Array(4 - col)].map((_, i) => (
                                <div
                                    key={i}
                                    className="space-y-1 rounded-md bg-white/[0.04] p-1.5"
                                >
                                    <div className="h-1 w-3/4 rounded-full bg-white/12" />
                                    <div className="h-1 w-1/2 rounded-full bg-white/8" />
                                    <div className="flex gap-0.5">
                                        <div
                                            className="h-1 w-4 rounded-full"
                                            style={{ background: `${accent}66` }}
                                        />
                                        <div className="h-1 w-3 rounded-full bg-white/12" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <div
                className="absolute bottom-[6%] left-0 h-[40%] w-[34%] rounded-[12px] border border-white/12 p-2.5"
                style={{ background: "rgba(18,5,48,0.97)" }}
            >
                <div className="flex items-center gap-1.5">
                    <div
                        className="h-5 w-5 rounded-full"
                        style={{ background: `${accent}88` }}
                    />
                    <div className="flex-1 space-y-0.5">
                        <div className="h-1.5 w-2/3 rounded-full bg-white/22" />
                        <div className="h-1 w-1/2 rounded-full bg-white/12" />
                    </div>
                </div>
                <div
                    className="mt-2 rounded p-1.5"
                    style={{ background: `${accent}18` }}
                >
                    <div className="h-1 w-3/4 rounded-full bg-white/22" />
                    <div className="mt-1 h-1 w-1/2 rounded-full bg-white/15" />
                </div>
            </div>
        </div>
    );
}

function Mockup({ kind, accent }: { kind: (typeof SERVICES)[number]["mockup"]; accent: string }) {
    switch (kind) {
        case "ai":
            return <AIMockup accent={accent} />;
        case "dashboard":
            return <DashboardMockup accent={accent} />;
        case "mobile":
            return <MobileMockup accent={accent} />;
        case "automation":
            return <AutomationMockup accent={accent} />;
    }
}

function ServiceRow({
    service,
    reverse,
}: {
    service: (typeof SERVICES)[number];
    reverse: boolean;
}) {
    const rowRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={rowRef}>
            <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center px-8 py-14 md:py-20 lg:grid-cols-2 lg:gap-8">
                <div className={`flex flex-col gap-8 ${reverse ? "lg:order-2 lg:pl-16" : "lg:pr-16"}`}>
                    <h3 className="text-2xl font-extrabold leading-[1.1] tracking-tight text-white md:text-3xl" data-reveal>
                        {service.name}
                    </h3>
                    <p className="max-w-lg text-sm leading-relaxed text-white/55" data-reveal>
                        {service.description}
                    </p>
                    <a href="#" className="mt-4 inline-flex w-fit items-center" data-reveal>
                        <CircleArrow />
                    </a>
                </div>

                <div className={`relative mt-12 h-[260px] w-full md:h-[340px] lg:mt-0 ${reverse ? "lg:order-1" : ""}`} data-reveal>
                    <Mockup kind={service.mockup} accent={service.accent} />
                </div>
            </div>
        </div>
    );
}

export default function ServicesSection() {
    const headerRef = useRef<HTMLDivElement>(null);
    const showAllRef = useRef<HTMLDivElement>(null);


    return (
        <section id="services" className="relative w-full overflow-hidden">
            {/* Section header */}
            <div ref={headerRef} className="px-8 pb-12 pt-16 md:pt-20">
                <div className="mx-auto max-w-[1440px] flex flex-col items-center text-center">
                    <div className="mb-4 inline-flex items-center gap-3">
                        <span className="flex items-center">
                            <span className="animate-label-line" />
                            <span className="animate-label-dot" />
                        </span>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Services</p>
                    </div>
                    <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-white md:text-4xl" data-reveal>
                        Built for teams that want{" "}
                        <span className="text-white">
                            outcomes, not deliverables.
                        </span>
                    </h2>
                </div>
            </div>

            {/* Alternating full-bleed rows */}
            {SERVICES.map((service, i) => (
                <ServiceRow key={service.name} service={service} reverse={i % 2 === 1} />
            ))}

            {/* Show All Services */}
            <div ref={showAllRef} className="px-8 py-16 text-center">
                <a href="#all-services" className="group/show inline-flex items-center gap-4">
                    <span className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                        Show All Services
                    </span>
                    <span
                        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 transition-all duration-300 group-hover/show:border-[#72C8F5]/50 group-hover/show:shadow-[0_0_18px_rgba(114,200,245,0.35)]"
                        style={{ color: "#ffffff" }}
                    >
                        <span className="transition-transform duration-300 group-hover/show:translate-x-0.5 group-hover/show:drop-shadow-[0_0_6px_#72C8F5]">
                            <ArrowIcon />
                        </span>
                    </span>
                </a>
            </div>
        </section>
    );
}

