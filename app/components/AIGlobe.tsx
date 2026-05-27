"use client";

import { useRef, useMemo, useEffect, Suspense, Component, ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

class WebGLErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
    state = { failed: false };
    static getDerivedStateFromError() { return { failed: true }; }
    render() { return this.state.failed ? null : this.props.children; }
}

// ── Particle system: particles morph between abstract shape targets ───────
const PARTICLE_COUNT = 1800;

// Each shape is a function (i, n) -> [x,y,z]. Particle order is consistent
// across shapes so morphing is a clean per-particle lerp.
type ShapeFn = (i: number, n: number) => [number, number, number];

// ─ Precomputed data for shapes that need it ─

// Cube edges — 12 edges of a unit cube (each entry: [x0,y0,z0,x1,y1,z1])
const CUBE_EDGES = (() => {
    const s = 0.5;
    return [
        [-s, -s, -s, +s, -s, -s], [+s, -s, -s, +s, -s, +s],
        [+s, -s, +s, -s, -s, +s], [-s, -s, +s, -s, -s, -s],
        [-s, +s, -s, +s, +s, -s], [+s, +s, -s, +s, +s, +s],
        [+s, +s, +s, -s, +s, +s], [-s, +s, +s, -s, +s, -s],
        [-s, -s, -s, -s, +s, -s], [+s, -s, -s, +s, +s, -s],
        [+s, -s, +s, +s, +s, +s], [-s, -s, +s, -s, +s, +s],
    ];
})();

// Neural cluster — 28 nodes on a sphere shell + nearest-neighbour edges
const NEURAL = (() => {
    const N = 28;
    const nodes: [number, number, number][] = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
        const y = 1 - (i / (N - 1)) * 2;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = phi * i;
        nodes.push([Math.cos(theta) * r * 0.75, y * 0.75, Math.sin(theta) * r * 0.75]);
    }
    const distSq = (a: [number, number, number], b: [number, number, number]) =>
        (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
    const links: [number, number][] = [];
    const seen = new Set<string>();
    for (let i = 0; i < N; i++) {
        const sorted = nodes
            .map((node, j) => [j, distSq(node, nodes[i])] as [number, number])
            .sort((a, b) => a[1] - b[1]);
        for (let k = 1; k < 4; k++) {
            const j = sorted[k][0];
            const key = i < j ? `${i}_${j}` : `${j}_${i}`;
            if (!seen.has(key)) {
                seen.add(key);
                links.push([i, j]);
            }
        }
    }
    return { nodes, links };
})();

// Lorenz attractor trajectory — iterative chaotic curve
const LORENZ = (() => {
    const sigma = 10, rho = 28, beta = 8 / 3, dt = 0.006;
    let x = 0.1, y = 0, z = 0;
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const dx = sigma * (y - x);
        const dy = x * (rho - z) - y;
        const dz = x * y - beta * z;
        x += dx * dt;
        y += dy * dt;
        z += dz * dt;
        arr[i * 3] = x;
        arr[i * 3 + 1] = y;
        arr[i * 3 + 2] = z;
    }
    // Center and normalise to ~unit box
    let cx = 0, cy = 0, cz = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        cx += arr[i * 3]; cy += arr[i * 3 + 1]; cz += arr[i * 3 + 2];
    }
    cx /= PARTICLE_COUNT; cy /= PARTICLE_COUNT; cz /= PARTICLE_COUNT;
    let maxAbs = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        arr[i * 3]     -= cx;
        arr[i * 3 + 1] -= cy;
        arr[i * 3 + 2] -= cz;
        maxAbs = Math.max(maxAbs, Math.abs(arr[i * 3]), Math.abs(arr[i * 3 + 1]), Math.abs(arr[i * 3 + 2]));
    }
    const scale = 0.75 / maxAbs;
    for (let i = 0; i < arr.length; i++) arr[i] *= scale;
    return arr;
})();

