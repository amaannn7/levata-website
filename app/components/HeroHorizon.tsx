"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SPACING = 1;

function Grid() {
    const ref = useRef<THREE.LineSegments>(null);

    const geo = useMemo(() => {
        const verts: number[] = [];
        for (let z = -30; z <= 6; z += SPACING) {
            verts.push(-20, 0, z, 20, 0, z);
        }
        for (let x = -20; x <= 20; x += SPACING) {
            verts.push(x, 0, -30, x, 0, 6);
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
        return g;
    }, []);

    useFrame((_, delta) => {
        if (!ref.current) return;
        ref.current.position.z = (ref.current.position.z + delta * 1.4) % SPACING;
    });

    return (
        <lineSegments ref={ref} geometry={geo}>
            <lineBasicMaterial color="#4B91F7" transparent opacity={0.35} />
        </lineSegments>
    );
}

function PulseLines() {
    const ref = useRef<THREE.LineSegments>(null);

    const geo = useMemo(() => {
        const verts: number[] = [];
        for (let x = -20; x <= 20; x += SPACING * 4) {
            verts.push(x, 0.001, -30, x, 0.001, 6);
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
        return g;
    }, []);

    useFrame((_, delta) => {
        if (!ref.current) return;
        ref.current.position.z = (ref.current.position.z + delta * 1.4) % SPACING;
    });

    return (
        <lineSegments ref={ref} geometry={geo}>
            <lineBasicMaterial color="#7B55EA" transparent opacity={0.25} />
        </lineSegments>
    );
}

export default function HeroHorizon() {
    return (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 h-[180px] md:h-[220px]">
            <Canvas
                camera={{ position: [0, 0.45, 2], fov: 60 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 1.5]}
                style={{ background: "transparent", width: "100%", height: "100%" }}
                onCreated={({ camera }) => {
                    camera.rotation.x = -0.35;
                }}
            >
                <Suspense fallback={null}>
                    <Grid />
                    <PulseLines />
                </Suspense>
            </Canvas>
            <div
                aria-hidden
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(to top, transparent 0%, #0D0F17 95%), linear-gradient(to right, #0D0F17 0%, transparent 18%, transparent 82%, #0D0F17 100%)",
                }}
            />
        </div>
    );
}
