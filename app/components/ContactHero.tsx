"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const HeroHorizon = dynamic(() => import("@/app/components/HeroHorizon"), { ssr: false });

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ContactHero() {
    return (
        <section
            data-hero
            className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-20 pt-28 text-center sm:px-6 md:min-h-0 md:pb-[100px] md:pt-[150px]"
        >
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6"
            >
                <h1 className="display-hero-title max-w-3xl text-center">
                    <span className="display-muted-line">Build the intelligence layer</span>
                    <span className="display-strong-line">your business deserves.</span>
                </h1>
                <p className="max-w-2xl text-lead text-white/55">
                    Tell us about your business, operations, and goals. We&apos;ll assess where smarter systems,
                    automation, and AI can unlock greater efficiency, visibility, and growth.
                </p>
            </motion.div>
            <HeroHorizon intensity="strong" />
        </section>
    );
}
