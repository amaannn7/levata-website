"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// - Theme colors -
const ACCENT   = "#7B55EA";  // purple
const ACCENT2  = "#00FFDD";  // cyan
const GLOW     = "#CC01FF";  // magenta glow

// - Single animated cube -
function Cube({
    position,
    scale,
    delay,
    color,
}: {
    position: [number, number, number];
    scale: number;
    delay: number;
    color: string;
}) {
    const meshRef = useRef<THREE.Mesh>(null);
    const edgesRef = useRef<THREE.LineSegments>(null);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() + delay;
        if (meshRef.current) {
            meshRef.current.position.y = position[1] + Math.sin(t * 0.6) * 0.18;
            meshRef.current.rotation.y = t * 0.15;
        }
        if (edgesRef.current) {
            edgesRef.current.position.y = position[1] + Math.sin(t * 0.6) * 0.18;
            edgesRef.current.rotation.y = t * 0.15;
        }
    });

    const geo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
    const edgesGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)), []);

    return (
        <group>
            {/* Solid dark fill */}
            <mesh ref={meshRef} position={position} scale={scale} geometry={geo}>
                <meshStandardMaterial
                    color="#0a0a14"
                    transparent
                    opacity={0.85}
                    roughness={0.1}
                    metalness={0.9}
                />
            </mesh>
            {/* Glowing edges */}
            <lineSegments ref={edgesRef} position={position} scale={scale * 1.001} geometry={edgesGeo}>
                <lineBasicMaterial color={color} transparent opacity={0.9} />
            </lineSegments>
        </group>
    );
}

// - Grid of dots on the floor -
function GridDots() {
    const count = 24;
    const spacing = 1.4;
    const dots = useMemo(() => {
        const arr = [];
        for (let x = -count / 2; x < count / 2; x++) {
            for (let z = -count / 2; z < count / 2; z++) {
                arr.push([x * spacing, -1.5, z * spacing] as [number, number, number]);
            }
        }
        return arr;
    }, []);

    const geoRef = useMemo(() => {
        const positions = new Float32Array(dots.length * 3);
        dots.forEach(([x, y, z], i) => {
            positions[i * 3]     = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        });
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        return geo;
    }, [dots]);

    return (
        <points geometry={geoRef}>
            <pointsMaterial
                color={ACCENT}
                size={0.04}
                transparent
                opacity={0.35}
                sizeAttenuation
            />
        </points>
    );
}

// - Floating particles -
function Particles() {
    const count = 120;
    const ref = useRef<THREE.Points>(null);

    const [positions, colors] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        const c1 = new THREE.Color(ACCENT);
        const c2 = new THREE.Color(ACCENT2);
        for (let i = 0; i < count; i++) {
            pos[i * 3]     = (Math.random() - 0.5) * 14;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 14;
            const c = Math.random() > 0.5 ? c1 : c2;
            col[i * 3]     = c.r;
            col[i * 3 + 1] = c.g;
            col[i * 3 + 2] = c.b;
        }
        return [pos, col];
    }, []);

    const geo = useMemo(() => {
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        return g;
    }, [positions, colors]);

    useFrame(({ clock }) => {
        if (!ref.current) return;
        ref.current.rotation.y = clock.getElapsedTime() * 0.04;
    });

    return (
        <points ref={ref} geometry={geo}>
            <pointsMaterial size={0.06} vertexColors transparent opacity={0.6} sizeAttenuation />
        </points>
    );
}

// - Platform base -
function Platform() {
    return (
        <group position={[0, -1.5, 0]}>
            {/* Thin flat base */}
            <mesh>
                <boxGeometry args={[6, 0.05, 6]} />
                <meshStandardMaterial color="#0d0d1a" transparent opacity={0.6} roughness={0.2} metalness={0.8} />
            </mesh>
            {/* Edge glow lines */}
            <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(6, 0.05, 6)]} />
                <lineBasicMaterial color={ACCENT} transparent opacity={0.3} />
            </lineSegments>
        </group>
    );
}

// - Point light that orbits -
function OrbitLight() {
    const ref = useRef<THREE.PointLight>(null);
    useFrame(({ clock }) => {
        if (!ref.current) return;
        const t = clock.getElapsedTime();
        ref.current.position.x = Math.sin(t * 0.4) * 5;
        ref.current.position.z = Math.cos(t * 0.4) * 5;
    });
    return <pointLight ref={ref} color={GLOW} intensity={18} distance={12} decay={2} position={[4, 2, 4]} />;
}

// - Scene composition -
function Scene() {
    const cubes = useMemo(() => [
        { position: [-0.6,  0,    0.3 ] as [number,number,number], scale: 1.1,  delay: 0,   color: ACCENT  },
        { position: [ 0.8,  0.3, -0.2 ] as [number,number,number], scale: 0.85, delay: 1.2, color: GLOW    },
        { position: [ 0,    0.6,  0.8 ] as [number,number,number], scale: 0.7,  delay: 2.1, color: ACCENT2 },
        { position: [-1.1, -0.1, -0.5 ] as [number,number,number], scale: 0.6,  delay: 0.7, color: ACCENT  },
        { position: [ 1.3,  0,    0.9 ] as [number,number,number], scale: 0.5,  delay: 1.8, color: GLOW    },
        { position: [ 0.2,  1.0, -0.8 ] as [number,number,number], scale: 0.45, delay: 3.0, color: ACCENT2 },
    ], []);

    return (
        <>
            <ambientLight intensity={0.15} />
            <directionalLight position={[4, 6, 4]} intensity={0.6} color="#ffffff" />
            <OrbitLight />
            <pointLight color={ACCENT2} intensity={8} distance={10} decay={2} position={[-4, 3, -3]} />

            <GridDots />
            <Particles />
            <Platform />

            {cubes.map((c, i) => (
                <Cube key={i} {...c} />
            ))}
        </>
    );
}

// - Export -
export default function HeroScene() {
    return (
        <Canvas
            camera={{ position: [4, 3.5, 5], fov: 42 }}
            gl={{ alpha: true, antialias: true }}
            style={{ background: "transparent" }}
        >
            <Scene />
        </Canvas>
    );
}
