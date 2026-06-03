"use client";

import { useEffect } from "react";

/**
 * Reveal safety net for HTML scroll-in wrappers.
 *
 * Most reveals use framer-motion `whileInView` with an `initial` opacity of 0.
 * On some mobile browsers the IntersectionObserver can fail to fire, leaving an
 * element stuck invisible. This sweeps the DOM shortly after load and on scroll
 * and force-reveals stuck HTML wrappers. (SVG visuals handle their own reveal
 * via a parent-level `useReveal` with a timed fallback.)
 */
export default function RevealFallback() {
    useEffect(() => {
        // Sweep stuck HTML scroll-reveal wrappers (opacity:0 + translate) that
        // are already in/above view. Skips carousels/overlays/hover reveals.
        // (SVG visuals reveal via their own parent-driven useReveal fallback.)
        let stopped = false;
        const sweep = () => {
            if (stopped) return;
            const vh = window.innerHeight;
            document.querySelectorAll<HTMLElement>('[style*="opacity: 0"]').forEach((el) => {
                const st = el.getAttribute("style") || "";
                if (!/translate/.test(st)) return;
                if (el.getAttribute("aria-hidden") === "true") return;
                if (/pointer-events:\s*none/.test(st)) return;
                const pos = getComputedStyle(el).position;
                if (pos === "absolute" || pos === "fixed") return;
                const r = el.getBoundingClientRect();
                if (r.height > 0 && r.top < vh) {
                    el.style.opacity = "1";
                    if (/translate|matrix/.test(el.style.transform)) el.style.transform = "none";
                }
            });
        };
        const t = setTimeout(sweep, 700);
        const onScroll = () => sweep();
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            stopped = true;
            clearTimeout(t);
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    return null;
}
