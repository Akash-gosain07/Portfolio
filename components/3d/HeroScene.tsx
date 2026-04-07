"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows, Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// Neural Network Nodes
const Nodes = () => {
  const group = useRef<THREE.Group>(null);
  const particlesCount = 100;
  
  const [[positions, connections]] = useState(() => {
    const pos = new Float32Array(particlesCount * 3);
    const conn = [];
    
    for (let i = 0; i < particlesCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    
    for (let i = 0; i < particlesCount; i++) {
      for (let j = i + 1; j < particlesCount; j++) {
        const dist = Math.sqrt(
          Math.pow(pos[i * 3] - pos[j * 3], 2) +
          Math.pow(pos[i * 3 + 1] - pos[j * 3 + 1], 2) +
          Math.pow(pos[i * 3 + 2] - pos[j * 3 + 2], 2)
        );
        if (dist < 1.5) {
          conn.push(
            pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2],
            pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]
          );
        }
      }
    }
    return [pos, new Float32Array(conn)];
  });

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.1;
      group.current.rotation.x = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#0ff" transparent opacity={0.8} />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[connections, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#b026ff" transparent opacity={0.15} />
      </lineSegments>
    </group>
  );
};

export const HeroScene = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#0ff" />
        <pointLight position={[-10, -10, -10]} intensity={2} color="#ff007f" />
        
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
          <Sphere args={[1.5, 64, 64]} position={[0, 0, 0]}>
            <MeshDistortMaterial 
              color="#000" 
              attach="material" 
              distort={0.4} 
              speed={2} 
              roughness={0.2} 
              metalness={0.8}
              envMapIntensity={2} 
            />
          </Sphere>
          <Nodes />
        </Float>
        
        <Environment preset="city" />
        <ContactShadows position={[0, -3, 0]} opacity={0.4} scale={20} blur={2} far={4} color="#0ff" />
      </Canvas>
    </div>
  );
};
