"use client";

import React from "react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ProjectCard3D } from "@/components/3d/ProjectCard3D";

const projects = [
  {
    title: "HFME 2.0 (Human Friction Mapping Engine)",
    description: "An upcoming AI research project and intelligent analytics dashboard. Designed to autonomously analyze user interactions, detect friction points in real-time, and provide actionable insights to improve UI/UX.",
    tags: ["Next.js", "AI/ML", "Real-Time Data", "Framer Motion"],
    githubUrl: "https://github.com/Akash-gosain07/HFME",
    color: "#0ff" // Cyan
  },
  {
    title: "Rebound",
    description: "A comprehensive Full-Stack Lost & Found Platform. Enables users to securely post and claim lost items with real-time notifications, robust authentication, and an intuitive dashboard.",
    tags: ["Next.js", "MongoDB", "Tailwind CSS", "Node.js"],
    githubUrl: "https://github.com/Akash-gosain07/Rebound",
    liveUrl: "https://rebound-steel.vercel.app",
    color: "#b026ff" // Purple
  },
  {
    title: "CV Generator",
    description: "A Premium ATS-Friendly Resume Builder SaaS. Features real-time live preview, multiple premium templates, PDF export, and a clean, dynamic user interface optimized for speed.",
    tags: ["React", "TypeScript", "Tailwind CSS", "PDF Generation"],
    githubUrl: "https://github.com/Akash-gosain07/CV-generator",
    color: "#ff007f" // Pink
  }
];

export const Projects = () => {
  return (
    <SectionWrapper id="projects">
      <div className="flex flex-col mb-16 items-center text-center">
        <h2 className="text-4xl md:text-5xl font-outfit font-bold text-white tracking-tight mb-4">
          Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-cyan)] to-[var(--color-neon-purple)]">Projects</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mt-4 font-inter">
          A selection of my best work, spanning from AI research tools to full-stack platforms. Hover over the cards to interact in 3D space.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-4 w-full">
        {projects.map((project, index) => (
          <ProjectCard3D key={index} {...project} />
        ))}
      </div>
    </SectionWrapper>
  );
};
