import numpy as np
import os
import pandas as pd

# =========================================================================
# EDGE XGBOOST / GRADIENT BOOSTED DECISION TREES (GBDT)
# Sequential Ensemble of Weak Decision Trees on Negative Loss Gradients
# Zero Dying Neurons, Robust to Sensor Noise, Compiles to C++ for ESP32
# =========================================================================

print("=========================================================")
print("[XGBOOST] Training Edge XGBoost / GBDT Crop Stress Model...")
print("=========================================================")

csv_path = os.path.join(os.path.dirname(__file__), "backend/agriculture_dataset_with_target.csv")
df = pd.read_csv(csv_path)

features = ['Soil_Moisture', 'Air_Temperature', 'Humidity', 'Solar_Radiation']
X = df[features].values
n_samples = len(X)

# Target: 0 = Healthy, 1 = Moderate_Stress, 2 = High_Stress
class_mapping = {'Healthy': 0, 'Moderate_Stress': 1, 'High_Stress': 2}
y = df['Crop_Health'].map(class_mapping).values
n_classes = 3

# One-hot encode targets
Y_onehot = np.zeros((n_samples, n_classes))
Y_onehot[np.arange(n_samples), y] = 1.0

# -------------------------------------------------------------
# Decision Tree Regressor for Negative Gradients (Residuals)
# -------------------------------------------------------------
class RegressionTree:
    def __init__(self, max_depth=2):
        self.max_depth = max_depth
        self.tree = None

    def fit(self, X, residual):
        self.tree = self._build(X, residual, depth=0)

    def _build(self, X, r, depth):
        if depth >= self.max_depth or len(r) < 15 or np.all(r == r[0]):
            return {'value': float(np.mean(r))}

        best_loss = float('inf')
        best_split = None

        for feat in range(X.shape[1]):
            # Sample candidate split thresholds
            thresholds = np.percentile(X[:, feat], [20, 40, 60, 80])
            for thresh in thresholds:
                left_mask = X[:, feat] < thresh
                right_mask = ~left_mask
                if np.sum(left_mask) < 5 or np.sum(right_mask) < 5:
                    continue

                r_left = r[left_mask]
                r_right = r[right_mask]
                # Mean Squared Error reduction
                loss = np.sum((r_left - np.mean(r_left))**2) + np.sum((r_right - np.mean(r_right))**2)

                if loss < best_loss:
                    best_loss = loss
                    best_split = (feat, thresh, left_mask, right_mask)

        if best_split is None:
            return {'value': float(np.mean(r))}

        feat, thresh, left_m, right_m = best_split
        return {
            'feature': feat,
            'threshold': float(thresh),
            'left': self._build(X[left_m], r[left_m], depth + 1),
            'right': self._build(X[right_m], r[right_m], depth + 1)
        }

    def predict_one(self, node, x):
        if 'value' in node:
            return node['value']
        if x[node['feature']] < node['threshold']:
            return self.predict_one(node['left'], x)
        return self.predict_one(node['right'], x)

    def predict(self, X):
        return np.array([self.predict_one(self.tree, x) for x in X])

# -------------------------------------------------------------
# Multi-Class Gradient Boosting Training Loop
# -------------------------------------------------------------
n_estimators = 5 # 5 rounds of boosting (15 trees total) for ultra-low ESP32 latency
learning_rate = 0.15

# Initial raw logit predictions (zeros)
raw_predictions = np.zeros((n_samples, n_classes))

# Storage for trained trees: list of (class_idx, RegressionTree)
boosted_trees = []

print(f"[XGBOOST] Boosting {n_estimators} rounds across {n_classes} classes ({n_estimators * n_classes} weak trees total)...")

for round_num in range(n_estimators):
    # Compute Softmax probabilities
    exp_logits = np.exp(raw_predictions - np.max(raw_predictions, axis=1, keepdims=True))
    probs = exp_logits / np.sum(exp_logits, axis=1, keepdims=True)

    # Negative Gradients for Cross-Entropy: residual = y_true - probability
    residuals = Y_onehot - probs

    for c in range(n_classes):
        tree = RegressionTree(max_depth=2)
        tree.fit(X, residuals[:, c])
        tree_preds = tree.predict(X)

        # Update ensemble logits
        raw_predictions[:, c] += learning_rate * tree_preds
        boosted_trees.append((c, tree.tree))

    # Evaluate accuracy on current iteration
    current_preds = np.argmax(raw_predictions, axis=1)
    acc = np.mean(current_preds == y) * 100
    print(f"  Round {round_num + 1:2d}/{n_estimators} | Train Accuracy: {acc:.2f}%")

final_preds = np.argmax(raw_predictions, axis=1)
final_acc = np.mean(final_preds == y) * 100
print(f"\n[SUCCESS] Final XGBoost Ensemble Accuracy: {final_acc:.2f}%")

# -------------------------------------------------------------
# Generate C++ Header for ESP32 Deployment
# -------------------------------------------------------------
feature_names = ['soilMoisture', 'temp', 'humidity', 'solarRadiation']

def node_to_cpp(node, indent="        "):
    if 'value' in node:
        return f"{indent}return {node['value']:.6f}f;\n"
    feat = feature_names[node['feature']]
    code = f"{indent}if ({feat} < {node['threshold']:.2f}f) {{\n"
    code += node_to_cpp(node['left'], indent + "    ")
    code += f"{indent}}} else {{\n"
    code += node_to_cpp(node['right'], indent + "    ")
    code += f"{indent}}}\n"
    return code

cpp_trees_code = ""
for idx, (c, tree_node) in enumerate(boosted_trees):
    cpp_trees_code += f"// Tree {idx} (Target Class: {c})\n"
    cpp_trees_code += f"inline float evalTree_{idx}(float soilMoisture, float temp, float humidity, float solarRadiation) {{\n"
    cpp_trees_code += node_to_cpp(tree_node)
    cpp_trees_code += "}\n\n"

cpp_code = f"""#pragma once
#include <math.h>

// =========================================================================
// Auto-Generated Edge XGBoost / Gradient Boosted Ensemble for ESP32
// Rounds: {n_estimators} | Trees: {len(boosted_trees)} | Learning Rate: {learning_rate}
// Zero dying neurons | Constant microsecond execution | Pure branch math
// =========================================================================

namespace EdgeXGBoost {{

{cpp_trees_code}

// Predict Crop Stress using the boosted tree ensemble
// 0 = HEALTHY, 1 = MODERATE_STRESS, 2 = HIGH_STRESS
inline int predictCropStress(float soilMoisture, float temp, float humidity, float solarRadiation) {{
    float logits[3] = {{ 0.0f, 0.0f, 0.0f }};
    const float lr = {learning_rate}f;

"""

for idx, (c, _) in enumerate(boosted_trees):
    cpp_code += f"    logits[{c}] += lr * evalTree_{idx}(soilMoisture, temp, humidity, solarRadiation);\n"

cpp_code += """
    // Argmax selection across 3 class logits
    int bestClass = 0;
    float maxLogit = logits[0];
    for (int c = 1; c < 3; c++) {
        if (logits[c] > maxLogit) {
            maxLogit = logits[c];
            bestClass = c;
        }
    }
    return bestClass;
}

} // namespace EdgeXGBoost
"""

header_path = os.path.join(os.path.dirname(__file__), "wokwi/xgboost_model.h")
with open(header_path, "w") as f:
    f.write(cpp_code)

print(f"[EXPORT] C++ XGBoost model successfully exported to: {header_path}")
print("=========================================================\n")
