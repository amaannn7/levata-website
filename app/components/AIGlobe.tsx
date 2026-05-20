"use client";

import { useRef, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// ── Fibonacci sphere — even node distribution ──────────────────────────────
function fibSphere(n: number): THREE.Vector3[] {
    const pts: THREE.Vector3[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
        const y = 1 - (i / (n - 1)) * 2;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = phi * i;
        pts.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r));
    }
    return pts;
}

const NODE_POSITIONS = fibSphere(80);

function greatCircleArc(a: THREE.Vector3, b: THREE.Vector3, steps = 24): THREE.Vector3[] {
    return Array.from({ length: steps + 1 }, (_, i) =>
        new THREE.Vector3().lerpVectors(a, b, i / steps).normalize()
    );
}

const STREAM_DATA = (() => {
    const rng = () => Math.floor(Math.random() * 80);
    return Array.from({ length: 8 }, (_, i) => {
        let a = rng();
        let b = rng();
        for (let k = 0; k < 50; k++) {
            if (NODE_POSITIONS[a].angleTo(NODE_POSITIONS[b]) >= 1.2) break;
            b = rng();
        }
        return {
            arc: greatCircleArc(NODE_POSITIONS[a], NODE_POSITIONS[b], 24),
            speed: 0.07 + Math.random() * 0.11,
            offset: Math.random(),
            color: i % 2 === 0 ? "#4B91F7" : "#7B55EA",
        };
    });
})();

const NODE_COLORS = ["#4B91F7", "#4B91F7", "#4B91F7", "#4B91F7", "#4B91F7",
    "#4B91F7", "#4B91F7", "#7B55EA", "#7B55EA", "#7B55EA"] as const;

// ── GlobeGrid — lat/long digital-earth grid lines (progressive reveal) ────
const GRID_SEG = 96;
const GRID_LAT_COUNT = 5;
const GRID_LNG_COUNT = 8;
const GRID_LINE_COUNT = GRID_LAT_COUNT + GRID_LNG_COUNT;
const GRID_TOTAL_SEGMENTS = GRID_LINE_COUNT * GRID_SEG;
const GRID_REVEAL_PER_LINE = 0.55;
const GRID_REVEAL_DELAY = 0.3;

function GlobeGrid() {
    const ref = useRef<THREE.LineSegments>(null);

    const geo = useMemo(() => {
        const verts: number[] = [];

        for (let latDeg = -60; latDeg <= 60; latDeg += 30) {
            const y = Math.sin((latDeg * Math.PI) / 180);
            const r = Math.cos((latDeg * Math.PI) / 180);
            for (let i = 0; i < GRID_SEG; i++) {
                const t0 = (i / GRID_SEG) * Math.PI * 2;
                const t1 = ((i + 1) / GRID_SEG) * Math.PI * 2;
                verts.push(Math.cos(t0) * r, y, Math.sin(t0) * r);
                verts.push(Math.cos(t1) * r, y, Math.sin(t1) * r);
            }
        }

        for (let lngDeg = 0; lngDeg < 360; lngDeg += 45) {
            const lng = (lngDeg * Math.PI) / 180;
            for (let i = 0; i < GRID_SEG; i++) {
                const phi0 = (i / GRID_SEG) * Math.PI * 2;
                const phi1 = ((i + 1) / GRID_SEG) * Math.PI * 2;
                verts.push(
                    Math.sin(phi0) * Math.cos(lng), Math.cos(phi0), Math.sin(phi0) * Math.sin(lng),
                    Math.sin(phi1) * Math.cos(lng), Math.cos(phi1), Math.sin(phi1) * Math.sin(lng),
                );
            }
        }

        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
        g.setDrawRange(0, 0);
        return g;
    }, []);

    useFrame(({ clock }) => {
        if (!ref.current) return;
        const t = clock.getElapsedTime() - GRID_REVEAL_DELAY;
        if (t < 0) {
            ref.current.geometry.setDrawRange(0, 0);
            return;
        }
        const linesRevealed = t / GRID_REVEAL_PER_LINE;
        const segmentsRevealed = Math.min(
            GRID_TOTAL_SEGMENTS,
            Math.floor(linesRevealed * GRID_SEG)
        );
        ref.current.geometry.setDrawRange(0, segmentsRevealed * 2);
    });

    return (
        <lineSegments ref={ref} geometry={geo} scale={1.003}>
            <lineBasicMaterial color="#4B91F7" transparent opacity={0.28} />
        </lineSegments>
    );
}

