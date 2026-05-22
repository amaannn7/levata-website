"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Intent = "default" | "subtle";

// Deterministic seeded RNG so node layout is identical across SSR / client / re-renders.
function mulberry32(seed: number) {
    return function () {
        seed |= 0;
        seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const VIEW_W = 1000;
const VIEW_H = 500;
const NODE_COUNT = 26;
const LINK_DISTANCE = 230;

type Node = { x: number; y: number; delay: number };

function buildLayout(): { nodes: Node[]; edges: [number, number][] } {
    const rand = mulberry32(42);
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
        x: rand() * VIEW_W,
        y: rand() * VIEW_H,
        delay: rand() * 3,
    }));

    const edges: [number, number][] = [];
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            if (Math.hypot(dx, dy) < LINK_DISTANCE) {
                edges.push([i, j]);
            }
        }
    }
    return { nodes, edges };
}

export default function CTAAurora({ intent = "default" }: { intent?: Intent }) {
    const prefersReducedMotion = useReducedMotion();
    const { nodes, edges } = useMemo(buildLayout, []);
    const opacityScale = intent === "subtle" ? 0.55 : 1;

    return (
        <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden"
            style={{ opacity: opacityScale }}
        >
            <svg
                className="h-full w-full"
                viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                preserveAspectRatio="xMidYMid slice"
                fill="none"
            >
                {edges.map(([a, b], i) => (
                    <line
                        key={`e-${i}`}
                        x1={nodes[a].x}
                        y1={nodes[a].y}
                        x2={nodes[b].x}
                        y2={nodes[b].y}
                        stroke="rgba(255,255,255,0.035)"
                        strokeWidth={1}
                    />
                ))}

                {nodes.map((n, i) => {
                    if (prefersReducedMotion) {
                        return (
                            <circle
                                key={`n-${i}`}
                                cx={n.x}
                                cy={n.y}
                                r={2}
                                fill="rgba(255,255,255,0.35)"
                            />
                        );
                    }
                    return (
                        <motion.circle
                            key={`n-${i}`}
                            cx={n.x}
                            cy={n.y}
                            initial={{ r: 1.8, opacity: 0.22 }}
                            animate={{ r: [1.8, 2.6, 1.8], opacity: [0.22, 0.5, 0.22] }}
                            transition={{
                                duration: 3.6,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: n.delay,
                            }}
                            fill="rgba(255,255,255,0.5)"
                        />
                    );
                })}
            </svg>
        </div>
    );
}
