import pandas as pd
import joblib
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Load Clean Dataset
df = pd.read_csv("dataset/Training_Clean.csv")

# Features
X = df.drop("prognosis", axis=1)

# Target
y = df["prognosis"]

# Label Encoding
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# Split Dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.2,
    random_state=42
)

print("Training Data Shape:", X_train.shape)
print("Testing Data Shape:", X_test.shape)

# Create Model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

# Train Model
model.fit(X_train, y_train)

print("\n✅ Model Trained Successfully!")

# Prediction
y_pred = model.predict(X_test)

# Accuracy
accuracy = accuracy_score(y_test, y_pred)

print(f"\nModel Accuracy: {accuracy*100:.2f}%")
# Save Model
joblib.dump(model, "model/disease_model.pkl")

# Save Label Encoder
joblib.dump(label_encoder, "model/label_encoder.pkl")

print("\n✅ Model saved successfully!")
print("✅ Label Encoder saved successfully!")