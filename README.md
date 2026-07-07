# Steel Plate Fault Classifier 🧠⚙️

**Steel Plate Fault Classifier** is an end-to-end Machine Learning web application designed to detect and classify manufacturing defects in steel plates. The platform offers a sleek, modern, enterprise-level UI that provides real-time inference, batch predictions, comprehensive exploratory data analysis (EDA), and interactive model performance metrics.

---

## 🚀 Key Features

*   **Inference Studio (Single Prediction):** Input feature values manually to instantly classify a steel fault using the LightGBM model. Includes verified sample data loading for quick testing.
*   **Batch Prediction:** Upload CSV files to process multiple steel plate records simultaneously. The results are displayed in an interactive, scrollable table with CSV export functionality.
*   **Exploratory Data Analysis (Analytics):** Visual exploration of class distribution and feature distributions, featuring dynamic interactive histograms overlaid with Kernel Density Estimation (KDE) curves.
*   **Model Performance:** Detailed, interactive metrics including dynamic ROC-AUC curves, confusion matrices, and key performance indicators (Accuracy, Precision, Recall, F1-Score).
*   **Dataset Explorer:** Paginated and sortable tabular view of the underlying `stell-faults.csv` dataset.
*   **Feature Analysis:** Visual breakdown of the most critical features driving the LightGBM model's decision-making process.

---

## 🛠️ Technology Stack

**Frontend:**
*   Next.js 14 (App Router)
*   React
*   Tailwind CSS (for styling and glassmorphism UI)
*   Framer Motion (for smooth micro-animations and transitions)
*   Recharts (for interactive data visualization)
*   Lucide React (for iconography)

**Backend / Machine Learning:**
*   FastAPI (Python web framework for serving the model)
*   Uvicorn (ASGI server)
*   Scikit-Learn (Data preprocessing & metrics evaluation)
*   LightGBM (Gradient Boosting classification model)
*   Pandas & NumPy (Data manipulation)
*   SciPy (KDE calculation)

---

## 📂 Project Structure

```text
Steel_Faults_new/
├── frontend/                 # Next.js application (React UI)
│   ├── src/app/              # Next.js App Router pages
│   │   ├── analytics/        # EDA and Distribution Visualizations
│   │   ├── batch/            # Batch Prediction Interface
│   │   ├── dataset/          # Dataset Explorer
│   │   ├── features/         # Feature Importance Analysis
│   │   ├── performance/      # Model Metrics and ROC Curves
│   │   ├── single/           # Inference Studio
│   │   └── page.tsx          # Main Dashboard
│   └── public/               # Static assets
├── stell-faults.csv          # Training Dataset
├── unseen_test_data_with_labels.csv # Unseen testing data
├── train_and_serialize.py    # ML Training script (generates pkl and json artifacts)
├── app.py                    # FastAPI Backend serving predictions and metrics
├── model.pkl                 # Serialized LightGBM Model (generated)
├── label_encoder.pkl         # Serialized Label Encoder (generated)
└── metrics.json              # Pre-calculated statistical metrics for the frontend (generated)
```

---

## ⚙️ Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   Python (3.9+)

### 1. Clone the repository
```bash
# Clone the repo and navigate to the project directory
cd Steel_Faults_new
```

### 2. Setup the Machine Learning Backend
Install the required Python dependencies:
```bash
pip install pandas numpy scikit-learn lightgbm fastapi uvicorn scipy
```

Run the training script to generate the model and necessary metrics artifacts (`model.pkl`, `label_encoder.pkl`, `metrics.json`):
```bash
python train_and_serialize.py
```

Start the FastAPI backend server:
```bash
# Runs on http://127.0.0.1:8000
uvicorn app:app --reload
```

### 3. Setup the Next.js Frontend
Open a new terminal window, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Start the Next.js development server:
```bash
# Runs on http://localhost:3000
npm run dev
```

---

## 📊 Model Information

*   **Algorithm:** LightGBM Classifier
*   **Problem Type:** Multi-class Classification
*   **Target Classes (7):** `Bumps`, `Dirtiness`, `K_Scatch`, `Other_Faults`, `Pastry`, `Stains`, `Z_Scratch`
*   **Validation:** 5-Fold Cross Validation
*   **Data Imbalance:** Addressed natively by LightGBM parameter configuration (`is_unbalance=True`)

---

## 🧑‍💻 Developers

*   **Praveen** - [GitHub Profile](https://github.com/PraveenChigurla?tab=repositories)
*   **Khushi**
