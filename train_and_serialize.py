import pandas as pd
import numpy as np
import pickle
import json
import os
from lightgbm import LGBMClassifier
from sklearn.metrics import (
    accuracy_score, classification_report, confusion_matrix,
    roc_auc_score, precision_score, recall_score, f1_score, roc_curve
)
from sklearn.preprocessing import LabelEncoder, label_binarize
from sklearn.model_selection import train_test_split, cross_val_score

# Define file paths
data_path = "stell-faults.csv"
unseen_data_path = "unseen_test_data_with_labels.csv"

# Load primary dataset
print("Loading steel faults dataset...")
df = pd.read_csv(data_path)

# Fault labels
Faults = ['Pastry', 'Z_Scratch', 'K_Scatch', 'Stains', 'Dirtiness', 'Bumps', 'Other_Faults']

# 1. Feature-Target Split
X = df.drop(Faults, axis=1)
Y = df[Faults].idxmax(axis=1)
x_train, x_test, y_train, y_test = train_test_split(X, Y, test_size=0.3, random_state=42, stratify=Y)

# 2. Encode Target Labels for LightGBM
le = LabelEncoder()
y_train_encoded = le.fit_transform(y_train)
y_test_encoded = le.transform(y_test)

# 3. Initialize LightGBM
lgbm_model = LGBMClassifier(random_state=42, verbosity=-1)

# Calculate Cross-Validation Scores before final fit (using training data)
print("Calculating Cross-Validation Scores (5-Fold)...")
cv_scores = cross_val_score(lgbm_model, x_train, y_train_encoded, cv=5, scoring='accuracy')
cv_mean = cv_scores.mean()
cv_std = cv_scores.std()

# Train the model
print("Training LightGBM model...")
lgbm_model.fit(x_train, y_train_encoded)

# 4. Predictions
y_train_pred = lgbm_model.predict(x_train)
y_pred = lgbm_model.predict(x_test)
y_prob = lgbm_model.predict_proba(x_test)

# 5. Calculate Metrics
train_acc = accuracy_score(y_train_encoded, y_train_pred)
test_acc = accuracy_score(y_test_encoded, y_pred)
precision = precision_score(y_test_encoded, y_pred, average='macro')
recall = recall_score(y_test_encoded, y_pred, average='macro')
f1 = f1_score(y_test_encoded, y_pred, average='macro')
roc_auc = roc_auc_score(y_test_encoded, y_prob, multi_class='ovr', average='macro')

# Generate Summary Dataframe
metrics_summary = pd.DataFrame({
    'Metric': ['Train Accuracy', 'Test Accuracy', 'Precision (Macro)', 'Recall (Macro)', 'F1-Score (Macro)', 'ROC-AUC', 'CV Score (Mean)', 'CV Std'],
    'Value': [train_acc, test_acc, precision, recall, f1, roc_auc, cv_mean, cv_std]
})

print("\n======================= MODEL METRICS SUMMARY =======================")
print(metrics_summary.to_string(index=False, formatters={'Value': '{:,.4f}'.format}))
print("=====================================================================\n")

conf_matrix = confusion_matrix(y_test_encoded, y_pred)
class_report = classification_report(y_test_encoded, y_pred, target_names=le.classes_, output_dict=True)
print("\nConfusion Matrix:\n", conf_matrix)
print("\nClassification Report:\n", classification_report(y_test_encoded, y_pred, target_names=le.classes_))

# ----------------- Unseen Data Evaluation -----------------
print("Evaluating on Unseen Data...")
df_unseen = pd.read_csv(unseen_data_path)

# Separate features and target label from unseen dataset
unseenX = df_unseen.drop("Target_Label", axis=1)
unseenY_labels = df_unseen["Target_Label"]

# Predict directly using your trained LightGBM model
unseen_preds_encoded = lgbm_model.predict(unseenX)

# Decode the numeric predictions back to original string text labels
unseen_preds = le.inverse_transform(unseen_preds_encoded)

# Calculate and print the accuracy score
unseen_accuracy = accuracy_score(unseenY_labels, unseen_preds)
print(f"Unseen Dataset Accuracy: {unseen_accuracy:.4f}")

# Print the full classification report
unseen_class_report = classification_report(unseenY_labels, unseen_preds, output_dict=True)
print("\nUnseen Classification Report:\n")
print(classification_report(unseenY_labels, unseen_preds))

# ----------------- Serialization -----------------
print("Serializing model, label encoder and metrics...")
with open("model.pkl", "wb") as f:
    pickle.dump(lgbm_model, f)

with open("label_encoder.pkl", "wb") as f:
    pickle.dump(le, f)

import scipy.stats as stats

feature_stats_dict = {}
for col in X.columns:
    col_data = X[col].dropna()
    mean_val = float(col_data.mean())
    std_val = float(col_data.std())
    min_val = float(col_data.min())
    max_val = float(col_data.max())
    
    # Histogram and KDE
    counts, bins = np.histogram(col_data, bins=20)
    bin_centers = bins[:-1] + np.diff(bins) / 2
    try:
        kde_func = stats.gaussian_kde(col_data)
        kde_vals = kde_func(bin_centers)
        # Normalize KDE to match histogram counts scale roughly for dual-axis plotting
        kde_vals = kde_vals * len(col_data) * np.diff(bins)[0]
    except Exception:
        kde_vals = np.zeros_like(counts)
        
    hist_data = [
        {
            "bin": round(float(bin_centers[i]), 4),
            "count": int(counts[i]),
            "kde": round(float(kde_vals[i]), 4)
        }
        for i in range(len(counts))
    ]
    
    feature_stats_dict[col] = {
        "mean": mean_val,
        "median": float(col_data.median()),
        "std": std_val,
        "min": min_val,
        "max": max_val,
        "skewness": float(col_data.skew()),
        "q25": float(col_data.quantile(0.25)),
        "q75": float(col_data.quantile(0.75)),
        "hist_data": hist_data
    }

# Prepare metrics dictionary for the UI dashboard
metrics_data = {
    "train_accuracy": float(train_acc),
    "test_accuracy": float(test_acc),
    "precision": float(precision),
    "recall": float(recall),
    "f1_score": float(f1),
    "roc_auc": float(roc_auc),
    "cv_mean": float(cv_mean),
    "cv_std": float(cv_std),
    "unseen_accuracy": float(unseen_accuracy),
    "feature_names": list(X.columns),
    "class_names": list(le.classes_),
    "confusion_matrix": conf_matrix.tolist(),
    "classification_report": class_report,
    "unseen_classification_report": unseen_class_report,
    "feature_importances": {
        name: float(imp)
        for name, imp in zip(X.columns, lgbm_model.feature_importances_)
    },
    "feature_stats": feature_stats_dict,
    "roc_curves": {
        cls_name: dict(zip(
            ["fpr", "tpr"],
            [
                [round(v, 4) for v in arr]
                for arr in roc_curve(
                    label_binarize(y_test, classes=le.classes_)[:, i],
                    y_prob[:, i]
                )[:2]
            ]
        ))
        for i, cls_name in enumerate(le.classes_)
    }
}

with open("metrics.json", "w") as f:
    json.dump(metrics_data, f, indent=4)

print("All artifacts successfully saved!")
