"use client";

import { useEffect } from "react";

/**
 * Mobile reveal safety net.
 *
 * The product-page "visuals" are SVGs whose pieces animate in via per-element
 * framer-motion `whileInView`. On some mobile browsers (iOS Safari + smooth
 * scroll) those IntersectionObservers don't fire, leaving each piece hidden
 * (framer sets `opacity="0"` as an SVG attribute) — so the whole visual is
 * invisible.
 *
 * On small screens we inject a stylesheet that forces SVG drawing elements
 * visible and clears the leftover slide-in transform. Injecting from JS (rather
 * than relying on globals.css cascade ordering) guarantees it wins reliably in
 * both dev and production. We also sweep stuck HTML reveal wrappers as a backup.
 */
const MOBILE_MAX = 767;

export default function RevealFallback() {
    useEffect(() => {
        // 1) Force SVG visuals visible on phones — independent of the observer.
        const style = document.createElement("style");
        style.setAttribute("data-reveal-fallback", "");
        style.textContent = `
@media (max-width: ${MOBILE_MAX}px) {
  svg g, svg path, svg circle, svg line, svg rect,
  svg polyline, svg polygon, svg ellipse, svg text { opacity: 1 !important; }
  svg g[style*="translate"] { transform: none !important; }
}`;
        document.head.appendChild(style);

        // 2) Sweep stuck HTML scroll-reveal wrappers (opacity:0 + translate) that
        //    are already in/above view. Skips carousels/overlays/hover reveals.
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
            style.remove();
        };
    }, []);

    return null;
}
