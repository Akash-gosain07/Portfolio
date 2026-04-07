"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

const experiences = [
  {
    title: "Frontend Developer Intern",
    company: "Springer Capital",
    date: "March 2026 – Present",
    description: "Engineering cinematic and high-performance financial web interfaces for trading analytics. Optimizing internal dashboards and integrating smooth interactive animations.",
    skills: ["Next.js", "React", "TypeScript", "Framer Motion"],
    color: "var(--color-neon-cyan)"
  },
  {
    title: "Full Stack Development Intern",
    company: "Vaidsys Technologies",
    date: "June 2025 – July 2025",
    description: "Developed comprehensive full-stack features for client applications. Managed RESTful APIs, optimized database queries, and implemented responsive design patterns.",
    skills: ["React", "Node.js", "Express", "MongoDB"],
    color: "var(--color-neon-purple)"
  }
];

export const Experience = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <SectionWrapper id="experience">
      <div className="flex flex-col mb-16 items-start">
        <h2 className="text-4xl md:text-5xl font-outfit font-bold text-white tracking-tight mb-4">
          Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-purple)] to-[var(--color-neon-pink)]">Experience</span>
        </h2>
        <div className="h-[2px] w-32 bg-[var(--color-neon-purple)]" />
      </div>

      <div ref={containerRef} className="relative w-full max-w-4xl mx-auto pl-8 md:pl-0">
        {/* Animated Timeline Line */}
        <div className="absolute left-[15px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-white/10">
          <motion.div 
            className="absolute top-0 w-full bg-gradient-to-b from-[var(--color-neon-cyan)] via-[var(--color-neon-purple)] to-transparent" 
            style={{ height: lineHeight }} 
          />
        </div>

        {experiences.map((exp, index) => {
          const isEven = index % 2 === 0;
          
          return (
            <div key={index} className="relative flex flex-col md:flex-row justify-between items-center w-full mb-16 md:mb-24 last:mb-0">
              {/* Timeline Dot */}
              <div className="absolute left-[-2px] md:left-1/2 md:-translate-x-1/2 w-[34px] h-[34px] rounded-full bg-black border-4 border-white/10 flex items-center justify-center z-10 transition-colors duration-300">
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: exp.color, boxShadow: `0 0 10px ${exp.color}` }}
                />
              </div>

              {/* Content Card */}
              <motion.div 
                initial={{ opacity: 0, x: isEven ? -50 : 50, y: 30 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                className={`w-full md:w-[45%] ml-6 md:ml-0 p-6 glass rounded-2xl border-l-[4px] relative ${isEven ? 'md:mr-auto' : 'md:ml-auto'}`}
                style={{ borderLeftColor: exp.color }}
              >
                <span className="text-sm font-bold tracking-wider uppercase mb-2 block" style={{ color: exp.color }}>
                  {exp.date}
                </span>
                <h3 className="text-2xl font-outfit font-bold text-white mb-1">{exp.title}</h3>
                <h4 className="text-lg text-gray-400 mb-4 font-medium">{exp.company}</h4>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  {exp.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {exp.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-gray-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
};
