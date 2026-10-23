import numpy as np
import os
import pandas as pd

# =========================================================================
# CLASSICAL ML MODEL: DECISION TREE CLASSIFIER FOR CROP STRESS
# No hidden layers, No ReLU, Zero dying neurons, Highly interpretable
# =========================================================================

print("[DATA] Loading agricultural dataset for Classical ML...")
csv_path = os.path.join(os.path.dirname(__file__), "backend/agriculture_dataset_with_target.csv")
df = pd.read_csv(csv_path)

# Features: Soil_Moisture, Air_Temperature, Humidity, Solar_Radiation
features = ['Soil_Moisture', 'Air_Temperature', 'Humidity', 'Solar_Radiation']
X = df[features].values

# Target classes: 0 = Healthy, 1 = Moderate_Stress, 2 = High_Stress
class_mapping = {'Healthy': 0, 'Moderate_Stress': 1, 'High_Stress': 2}
y = df['Crop_Health'].map(class_mapping).values

class DecisionNode:
    def __init__(self, feature_idx=None, threshold=None, left=None, right=None, value=None):
        self.feature_idx = feature_idx  # index of feature to split on
        self.threshold = threshold      # split threshold
        self.left = left                # left child node (< threshold)
        self.right = right              # right child node (>= threshold)
        self.value = value              # prediction if leaf node

def gini_impurity(y):
    if len(y) == 0:
        return 0
    counts = np.bincount(y, minlength=3)
    probs = counts / len(y)
    return 1.0 - np.sum(probs ** 2)

def best_split(X, y):
    best_gain = -1
    split_idx, split_thresh = None, None
    current_gini = gini_impurity(y)
    n = len(y)

    for feat in range(X.shape[1]):
        thresholds = np.percentile(X[:, feat], [20, 35, 50, 65, 80])
        for thresh in thresholds:
            left_mask = X[:, feat] < thresh
            right_mask = ~left_mask
            if np.sum(left_mask) == 0 or np.sum(right_mask) == 0:
                continue

            g_left = gini_impurity(y[left_mask])
            g_right = gini_impurity(y[right_mask])
            gain = current_gini - (np.sum(left_mask)/n * g_left + np.sum(right_mask)/n * g_right)

            if gain > best_gain:
                best_gain = gain
                split_idx = feat
                split_thresh = thresh

    return split_idx, split_thresh

def build_tree(X, y, depth=0, max_depth=3):
    # Majority class
    majority = np.argmax(np.bincount(y, minlength=3))
    if depth >= max_depth or len(np.unique(y)) <= 1 or len(y) < 20:
        return DecisionNode(value=majority)

    feat, thresh = best_split(X, y)
    if feat is None:
        return DecisionNode(value=majority)

    left_mask = X[:, feat] < thresh
    right_mask = ~left_mask

    left_child = build_tree(X[left_mask], y[left_mask], depth + 1, max_depth)
    right_child = build_tree(X[right_mask], y[right_mask], depth + 1, max_depth)

    return DecisionNode(feature_idx=feat, threshold=thresh, left=left_child, right=right_child)

def predict_one(node, x):
    if node.value is not None:
        return node.value
    if x[node.feature_idx] < node.threshold:
        return predict_one(node.left, x)
    return predict_one(node.right, x)

print("[TRAIN] Training Decision Tree Classifier (max_depth=3)...")
tree_root = build_tree(X, y, max_depth=3)

preds = np.array([predict_one(tree_root, sample) for sample in X])
acc = np.mean(preds == y) * 100
print(f"[RESULT] Decision Tree Crop Stress Accuracy: {acc:.2f}%")

# Generate clean C++ if-else code for ESP32
feature_names = ['soilMoisture', 'temp', 'humidity', 'solarRadiation']
class_labels = ['HEALTHY (0)', 'MODERATE_STRESS (1)', 'HIGH_STRESS (2)']

def tree_to_cpp(node, indent="    "):
    if node.value is not None:
        return f"{indent}return {node.value}; // {class_labels[node.value]}\n"
    
    feat_name = feature_names[node.feature_idx]
    code = f"{indent}if ({feat_name} < {node.threshold:.2f}f) {{\n"
    code += tree_to_cpp(node.left, indent + "    ")
    code += f"{indent}}} else {{\n"
    code += tree_to_cpp(node.right, indent + "    ")
    code += f"{indent}}}\n"
    return code

cpp_function = f"""// Auto-generated Classical Decision Tree for ESP32
// Zero neurons, zero matrix multiplies, pure branch inference
int predictCropStressTree(float soilMoisture, float temp, float humidity, float solarRadiation) {{
{tree_to_cpp(tree_root)}
}}
"""

cpp_file = os.path.join(os.path.dirname(__file__), "wokwi/decision_tree.h")
with open(cpp_file, "w") as f:
    f.write(cpp_function)

print(f"[EXPORT] Decision Tree C++ exported to: {cpp_file}")
print("\n--- Generated C++ Edge Decision Tree ---")
print(cpp_function)
