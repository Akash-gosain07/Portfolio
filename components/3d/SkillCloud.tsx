"use client";

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, TrackballControls, Sphere } from "@react-three/drei";
import * as THREE from "three";

const skills = [
  "React", "Next.js", "TypeScript", "TailwindCSS", "Framer Motion", "Three.js",
  "Node.js", "Express", "MongoDB", "PostgreSQL", "Python", "C++",
  "Git", "Docker", "AWS", "Figma", "Redux", "AI/ML"
];

const SkillNode = ({ position, text, color }: { position: [number, number, number], text: string, color: string }) => {
  const ref = useRef<THREE.Mesh>(null);
  const [factor] = useState(() => 0.5 + Math.random());
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * factor) * 0.2;
    }
  });

  return (
    <Sphere ref={ref} args={[0.3, 32, 32]} position={position}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} wireframe />
      <Html distanceFactor={15} center>
        <div className="px-2 py-1 bg-black/80 border border-white/20 rounded-md whitespace-nowrap text-xs font-outfit text-white backdrop-blur-md font-medium tracking-wide">
          {text}
        </div>
      </Html>
    </Sphere>
  );
};

export const SkillCloud = () => {
  const nodes = useMemo(() => {
    return skills.map((skill, i) => {
      // Golden spiral distribution on sphere
      const phi = Math.acos(-1 + (2 * i) / skills.length);
      const theta = Math.sqrt(skills.length * Math.PI) * phi;
      const r = 3.5; // Radius
      
      const x = r * Math.cos(theta) * Math.sin(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(phi);
      
      // Select neon color mapping
      const colors = ["#0ff", "#0077ff", "#ff007f", "#b026ff"];
      const color = colors[i % colors.length];
      
      return { position: [x, y, z] as [number, number, number], text: skill, color };
    });
  }, []);

  return (
    <div className="w-full h-[500px] relative">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#0ff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ff007f" />
        
        <group>
          {nodes.map((node, i) => (
            <SkillNode key={i} {...node} />
          ))}
        </group>
        
        <TrackballControls noPan noZoom rotateSpeed={2.0} dynamicDampingFactor={0.1} />
      </Canvas>
    </div>
  );
};
