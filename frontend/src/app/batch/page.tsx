"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { UploadCloud, FileSpreadsheet, Play, CheckCircle2, Download, AlertTriangle } from "lucide-react";

const TARGET_CLASSES = ["Pastry", "Z_Scratch", "K_Scatch", "Stains", "Dirtiness", "Bumps", "Other_Faults"];

export default function BatchPredictionPage() {
  const [results, setResults] = useState<any[]>([]);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setResults([]);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim() !== '');
      if (lines.length > 0) {
        const headers = lines[0].split(',').map(h => h.trim());
        const data = lines.slice(1).map(line => {
          const values = line.split(',');
          const obj: any = {};
          headers.forEach((h, i) => obj[h] = values[i]?.trim());
          return obj;
        });
        setCsvHeaders(headers);
        setCsvData(data);
      }
    };
    reader.readAsText(file);
  };

  const handlePredict = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setErrorMsg(null);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('/api/predict-batch', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json();
        setErrorMsg(errData.detail || `Server error: ${res.status}`);
        setResults([]);
        return;
      }

      const data = await res.json();
      // Backend returns { predictions: [...], total_records: N }
      const predictions = data.predictions || data.results || [];
      if (predictions.length === 0) {
        setErrorMsg("API returned empty predictions. Check that the FastAPI server is running.");
      } else {
        setResults(predictions);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(`Failed to connect to the prediction API: ${err.message}. Ensure FastAPI is running on port 8000.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportCSV = () => {
    if (results.length === 0 || csvData.length === 0) return;

    const headers = ["Prediction", "Confidence_%", ...csvHeaders].join(",");
    const rows = results.map((r: any, i: number) => {
      const row = csvData[i] || {};
      const pred = r.prediction || "";
      // Backend provides confidence directly OR via probabilities dict
      const conf = r.confidence != null
        ? (r.confidence * 100).toFixed(1)
        : r.probabilities
          ? (Math.max(...Object.values(r.probabilities as Record<string, number>)) * 100).toFixed(1)
          : "";
      return `"${pred}","${conf}",${csvHeaders.map(h => `"${row[h] || ''}"`).join(",")}`;
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "batch_predictions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate Batch Accuracy if labels are present in the CSV
  const batchAccuracy = useMemo(() => {
    if (results.length === 0 || csvData.length === 0) return null;
    
    // Check if the CSV has the 7 one-hot encoded target columns
    const hasTargets = TARGET_CLASSES.every(c => csvHeaders.includes(c));
    if (!hasTargets) return null;

    let correct = 0;
    let total = 0;

    csvData.forEach((row, i) => {
      const r = results[i];
      if (!r) return;
      
      // Determine true label from one-hot columns
      let trueLabel = null;
      for (const tClass of TARGET_CLASSES) {
        if (row[tClass] === "1" || row[tClass] === 1 || row[tClass] === "1.0") {
          trueLabel = tClass;
          break;
        }
      }

      if (trueLabel) {
        total++;
        if (r.prediction === trueLabel) {
          correct++;
        }
      }
    });

    if (total === 0) return null;
    return ((correct / total) * 100).toFixed(2);
  }, [csvData, csvHeaders, results]);

  return (
    <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="flex flex-col gap-8 pb-12">
      <div className="mb-4">
        <h2 className="text-3xl font-bold mb-2 text-white flex items-center gap-3">
          <UploadCloud className="w-8 h-8 text-brandPurple" /> Batch Processing
        </h2>
        <p className="text-textMuted max-w-3xl leading-relaxed">
          Upload a CSV file containing multiple plate scan records for bulk inference. The results will be appended directly to your dataset view.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 panel border-dashed border-2 border-panelBorder hover:border-brandPurple hover:bg-brandPurple/5 transition-colors cursor-pointer relative">
          <input type="file" accept=".csv" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} disabled={isProcessing} />
          <div className="flex flex-col items-center justify-center py-16 text-center">
            {selectedFile ? (
              <>
                <CheckCircle2 className="w-16 h-16 text-brandGreen mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{selectedFile.name} Loaded</h3>
                <p className="text-sm text-brandGreen">{csvData.length} records ready for processing.</p>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-16 h-16 text-brandPurple/80 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Click or Drag to Upload CSV</h3>
                <p className="text-sm text-textMuted">Ensure the CSV contains all required feature columns.</p>
              </>
            )}
          </div>
        </div>
        
        <div className="panel flex flex-col justify-center items-center p-8 bg-[#0f141e]">
           <h3 className="text-lg font-bold text-white mb-6 text-center">Ready to Execute?</h3>
           <button 
              onClick={handlePredict}
              disabled={!selectedFile || isProcessing}
              className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
                !selectedFile ? 'bg-panelBorder text-slate-500 cursor-not-allowed' 
                : isProcessing ? 'bg-brandPurple/50 text-white cursor-wait' 
                : 'bg-brandPurple hover:bg-purple-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]'
              }`}
            >
              {isProcessing ? (
                <><div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div> Processing...</>
              ) : (
                <><Play className="w-5 h-5 fill-current" /> Run Batch Prediction</>
              )}
           </button>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5" />
          <p className="text-sm">{errorMsg}</p>
        </div>
      )}

      {(results.length > 0 || csvData.length > 0) && !errorMsg && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white text-xl flex items-center gap-2">
              Inference Results <span className="text-textMuted">({csvData.length} records)</span>
            </h3>
            {results.length > 0 && (
              <button 
                onClick={handleExportCSV}
                className="bg-[#121827] hover:bg-white/10 border border-panelBorder text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export predicted CSV
              </button>
            )}
          </div>

          {batchAccuracy !== null && (
            <div className="panel bg-[#0b0f19] border-brandGreen flex justify-between items-center p-6">
              <span className="text-slate-300 font-medium">Batch Accuracy:</span>
              <span className="text-3xl font-extrabold text-brandGreen">{batchAccuracy}%</span>
            </div>
          )}

          <div className="panel p-0 overflow-hidden shadow-2xl border-t-4 border-brandPurple">
            <div className="max-h-[600px] overflow-auto custom-scrollbar">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-[#121827] border-b border-panelBorder text-slate-400 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="p-4 font-bold border-r border-panelBorder bg-[#161d2e] sticky left-0 z-20">Prediction</th>
                    <th className="p-4 font-bold border-r border-panelBorder bg-[#161d2e] sticky left-[120px] z-20">Confidence</th>
                    {csvHeaders.map(h => (
                      <th key={h} className="p-3 font-medium text-[10px] uppercase tracking-wider">
                        {h.includes('_') ? (
                          <>
                            {h.split('_')[0]}<br/>{h.split('_').slice(1).join('_')}
                          </>
                        ) : h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-panelBorder">
                  {csvData.map((row, i) => {
                    const r = results[i];
                    // support both r.confidence and r.probabilities
                    const conf = r
                      ? r.confidence != null
                        ? r.confidence
                        : r.probabilities
                          ? Math.max(...Object.values(r.probabilities as Record<string, number>))
                          : 0
                      : 0;
                    
                    return (
                      <tr key={i} className="hover:bg-white/5 transition-colors group">
                        <td className="p-4 border-r border-panelBorder bg-[#0f141e] group-hover:bg-[#161d2e] transition-colors sticky left-0 z-10 font-bold">
                          {r ? (
                            <span className="text-brandBlue">{r.prediction}</span>
                          ) : (
                            <span className="text-slate-600 font-medium italic text-xs">Pending…</span>
                          )}
                        </td>
                        <td className="p-4 border-r border-panelBorder bg-[#0f141e] group-hover:bg-[#161d2e] transition-colors sticky left-[120px] z-10">
                          {r ? (
                            <span className="font-mono font-bold text-brandGreen">{(conf * 100).toFixed(1)}%</span>
                          ) : (
                            <span className="text-slate-600 text-xs">-</span>
                          )}
                        </td>
                        {csvHeaders.map(h => (
                          <td key={h} className="p-3 text-slate-300 font-mono text-[11px]">{row[h]}</td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
