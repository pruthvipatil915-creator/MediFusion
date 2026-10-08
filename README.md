# MediFusion AI Pro (MedAI) — AI Healthcare Platform V2

MediFusion is an advanced, full-stack, multi-model AI healthcare decision-support and clinical management platform combining symptom-based disease prediction, specialized diabetes and cardiovascular risk assessment, doctor discovery, appointment management, conversational AI guidance, and administrative oversight.

---

## 🏗️ System Architecture

```
                                  MEDIFUSION V2
                                       │
            ┌──────────────────────────┼──────────────────────────┐
            │                          │                          │
    Healthcare Module            AI/ML Engine             Management Module
            │                          │                          │
     • Doctor Discovery        • General Model V2         • Admin Dashboard
     • Doctor Details          • Diabetes Risk Model      • Doctors Management
     • Appointment Booking     • Heart Risk Model         • Hospitals Management
     • Patient History         • Top-3 Predictions        • User Directory
                               • SHAP Feature XAI         • Appointment Logs
                               • Safety Validation
                               • Calibrated Proba
```

### Data & Execution Flow:
```
React 19 Frontend (:5173) 
  ↓ (Axios + JWT Authentication)
Spring Boot Backend (:8080)
  ↓ (RestTemplate Proxy)
Flask ML Microservice Engine (:5000)
  ├── General Disease Model V2 (RandomForest Classifier - 41 Classes, 131 Symptoms)
  ├── Diabetes Risk Model (StandardScaler + RandomForest)
  └── Heart Disease Risk Model (StandardScaler + GradientBoosting)
  ↓
Spring Boot -> MySQL Database (`medai`)
  ↓
React Result Presentation UI
```

---

## 🌟 Key Features Implemented

1. **Multi-Model AI Diagnostic Suite**:
   - **General Disease Model V2**: Multi-class Random Forest predicting across 41 disease categories with Stratified 5-Fold Cross Validation. Returns **Top-3 Differential Predictions** and **SHAP Feature Attribution** (important contributing symptoms).
   - **Diabetes Risk Model**: Specialized clinical assessment trained on glucose, BMI, insulin, age, and blood pressure.
   - **Heart Disease Risk Model**: Gradient-boosted cardiovascular risk model evaluating cholesterol, resting blood pressure, chest pain, and ECG markers.

2. **Full-Stack Security & Role Authorization**:
   - Stateless JWT Authentication (24-hour token duration).
   - Backend Spring Security role guards (`ROLE_USER`, `ROLE_DOCTOR`, `ROLE_ADMIN`).
   - Hardcoded secrets externalized to environment variables.

3. **Doctor Discovery & Patient Care**:
   - Doctor-first search and filtering by city, specialization, experience, and fee.
   - Doctor Details page (`/doctors/:id`) and Doctor Management Dashboard (`/doctor/dashboard`).
   - Database foreign key relationship (`Doctor -> hospital_id -> Hospital`).

4. **Complete Admin Suite**:
   - Platform metrics & real-time analytics.
   - Doctor & Hospital CRUD management.
   - Admin User Directory API (`GET /api/users`).

5. **Conversational AI Health Assistant**:
   - Integrated Gemini API chatbot with safety disclaimers and clinical guidance rules.

---

## 🚀 Execution & Startup Commands

### Prerequisites
- Java 21 JDK
- Node.js v20+
- Python 3.11+
- MySQL Server 8.0+

---

### Step 1: Start MySQL Database
Create a database named `medai`:
```sql
CREATE DATABASE medai;
```

---

### Step 2: Start Python Flask ML Service
```bash
cd "MediFusion-AI&ML"

# (Optional) Retrain ML Models
python train_general_v2.py
python train_diabetes.py
python train_heart.py

# Start Flask Engine
python app.py
```
*Flask ML Service will start on `http://localhost:5000`*

---

### Step 3: Start Spring Boot Backend
```bash
cd backend
.\mvnw.cmd spring-boot:run
```
*Spring Boot Backend will start on `http://localhost:8080`*
*Swagger API Docs available at `http://localhost:8080/swagger-ui.html`*

---

### Step 4: Start React Frontend
```bash
cd medifusion-frontend
npm install
npm run dev
```
*React SPA Application will run on `http://localhost:5173`*

---

## 🐳 Docker Container Deployment

To launch the entire platform via Docker Compose:
```bash
docker-compose up --build
```

---

## ⚠️ Medical Safety Notice
MediFusion AI assessment outputs are designed strictly for clinical decision-support and educational assistance. They do not constitute formal medical diagnoses or prescriptions. Always consult a certified physician for personal healthcare decisions.
