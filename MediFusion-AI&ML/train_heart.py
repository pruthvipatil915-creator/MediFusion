import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, roc_auc_score

def train_heart_model():
    dataset_path = os.path.join("dataset", "heart.csv")
    model_dir = "model"
    os.makedirs(model_dir, exist_ok=True)

    print("==================================================")
    print("Executing Heart Disease Risk Model Training Pipeline")
    print("==================================================")

    # 1. Load Dataset
    df = pd.read_csv(dataset_path)
    print(f"Dataset Loaded. Total Records: {df.shape[0]}, Features: {df.shape[1] - 1}")

    X = df.drop("target", axis=1)
    y = df["target"]
    feature_names = X.columns.tolist()

    # 2. Train / Test Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # 3. Model Pipeline & Benchmarking
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('classifier', GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42))
    ])

    cv_scores = cross_val_score(pipeline, X_train, y_train, cv=skf, scoring='accuracy')
    print(f"Heart Risk 5-Fold CV Accuracy: {cv_scores.mean()*100:.2f}% (+/- {cv_scores.std()*100:.2f}%)")

    # 4. Train Best Pipeline
    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)
    y_proba = pipeline.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='binary')
    auc = roc_auc_score(y_test, y_proba)

    print(f"Holdout Test Set Accuracy : {acc*100:.2f}%")
    print(f"Precision                 : {precision:.4f}")
    print(f"Recall                    : {recall:.4f}")
    print(f"F1-Score                  : {f1:.4f}")
    print(f"ROC-AUC                   : {auc:.4f}")

    # 5. Extract Feature Importances
    gb_model = pipeline.named_steps['classifier']
    importances = gb_model.feature_importances_
    top_feature_indices = np.argsort(importances)[::-1]
    top_features = [{
        "feature": feature_names[i],
        "importance": round(float(importances[i]), 4)
    } for i in top_feature_indices]

    # 6. Save Model Artifacts
    model_file = os.path.join(model_dir, "heart_model.pkl")
    metadata_file = os.path.join(model_dir, "heart_metadata.json")

    joblib.dump(pipeline, model_file)

    metadata = {
        "modelName": "Heart Disease Risk Model",
        "version": "1.0.0",
        "algorithm": "StandardScaler + GradientBoostingClassifier",
        "numFeatures": len(feature_names),
        "features": feature_names,
        "cvAccuracy": round(float(cv_scores.mean() * 100), 2),
        "testAccuracy": round(float(acc * 100), 2),
        "precision": round(float(precision), 4),
        "recall": round(float(recall), 4),
        "f1Score": round(float(f1), 4),
        "rocAuc": round(float(auc), 4),
        "topFeatures": top_features
    }

    with open(metadata_file, "w") as f:
        json.dump(metadata, f, indent=2)

    print("==================================================")
    print("Heart Disease Risk Model Trained & Saved Successfully!")
    print("==================================================")

if __name__ == "__main__":
    train_heart_model()
