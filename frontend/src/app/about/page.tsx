"use client";

import { motion } from "framer-motion";
import { Info, Code2, User } from "lucide-react";

export default function AboutPage() {
  return (
    <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="flex flex-col gap-8 pb-12 max-w-3xl">
      <div className="mb-4">
        <h2 className="text-3xl font-bold mb-2 text-white flex items-center gap-3">
          <Info className="w-8 h-8 text-brandPurple" /> About the Project
        </h2>
      </div>

      <div className="panel p-8">
        <h3 className="text-2xl font-bold text-white mb-4">Steel Plate Fault Classifier</h3>
        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          This platform was built to demonstrate an end-to-end Machine Learning pipeline, from Exploratory Data Analysis to model deployment.
          It emphasizes not just raw algorithmic performance, but also <strong>Information Architecture</strong> and <strong>User Experience</strong>.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed mb-8">
          The goal is to present AI in a way that is interpretable, actionable, and visually stunning, matching the aesthetic of enterprise SaaS products.
        </p>
        
        <div className="border-t border-panelBorder pt-6 flex gap-4">
          <a href="#" className="flex items-center gap-2 bg-[#121827] border border-panelBorder px-4 py-2 rounded-lg text-sm text-white hover:bg-white/5 transition-colors">
            <Code2 className="w-4 h-4" /> Source Code
          </a>
          <a href="https://github.com/PraveenChigurla?tab=repositories" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#121827] border border-panelBorder px-4 py-2 rounded-lg text-sm text-white hover:bg-white/5 transition-colors">
            <User className="w-4 h-4 text-blue-500" /> Developer Profile
          </a>
        </div>
      </div>
    </motion.div>
  );
}
