"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp, Activity, Crosshair, Target, Brain, Moon, Code2,
  CheckCircle2, Zap, LayoutList, Clock, Layers, Maximize, Target as TargetIcon,
  Search, ShieldAlert, Cpu, BarChart2, Database
} from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

// Mock Data for the dense dashboard
const sparklineData = [82, 85, 91, 88, 93, 89, 95, 90, 86, 92, 94, 87, 83, 88, 96];
const classDistData = [
  { name: "Other_Faults", value: 669, color: "#3b82f6" },
  { name: "Bumps", value: 429, color: "#8b5cf6" },
  { name: "K_Scatch", value: 407, color: "#0ea5e9" },
  { name: "Z_Scratch", value: 200, color: "#f59e0b" },
  { name: "Pastry", value: 155, color: "#eab308" },
  { name: "Stains", value: 72, color: "#ec4899" },
  { name: "Dirtiness", value: 17, color: "#ef4444" }
];
const categoryImportanceData = [
  { name: "Position", value: 19.3, color: "#3b82f6" },
  { name: "Geometry", value: 9.2, color: "#8b5cf6" },
  { name: "Luminosity", value: 13.7, color: "#10b981" },
  { name: "Manufacturing", value: 14.6, color: "#f97316" },
  { name: "Shape & Statistical", value: 43.3, color: "#ec4899" }
];

