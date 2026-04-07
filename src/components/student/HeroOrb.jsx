import React, { useRef, useMemo, useContext, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Icosahedron, Sphere, Torus, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { StudentContext } from '../../context/StudentContext';

const QuantumCore = ({ isDark, mouse }) => {
  const meshRef = useRef();
  const innerRef = useRef();
  const ringRef1 = useRef();
  const ringRef2 = useRef();
  const groupRef = useRef();

  const primaryColor = isDark ? '#38bdf8' : '#2563eb';
  const accentColor  = isDark ? '#818cf8' : '#3b82f6';

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const mx = mouse.x;
    const my = mouse.y;

    // Core rotations
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.12;
      meshRef.current.rotation.z = t * 0.05 + mx * 0.2;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.18;
      innerRef.current.rotation.x = t * 0.1 + my * 0.2;
    }
    
    // Smooth group parallax (responding to cursor with better damping)
    if (groupRef.current) {
      const targetX = mx * 0.6;
      const targetY = -my * 0.4;
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.03;
      groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.03;
    }

    if (ringRef1.current) ringRef1.current.rotation.z = t * 0.2;
    if (ringRef2.current) ringRef2.current.rotation.z = -t * 0.15;
  });

  return (
    <group ref={groupRef}>
      {/* Outer Geometric Shell */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2.8, 1]} />
        <meshBasicMaterial color={primaryColor} wireframe transparent opacity={isDark ? 0.22 : 0.15} />
      </mesh>
      
      {/* Inner Energy Core */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <MeshDistortMaterial
          color={accentColor}
          speed={2.2}
          distort={0.4}
          radius={1}
          transparent
          opacity={isDark ? 0.45 : 0.35}
        />
      </mesh>

      {/* Orbiting Glass Rings */}
      <group ref={ringRef1} rotation={[Math.PI / 3, 0, 0]}>
        <Torus args={[3.5, 0.02, 16, 120]}>
          <meshBasicMaterial color={primaryColor} transparent opacity={0.2} />
        </Torus>
      </group>
      <group ref={ringRef2} rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
        <Torus args={[4.2, 0.015, 16, 120]}>
          <meshBasicMaterial color={accentColor} transparent opacity={0.15} />
        </Torus>
      </group>
    </group>
  );
};

const OrbitParticles = ({ isDark, mouse }) => {
  const count = 1500;
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4.2 + Math.random() * 6.5;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      p[i * 3 + 2] = r * Math.cos(phi);
    }
    return p;
  }, [count]);

  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const mx = mouse.x;
    
    // Dynamic interaction with particles
    ref.current.rotation.y = t * 0.04 + mx * 0.1;
    ref.current.rotation.x = t * 0.02 + Math.sin(t * 0.1) * 0.1;
  });

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={isDark ? "#38bdf8" : "#2563eb"}
        size={0.5}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={isDark ? 0.55 : 0.35}
      />
    </Points>
  );
};

const HeroOrb = () => {
  const { theme } = useContext(StudentContext);
  const isDark = theme === 'dark';
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      // Convert to normalized device coordinates (-1 to +1)
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
      <Canvas 
        camera={{ position: [0, 0, 11], fov: 45 }} 
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={isDark ? 0.4 : 0.7} />
        <pointLight position={[10, 10, 10]} intensity={2.5} color={isDark ? "#38bdf8" : "#2563eb"} />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color={isDark ? "#818cf8" : "#3b82f6"} />
        
        <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
          <QuantumCore isDark={isDark} mouse={mouse} />
        </Float>
        
        <OrbitParticles isDark={isDark} mouse={mouse} />
      </Canvas>
      
      {/* Subtle depth mask to clean up edges */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at 50% 50%, transparent 25%, ${isDark ? '#0f172a' : '#ffffff'} 95%)`,
        opacity: isDark ? 0.5 : 0.3,
        pointerEvents: 'none'
      }} />
    </div>
  );
};

export default HeroOrb;



