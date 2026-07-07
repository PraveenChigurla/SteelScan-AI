"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ListTree, ArrowUpCircle, ArrowDownCircle, Lightbulb } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  "X_Minimum":             "#38bdf8",
  "X_Maximum":             "#38bdf8",
  "Y_Minimum":             "#38bdf8",
  "Y_Maximum":             "#38bdf8",
  "Pixels_Areas":          "#a78bfa",
  "X_Perimeter":           "#a78bfa",
  "Y_Perimeter":           "#a78bfa",
  "Sum_of_Luminosity":     "#34d399",
  "Minimum_of_Luminosity": "#34d399",
  "Maximum_of_Luminosity": "#34d399",
  "Length_of_Conveyer":    "#fb923c",
  "TypeOfSteel_A300":      "#fb923c",
  "TypeOfSteel_A400":      "#fb923c",
  "Steel_Plate_Thickness": "#fb923c",
  "Edges_Index":           "#f472b6",
  "Empty_Index":           "#f472b6",
  "Square_Index":          "#f472b6",
  "Outside_X_Index":       "#f472b6",
  "Edges_X_Index":         "#f472b6",
  "Edges_Y_Index":         "#f472b6",
  "Outside_Global_Index":  "#f472b6",
  "LogOfAreas":            "#f472b6",
  "Log_X_Index":           "#f472b6",
  "Log_Y_Index":           "#f472b6",
  "Orientation_Index":     "#f472b6",
  "Luminosity_Index":      "#f472b6",
  "SigmoidOfAreas":        "#f472b6",
};

const CATEGORY_META: Record<string, { label: string; color: string }> = {
  Position:    { label: "Position",    color: "#38bdf8" },
  Geometry:    { label: "Geometry",    color: "#a78bfa" },
  Luminosity:  { label: "Luminosity",  color: "#34d399" },
  Manufacture: { label: "Manufacturing", color: "#fb923c" },
  Shape:       { label: "Shape & Statistical", color: "#f472b6" },
};

export default function FeaturesPage() {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    fetch('/api/metrics').then(r => r.json()).then(data => setMetrics(data)).catch(console.error);
  }, []);

  const featureImpData: { name: string; value: number; color: string }[] = metrics?.feature_importances
    ? Object.entries(metrics.feature_importances)
        .sort((a: any, b: any) => b[1] - a[1])
        .map(([name, value]) => ({
          name,
          value: value as number,
          color: CATEGORY_COLORS[name] ?? "#8b5cf6",
        }))
    : [];

  const maxVal = featureImpData[0]?.value ?? 1;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8 pb-12">
      <div className="mb-2">
        <span className="badge badge-green mb-3">Feature Engineering</span>
        <h2 className="text-3xl font-bold mb-2 text-white flex items-center gap-3">
          <ListTree className="w-8 h-8 text-brandGreen" /> Feature Analysis
        </h2>
        <p className="text-textMuted max-w-3xl leading-relaxed">
          LightGBM feature importances (gain) — a higher score means the feature contributes more information to predicting the fault class.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        {Object.entries(CATEGORY_META).map(([k, v]) => (
          <div key={k} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: v.color }} />
            <span className="text-slate-400">{v.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main chart */}
        <div className="lg:col-span-3 panel p-6">
          <h3 className="font-bold text-white mb-6 text-lg border-b border-panelBorder pb-3">
            Feature Importance — All 27 Features Ranked
          </h3>

          {featureImpData.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-pulse text-slate-500 text-sm">Loading feature data from API…</div>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              {featureImpData.map((f, i) => {
                const pct = (f.value / maxVal) * 100;
                return (
                  <div key={f.name} className="group">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[11px] text-slate-400 w-5 text-right shrink-0">#{i + 1}</span>
                      <span className="text-[12px] font-mono text-white w-44 shrink-0 truncate" title={f.name}>{f.name}</span>
                      <div className="flex-1 bg-[#0b0f19] rounded-full h-5 relative overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, delay: i * 0.025, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: f.color, opacity: 0.85 }}
                        />
                      </div>
                      <span className="text-[12px] font-mono font-bold w-16 text-right shrink-0" style={{ color: f.color }}>
                        {f.value.toFixed(0)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Side cards */}
        <div className="flex flex-col gap-4">
          <div className="panel bg-blue-500/5 border-blue-500/20">
            <h4 className="font-bold text-brandBlue mb-4 flex items-center gap-2 text-sm">
              <ArrowUpCircle className="w-4 h-4" /> Top 5 Drivers
            </h4>
            <ul className="text-xs text-slate-300 space-y-3">
              {featureImpData.slice(0, 5).map((f, i) => (
                <li key={f.name} className="flex justify-between items-center pb-2 border-b border-blue-500/10">
                  <span className="font-medium truncate" title={f.name}>{f.name}</span>
                  <span className="font-mono font-bold ml-2 shrink-0" style={{ color: f.color }}>
                    {f.value.toFixed(0)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel bg-red-500/5 border-red-500/20">
            <h4 className="font-bold text-red-400 mb-4 flex items-center gap-2 text-sm">
              <ArrowDownCircle className="w-4 h-4" /> Lowest Impact
            </h4>
            <ul className="text-xs text-slate-300 space-y-3">
              {featureImpData.slice(-5).map((f) => (
                <li key={f.name} className="flex justify-between items-center pb-2 border-b border-red-500/10">
                  <span className="font-medium truncate" title={f.name}>{f.name}</span>
                  <span className="font-mono font-bold text-red-400 ml-2 shrink-0">{f.value.toFixed(0)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel bg-brandPurple/10 border-l-4 border-brandPurple p-4 rounded-r-lg">
            <h4 className="font-bold text-brandPurple mb-2 text-sm flex items-center gap-2">
              <Lightbulb className="w-4 h-4" /> Key Insight
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Geometric features like <span className="text-white font-semibold">Pixels_Areas</span> and <span className="text-white font-semibold">X/Y Perimeter</span> dominate — physical size is the most reliable fault signature. Luminosity adds secondary discriminating power for dark stains and scratches.
            </p>
          </div>

          {featureImpData.length > 0 && (
            <div className="panel p-4 bg-[#0b0f19]">
              <h4 className="font-bold text-white mb-3 text-sm">Importance Distribution</h4>
              <div className="space-y-2 text-xs">
                {Object.entries(CATEGORY_META).map(([k, v]) => {
                  const catFeatures = featureImpData.filter(f => f.color === v.color);
                  const catTotal = catFeatures.reduce((s, f) => s + f.value, 0);
                  const allTotal = featureImpData.reduce((s, f) => s + f.value, 0);
                  const catPct = allTotal > 0 ? ((catTotal / allTotal) * 100) : 0;
                  return (
                    <div key={k}>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>{v.label}</span>
                        <span style={{ color: v.color }}>{catPct.toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 bg-[#1a2035] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${catPct}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: v.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
