"use client";

import { useEffect } from "react";

/**
 * Safety net for scroll-reveal animations on phones.
 *
 * Most reveals use framer-motion `whileInView` with an `initial` opacity of 0.
 * On some mobile browsers (notably iOS Safari combined with smooth scroll) the
 * underlying IntersectionObserver can fail to fire, leaving an element stuck at
 * `opacity: 0` — i.e. invisible. This sweeps the DOM a short time after load and
 * again on scroll, and force-reveals anything framer-motion has left hidden.
 *
 * It only touches elements that are STILL at near-zero opacity via an inline
 * style (framer-motion's signature for an untriggered reveal). Elements that
 * have already animated in are left untouched, so working animations are
 * unaffected.
 */
export default function RevealFallback() {
    useEffect(() => {
        let stopped = false;

        const reveal = (el: HTMLElement) => {
            // Skip things intentionally kept hidden (aria-hidden dec/overlays handled elsewhere)
            el.style.opacity = "1";
            // Clear any lingering translate so it doesn't sit shifted off-position
            const tf = el.style.transform;
            if (tf && /translate|matrix/.test(tf)) {
                el.style.transform = "none";
            }
        };

        const sweep = () => {
            if (stopped) return;
            const vh = window.innerHeight;
            document.querySelectorAll<HTMLElement>('[style*="opacity: 0"]').forEach((el) => {
                // A scroll-reveal wrapper translates in (opacity:0 + translate). Skip elements
                // that are intentionally/persistently hidden so we don't break carousels,
                // AnimatePresence exits, decorative overlays, or hover-only reveals.
                const style = el.getAttribute("style") || "";
                if (!/translate/.test(style)) return;            // not a slide-in reveal
                if (el.getAttribute("aria-hidden") === "true") return;
                if (/pointer-events:\s*none/.test(style)) return;
                const pos = getComputedStyle(el).position;
                if (pos === "absolute" || pos === "fixed") return; // stacked/overlay element

                const r = el.getBoundingClientRect();
                // Only reveal if it has real size and is at/above the current scroll position
                // (i.e. it should have been revealed already). Leaves far-below content alone
                // so its real animation can still play when scrolled to.
                if (r.height > 0 && r.top < vh) reveal(el);
            });
        };

        // First sweep after reveals would normally have fired.
        const t = setTimeout(sweep, 700);
        // And on scroll, so anything missed as the user moves down gets caught.
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