const SHAPES: ShapeFn[] = [
    // 0 — Neural-web cluster (particles ride along inter-node connections)
    (i) => {
        const link = NEURAL.links[i % NEURAL.links.length];
        const a = NEURAL.nodes[link[0]];
        const b = NEURAL.nodes[link[1]];
        // ~22% sit on the nodes themselves (looks like web hubs)
        const slot = (i * 0.6180339887) % 1;
        let t: number;
        if (slot < 0.11) t = 0;
        else if (slot < 0.22) t = 1;
        else t = (slot - 0.22) / 0.78;
        return [
            a[0] * (1 - t) + b[0] * t,
            a[1] * (1 - t) + b[1] * t,
            a[2] * (1 - t) + b[2] * t,
        ];
    },
    // 1 — Hollow cube outline (particles distributed along 12 edges)
    (i) => {
        const edge = CUBE_EDGES[i % 12];
        const t = ((i * 0.6180339887) % 1); // quasi-random along edge
        return [
            edge[0] + (edge[3] - edge[0]) * t,
            edge[1] + (edge[4] - edge[1]) * t,
            edge[2] + (edge[5] - edge[2]) * t,
        ];
    },
    // 2 — DNA double helix (two strands + rungs)
    (i, n) => {
        const turns = 4;
        const R = 0.4;
        const H = 1.5; // total height
        const slot = i % 5;
        if (slot < 3) {
            const groupIdx = Math.floor(i / 5);
            const t = groupIdx / Math.max(1, Math.ceil(n / 5) - 1);
            const u = t * Math.PI * 2 * turns;
            const branch = slot === 0 ? 0 : Math.PI;
            return [Math.cos(u + branch) * R, (t - 0.5) * H, Math.sin(u + branch) * R];
        } else {
            const groupIdx = Math.floor(i / 5);
            const t = groupIdx / Math.max(1, Math.ceil(n / 5) - 1);
            const u = t * Math.PI * 2 * turns;
            const rt = slot === 3 ? 0.3 : 0.7;
            const xA = Math.cos(u) * R, zA = Math.sin(u) * R;
            const xB = Math.cos(u + Math.PI) * R, zB = Math.sin(u + Math.PI) * R;
            return [xA * (1 - rt) + xB * rt, (t - 0.5) * H, zA * (1 - rt) + zB * rt];
        }
    },
    // 3 — Lorenz attractor (chaotic butterfly curve, sampled trajectory)
    (i) => [LORENZ[i * 3], LORENZ[i * 3 + 1], LORENZ[i * 3 + 2]],
    // 4 — Galaxy spiral, 3 arms with perpendicular scatter
    (i, n) => {
        const arms = 3;
        const arm = i % arms;
        const tArm = Math.floor(i / arms) / Math.max(1, Math.floor(n / arms) - 1);
        const r = Math.sqrt(tArm) * 0.85;
        const pitch = 4.5;
        const theta = (arm / arms) * Math.PI * 2 + r * pitch;
        const sideways = ((i * 0.31) % 1 - 0.5) * 0.05;
        const yJitter = ((i * 0.71) % 1 - 0.5) * 0.1;
        return [
            Math.cos(theta) * r + Math.cos(theta + Math.PI / 2) * sideways,
            yJitter,
            Math.sin(theta) * r + Math.sin(theta + Math.PI / 2) * sideways,
        ];
    },
];

// Per-particle constant scatter — very subtle so shape silhouettes stay readable
const SCATTER = (() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        arr[i * 3]     = (Math.random() - 0.5) * 0.035;
        arr[i * 3 + 1] = (Math.random() - 0.5) * 0.035;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 0.035;
    }
    return arr;
})();

const HOLD = 3.2;          // seconds steady in a shape
const MORPH = 2.0;         // seconds transitioning
const CYCLE = HOLD + MORPH;