// ── EnergyCore — pulsing AI processing core ───────────────────────────────
function EnergyCore() {
    const innerRef = useRef<THREE.Mesh>(null);
    const outerRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        const pulse = 1 + Math.sin(t * 2.6) * 0.22;
        if (innerRef.current) innerRef.current.scale.setScalar(pulse);
        if (outerRef.current) {
            outerRef.current.scale.setScalar(1 + Math.sin(t * 2.6 + 0.8) * 0.35);
            const mat = outerRef.current.material as THREE.MeshBasicMaterial;
            mat.opacity = 0.12 + Math.sin(t * 2.6 + 0.8) * 0.07;
        }
    });

    return (
        <group>
            {/* Outer glow ring */}
            <mesh ref={outerRef}>
                <sphereGeometry args={[0.18, 16, 16]} />
                <meshBasicMaterial color="#00D4FF" transparent opacity={0.15} />
            </mesh>
            {/* Bright inner core */}
            <mesh ref={innerRef}>
                <sphereGeometry args={[0.06, 12, 12]} />
                <meshBasicMaterial color="#00D4FF" transparent opacity={0.95} />
            </mesh>
        </group>
    );
}

// ── NeuralNodes — 80 instanced pulsing nodes ──────────────────────────────
function NeuralNodes() {
    const geo = useMemo(() => new THREE.SphereGeometry(0.014, 6, 6), []);
    const mat = useMemo(() => new THREE.MeshBasicMaterial({ vertexColors: true }), []);
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const tempColor = useMemo(() => new THREE.Color(), []);
    const phases = useMemo(
        () => Float32Array.from({ length: 80 }, () => Math.random() * Math.PI * 2),
        []
    );

    useEffect(() => {
        const mesh = meshRef.current;
        if (!mesh) return;
        NODE_POSITIONS.forEach((pos, i) => {
            dummy.position.copy(pos);
            dummy.scale.setScalar(1);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
            tempColor.set(NODE_COLORS[i % NODE_COLORS.length]);
            mesh.setColorAt(i, tempColor);
        });
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }, [dummy, tempColor]);

    useFrame(({ clock }) => {
        const mesh = meshRef.current;
        if (!mesh) return;
        const t = clock.getElapsedTime();
        NODE_POSITIONS.forEach((pos, i) => {
            dummy.position.copy(pos);
            dummy.scale.setScalar(0.7 + Math.sin(t * 1.4 + phases[i]) * 0.3);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
        });
        mesh.instanceMatrix.needsUpdate = true;
    });

    return <instancedMesh ref={meshRef} args={[geo, mat, 80]} />;
}

// ── ConnectionLines — single LineSegments buffer ──────────────────────────
function ConnectionLines() {
    const geo = useMemo(() => {
        const verts: number[] = [];
        for (let i = 0; i < NODE_POSITIONS.length; i++) {
            for (let j = i + 1; j < NODE_POSITIONS.length; j++) {
                if (NODE_POSITIONS[i].angleTo(NODE_POSITIONS[j]) < 0.55) {
                    const a = NODE_POSITIONS[i], b = NODE_POSITIONS[j];
                    verts.push(a.x, a.y, a.z, b.x, b.y, b.z);
                }
            }
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
        return g;
    }, []);

    return (
        <lineSegments geometry={geo}>
            <lineBasicMaterial color="#4B91F7" transparent opacity={0.16} />
        </lineSegments>
    );
}

// ── DataStreams — 8 animated glowing packets ──────────────────────────────
function DataStreams() {
    const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        STREAM_DATA.forEach((s, i) => {
            const mesh = meshRefs.current[i];
            if (!mesh) return;
            const frac = ((t * s.speed + s.offset) % 1 + 1) % 1;
            const idx = Math.min(Math.floor(frac * s.arc.length), s.arc.length - 1);
            const p = s.arc[idx];
            mesh.position.set(p.x, p.y, p.z);
        });
    });

    return (
        <>
            {STREAM_DATA.map((s, i) => (
                <mesh key={i} ref={(el) => { meshRefs.current[i] = el; }}>
                    <sphereGeometry args={[0.02, 8, 8]} />
                    <meshBasicMaterial color={s.color} />
                </mesh>
            ))}
        </>
    );
}

