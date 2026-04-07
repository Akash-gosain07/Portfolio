"use client";

import React from "react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { SkillCloud } from "@/components/3d/SkillCloud";
import { motion } from "framer-motion";

const skillCategories = [
  { name: "Frontend", skills: ["React", "Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js", "Redux Toolkit"] },
  { name: "Backend & DB", skills: ["Node.js", "Express.js", "MongoDB", "PostgreSQL", "REST APIs", "Prisma"] },
  { name: "Languages", skills: ["JavaScript", "TypeScript", "Python", "C++", "Java", "C"] },
  { name: "Tools & Others", skills: ["Git", "Docker", "AWS", "Figma", "Postman", "Linux", "AI/ML"] },
];

export const Skills = () => {
  return (
    <SectionWrapper id="skills">
      <div className="flex flex-col mb-12 items-end text-right">
        <h2 className="text-4xl md:text-5xl font-outfit font-bold text-white tracking-tight mb-4">
          Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-pink)] to-[var(--color-neon-purple)]">Skills</span>
        </h2>
        <div className="h-[2px] w-32 bg-[var(--color-neon-pink)]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* 3D Skill Cloud */}
        <div className="w-full h-full min-h-[400px] lg:min-h-[500px] border border-white/5 rounded-3xl bg-black/40 backdrop-blur-md overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-neon-cyan)]/5 to-transparent pointer-events-none" />
          <SkillCloud />
          <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-500 font-inter pointer-events-none">
            Interact to rotate 3D sphere
          </div>
        </div>

        {/* Skill Categories */}
        <div className="space-y-8">
          {skillCategories.map((category, index) => (
            <motion.div 
              key={category.name}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-xl font-outfit font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--color-neon-cyan)] shadow-[0_0_8px_var(--color-neon-cyan)]" />
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill) => (
                  <span 
                    key={skill} 
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none hover:bg-white/10 hover:border-[var(--color-neon-cyan)]/50 transition-all font-medium text-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};