function easeInOut(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function ParticleField({ mouseSmooth }: { mouseSmooth: React.RefObject<{ x: number; y: number }> }) {
    const groupRef = useRef<THREE.Group>(null);

    // Precompute target positions for every shape, once. Bake in per-particle
    // scatter so every shape reads as organic cloud rather than clean primitive.
    const shapeTargets = useMemo(() => {
        return SHAPES.map((fn) => {
            const arr = new Float32Array(PARTICLE_COUNT * 3);
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const [x, y, z] = fn(i, PARTICLE_COUNT);
                arr[i * 3]     = x + SCATTER[i * 3];
                arr[i * 3 + 1] = y + SCATTER[i * 3 + 1];
                arr[i * 3 + 2] = z + SCATTER[i * 3 + 2];
            }
            return arr;
        });
    }, []);

    const { geo, posAttr } = useMemo(() => {
        const g = new THREE.BufferGeometry();
        const pos = new Float32Array(PARTICLE_COUNT * 3);
        pos.set(shapeTargets[0]);
        const posAttr = new THREE.BufferAttribute(pos, 3);
        g.setAttribute("position", posAttr);

        // Per-particle colors: dominant purple with a sprinkle of teal
        const col = new Float32Array(PARTICLE_COUNT * 3);
        const purple = new THREE.Color("#A78BFA");
        const teal = new THREE.Color("#5EEAD4");
        const c = new THREE.Color();
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const k = ((i * 0.137) % 1) < 0.78 ? 0 : 1;
            c.copy(k === 0 ? purple : teal);
            col[i * 3] = c.r;
            col[i * 3 + 1] = c.g;
            col[i * 3 + 2] = c.b;
        }
        g.setAttribute("color", new THREE.BufferAttribute(col, 3));
        return { geo: g, posAttr };
    }, [shapeTargets]);

    // Per-particle phase offsets for organic noise
    const phases = useMemo(() => {
        const arr = new Float32Array(PARTICLE_COUNT);
        for (let i = 0; i < PARTICLE_COUNT; i++) arr[i] = Math.random() * Math.PI * 2;
        return arr;
    }, []);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();

        // Decide which two shapes we're between
        const cyclePos = t % CYCLE;
        const cycleIdx = Math.floor(t / CYCLE);
        const a = cycleIdx % SHAPES.length;
        const b = (cycleIdx + 1) % SHAPES.length;
        const rawMorph = cyclePos < HOLD ? 0 : (cyclePos - HOLD) / MORPH;
        const e = easeInOut(Math.min(1, rawMorph));

        const A = shapeTargets[a];
        const B = shapeTargets[b];
        const arr = posAttr.array as Float32Array;

        // Per-frame: lerp between shape A and shape B, plus very subtle wobble
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const ix = i * 3;
            const ph = phases[i];
            const wob = Math.sin(t * 0.7 + ph) * 0.005;
            const wob2 = Math.sin(t * 0.55 + ph + 1.3) * 0.005;
            arr[ix]     = A[ix]     * (1 - e) + B[ix]     * e + wob;
            arr[ix + 1] = A[ix + 1] * (1 - e) + B[ix + 1] * e + wob2;
            arr[ix + 2] = A[ix + 2] * (1 - e) + B[ix + 2] * e + wob;
        }
        posAttr.needsUpdate = true;

        // Group motion: auto-spin + responsive mouse parallax + idle bob
        const g = groupRef.current;
        if (g) {
            g.rotation.y += 0.0018;
            const m = mouseSmooth.current;
            if (m) {
                const targetTiltX = m.y * 0.55;
                const targetSpinY = m.x * 0.7;
                g.rotation.x += (targetTiltX - g.rotation.x) * 0.09;
                // additive mouse-driven yaw on top of auto-spin
                g.rotation.y += (targetSpinY * 0.01);
                g.position.x += (m.x * 0.22 - g.position.x) * 0.09;
                g.position.y += ((-m.y * 0.15 + Math.sin(t * 0.4) * 0.05) - g.position.y) * 0.09;
            } else {
                g.position.y = Math.sin(t * 0.4) * 0.05;
            }
        }
    });

    return (
        <group ref={groupRef} scale={1.35}>
            <points geometry={geo}>
                <pointsMaterial
                    vertexColors
                    size={0.024}
                    sizeAttenuation
                    transparent
                    opacity={0.95}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </points>
        </group>
    );
}

// ── Rig: tracks mouse with low-pass filter, hands smoothed value down ─────
function Rig() {
    const mouseTarget = useRef({ x: 0, y: 0 });
    const mouseSmooth = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            mouseTarget.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseTarget.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    useFrame(() => {
        mouseSmooth.current.x += (mouseTarget.current.x - mouseSmooth.current.x) * 0.12;
        mouseSmooth.current.y += (mouseTarget.current.y - mouseSmooth.current.y) * 0.12;
    });

    return <ParticleField mouseSmooth={mouseSmooth} />;
}

// ── Scene ─────────────────────────────────────────────────────────────────
function Scene() {
    return (
        <>
            <fog attach="fog" args={["#07080F", 4, 9]} />
            <ambientLight intensity={0.3} />
            <Rig />
        </>
    );
}

// ── AIGlobe, main export ──────────────────────────────────────────────────
export default function AIGlobe() {
    return (
        <WebGLErrorBoundary>
            <Canvas
                camera={{ position: [0, 0, 4.0], fov: 40 }}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                dpr={[1, 1.75]}
                style={{ background: "transparent", width: "100%", height: "100%" }}
            >
                <Suspense fallback={null}>
                    <Scene />
                    <EffectComposer>
                        <Bloom intensity={0.6} luminanceThreshold={0.2} luminanceSmoothing={0.85} mipmapBlur />
                    </EffectComposer>
                </Suspense>
            </Canvas>
        </WebGLErrorBoundary>
    );
}
