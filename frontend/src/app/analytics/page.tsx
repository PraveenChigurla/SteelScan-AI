"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const CLASS_LIST  = ["Bumps", "Dirtiness", "K_Scatch", "Other_Faults", "Pastry", "Stains", "Z_Scratch"];
const CLASS_COUNTS = [429, 17, 407, 669, 155, 72, 200];
const COLORS      = ['#8b5cf6','#ef4444','#0ea5e9','#3b82f6','#eab308','#ec4899','#f59e0b'];
const TOTAL       = CLASS_COUNTS.reduce((a,b) => a+b, 0);

const distData = CLASS_LIST.map((name, i) => ({ name, value: CLASS_COUNTS[i], color: COLORS[i] }))
  .sort((a, b) => b.value - a.value);

// Custom label renderer for the Pie chart that shows "Name\nX.X%"
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 28;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const pct = ((value / TOTAL) * 100).toFixed(1);
  return (
    <text x={x} y={y} fill="#94a3b8" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={11}>
      {`${name.replace('_', ' ')} ${pct}%`}
    </text>
  );
};

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [selectedFeat, setSelectedFeat] = useState<string>("");

  useEffect(() => {
    fetch('/api/metrics').then(r => r.json()).then(data => {
      setMetrics(data);
      if (data.feature_names?.length > 0) setSelectedFeat(data.feature_names[0]);
    }).catch(console.error);
  }, []);

  const featureNames: string[] = metrics?.feature_names || [];
  const featureStats = metrics?.feature_stats || {};
  const stats = featureStats[selectedFeat];

  const histData = stats?.hist_data || [];

  return (
    <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="flex flex-col gap-8 pb-12">
      <div className="mb-4">
        <span className="badge badge-blue mb-3">Analytics</span>
        <h2 className="text-3xl font-bold mb-2 text-white flex items-center gap-3">
          <PieChartIcon className="w-8 h-8 text-brandBlue" /> Exploratory Data Analysis
        </h2>
        <p className="text-textMuted max-w-3xl leading-relaxed">
          Visual exploration of distributions, class imbalance, correlations, and outliers to inform model development decisions.
        </p>
      </div>

      {/* Class Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
        <div className="lg:col-span-2 panel flex items-center justify-center min-h-[320px]">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distData}
                innerRadius={70}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
                label={renderCustomLabel}
                labelLine={false}
              >
                {distData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#121827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                formatter={(v: any, name: any) => [`${v} samples (${((v/TOTAL)*100).toFixed(1)}%)`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-3 panel">
          <h3 className="font-bold text-white mb-4 text-lg">Class Distribution</h3>
          <table className="w-full text-sm text-left mb-5">
            <thead className="text-xs text-textMuted uppercase border-b border-panelBorder">
              <tr><th className="pb-3">Class</th><th className="pb-3">Count</th><th className="pb-3">Share</th><th className="pb-3">Bar</th></tr>
            </thead>
            <tbody className="divide-y divide-panelBorder">
              {distData.map((d) => (
                <tr key={d.name} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 flex items-center gap-3 text-white font-medium">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{background: d.color}}/>
                    {d.name}
                  </td>
                  <td className="py-3 font-mono text-slate-300">{d.value}</td>
                  <td className="py-3 font-mono font-bold" style={{ color: d.color }}>
                    {((d.value/TOTAL)*100).toFixed(1)}%
                  </td>
                  <td className="py-3 w-32">
                    <div className="h-2 bg-[#0b0f19] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(d.value/CLASS_COUNTS[0])*100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: d.color }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="bg-brandBlue/10 border-l-4 border-brandBlue p-4 rounded-r-lg">
            <h4 className="font-bold text-brandBlue mb-1 text-sm">⚠ Severe Class Imbalance</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              "Other_Faults" dominates (34.4%), while "Dirtiness" and "Stains" are severe minorities (&lt;4%).
              LightGBM uses <code className="text-brandPurple">is_unbalance=True</code> to penalize minority misclassification.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Distribution */}
      <h3 className="text-xl font-bold text-white border-b border-panelBorder pb-2">Feature Distribution</h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="panel lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              Distribution Summary — <span className="text-brandPurple">{selectedFeat}</span>
            </h4>
            <div className="flex items-center gap-4">
              <div className="flex gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#3b82f6]"></span> Histogram</span>
                <span className="flex items-center gap-1"><span className="w-2 h-1.5 rounded-full bg-[#f472b6]"></span> KDE Curve</span>
              </div>
              <select
                className="bg-[#0b0f19] border border-panelBorder text-xs text-white p-2 rounded-lg outline-none focus:border-brandPurple transition-colors"
                value={selectedFeat}
                onChange={e => setSelectedFeat(e.target.value)}
              >
                {featureNames.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
          {stats ? (
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={histData} margin={{top:10, right:10, left:0, bottom:20}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="bin" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#121827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                    cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                    formatter={(v: any, name: any) => [v, name === 'kde' ? 'Density (Scaled)' : 'Count']}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4,4,0,0]} opacity={0.8} />
                  <Line type="monotone" dataKey="kde" stroke="#f472b6" strokeWidth={3} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-slate-500 text-sm animate-pulse">Loading feature data…</div>
          )}
        </div>

        <div className="panel flex flex-col gap-5">
          <h4 className="font-bold text-white text-sm mb-1">Statistical Summary</h4>
          {stats ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Mean",    value: stats.mean.toFixed(3),    color: "#8b5cf6" },
                  { label: "Median",  value: stats.median.toFixed(3),  color: "#0ea5e9" },
                  { label: "Std Dev", value: stats.std.toFixed(3),     color: "#f59e0b" },
                  { label: "Skewness",value: stats.skewness.toFixed(3),color: "#ef4444" },
                  { label: "Min",     value: stats.min.toFixed(2),     color: "#34d399" },
                  { label: "Max",     value: stats.max.toFixed(2),     color: "#ec4899" },
                  { label: "Q25",     value: stats.q25.toFixed(3),     color: "#a78bfa" },
                  { label: "Q75",     value: stats.q75.toFixed(3),     color: "#fb923c" },
                ].map(item => (
                  <div key={item.label} className="bg-[#0b0f19] rounded-lg p-3">
                    <p className="text-[10px] text-slate-500 uppercase mb-1">{item.label}</p>
                    <p className="font-mono font-bold text-sm" style={{ color: item.color }}>{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-brandPurple/10 border-l-4 border-brandPurple p-3 rounded-r-lg mt-auto">
                <h4 className="font-bold text-brandPurple mb-1 text-xs">Insight</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {Math.abs(stats.skewness) > 1.5
                    ? `High skewness (${stats.skewness.toFixed(2)}) detected. Distribution is heavily ${stats.skewness > 0 ? 'right' : 'left'}-tailed. LightGBM handles this natively without scaling.`
                    : `Skewness of ${stats.skewness.toFixed(2)} — distribution is approximately symmetric. Features are well-behaved for tree-based modeling.`}
                </p>
              </div>
            </>
          ) : (
            <div className="animate-pulse text-slate-500 text-sm">Select a feature to view stats</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
