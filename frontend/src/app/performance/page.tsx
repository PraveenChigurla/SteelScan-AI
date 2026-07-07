"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { BarChart2, TrendingUp, Target, ShieldCheck } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const CLASS_LIST = ["Bumps", "Dirtiness", "K_Scatch", "Other_Faults", "Pastry", "Stains", "Z_Scratch"];
const ROC_COLORS = ["#8b5cf6","#0ea5e9","#34d399","#f59e0b","#ef4444","#ec4899","#38bdf8"];

export default function PerformancePage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [activeClass, setActiveClass] = useState<string>("Bumps");

  useEffect(() => {
    fetch('/api/metrics').then(r => r.json()).then(data => setMetrics(data)).catch(console.error);
  }, []);

  // Build ROC chart data by zipping fpr/tpr arrays into [{fpr, tpr}] pairs
  const rocData: { fpr: number; tpr: number }[] = React.useMemo(() => {
    const curve = metrics?.roc_curves?.[activeClass];
    if (!curve) return [];
    const { fpr, tpr } = curve;
    // Sample at most 200 points to keep it fast
    const step = Math.max(1, Math.floor(fpr.length / 200));
    const pts: { fpr: number; tpr: number }[] = [];
    for (let i = 0; i < fpr.length; i += step) {
      pts.push({ fpr: parseFloat(fpr[i].toFixed(4)), tpr: parseFloat(tpr[i].toFixed(4)) });
    }
    // Always include the last point
    if (pts[pts.length - 1]?.fpr !== 1) {
      pts.push({ fpr: 1, tpr: 1 });
    }
    return pts;
  }, [metrics, activeClass]);

  const diagLine = [{ fpr: 0, tpr: 0 }, { fpr: 1, tpr: 1 }];

  return (
    <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="flex flex-col gap-8 pb-12">
      <div className="mb-4">
        <h2 className="text-3xl font-bold mb-2 text-white flex items-center gap-3">
          <BarChart2 className="w-8 h-8 text-brandBlue" /> Model Performance Diagnostics
        </h2>
        <p className="text-textMuted">MLflow-style dashboard for evaluating the LightGBM classifier.</p>
      </div>

      {!metrics ? (
        <div className="animate-pulse text-slate-500">Loading metrics...</div>
      ) : (
        <>
          {/* Top KPI Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            <div className="panel p-5 border-t-4 border-brandBlue">
              <p className="text-[0.65rem] text-textMuted uppercase mb-1 tracking-widest">Unseen Accuracy</p>
              <p className="text-3xl font-extrabold text-brandBlue">{(metrics.unseen_accuracy * 100).toFixed(1)}%</p>
              <p className="text-[10px] text-slate-500 mt-1">389 held-out samples</p>
            </div>
            <div className="panel p-5 border-t-4 border-brandPurple">
              <p className="text-[0.65rem] text-textMuted uppercase mb-1 tracking-widest">ROC-AUC (Macro)</p>
              <p className="text-3xl font-extrabold text-brandPurple">{(metrics.roc_auc * 100).toFixed(2)}%</p>
              <p className="text-[10px] text-slate-500 mt-1">One-vs-Rest, 7 classes</p>
            </div>
            <div className="panel p-5 border-t-4 border-brandGreen">
              <p className="text-[0.65rem] text-textMuted uppercase mb-1 tracking-widest">Test Accuracy</p>
              <p className="text-3xl font-extrabold text-brandGreen">{(metrics.test_accuracy * 100).toFixed(1)}%</p>
              <p className="text-[10px] text-slate-500 mt-1">30% stratified test set</p>
            </div>
            <div className="panel p-5 border-t-4 border-yellow-400">
              <p className="text-[0.65rem] text-textMuted uppercase mb-1 tracking-widest">Macro F1</p>
              <p className="text-3xl font-extrabold text-yellow-400">{metrics.classification_report?.['macro avg']?.['f1-score']?.toFixed(3)}</p>
              <p className="text-[10px] text-slate-500 mt-1">Balanced across all classes</p>
            </div>
          </div>

          {/* ROC-AUC Plot */}
          <div className="panel">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <div>
                <h3 className="font-bold text-white text-lg">ROC Curve — One vs Rest</h3>
                <p className="text-xs text-slate-500 mt-1">Select a fault class to view its ROC curve. AUC approaches 1.0 for near-perfect discriminability.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {CLASS_LIST.map((cls, i) => (
                  <button
                    key={cls}
                    onClick={() => setActiveClass(cls)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                      activeClass === cls
                        ? 'text-white border-transparent shadow-lg'
                        : 'text-slate-400 border-panelBorder hover:text-white hover:border-white/20 bg-transparent'
                    }`}
                    style={activeClass === cls ? { backgroundColor: ROC_COLORS[i], borderColor: ROC_COLORS[i] } : {}}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rocData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="fpr"
                    type="number"
                    domain={[0, 1]}
                    tickFormatter={v => v.toFixed(1)}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    dataKey="tpr"
                    domain={[0, 1]}
                    tickFormatter={v => v.toFixed(1)}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#121827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                    formatter={(v: any, name: any) => [v.toFixed(4), name === 'tpr' ? 'TPR (Sensitivity)' : name]}
                    labelFormatter={v => `FPR: ${parseFloat(v).toFixed(4)}`}
                  />
                  {/* Diagonal reference line */}
                  <Line data={diagLine} dataKey="tpr" stroke="#374151" strokeDasharray="6 4" dot={false} strokeWidth={1.5} name="Random (AUC=0.5)" />
                  {/* Actual ROC */}
                  <Line dataKey="tpr" stroke={ROC_COLORS[CLASS_LIST.indexOf(activeClass)]} strokeWidth={2.5} dot={false} name={`${activeClass} ROC`} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-2">
                <span className="w-8 h-0.5 bg-gray-600 border-dashed inline-block" style={{ borderTop: '2px dashed #374151' }}></span>
                Random classifier (AUC = 0.50)
              </span>
              <span className="flex items-center gap-2">
                <span className="w-8 h-0.5 inline-block" style={{ backgroundColor: ROC_COLORS[CLASS_LIST.indexOf(activeClass)] }}></span>
                {activeClass} — AUC: <strong className="text-white">{(metrics.roc_auc * 100).toFixed(2)}%</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Confusion Matrix */}
            <div className="panel">
              <h3 className="font-bold mb-6 text-white text-lg">Confusion Matrix</h3>
              <div className="overflow-x-auto">
                <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', gap: '2px' }}>
                  <div></div>
                  {CLASS_LIST.map(c => <div key={c} className="text-xs text-textMuted text-center font-medium py-1">{c.substring(0,5)}</div>)}
                  {metrics.confusion_matrix?.map((row: number[], i: number) => {
                    const max = Math.max(...row);
                    return (
                      <React.Fragment key={i}>
                        <div className="text-xs text-textMuted flex items-center justify-end pr-2 font-medium">{CLASS_LIST[i].substring(0,5)}</div>
                        {row.map((val, j) => {
                          let bg = '#121624'; let color = '#475569'; let shadow = 'none';
                          if (i === j && val > 0) { bg = '#1d4d2f'; color = '#34d399'; } // correct: green diagonal
                          else if (val > max * 0.5) { bg = '#5e1d1d'; color = '#f87171'; shadow = '0 0 10px rgba(239,68,68,0.4)'; }
                          else if (val > 0) { bg = '#2d1b1b'; color = '#fca5a5'; }
                          return <div key={j} className="aspect-square flex items-center justify-center rounded font-mono text-xs transition-transform hover:scale-110 cursor-default" style={{backgroundColor: bg, color, boxShadow: shadow}}>{val}</div>;
                        })}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
              <p className="text-[10px] text-slate-600 mt-4"><span className="text-green-500">■</span> Correct · <span className="text-red-500">■</span> Most misclassified · <span className="text-slate-600">■</span> Other errors</p>
            </div>

            {/* Classification Report */}
            <div className="panel flex flex-col">
              <h3 className="font-bold mb-6 text-white text-lg">Classification Report</h3>
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-panelBorder text-textMuted text-xs">
                    <tr><th className="pb-3">Class</th><th className="pb-3">Precision</th><th className="pb-3">Recall</th><th className="pb-3 text-brandGreen">F1</th><th className="pb-3">Support</th></tr>
                  </thead>
                  <tbody className="divide-y divide-panelBorder">
                    {CLASS_LIST.map((c, ci) => {
                      const r = metrics.classification_report?.[c];
                      if (!r) return null;
                      const f1 = r['f1-score'];
                      return (
                        <tr key={c} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 text-white font-medium flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ROC_COLORS[ci] }} />
                            {c}
                          </td>
                          <td className="py-3 font-mono text-slate-300">{r.precision.toFixed(2)}</td>
                          <td className="py-3 font-mono text-slate-300">{r.recall.toFixed(2)}</td>
                          <td className="py-3 font-mono font-bold" style={{ color: f1 > 0.9 ? '#34d399' : f1 > 0.75 ? '#f59e0b' : '#ef4444' }}>
                            {f1.toFixed(2)}
                          </td>
                          <td className="py-3 font-mono text-slate-300">{r.support}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Model Rankings Table */}
          <div className="panel">
            <h3 className="text-xl font-bold mb-6 text-white tracking-tight">Performance Comparison: All 9 Models Ranked</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#121827] border-b border-panelBorder text-slate-300">
                  <tr>
                    {['Model','Train Acc','Test Acc','Precision','Recall','F1 Score','ROC-AUC','CV Score','Unseen Acc','Rank'].map(h => (
                      <th key={h} className="p-4 font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-panelBorder">
                  {[
                    { name:'LightGBM ✓', train:'—', test:'82.8%', prec:'0.85', rec:'0.81', f1:'0.83', roc:'96.7%', cv:'80.5%', unseen:'83.6%', rank:'#1', active:true },
                    { name:'CatBoost',   train:'—', test:'80.8%', prec:'0.84', rec:'0.81', f1:'0.82', roc:'96.6%', cv:'79.2%', unseen:'80.2%', rank:'#2', active:false },
                    { name:'XGBoost',    train:'—', test:'80.4%', prec:'0.83', rec:'0.80', f1:'0.81', roc:'96.3%', cv:'80.0%', unseen:'80.5%', rank:'#3', active:false },
                    { name:'RF (Tuned)', train:'—', test:'78.9%', prec:'0.83', rec:'0.81', f1:'0.82', roc:'96.4%', cv:'76.9%', unseen:'77.9%', rank:'#4', active:false },
                    { name:'AdaBoost (Tuned)', train:'—', test:'78.2%', prec:'0.84', rec:'0.77', f1:'0.79', roc:'94.7%', cv:'76.8%', unseen:'78.9%', rank:'#5', active:false },
                    { name:'KNN (Tuned)', train:'—', test:'75.8%', prec:'0.76', rec:'0.77', f1:'0.76', roc:'93.0%', cv:'73.7%', unseen:'75.1%', rank:'#6', active:false },
                    { name:'SVM (Tuned)', train:'—', test:'74.6%', prec:'0.80', rec:'0.75', f1:'0.77', roc:'95.1%', cv:'73.6%', unseen:'74.3%', rank:'#7', active:false },
                    { name:'Random Forest', train:'—', test:'73.9%', prec:'0.77', rec:'0.81', f1:'0.78', roc:'95.6%', cv:'—', unseen:'73.8%', rank:'#8', active:false },
                    { name:'Logistic Regression', train:'—', test:'71.4%', prec:'0.75', rec:'0.72', f1:'0.73', roc:'94.0%', cv:'71.7%', unseen:'72.0%', rank:'#9', active:false },
                  ].map(row => (
                    <tr key={row.name} className={`hover:bg-white/5 transition-colors ${row.active ? 'text-white font-bold bg-brandPurple/5' : 'text-slate-400'}`}>
                      <td className="p-4">{row.name}</td>
                      <td className="p-4">{row.train}</td>
                      <td className="p-4">{row.test}</td>
                      <td className="p-4">{row.prec}</td>
                      <td className="p-4">{row.rec}</td>
                      <td className="p-4">{row.f1}</td>
                      <td className="p-4 text-brandBlue font-mono">{row.roc}</td>
                      <td className="p-4">{row.cv}</td>
                      <td className="p-4 text-brandGreen font-mono">{row.unseen}</td>
                      <td className="p-4 font-bold">{row.rank}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
