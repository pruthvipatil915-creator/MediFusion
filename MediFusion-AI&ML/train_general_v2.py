import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_recall_fscore_support

def train_general_model_v2():
    dataset_path = os.path.join("dataset", "Training_Clean.csv")
    model_dir = "model"
    os.makedirs(model_dir, exist_ok=True)

    print("==================================================")
    print("Executing General Disease Model V2 Upgrade Pipeline")
    print("==================================================")

    # 1. Load Dataset
    df = pd.read_csv(dataset_path)
    print(f"Dataset Loaded. Total Records: {df.shape[0]}, Total Features: {df.shape[1] - 1}")

    # Audit for duplicates
    duplicates = df.duplicated().sum()
    print(f"Dataset Audit: Found {duplicates} duplicate samples.")

    X = df.drop("prognosis", axis=1)
    y = df["prognosis"]
    feature_names = X.columns.tolist()

    # Encode Labels
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    num_classes = len(label_encoder.classes_)
    print(f"Total Disease Classes: {num_classes}")

    # 2. Stratified Train / Test Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )

    # 3. Model Benchmark & Cross Validation
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    rf_model = RandomForestClassifier(n_estimators=120, max_depth=25, random_state=42)
    lr_model = LogisticRegression(max_iter=1000, random_state=42)

    rf_cv_scores = cross_val_score(rf_model, X_train, y_train, cv=skf, scoring='accuracy')
    print(f"RandomForest 5-Fold CV Accuracy: {rf_cv_scores.mean()*100:.2f}% (+/- {rf_cv_scores.std()*100:.2f}%)")

    # 4. Train Best Model
    rf_model.fit(X_train, y_train)
    y_pred = rf_model.predict(X_test)

    acc = accuracy_score(y_test, y_pred)
    precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='weighted')

    print(f"Holdout Test Set Accuracy : {acc*100:.2f}%")
    print(f"Weighted Precision        : {precision:.4f}")
    print(f"Weighted Recall           : {recall:.4f}")
    print(f"Weighted F1-Score         : {f1:.4f}")

    # 5. Extract Symptom Feature Importance Rankings
    importances = rf_model.feature_importances_
    top_feature_indices = np.argsort(importances)[::-1][:20]
    top_features = [{
        "feature": feature_names[i],
        "importance": round(float(importances[i]), 4)
    } for i in top_feature_indices]

    # 6. Save Model Artifacts
    model_file = os.path.join(model_dir, "disease_model.pkl")
    encoder_file = os.path.join(model_dir, "label_encoder.pkl")
    metadata_file = os.path.join(model_dir, "general_metadata.json")

    joblib.dump(rf_model, model_file)
    joblib.dump(label_encoder, encoder_file)

    metadata = {
        "modelName": "General Disease Model V2",
        "version": "2.0.0",
        "algorithm": "RandomForestClassifier",
        "n_estimators": 120,
        "numClasses": num_classes,
        "numFeatures": len(feature_names),
        "cvAccuracy": round(float(rf_cv_scores.mean() * 100), 2),
        "testAccuracy": round(float(acc * 100), 2),
        "weightedF1": round(float(f1), 4),
        "topFeatures": top_features
    }

    with open(metadata_file, "w") as f:
        json.dump(metadata, f, indent=2)

    print("==================================================")
    print("General Disease Model V2 Trained & Saved Successfully!")
    print("==================================================")

if __name__ == "__main__":
    train_general_model_v2()
