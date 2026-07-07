"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Crosshair, Play, ScanLine } from "lucide-react";

export default function SinglePredictionPage() {
  const [featureList, setFeatureList] = useState<string[]>([]);
  const [inputs, setInputs] = useState<Record<string, number>>({});
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetch('/api/metrics').then(r => r.json()).then(data => {
      setFeatureList(data.feature_names || []);
      const init: Record<string, number> = {};
      (data.feature_names || []).forEach((f: string) => init[f] = 0);
      setInputs(init);
    }).catch(console.error);
  }, []);

  const samples = [
    { label: "Other_Faults", data: {"X_Minimum": 333.0, "X_Maximum": 342.0, "Y_Minimum": 764107.0, "Y_Maximum": 764213.0, "Pixels_Areas": 525.0, "X_Perimeter": 16.0, "Y_Perimeter": 106.0, "Sum_of_Luminosity": 57020.0, "Minimum_of_Luminosity": 95.0, "Maximum_of_Luminosity": 127.0, "Length_of_Conveyer": 1353.0, "TypeOfSteel_A300": 0.0, "TypeOfSteel_A400": 1.0, "Steel_Plate_Thickness": 70.0, "Edges_Index": 0.4922, "Empty_Index": 0.4497, "Square_Index": 0.0849, "Outside_X_Index": 0.0066, "Edges_X_Index": 0.5625, "Edges_Y_Index": 1.0, "Outside_Global_Index": 1.0, "LogOfAreas": 2.7202, "Log_X_Index": 0.9542, "Log_Y_Index": 2.0253, "Orientation_Index": 0.9151, "Luminosity_Index": -0.1515, "SigmoidOfAreas": 0.9872} },
    { label: "Dirtiness",    data: {"X_Minimum": 1325.0, "X_Maximum": 1339.0, "Y_Minimum": 30207.0, "Y_Maximum": 30238.0, "Pixels_Areas": 268.0, "X_Perimeter": 29.0, "Y_Perimeter": 31.0, "Sum_of_Luminosity": 25809.0, "Minimum_of_Luminosity": 79.0, "Maximum_of_Luminosity": 124.0, "Length_of_Conveyer": 1353.0, "TypeOfSteel_A300": 0.0, "TypeOfSteel_A400": 1.0, "Steel_Plate_Thickness": 120.0, "Edges_Index": 0.0207, "Empty_Index": 0.3825, "Square_Index": 0.4516, "Outside_X_Index": 0.0104, "Edges_X_Index": 0.4828, "Edges_Y_Index": 1.0, "Outside_Global_Index": 1.0, "LogOfAreas": 2.4281, "Log_X_Index": 1.1461, "Log_Y_Index": 1.4914, "Orientation_Index": 0.5484, "Luminosity_Index": -0.2476, "SigmoidOfAreas": 0.7065} },
    { label: "Bumps",        data: {"X_Minimum": 38.0, "X_Maximum": 49.0, "Y_Minimum": 735612.0, "Y_Maximum": 735624.0, "Pixels_Areas": 113.0, "X_Perimeter": 11.0, "Y_Perimeter": 12.0, "Sum_of_Luminosity": 12652.0, "Minimum_of_Luminosity": 93.0, "Maximum_of_Luminosity": 130.0, "Length_of_Conveyer": 1707.0, "TypeOfSteel_A300": 1.0, "TypeOfSteel_A400": 0.0, "Steel_Plate_Thickness": 100.0, "Edges_Index": 0.0445, "Empty_Index": 0.1439, "Square_Index": 0.9167, "Outside_X_Index": 0.0064, "Edges_X_Index": 1.0, "Edges_Y_Index": 1.0, "Outside_Global_Index": 1.0, "LogOfAreas": 2.0531, "Log_X_Index": 1.0414, "Log_Y_Index": 1.0792, "Orientation_Index": 0.0833, "Luminosity_Index": -0.1253, "SigmoidOfAreas": 0.2432} },
    { label: "K_Scatch",     data: {"X_Minimum": 464.0, "X_Maximum": 474.0, "Y_Minimum": 28542.0, "Y_Maximum": 28553.0, "Pixels_Areas": 72.0, "X_Perimeter": 13.0, "Y_Perimeter": 12.0, "Sum_of_Luminosity": 13094.0, "Minimum_of_Luminosity": 168.0, "Maximum_of_Luminosity": 198.0, "Length_of_Conveyer": 1387.0, "TypeOfSteel_A300": 0.0, "TypeOfSteel_A400": 1.0, "Steel_Plate_Thickness": 40.0, "Edges_Index": 0.6691, "Empty_Index": 0.3455, "Square_Index": 0.9091, "Outside_X_Index": 0.0072, "Edges_X_Index": 0.7692, "Edges_Y_Index": 0.9167, "Outside_Global_Index": 1.0, "LogOfAreas": 1.8573, "Log_X_Index": 1.0, "Log_Y_Index": 1.0414, "Orientation_Index": 0.0909, "Luminosity_Index": 0.4208, "SigmoidOfAreas": 0.2173} },
    { label: "Z_Scratch",    data: {"X_Minimum": 1166.0, "X_Maximum": 1185.0, "Y_Minimum": 2258648.0, "Y_Maximum": 2258662.0, "Pixels_Areas": 123.0, "X_Perimeter": 33.0, "Y_Perimeter": 17.0, "Sum_of_Luminosity": 15858.0, "Minimum_of_Luminosity": 116.0, "Maximum_of_Luminosity": 143.0, "Length_of_Conveyer": 1708.0, "TypeOfSteel_A300": 1.0, "TypeOfSteel_A400": 0.0, "Steel_Plate_Thickness": 100.0, "Edges_Index": 0.6124, "Empty_Index": 0.5376, "Square_Index": 0.7368, "Outside_X_Index": 0.0111, "Edges_X_Index": 0.5758, "Edges_Y_Index": 0.8235, "Outside_Global_Index": 0.0, "LogOfAreas": 2.0899, "Log_X_Index": 1.2787, "Log_Y_Index": 1.1461, "Orientation_Index": -0.2632, "Luminosity_Index": 0.0072, "SigmoidOfAreas": 0.4399} },
    { label: "Pastry",       data: {"X_Minimum": 42.0, "X_Maximum": 50.0, "Y_Minimum": 270900.0, "Y_Maximum": 270944.0, "Pixels_Areas": 267.0, "X_Perimeter": 17.0, "Y_Perimeter": 44.0, "Sum_of_Luminosity": 24220.0, "Minimum_of_Luminosity": 76.0, "Maximum_of_Luminosity": 108.0, "Length_of_Conveyer": 1687.0, "TypeOfSteel_A300": 1.0, "TypeOfSteel_A400": 0.0, "Steel_Plate_Thickness": 80.0, "Edges_Index": 0.0498, "Empty_Index": 0.2415, "Square_Index": 0.1818, "Outside_X_Index": 0.0047, "Edges_X_Index": 0.4706, "Edges_Y_Index": 1.0, "Outside_Global_Index": 1.0, "LogOfAreas": 2.4265, "Log_X_Index": 0.9031, "Log_Y_Index": 1.6435, "Orientation_Index": 0.8182, "Luminosity_Index": -0.2913, "SigmoidOfAreas": 0.5822} },
    { label: "Stains",       data: {"X_Minimum": 1145.0, "X_Maximum": 1152.0, "Y_Minimum": 1083340.0, "Y_Maximum": 1083344.0, "Pixels_Areas": 22.0, "X_Perimeter": 7.0, "Y_Perimeter": 4.0, "Sum_of_Luminosity": 2871.0, "Minimum_of_Luminosity": 116.0, "Maximum_of_Luminosity": 148.0, "Length_of_Conveyer": 1358.0, "TypeOfSteel_A300": 0.0, "TypeOfSteel_A400": 1.0, "Steel_Plate_Thickness": 50.0, "Edges_Index": 0.3034, "Empty_Index": 0.2143, "Square_Index": 0.5714, "Outside_X_Index": 0.0052, "Edges_X_Index": 1.0, "Edges_Y_Index": 1.0, "Outside_Global_Index": 0.0, "LogOfAreas": 1.3424, "Log_X_Index": 0.8451, "Log_Y_Index": 0.6021, "Orientation_Index": -0.4286, "Luminosity_Index": 0.0195, "SigmoidOfAreas": 0.1384} },
  ];

  const loadSample = (index: number) => {
    setInputs(samples[index].data);
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="flex flex-col gap-8 pb-12">
      <div className="mb-4">
        <h2 className="text-3xl font-bold mb-2 text-white flex items-center gap-3">
          <Crosshair className="w-8 h-8 text-brandBlue" /> Inference Studio
        </h2>
        <p className="text-textMuted max-w-3xl leading-relaxed">
          Interactive real-time prediction via the FastAPI LightGBM backend.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Feature Inputs ({featureList.length})</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-textMuted font-medium mr-2">Load Sample:</span>
              {samples.map((s, i) => (
                <button 
                  key={i} 
                  type="button" 
                  onClick={() => loadSample(i)} 
                  className="bg-[#121827] border border-panelBorder text-cyan-400 hover:bg-brandBlue/10 hover:border-brandBlue/30 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors"
                >
                  Sample {i+1} ({s.label})
                </button>
              ))}
            </div>
          </div>
          <form onSubmit={handlePredict}>
            <div className="panel grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 bg-appBg">
              {featureList.map(f => (
                <div key={f}>
                  <label className="block text-[10px] uppercase text-textMuted mb-1 font-medium truncate" title={f}>{f.replace(/_/g, ' ')}</label>
                  <input 
                    type="number" step="any" required
                    className="w-full bg-[#121827] border border-panelBorder rounded p-2 text-white text-sm outline-none focus:border-brandBlue transition-colors"
                    value={inputs[f] || 0}
                    onChange={(e) => setInputs({...inputs, [f]: parseFloat(e.target.value) || 0})}
                  />
                </div>
              ))}
            </div>
            <button type="submit" className="w-full bg-brandBlue hover:bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-colors">
              <Play className="w-5 h-5 fill-white" /> Execute Inference
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white mb-6">Prediction Result</h3>
          {!result ? (
            <div className="panel flex flex-col items-center justify-center text-center min-h-[300px]">
              <ScanLine className="w-16 h-16 text-slate-700 mb-4" />
              <p className="text-sm text-textMuted">Awaiting input.</p>
            </div>
          ) : (
            <div className="panel border-t-4 border-t-brandGreen bg-gradient-to-b from-brandGreen/10 to-transparent">
              <span className="badge badge-green mb-6">Complete</span>
              <p className="text-[10px] text-textMuted uppercase tracking-wider mb-1">Detected Fault Type</p>
              <h3 className="text-4xl font-extrabold text-white mb-8">{result.prediction}</h3>
              
              <div className="bg-[#0b0f19] border border-panelBorder p-4 rounded-xl mb-6 shadow-inner">
                <p className="text-[10px] text-textMuted uppercase mb-1">Confidence Score</p>
                <p className="text-3xl font-bold text-brandGreen">
                  {(Math.max(...Object.values(result.probabilities as Record<string, number>)) * 100).toFixed(1)}%
                </p>
              </div>
              
              <p className="text-[10px] text-textMuted uppercase mb-2">Recommendation</p>
              <p className="text-sm text-slate-300 border-l-2 border-brandBlue pl-3">Isolate plate for inspection.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
