import React, { useRef, useMemo, useContext } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { StudentContext } from '../../context/StudentContext';

// ── Floating Constellation Orb (wireframe-only, never blocks text) ──
const ConstellationOrb = ({ isDark }) => {
  const groupRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const coreRef = useRef();

  const primaryColor = isDark ? '#60a5fa' : '#3b82f6';
  const accentColor  = isDark ? '#a78bfa' : '#8b5cf6';
  const cyanColor    = isDark ? '#22d3ee' : '#06b6d4';

  // Build geometries once
  const { outerEdges, midEdges, innerEdges, octaEdges, coreGeo } = useMemo(() => {
    const outerGeo = new THREE.IcosahedronGeometry(2.2, 1);
    const midGeo   = new THREE.IcosahedronGeometry(1.7, 1);
    const innerGeo = new THREE.OctahedronGeometry(1.2, 0);
    const octaGeo  = new THREE.OctahedronGeometry(0.6, 0);
    const sphereGeo= new THREE.SphereGeometry(0.18, 8, 8);
    return {
      outerEdges: new THREE.EdgesGeometry(outerGeo),
      midEdges:   new THREE.EdgesGeometry(midGeo),
      innerEdges: new THREE.EdgesGeometry(innerGeo),
      octaEdges:  new THREE.EdgesGeometry(octaGeo),
      coreGeo:    sphereGeo,
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const px = state.pointer.x;
    const py = state.pointer.y;

    // Smooth top-level mouse parallax
    if (groupRef.current) {
      groupRef.current.rotation.y += (px * 0.4 - groupRef.current.rotation.y) * 0.04;
      groupRef.current.rotation.x += (-py * 0.25 - groupRef.current.rotation.x) * 0.04;
    }

    // Each ring spins on a different axis independently
    if (ring1Ref.current) {
      ring1Ref.current.rotation.y = t * 0.22;
      ring1Ref.current.rotation.x = t * 0.09;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.18;
      ring2Ref.current.rotation.z =  t * 0.13;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = t * 0.28;
      ring3Ref.current.rotation.z = -t * 0.16;
    }
    // Core gentle pulse
    if (coreRef.current) {
      const s = 1 + Math.sin(t * 2.5) * 0.12;
      coreRef.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Floating bob */}
      <group position={[0, Math.sin(Date.now() * 0.001) * 0.1, 0]}>

        {/* Outer icosahedron wireframe */}
        <lineSegments ref={ring1Ref} geometry={outerEdges}>
          <lineBasicMaterial color={primaryColor} transparent opacity={isDark ? 0.38 : 0.28} />
        </lineSegments>

        {/* Mid icosahedron wireframe */}
        <lineSegments ref={ring2Ref} geometry={midEdges}>
          <lineBasicMaterial color={cyanColor} transparent opacity={isDark ? 0.5 : 0.35} />
        </lineSegments>

        {/* Inner octahedron wireframe */}
        <lineSegments ref={ring3Ref} geometry={innerEdges}>
          <lineBasicMaterial color={accentColor} transparent opacity={isDark ? 0.65 : 0.45} />
        </lineSegments>

        {/* Tiny inner octahedron */}
        <lineSegments geometry={octaEdges}>
          <lineBasicMaterial color={primaryColor} transparent opacity={isDark ? 0.9 : 0.7} />
        </lineSegments>

        {/* Glowing data-core sphere */}
        <mesh ref={coreRef} geometry={coreGeo}>
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={isDark ? 3.5 : 1.8}
            roughness={0}
            metalness={0}
          />
        </mesh>
      </group>
    </group>
  );
};

// ── Animated particle dots orbiting the orb ──
const OrbitParticles = ({ isDark }) => {
  const ref = useRef();
  const count = 80;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const paletteDark  = [[0.37, 0.64, 0.98], [0.66, 0.55, 0.98], [0.13, 0.83, 0.93]];
    const paletteLight = [[0.23, 0.51, 0.96], [0.55, 0.36, 0.96], [0.02, 0.71, 0.83]];
    const palette = isDark ? paletteDark : paletteLight;
    for (let i = 0; i < count; i++) {
      const phi   = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const r = 2.6 + Math.random() * 0.8;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const c = palette[i % palette.length];
      col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2];
    }
    return { positions: pos, colors: col };
  }, [isDark]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.08;
      ref.current.rotation.x = state.clock.elapsedTime * 0.04;
    }
  });

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
    return g;
  }, [positions, colors]);

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.06} vertexColors transparent opacity={isDark ? 0.85 : 0.65} sizeAttenuation />
    </points>
  );
};

// ── Mouse camera follower ──
const MouseTracker = () => {
  useFrame((state) => {
    const tx = state.pointer.x * 1.5;
    const ty = state.pointer.y * 1.0;
    state.camera.position.lerp({ x: tx, y: ty, z: 7 }, 0.04);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

// ── Exported HeroOrb wrapper ──
const HeroOrb = () => {
  const { theme } = useContext(StudentContext);
  const isDark = theme === 'dark';

  const ambientIntensity = isDark ? 0.2 : 0.5;
  const pointColor1 = isDark ? '#60a5fa' : '#3b82f6';
  const pointColor2 = isDark ? '#a78bfa' : '#8b5cf6';

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 48 }}
        eventSource={document.body}
        eventPrefix="client"
        gl={{ alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={ambientIntensity} />
        <pointLight position={[5, 5, 5]}   intensity={isDark ? 2 : 1} color={pointColor1} />
        <pointLight position={[-5, -4, -3]} intensity={isDark ? 2 : 1} color={pointColor2} />

        <ConstellationOrb isDark={isDark} />
        <OrbitParticles   isDark={isDark} />
        <MouseTracker />
      </Canvas>
    </div>
  );
};

export default HeroOrb;
