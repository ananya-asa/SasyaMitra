import numpy as np
import os
import pandas as pd
import xgboost as xgb  # Native XGBoost Engine

# =========================================================================
# OFFICIAL NATIVE XGBOOST MULTI-CLASS CLASSIFIER FOR CROP STRESS
# Using core DMatrix & xgb.train (No sklearn dependency needed)
# =========================================================================

print("=========================================================")
print(f"[XGBOOST] Initializing Native XGBoost C++ Engine: v{xgb.__version__}")
print("=========================================================")

csv_path = os.path.join(os.path.dirname(__file__), "backend/agriculture_dataset_with_target.csv")
df = pd.read_csv(csv_path)

# Features: Soil_Moisture, Air_Temperature, Humidity, Solar_Radiation
features = ['Soil_Moisture', 'Air_Temperature', 'Humidity', 'Solar_Radiation']
X = df[features].values

# Target classes: 0 = Healthy, 1 = Moderate_Stress, 2 = High_Stress
class_mapping = {'Healthy': 0, 'Moderate_Stress': 1, 'High_Stress': 2}
y = df['Crop_Health'].map(class_mapping).values

print(f"[DATA] Converting {len(X)} records into XGBoost native DMatrix...")
dtrain = xgb.DMatrix(X, label=y, feature_names=features)

params = {
    'objective': 'multi:softprob',
    'num_class': 3,
    'max_depth': 7,
    'eta': 0.25,
    'eval_metric': 'mlogloss',
    'seed': 42
}

print("[TRAIN] Boosting 55 sequential decision trees across gradient residuals...")
bst = xgb.train(params, dtrain, num_boost_round=55)

# Inference
prob_preds = bst.predict(dtrain)
final_preds = np.argmax(prob_preds, axis=1)
accuracy = np.mean(final_preds == y) * 100
print(f"[RESULT] Official Native XGBoost Crop Stress Accuracy: {accuracy:.2f}%")

# Save model
model_path = os.path.join(os.path.dirname(__file__), "backend/simulation/xgboost_model.json")
bst.save_model(model_path)
print(f"[EXPORT] Trained native model saved to: {model_path}")
print("=========================================================\n")
