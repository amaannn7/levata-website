"use client";

import Image from "next/image";

type Intent = "default" | "subtle";
type Variant = 1 | 2 | 3;

// Soft image backdrop for CTA sections.
// One image per section, with a radial vignette so it fades into the page bg.
// No animation, no node lines -- just a calm photographic atmosphere at low opacity.
export default function CTAAurora({
    intent = "default",
    variant = 1,
}: {
    intent?: Intent;
    variant?: Variant;
}) {
    const opacity = intent === "subtle" ? 0.1 : 0.18;

    return (
        <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden"
        >
            {/* Background photo */}
            <Image
                src={`/clients/CTA-${variant}.jpeg`}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
                style={{ opacity }}
                priority={false}
            />

            {/* Soft dark vignette -- fades the image into the page background at the edges */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 0%, rgba(7,8,15,0.55) 60%, rgba(7,8,15,0.92) 100%)",
                }}
            />

            {/* Faint purple-to-cyan tint on top for brand cohesion */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(135deg, rgba(123,85,234,0.08) 0%, transparent 50%, rgba(34,211,238,0.06) 100%)",
                }}
            />
        </div>
    );
}
