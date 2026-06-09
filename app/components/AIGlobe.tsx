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

// Neural cluster — 48 nodes on a sphere shell + nearest-neighbour edges
// More nodes = more links = full sphere coverage with no gaps
const NEURAL = (() => {
    const N = 48;
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
        // Connect each node to its 5 nearest neighbours for denser coverage
        for (let k = 1; k <= 5; k++) {
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
    // 1 — Icosahedron (20 faces, 30 edges, 12 vertices)
    (i) => {
        const phi = (1 + Math.sqrt(5)) / 2; // golden ratio
        // 12 icosahedron vertices
        const verts: [number,number,number][] = [
            [0, 1, phi],[0,-1, phi],[0, 1,-phi],[0,-1,-phi],
            [1, phi, 0],[-1, phi, 0],[1,-phi, 0],[-1,-phi, 0],
            [phi, 0, 1],[-phi, 0, 1],[phi, 0,-1],[-phi, 0,-1],
        ].map(([x,y,z]) => {
            const len = Math.sqrt(x*x+y*y+z*z);
            return [x/len*0.82, y/len*0.82, z/len*0.82];
        });
        // 30 edges of the icosahedron
        const edges: [number,number][] = [
            [0,1],[0,4],[0,5],[0,8],[0,9],
            [1,6],[1,7],[1,8],[1,9],
            [2,3],[2,4],[2,5],[2,10],[2,11],
            [3,6],[3,7],[3,10],[3,11],
            [4,5],[4,8],[4,10],
            [5,9],[5,11],
            [6,7],[6,8],[6,10],
            [7,9],[7,11],
            [8,10],[9,11],
        ];
        // Distribute evenly: fill each edge with PARTICLE_COUNT/30 particles
        // so consecutive particles stay on the same edge
        const perEdge = Math.ceil(PARTICLE_COUNT / 30);
        const edgeIdx = Math.floor(i / perEdge) % 30;
        const posInEdge = (i % perEdge) / Math.max(1, perEdge - 1);
        const edge = edges[edgeIdx];
        const a = verts[edge[0]], b = verts[edge[1]];
        return [a[0]*(1-posInEdge)+b[0]*posInEdge, a[1]*(1-posInEdge)+b[1]*posInEdge, a[2]*(1-posInEdge)+b[2]*posInEdge];
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
    // 3 — Twisted torus knot, tilted 50° so its 3D structure is clearly visible
    (i, n) => {
        const p = 2, q = 5;
        const t = (i / n) * Math.PI * 2;
        const R = 0.58, r = 0.18;
        const cx = (R + r * Math.cos(q * t)) * Math.cos(p * t);
        const cy = r * Math.sin(q * t);
        const cz = (R + r * Math.cos(q * t)) * Math.sin(p * t);
        const ang = (i * 7.31) % (Math.PI * 2);
        const jitter = 0.04;
        const x = cx + Math.cos(ang) * jitter;
        const y = cy + Math.sin(ang) * jitter * 0.6;
        const z = cz + Math.sin(ang) * jitter;
        // Tilt 50° around X axis
        const tilt = 0.88;
        const cT = Math.cos(tilt), sT = Math.sin(tilt);
        return [x, y * cT - z * sT, y * sT + z * cT];
    },
    // 4 — Seashell / Nautilus spiral (conical helix expanding outward)
    (i, n) => {
        const f = i / n;                 // 0 → 1 along the curve
        const turns = 3;
        const t = f * Math.PI * 2 * turns;
        const maxR = 0.85;               // outermost radius
        const r = maxR * f;              // radius grows linearly to maxR
        const H = 0.8;                   // total height

        const x = r * Math.cos(t);
        const z = r * Math.sin(t);
        const y = f * H - H / 2;         // rise from bottom to top

        // Tilt 30° so the spiral face is visible
        const tilt = 0.5;
        const cT = Math.cos(tilt), sT = Math.sin(tilt);
        return [x, y * cT - z * sT, y * sT + z * cT];
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

const MAX_LINES = 2500;
const MAX_PER_PARTICLE = 3;
const SAMPLE_STEP = 3;
const SHAPE_DIST = [0.22, 0.22, 0.22, 0.22, 0.22];

function ParticleField({ mouseSmooth }: { mouseSmooth: React.RefObject<{ x: number; y: number }> }) {
    const groupRef = useRef<THREE.Group>(null);

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

        const col = new Float32Array(PARTICLE_COUNT * 3);
        const purple = new THREE.Color("#A78BFA");
        const teal = new THREE.Color("#5EEAD4");
        const c = new THREE.Color();
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const k = ((i * 0.137) % 1) < 0.78 ? 0 : 1;
            c.copy(k === 0 ? purple : teal);
            col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
        }
        g.setAttribute("color", new THREE.BufferAttribute(col, 3));
        return { geo: g, posAttr };
    }, [shapeTargets]);

    // Line geometry — pre-allocate max capacity, draw range updated each frame
    const { lineGeo, linePosAttr, lineColAttr } = useMemo(() => {
        const lineGeo = new THREE.BufferGeometry();
        const linePosAttr = new THREE.BufferAttribute(new Float32Array(2500 * 6), 3);
        const lineColAttr = new THREE.BufferAttribute(new Float32Array(2500 * 6), 3);
        linePosAttr.setUsage(THREE.DynamicDrawUsage);
        lineColAttr.setUsage(THREE.DynamicDrawUsage);
        lineGeo.setAttribute("position", linePosAttr);
        lineGeo.setAttribute("color", lineColAttr);
        lineGeo.setDrawRange(0, 0);
        return { lineGeo, linePosAttr, lineColAttr };
    }, []);

    const phases = useMemo(() => {
        const arr = new Float32Array(PARTICLE_COUNT);
        for (let i = 0; i < PARTICLE_COUNT; i++) arr[i] = Math.random() * Math.PI * 2;
        return arr;
    }, []);

    const purple = useMemo(() => new THREE.Color("#A78BFA"), []);
    const teal   = useMemo(() => new THREE.Color("#5EEAD4"), []);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();

        const cyclePos = t % CYCLE;
        const cycleIdx = Math.floor(t / CYCLE);
        const a = cycleIdx % SHAPES.length;
        const b = (cycleIdx + 1) % SHAPES.length;
        const rawMorph = cyclePos < HOLD ? 0 : (cyclePos - HOLD) / MORPH;
        const e = easeInOut(Math.min(1, rawMorph));

        const A = shapeTargets[a];
        const B = shapeTargets[b];
        const arr = posAttr.array as Float32Array;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const ix = i * 3;
            const ph = phases[i];
            const wob  = Math.sin(t * 0.7  + ph) * 0.005;
            const wob2 = Math.sin(t * 0.55 + ph + 1.3) * 0.005;
            arr[ix]     = A[ix]     * (1 - e) + B[ix]     * e + wob;
            arr[ix + 1] = A[ix + 1] * (1 - e) + B[ix + 1] * e + wob2;
            arr[ix + 2] = A[ix + 2] * (1 - e) + B[ix + 2] * e + wob;
        }
        posAttr.needsUpdate = true;

        // ── Build connection lines ────────────────────────────────────────────
        // Use the active shape's distance threshold so all shapes get lines
        const connectDist = SHAPE_DIST[a] * (1 - e) + SHAPE_DIST[b] * e;
        const connectDistSq = connectDist * connectDist;

        const lp = linePosAttr.array as Float32Array;
        const lc = lineColAttr.array as Float32Array;
        let lineCount = 0;

        const sampled = PARTICLE_COUNT / SAMPLE_STEP | 0;
        const connPerParticle = new Uint8Array(sampled);

        outer: for (let si = 0; si < sampled; si++) {
            if (connPerParticle[si] >= MAX_PER_PARTICLE) continue;
            const i = si * SAMPLE_STEP;
            const ix = i * 3;
            const ax = arr[ix], ay = arr[ix + 1], az = arr[ix + 2];
            const ci = ((i * 0.137) % 1) < 0.78 ? purple : teal;

            for (let sj = si + 1; sj < sampled; sj++) {
                if (connPerParticle[sj] >= MAX_PER_PARTICLE) continue;
                const j = sj * SAMPLE_STEP;
                const jx = j * 3;
                const dx = ax - arr[jx];
                const dy = ay - arr[jx + 1];
                const dz = az - arr[jx + 2];
                const dSq = dx * dx + dy * dy + dz * dz;

                if (dSq < connectDistSq) {
                    const alpha = (1 - dSq / connectDistSq) * 0.18;
                    const cj = ((j * 0.137) % 1) < 0.78 ? purple : teal;

                    const base = lineCount * 6;
                    lp[base]     = ax;           lp[base + 1] = ay;           lp[base + 2] = az;
                    lc[base]     = ci.r * alpha; lc[base + 1] = ci.g * alpha; lc[base + 2] = ci.b * alpha;
                    lp[base + 3] = arr[jx];      lp[base + 4] = arr[jx + 1]; lp[base + 5] = arr[jx + 2];
                    lc[base + 3] = cj.r * alpha; lc[base + 4] = cj.g * alpha; lc[base + 5] = cj.b * alpha;

                    connPerParticle[si]++;
                    connPerParticle[sj]++;
                    lineCount++;
                    if (lineCount >= MAX_LINES) break outer;
                }
            }
        }

        linePosAttr.needsUpdate = true;
        lineColAttr.needsUpdate = true;
        lineGeo.setDrawRange(0, lineCount * 2);

        // Group motion
        const g = groupRef.current;
        if (g) {
            g.rotation.y += 0.0018;
            const m = mouseSmooth.current;
            if (m) {
                g.rotation.x += (m.y * 0.55 - g.rotation.x) * 0.09;
                g.rotation.y += m.x * 0.01;
                g.position.x += (m.x * 0.22 - g.position.x) * 0.09;
                g.position.y += ((-m.y * 0.15 + Math.sin(t * 0.4) * 0.05) - g.position.y) * 0.09;
            } else {
                g.position.y = Math.sin(t * 0.4) * 0.05;
            }
        }
    });

    return (
        <group ref={groupRef} scale={1.35}>
            {/* Particles */}
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
            {/* Connection lines */}
            <lineSegments geometry={lineGeo}>
                <lineBasicMaterial
                    vertexColors
                    transparent
                    opacity={1}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </lineSegments>
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
    return <Rig />;
}

// ── AIGlobe, main export ──────────────────────────────────────────────────
export default function AIGlobe() {
    return (
        <WebGLErrorBoundary>
            <Canvas
                camera={{ position: [0, 0, 4.0], fov: 40 }}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                dpr={[1, 1.75]}
                style={{ background: "transparent", width: "100%", height: "100%", pointerEvents: "none" }}
            >
                <Suspense fallback={null}>
                    <Scene />
                    <EffectComposer>
                        <Bloom mipmapBlur intensity={0.4} luminanceThreshold={0.2} luminanceSmoothing={0.9} radius={0.7} />
                    </EffectComposer>
                </Suspense>
            </Canvas>
        </WebGLErrorBoundary>
    );
}
