"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PresentationControls, Html, Float } from "@react-three/drei";
import * as THREE from "three";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
  color: string;
}

const CardContent = ({ title, description, tags, githubUrl, liveUrl, color }: ProjectCardProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        hovered ? Math.sin(state.clock.elapsedTime) * 0.1 : 0,
        0.1
      );
    }
  });

  return (
    <Float rotationIntensity={0.2} floatIntensity={0.5} speed={2}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[4.5, 6, 0.1]} />
        <meshStandardMaterial color="#0a0a0f" metalness={0.8} roughness={0.2} />
        
        {/* Glowing Edge Effect */}
        <mesh position={[0, 0, -0.06]}>
          <boxGeometry args={[4.6, 6.1, 0.05]} />
          <meshBasicMaterial color={hovered ? color : "#1f1f2e"} transparent opacity={0.5} />
        </mesh>

        <Html
          transform
          occlude
          position={[0, 0, 0.06]}
          style={{ width: "280px", height: "380px" }}
          className="pointer-events-auto"
        >
          <div 
            className="w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br from-black/80 to-black/90 rounded-xl border border-white/5 shadow-2xl transition-all duration-300 group"
            style={{ boxShadow: hovered ? `0 0 30px ${color}40` : 'none' }}
          >
            <div>
              <h3 className="text-2xl font-outfit font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                {title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed font-inter line-clamp-4 mb-4">
                {description}
              </p>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-300 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-6">
              <a 
                href={githubUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                <FaGithub size={18} /> Code
              </a>
              {liveUrl && (
                <a 
                  href={liveUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ color }}
                  className="flex items-center gap-2 text-sm font-bold hover:scale-105 transition-transform drop-shadow-[0_0_8px_currentColor]"
                >
                  <ExternalLink size={18} /> Live Demo
                </a>
              )}
            </div>
          </div>
        </Html>
      </mesh>
    </Float>
  );
};

export const ProjectCard3D = (props: ProjectCardProps) => {
  return (
    <div className="w-full h-[500px]">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} intensity={1.5} penumbra={1} color={props.color} />
        <PresentationControls
          global
          rotation={[0, 0, 0]}
          polar={[-0.1, 0.1]}
          azimuth={[-0.2, 0.2]}
          snap
        >
          <CardContent {...props} />
        </PresentationControls>
      </Canvas>
    </div>
  );
};