export default function Dashboard() {
  const containerVars: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVars: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="flex flex-col gap-6">
      
      {/* HEADER ROW */}
      <motion.div variants={itemVars} className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-300 mb-1">Welcome back, Praveen 👋</p>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Steel Plate Fault <span className="text-transparent bg-clip-text bg-gradient-to-r from-brandBlue to-brandPurple">Classifier</span>
          </h1>
          <p className="text-sm text-textMuted mt-1">AI-Powered Defect Detection for Steel Manufacturing</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-panelBg border border-panelBorder rounded-full px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-brandGreen"></span>
            <span className="text-xs font-bold text-white">LightGBM Model</span>
            <span className="text-[10px] text-slate-400 border-l border-panelBorder pl-2 ml-1">v1.0.0</span>
          </div>
          <Brain className="w-12 h-12 text-brandPurple drop-shadow-[0_0_15px_rgba(139,92,246,0.5)] ml-4" />
        </div>
      </motion.div>

      {/* METRICS ROW */}
      <motion.div variants={itemVars} className="grid grid-cols-4 gap-4">
        {[
          { title: "Train Accuracy", value: "100.00%", icon: TrendingUp, color: "text-brandGreen", border: "border-b-brandGreen" },
          { title: "Test Accuracy", value: "82.85%", icon: Activity, color: "text-brandBlue", border: "border-b-brandBlue" },
          { title: "CV Score (5-Fold)", value: "79.97%", icon: Crosshair, color: "text-brandPurple", border: "border-b-brandPurple" },
          { title: "Unseen Accuracy", value: "83.55%", icon: Target, color: "text-cyan-400", border: "border-b-cyan-400" }
        ].map((m, i) => (
          <div key={i} className={`panel p-4 flex flex-col justify-between border-b-2 ${m.border} bg-gradient-to-b from-panelBg to-[#0f141e]`}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-full bg-white/5 ${m.color}`}><m.icon className="w-4 h-4" /></div>
                <p className="text-xs font-medium text-slate-300">{m.title}</p>
              </div>
            </div>
            <h3 className={`text-2xl font-bold ${m.color}`}>{m.value}</h3>
            {/* Mock Sparkline purely visual */}
            <div className="h-6 mt-2 flex items-end gap-[2px]">
              {sparklineData.map((v, j) => (
                <div key={j} className={`w-full ${m.color.replace('text-', 'bg-')}/30 rounded-t-sm`} style={{ height: `${v}%` }}></div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      {/* MID ROW: DIST & HIGHLIGHTS */}
      <motion.div variants={itemVars} className="grid grid-cols-12 gap-4">

        {/* Class Distribution */}
        <div className="panel col-span-6 p-4">
          <h3 className="text-sm font-bold text-white mb-2">Class Distribution</h3>
          <div className="flex items-center h-[200px] relative">
            <div className="w-1/2 h-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={classDistData} innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                    {classDistData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-bold text-white">1,941</span>
                <span className="text-[9px] text-slate-400">Total Samples</span>
              </div>
            </div>
            <div className="w-1/2 flex flex-col justify-center gap-1.5 pl-2">
              {classDistData.map(d => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{background: d.color}}></span><span className="text-[10px] text-slate-300">{d.name}</span></div>
                  <span className="text-[9px] font-mono text-slate-500">{((d.value/1941)*100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Model Highlights */}
        <div className="panel col-span-6 p-4">
          <h3 className="text-sm font-bold text-white mb-4">Model Highlights</h3>
          <div className="space-y-4">
            {[
              { icon: CheckCircle2, c: "text-brandGreen", bg: "bg-brandGreen/10", t1: "High Prediction Accuracy", t2: "83.55% accuracy on unseen data" },
              { icon: Zap, c: "text-brandBlue", bg: "bg-brandBlue/10", t1: "Fast & Efficient", t2: "LightGBM for optimal performance" },
              { icon: LayoutList, c: "text-brandPurple", bg: "bg-brandPurple/10", t1: "7 Fault Categories", t2: "Comprehensive defect classification" },
              { icon: Clock, c: "text-yellow-500", bg: "bg-yellow-500/10", t1: "Real-time Prediction", t2: "Instant results for single & batch data" }
            ].map((h, i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className={`p-2 rounded-full ${h.bg} ${h.c}`}><h.icon className="w-4 h-4" /></div>
                <div><p className="text-xs font-bold text-slate-200">{h.t1}</p><p className="text-[10px] text-slate-500">{h.t2}</p></div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* BOTTOM ROW: DATASET, FEATURE ANALYSIS, FEED */}
      <motion.div variants={itemVars} className="grid grid-cols-12 gap-4">
        
        {/* Dataset Overview */}
        <div className="panel col-span-4 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-white">Dataset Overview</h3>
            <Link href="/dataset" className="text-[10px] text-brandBlue bg-brandBlue/10 px-2 py-1 rounded transition-colors hover:bg-brandBlue/20">View Full Analysis</Link>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[ {v: "1,941", t: "Total Samples", c:"text-brandBlue"}, {v: "27", t: "Total Features", c:"text-brandGreen"}, {v: "7", t: "Fault Classes", c:"text-brandPurple"}, {v: "0", t: "Missing Values", c:"text-slate-300"}].map(k => (
              <div key={k.t} className="bg-[#1a2133] border border-panelBorder rounded p-2 text-center">
                <p className={`text-lg font-bold ${k.c}`}>{k.v}</p><p className="text-[9px] text-slate-500">{k.t}</p>
              </div>
            ))}
          </div>
          <p className="text-[11px] font-bold text-slate-400 mb-2">Feature Categories</p>
          <div className="grid grid-cols-2 gap-2 flex-1">
            <div className="bg-appBg border border-panelBorder rounded p-2 flex items-center gap-2"><TargetIcon className="w-4 h-4 text-brandBlue"/><div className="text-[10px]"><p className="text-slate-300 font-bold">Position Features</p><p className="text-slate-600">4 features</p></div></div>
            <div className="bg-appBg border border-panelBorder rounded p-2 flex items-center gap-2"><Maximize className="w-4 h-4 text-brandPurple"/><div className="text-[10px]"><p className="text-slate-300 font-bold">Geometry Features</p><p className="text-slate-600">3 features</p></div></div>
            <div className="bg-appBg border border-panelBorder rounded p-2 flex items-center gap-2"><Layers className="w-4 h-4 text-brandBlue"/><div className="text-[10px]"><p className="text-slate-300 font-bold">Edge & Shape</p><p className="text-slate-600">6 features</p></div></div>
            <div className="bg-appBg border border-panelBorder rounded p-2 flex items-center gap-2"><Cpu className="w-4 h-4 text-brandGreen"/><div className="text-[10px]"><p className="text-slate-300 font-bold">Statistical Features</p><p className="text-slate-600">14 features</p></div></div>
          </div>
        </div>

        {/* Feature Analysis */}
        <div className="panel col-span-4 p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-white">Feature Category Importance</h3>
            <Link href="/features" className="text-[10px] text-brandPurple bg-brandPurple/10 px-2 py-1 rounded transition-colors hover:bg-brandPurple/20">Analyze Features</Link>
          </div>
          <div className="w-full flex-1 flex flex-col justify-center space-y-4">
            {categoryImportanceData.map((cat, i) => (
              <div key={i} className="w-full">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-300 font-medium">{cat.name}</span>
                  <span className="text-xs font-bold" style={{color: cat.color}}>{cat.value.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-[#0b0f19] rounded-full h-1.5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.value}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
                    className="h-full rounded-full" 
                    style={{backgroundColor: cat.color}}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-end mt-4 border-t border-panelBorder pt-3">
            <div><p className="text-[9px] text-slate-500 mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3 text-brandBlue"/> Strongest Correlation</p><p className="text-sm font-bold text-brandBlue">0.89</p></div>
            <div><p className="text-[9px] text-slate-500 mb-1 flex items-center gap-1"><BarChart2 className="w-3 h-3 text-brandPurple"/> Avg. Feature Importance</p><p className="text-sm font-bold text-slate-300">0.037</p></div>
            <div><p className="text-[9px] text-slate-500 mb-1 flex items-center gap-1"><ShieldAlert className="w-3 h-3 text-brandGreen"/> Low Multicollinearity</p><p className="text-sm font-bold text-brandGreen">Good</p></div>
          </div>
        </div>

        {/* Model Diagnostics */}
        <div className="panel col-span-4 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-white">Model Diagnostics</h3>
            <Link href="/performance" className="text-[10px] text-brandGreen bg-brandGreen/10 px-2 py-1 rounded transition-colors hover:bg-brandGreen/20">View Details</Link>
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col justify-center">
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-appBg/50 p-2 rounded border border-panelBorder">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brandGreen"/> <span className="text-xs text-slate-300 font-medium">Feature Scaling</span></div>
                <span className="text-[10px] text-brandGreen font-bold uppercase tracking-wider">Passed</span>
              </div>
              <div className="flex items-center justify-between bg-appBg/50 p-2 rounded border border-panelBorder">
                <div className="flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-yellow-500"/> <span className="text-xs text-slate-300 font-medium">Class Imbalance</span></div>
                <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider">Detected</span>
              </div>
              <div className="flex items-center justify-between bg-appBg/50 p-2 rounded border border-panelBorder">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brandGreen"/> <span className="text-xs text-slate-300 font-medium">Data Leakage</span></div>
                <span className="text-[10px] text-brandGreen font-bold uppercase tracking-wider">None</span>
              </div>
              <div className="flex items-center justify-between bg-appBg/50 p-2 rounded border border-panelBorder">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brandGreen"/> <span className="text-xs text-slate-300 font-medium">Missing Values</span></div>
                <span className="text-[10px] text-brandGreen font-bold uppercase tracking-wider">0%</span>
              </div>
              <div className="flex items-center justify-between bg-appBg/50 p-2 rounded border border-panelBorder">
                <div className="flex items-center gap-2"><Activity className="w-4 h-4 text-brandBlue"/> <span className="text-xs text-slate-300 font-medium">Cross Validation</span></div>
                <span className="text-[10px] text-brandBlue font-bold uppercase tracking-wider">5 Folds</span>
              </div>
            </div>
          </div>
        </div>

      </motion.div>

      {/* FOOTER ROW */}
      <motion.div variants={itemVars} className="flex justify-between items-center bg-panelBg border border-panelBorder rounded-xl p-3 px-6 text-[10px]">
        <div className="flex items-center gap-2"><TargetIcon className="w-4 h-4 text-brandBlue"/><div className="text-slate-500">Model Type <span className="text-slate-300 font-bold ml-1">LightGBM Classifier</span></div></div>
        <div className="flex items-center gap-2"><Search className="w-4 h-4 text-brandPurple"/><div className="text-slate-500">Training Samples <span className="text-slate-300 font-bold ml-1">1,358 (70%)</span></div></div>
        <div className="flex items-center gap-2"><BarChart2 className="w-4 h-4 text-brandBlue"/><div className="text-slate-500">Test Samples <span className="text-slate-300 font-bold ml-1">583 (30%)</span></div></div>
        <div className="flex items-center gap-2"><Database className="w-4 h-4 text-brandPurple"/><div className="text-slate-500">Dataset Size <span className="text-slate-300 font-bold ml-1">1,941 Samples</span></div></div>
        <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-brandBlue"/><div className="text-slate-500">Last Updated <span className="text-slate-300 font-bold ml-1">8/7/2026</span></div></div>
        <div className="flex items-center gap-2"><Crosshair className="w-4 h-4 text-brandPurple"/><div className="text-slate-500">Developers <span className="text-slate-300 font-bold ml-1">Praveen, Khushi</span></div></div>
      </motion.div>

    </motion.div>
  );
}
