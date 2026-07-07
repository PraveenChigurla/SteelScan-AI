"use client";

import { motion } from "framer-motion";
import { Book, Code, Server, Database } from "lucide-react";

export default function DocsPage() {
  return (
    <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="flex flex-col gap-8 pb-12 max-w-4xl">
      <div className="mb-4">
        <h2 className="text-3xl font-bold mb-2 text-white flex items-center gap-3">
          <Book className="w-8 h-8 text-brandBlue" /> Platform Documentation
        </h2>
        <p className="text-textMuted max-w-3xl leading-relaxed">
          Technical specifications for the Steel Faults AI Classifier.
        </p>
      </div>

      <div className="space-y-6">
        <div className="panel p-6 border-l-4 border-brandBlue">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Server className="w-5 h-5 text-brandBlue"/> API Architecture</h3>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            The backend is powered by <strong>FastAPI</strong>, serving a serialized LightGBM model. 
            The Next.js frontend communicates with the backend via REST endpoints.
          </p>
          <ul className="list-disc pl-5 text-sm text-slate-400 space-y-2">
            <li><code className="text-brandBlue font-mono">GET /api/metrics</code>: Returns dataset metadata, feature importances, and classification reports.</li>
            <li><code className="text-brandBlue font-mono">POST /api/predict</code>: Accepts a JSON payload of 27 features and returns a single inference result.</li>
            <li><code className="text-brandBlue font-mono">POST /api/predict-batch</code>: Accepts a CSV file upload for bulk inference.</li>
          </ul>
        </div>

        <div className="panel p-6 border-l-4 border-brandPurple">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Code className="w-5 h-5 text-brandPurple"/> Model Details</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            The core engine is a <strong>LightGBM</strong> classifier trained with `is_unbalance=True` to handle the severe class imbalance in the dataset.
            Hyperparameters were tuned using 5-fold Stratified Cross-Validation.
          </p>
        </div>

        <div className="panel p-6 border-l-4 border-brandGreen">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Database className="w-5 h-5 text-brandGreen"/> Dataset Origin</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Sourced from the UCI Machine Learning Repository ("Steel Plates Faults"). It contains 1941 instances and 27 attributes representing geometric and shape features of steel plates.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