// ── OrbitalRings — 3 rings, each carrying a wireframe satellite ───────────
const RING_CONFIGS = [
    { tilt: [1.2, 0, 0] as const, radius: 1.42, tube: 0.006, color: "#4B91F7", opacity: 0.6, spin: 0.003 },
    { tilt: [0.5, 0.6, Math.PI / 3] as const, radius: 1.58, tube: 0.005, color: "#7B55EA", opacity: 0.45, spin: -0.0022 },
    { tilt: [-0.4, -0.8, -Math.PI / 4] as const, radius: 1.68, tube: 0.0045, color: "#4B91F7", opacity: 0.3, spin: 0.0014 },
] as const;

function OrbitalRings() {
    const groupRefs = useRef<(THREE.Group | null)[]>([]);
    const satRefs = useRef<(THREE.Mesh | null)[]>([]);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        RING_CONFIGS.forEach((cfg, i) => {
            const g = groupRefs.current[i];
            if (g) g.rotation.z += cfg.spin;
            const sat = satRefs.current[i];
            if (sat) {
                sat.rotation.x = t * 1.4;
                sat.rotation.y = t * 1.2;
            }
        });
    });

    return (
        <>
            {RING_CONFIGS.map((cfg, i) => (
                <group
                    key={i}
                    ref={(el) => { groupRefs.current[i] = el; }}
                    rotation={cfg.tilt}
                >
                    {/* Ring torus — lies in local XY plane */}
                    <mesh>
                        <torusGeometry args={[cfg.radius, cfg.tube, 12, 160]} />
                        <meshBasicMaterial color={cfg.color} transparent opacity={cfg.opacity} />
                    </mesh>
                    {/* Satellite — sits on the ring at local +X, rides with the ring's Z spin */}
                    <mesh
                        ref={(el) => { satRefs.current[i] = el; }}
                        position={[cfg.radius, 0, 0]}
                    >
                        <octahedronGeometry args={[0.05, 0]} />
                        <meshBasicMaterial color={cfg.color} wireframe transparent opacity={0.9} />
                    </mesh>
                </group>
            ))}
        </>
    );
}

// ── Starfield — distant constellation backdrop (back hemisphere only) ─────
function Starfield() {
    const geo = useMemo(() => {
        const N = 140;
        const arr = new Float32Array(N * 3);
        for (let i = 0; i < N; i++) {
            const r = 8 + Math.random() * 5;
            const theta = Math.random() * Math.PI * 2;
            const cosPhi = 0.2 + Math.random() * 0.8;
            const sinPhi = Math.sqrt(1 - cosPhi * cosPhi);
            arr[i * 3] = r * sinPhi * Math.cos(theta);
            arr[i * 3 + 1] = r * sinPhi * Math.sin(theta);
            arr[i * 3 + 2] = -r * cosPhi;
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
        return g;
    }, []);

    return (
        <points geometry={geo}>
            <pointsMaterial color="#A8C5FF" size={0.04} transparent opacity={0.45} sizeAttenuation />
        </points>
    );
}

// ── GlobeScene — master group: auto-spin + mouse parallax ─────────────────
function GlobeScene() {
    const groupRef = useRef<THREE.Group>(null);
    const mouse = useRef({ x: 0, y: 0 });
    const autoY = useRef(0);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
            mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    useFrame(() => {
        if (!groupRef.current) return;
        autoY.current += 0.0012;
        const targetY = autoY.current + mouse.current.x * 0.6;
        const targetX = mouse.current.y * 0.22;
        groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.06;
        groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.06;
    });

    return (
        <>
            <ambientLight intensity={0.08} />
            <pointLight position={[3, 3, 3]} intensity={3} color="#4B91F7" />
            <pointLight position={[-3, -2, 2]} intensity={1.5} color="#7B55EA" />
            <Starfield />
            <group ref={groupRef}>
                <GlobeGrid />
                <EnergyCore />
                <NeuralNodes />
                <ConnectionLines />
                <DataStreams />
            </group>
            <OrbitalRings />
        </>
    );
}

// ── AIGlobe — main export ──────────────────────────────────────────────────
export default function AIGlobe() {
    return (
        <Canvas
            camera={{ position: [0, 0, 5.0], fov: 42 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 1.5]}
            style={{ background: "transparent", width: "100%", height: "100%" }}
        >
            <Suspense fallback={null}>
                <GlobeScene />
            </Suspense>
            <EffectComposer>
                <Bloom intensity={1.1} luminanceThreshold={0.3} luminanceSmoothing={0.9} mipmapBlur />
            </EffectComposer>
        </Canvas>
    );
}
