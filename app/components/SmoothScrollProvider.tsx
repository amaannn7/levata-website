"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // No smooth scrolling on touch devices (Lenis intercepts touch events and
        // breaks iframes like Calendly) or for people who asked for reduced motion.
        if ("ontouchstart" in window || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        // lerp-based smoothing follows the wheel closely. Scrollable children can
        // opt out with `data-lenis-prevent`.
        const lenis = new Lenis({ lerp: 0.12, autoRaf: true });
        return () => lenis.destroy();
    }, []);

    return <>{children}</>;
}
