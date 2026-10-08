import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeartPulse,
  FaStethoscope,
  FaCalendarCheck,
  FaClock,
  FaMagnifyingGlass,
  FaXmark,
  FaTriangleExclamation,
  FaCircleInfo,
  FaPills,
  FaShieldHeart,
  FaChartBar,
  FaLungs,
  FaSyringe,
  FaHeart,
} from "react-icons/fa6";
import "./Prediction.css";

import {
  predictDisease,
  predictDiabetes,
  predictHeart,
} from "../../services/predictionService";
import { getSymptoms } from "../../services/symptomService";

function Prediction() {
  const navigate = useNavigate();

  // Assessment Mode: 'general' | 'diabetes' | 'heart'
  const [assessmentType, setAssessmentType] = useState("general");

  // General Symptoms State
  const [symptomsData, setSymptomsData] = useState([]);
  const [loadingSymptoms, setLoadingSymptoms] = useState(true);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Specialized Models State
  const [diabetesForm, setDiabetesForm] = useState({
    pregnancies: 1,
    glucose: 120,
    blood_pressure: 70,
    skin_thickness: 20,
    insulin: 80,
    bmi: 25.5,
    diabetes_pedigree: 0.47,
    age: 33,
  });

  const [heartForm, setHeartForm] = useState({
    age: 52,
    sex: 1,
    cp: 1,
    trestbps: 125,
    chol: 212,
    fbs: 0,
    restecg: 1,
    thalach: 168,
    exang: 0,
    oldpeak: 1.0,
    slope: 2,
    ca: 0,
    thal: 2,
  });

  // Common Assessment Output State
  const [result, setResult] = useState(null);
  const [specializedResult, setSpecializedResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [validationError, setValidationError] = useState("");

  const loadSymptoms = useCallback(async () => {
    try {
      setLoadingSymptoms(true);
      const response = await getSymptoms();

      const rawList = Array.isArray(response)
        ? response.map((item) => (typeof item === "string" ? item : item?.symptom))
        : [];

      const cleanedList = [...new Set(rawList.filter(Boolean))].sort((a, b) =>
        a.localeCompare(b)
      );

      setSymptomsData(cleanedList);
    } catch (error) {
      console.error("Error loading symptoms:", error);
      setValidationError("Failed to load symptoms list. Please refresh the page.");
    } finally {
      setLoadingSymptoms(false);
    }
  }, []);

  useEffect(() => {
    loadSymptoms();
  }, [loadSymptoms]);

  const filteredSymptoms = useMemo(() => {
    return symptomsData.filter((symptom) =>
      symptom ? symptom.toLowerCase().includes(searchQuery.toLowerCase().trim()) : false
    );
  }, [searchQuery, symptomsData]);

  const handleToggleSymptom = (symptom) => {
    if (validationError) setValidationError("");
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((item) => item !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleRemoveSymptom = (symptom) => {
    setSelectedSymptoms(selectedSymptoms.filter((item) => item !== symptom));
  };

  const handleClearAll = () => {
    setSelectedSymptoms([]);
    setValidationError("");
  };

  // General Disease Submit
  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) {
      setValidationError("Please select at least one physical symptom to proceed.");
      return;
    }

    setValidationError("");
    setLoading(true);
    setResult(null);
    setSpecializedResult(null);
    setLoadingStep(1);

    const timer1 = setTimeout(() => setLoadingStep(2), 600);
    const timer2 = setTimeout(() => setLoadingStep(3), 1200);

    try {
      const response = await predictDisease(selectedSymptoms);
      setResult(response);
      setSearchQuery("");
      setTimeout(() => {
        document.querySelector(".report-result-card")?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } catch (error) {
      console.error("Prediction Error:", error);
      setValidationError(error.response?.data?.message || "Unable to connect to AI prediction server.");
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setLoading(false);
      setLoadingStep(0);
    }
  };

  // Diabetes Submit
  const handleDiabetesSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");
    setLoading(true);
    setResult(null);
    setSpecializedResult(null);

    try {
      const response = await predictDiabetes(diabetesForm);
      setSpecializedResult(response);
      setTimeout(() => {
        document.querySelector(".report-result-card")?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } catch (error) {
      console.error("Diabetes Risk Error:", error);
      setValidationError("Unable to connect to Diabetes Risk AI service.");
    } finally {
      setLoading(false);
    }
  };

  // Heart Submit
  const handleHeartSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");
    setLoading(true);
    setResult(null);
    setSpecializedResult(null);

    try {
      const response = await predictHeart(heartForm);
      setSpecializedResult(response);
      setTimeout(() => {
        document.querySelector(".report-result-card")?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } catch (error) {
      console.error("Heart Risk Error:", error);
      setValidationError("Unable to connect to Heart Risk AI service.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeClass = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case "high":
        return "badge-risk-high";
      case "medium":
      case "moderate":
        return "badge-risk-medium";
      case "low":
        return "badge-risk-low";
      default:
        return "bg-secondary text-white";
    }
  };

  if (loadingSymptoms) {
    return (
      <div className="text-center my-5 py-5">
        <div className="spinner-border text-cyan" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="mt-3 text-muted">Loading clinical symptoms library...</h5>
      </div>
    );
  }

  return (
    <div className="container medifusion-prediction-container my-5 fade-in">
      {/* Header Section */}
      <div className="text-center mb-4">
        <span className="badge bg-primary-subtle text-cyan border border-primary-subtle px-3 py-1.5 rounded-pill fw-semibold mb-2 d-inline-flex align-items-center gap-2">
          <FaHeartPulse /> Clinical Multi-Model Assessment Engine
        </span>
        <h1 className="fw-bold text-white display-6 mb-2">
          AI Healthcare Diagnostic Platform V2
        </h1>
        <p className="text-muted fs-6 max-w-lg mx-auto">
          Select an assessment module below to analyze potential health conditions using our trained machine learning classifiers.
        </p>
      </div>

      {/* Assessment Selector Mode Tabs */}
      <div className="d-flex justify-content-center gap-2 mb-4 flex-wrap">
        <button
          className={`btn ${assessmentType === "general" ? "btn-primary-glow" : "btn-outline-secondary"} px-4 py-2.5 rounded-pill fw-semibold d-flex align-items-center gap-2`}
          onClick={() => { setAssessmentType("general"); setResult(null); setSpecializedResult(null); setValidationError(""); }}
        >
          <FaLungs /> General Disease (41+ Conditions)
        </button>
        <button
          className={`btn ${assessmentType === "diabetes" ? "btn-primary-glow" : "btn-outline-secondary"} px-4 py-2.5 rounded-pill fw-semibold d-flex align-items-center gap-2`}
          onClick={() => { setAssessmentType("diabetes"); setResult(null); setSpecializedResult(null); setValidationError(""); }}
        >
          <FaSyringe /> Diabetes Risk Assessment
        </button>
        <button
          className={`btn ${assessmentType === "heart" ? "btn-primary-glow" : "btn-outline-secondary"} px-4 py-2.5 rounded-pill fw-semibold d-flex align-items-center gap-2`}
          onClick={() => { setAssessmentType("heart"); setResult(null); setSpecializedResult(null); setValidationError(""); }}
        >
          <FaHeart /> Heart Risk Assessment
        </button>
      </div>

      {/* validation error alert */}
      {validationError && (
        <div className="alert alert-danger alert-dismissible fade show rounded-3 mb-4" role="alert">
          <FaTriangleExclamation className="me-2" />
          {validationError}
          <button type="button" className="btn-close" onClick={() => setValidationError("")}></button>
        </div>
      )}

      {/* MODE 1: General Disease Assessment */}
      {assessmentType === "general" && (
        <div className="glass-card p-4 mb-5">
          <form onSubmit={handleGeneralSubmit}>
            <div className="row g-3 align-items-center mb-4">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary border-opacity-25 text-muted">
                    <FaMagnifyingGlass />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search symptoms (e.g. fever, headache)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={loading}
                  />
                  {searchQuery && (
                    <button className="btn btn-outline-secondary" type="button" onClick={() => setSearchQuery("")}>
                      <FaXmark />
                    </button>
                  )}
                </div>
              </div>

              <div className="col-md-6 d-flex justify-content-md-end justify-content-between align-items-center">
                <span className="badge bg-primary-subtle text-cyan border border-primary-subtle px-3 py-2 rounded-pill fw-semibold">
                  Selected Symptoms ({selectedSymptoms.length})
                </span>
                {selectedSymptoms.length > 0 && (
                  <button type="button" className="btn btn-link text-danger text-decoration-none ms-3 p-0 border-0 small" onClick={handleClearAll} disabled={loading}>
                    Clear Selection
                  </button>
                )}
              </div>
            </div>

            {selectedSymptoms.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mb-4 p-3 rounded-3 bg-dark border border-secondary border-opacity-25">
                {selectedSymptoms.map((symptom, idx) => (
                  <span key={idx} className="symptom-chip-dark">
                    <span>{symptom}</span>
                    <button type="button" className="btn-close-chip" aria-label="Remove" onClick={() => handleRemoveSymptom(symptom)} disabled={loading}>
                      <FaXmark />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {loading ? (
              <div className="processing-overlay my-4 text-center py-5">
                <div className="spinner-border text-cyan mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
                <h4 className="fw-bold text-white mb-2">Analyzing Clinical Symptoms</h4>
                <p className="text-cyan mb-0">
                  {loadingStep === 1 && "Matching symptom vectors with clinical dataset..."}
                  {loadingStep === 2 && "Computing Top-3 disease class probabilities & SHAP attributions..."}
                  {loadingStep === 3 && "Formatting medical guidelines and treatment plans..."}
                </p>
              </div>
            ) : (
              <div className="symptom-grid-container mb-4" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {filteredSymptoms.length > 0 ? (
                  <div className="row g-2">
                    {filteredSymptoms.map((symptom, index) => {
                      const isChecked = selectedSymptoms.includes(symptom);
                      return (
                        <div className="col-lg-4 col-md-6 col-sm-12" key={index}>
                          <div
                            className={`symptom-card-selectable ${isChecked ? "selected" : ""}`}
                            onClick={() => handleToggleSymptom(symptom)}
                          >
                            <div className="d-flex align-items-center gap-2">
                              <input type="checkbox" className="form-check-input flex-shrink-0 m-0" checked={isChecked} readOnly />
                              <span className="text-truncate small fw-medium text-white">{symptom}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted border rounded-3 bg-dark">
                    <p className="mb-0 small">No symptoms match "<strong>{searchQuery}</strong>".</p>
                  </div>
                )}
              </div>
            )}

            {!loading && (
              <div className="text-center mt-4">
                <button className="btn btn-primary-glow btn-lg px-5 py-3 rounded-pill" type="submit">
                  <FaHeartPulse className="me-2" /> Predict Disease Condition
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* MODE 2: Diabetes Risk Assessment Form */}
      {assessmentType === "diabetes" && (
        <div className="glass-card p-4 mb-5">
          <h4 className="fw-bold text-white mb-3 font-heading d-flex align-items-center gap-2">
            <FaSyringe className="text-cyan" /> Structured Diabetes Clinical Assessment
          </h4>
          <p className="text-muted small mb-4">Provide key biometric parameters to evaluate 5-year diabetes vulnerability risk.</p>
          <form onSubmit={handleDiabetesSubmit}>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label text-secondary small fw-semibold">Glucose Level (mg/dL)</label>
                <input type="number" className="form-control" value={diabetesForm.glucose} onChange={(e) => setDiabetesForm({...diabetesForm, glucose: e.target.value})} required />
              </div>
              <div className="col-md-3">
                <label className="form-label text-secondary small fw-semibold">BMI (kg/m²)</label>
                <input type="number" step="0.1" className="form-control" value={diabetesForm.bmi} onChange={(e) => setDiabetesForm({...diabetesForm, bmi: e.target.value})} required />
              </div>
              <div className="col-md-3">
                <label className="form-label text-secondary small fw-semibold">Age (years)</label>
                <input type="number" className="form-control" value={diabetesForm.age} onChange={(e) => setDiabetesForm({...diabetesForm, age: e.target.value})} required />
              </div>
              <div className="col-md-3">
                <label className="form-label text-secondary small fw-semibold">Insulin (mu U/ml)</label>
                <input type="number" className="form-control" value={diabetesForm.insulin} onChange={(e) => setDiabetesForm({...diabetesForm, insulin: e.target.value})} required />
              </div>
              <div className="col-md-3">
                <label className="form-label text-secondary small fw-semibold">Blood Pressure (mm Hg)</label>
                <input type="number" className="form-control" value={diabetesForm.blood_pressure} onChange={(e) => setDiabetesForm({...diabetesForm, blood_pressure: e.target.value})} required />
              </div>
              <div className="col-md-3">
                <label className="form-label text-secondary small fw-semibold">Pregnancies</label>
                <input type="number" className="form-control" value={diabetesForm.pregnancies} onChange={(e) => setDiabetesForm({...diabetesForm, pregnancies: e.target.value})} required />
              </div>
              <div className="col-md-3">
                <label className="form-label text-secondary small fw-semibold">Skin Thickness (mm)</label>
                <input type="number" className="form-control" value={diabetesForm.skin_thickness} onChange={(e) => setDiabetesForm({...diabetesForm, skin_thickness: e.target.value})} required />
              </div>
              <div className="col-md-3">
                <label className="form-label text-secondary small fw-semibold">Diabetes Pedigree Score</label>
                <input type="number" step="0.01" className="form-control" value={diabetesForm.diabetes_pedigree} onChange={(e) => setDiabetesForm({...diabetesForm, diabetes_pedigree: e.target.value})} required />
              </div>
            </div>

            <div className="text-center mt-4">
              <button className="btn btn-primary-glow btn-lg px-5 py-3 rounded-pill" type="submit" disabled={loading}>
                {loading ? "Analyzing..." : "Evaluate Diabetes Vulnerability"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODE 3: Heart Risk Assessment Form */}
      {assessmentType === "heart" && (
        <div className="glass-card p-4 mb-5">
          <h4 className="fw-bold text-white mb-3 font-heading d-flex align-items-center gap-2">
            <FaHeart className="text-danger" /> Cardiovascular Health Risk Assessment
          </h4>
          <p className="text-muted small mb-4">Input clinical cardiac markers for gradient-boosted heart risk prediction.</p>
          <form onSubmit={handleHeartSubmit}>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label text-secondary small fw-semibold">Age</label>
                <input type="number" className="form-control" value={heartForm.age} onChange={(e) => setHeartForm({...heartForm, age: e.target.value})} required />
              </div>
              <div className="col-md-3">
                <label className="form-label text-secondary small fw-semibold">Sex</label>
                <select className="form-select" value={heartForm.sex} onChange={(e) => setHeartForm({...heartForm, sex: e.target.value})}>
                  <option value={1}>Male</option>
                  <option value={0}>Female</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label text-secondary small fw-semibold">Chest Pain Type</label>
                <select className="form-select" value={heartForm.cp} onChange={(e) => setHeartForm({...heartForm, cp: e.target.value})}>
                  <option value={0}>Typical Angina</option>
                  <option value={1}>Atypical Angina</option>
                  <option value={2}>Non-anginal Pain</option>
                  <option value={3}>Asymptomatic</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label text-secondary small fw-semibold">Resting Blood Pressure (mmHg)</label>
                <input type="number" className="form-control" value={heartForm.trestbps} onChange={(e) => setHeartForm({...heartForm, trestbps: e.target.value})} required />
              </div>
              <div className="col-md-3">
                <label className="form-label text-secondary small fw-semibold">Serum Cholesterol (mg/dl)</label>
                <input type="number" className="form-control" value={heartForm.chol} onChange={(e) => setHeartForm({...heartForm, chol: e.target.value})} required />
              </div>
              <div className="col-md-3">
                <label className="form-label text-secondary small fw-semibold">Max Heart Rate (thalach)</label>
                <input type="number" className="form-control" value={heartForm.thalach} onChange={(e) => setHeartForm({...heartForm, thalach: e.target.value})} required />
              </div>
              <div className="col-md-3">
                <label className="form-label text-secondary small fw-semibold">Exercise Induced Angina</label>
                <select className="form-select" value={heartForm.exang} onChange={(e) => setHeartForm({...heartForm, exang: e.target.value})}>
                  <option value={0}>No</option>
                  <option value={1}>Yes</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label text-secondary small fw-semibold">ST Depression (oldpeak)</label>
                <input type="number" step="0.1" className="form-control" value={heartForm.oldpeak} onChange={(e) => setHeartForm({...heartForm, oldpeak: e.target.value})} required />
              </div>
            </div>

            <div className="text-center mt-4">
              <button className="btn btn-primary-glow btn-lg px-5 py-3 rounded-pill" type="submit" disabled={loading}>
                {loading ? "Analyzing..." : "Evaluate Cardiovascular Risk"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* General Disease Prediction Report Display */}
      {result && (
        <div className="glass-card overflow-hidden report-result-card fade-in mb-5">
          <div className="report-header-banner d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <span className="text-uppercase text-cyan fw-bold small tracking-wide">
                General Disease Clinical Report V2
              </span>
              <h2 className="display-6 fw-bold text-white mb-0 mt-1">
                {result.predictedDisease || "Undetermined Condition"}
              </h2>
            </div>
            <div>
              <span className={`badge-status ${getRiskBadgeClass(result.riskLevel)}`}>
                Risk Level: {result.riskLevel || "Standard"}
              </span>
            </div>
          </div>

          <div className="p-4 p-md-5">
            {/* Top Metric & Confidence */}
            <div className="confidence-bar-wrapper mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-semibold text-secondary small">Model Calibrated Confidence</span>
                <span className="fw-bold fs-4 text-cyan">{result.confidence}%</span>
              </div>
              <div className="progress bg-dark" style={{ height: "10px", borderRadius: "10px" }}>
                <div className="progress-bar progress-bar-striped progress-bar-animated bg-info" role="progressbar" style={{ width: `${result.confidence}%` }}></div>
              </div>
            </div>

            {/* Top-3 Probability Visualizer */}
            {result.top3Predictions && result.top3Predictions.length > 0 && (
              <div className="mb-4 p-3 rounded bg-dark border border-secondary border-opacity-25">
                <h6 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
                  <FaChartBar className="text-cyan" /> Top-3 Differential Diagnostics
                </h6>
                <div className="d-flex flex-column gap-2">
                  {result.top3Predictions.map((pred, i) => (
                    <div key={i} className="d-flex align-items-center justify-content-between gap-3">
                      <span className="small text-white fw-medium" style={{ minWidth: '160px' }}>
                        {i + 1}. {pred.disease}
                      </span>
                      <div className="progress flex-grow-1 bg-secondary bg-opacity-25" style={{ height: '8px' }}>
                        <div className={`progress-bar ${i === 0 ? "bg-cyan" : "bg-secondary"}`} style={{ width: `${pred.probability}%` }}></div>
                      </div>
                      <span className="small text-cyan fw-bold" style={{ minWidth: '50px', textAlign: 'right' }}>
                        {pred.probability}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SHAP Feature Contribution Visualizer */}
            {result.importantSymptoms && result.importantSymptoms.length > 0 && (
              <div className="mb-4 p-3 rounded bg-dark border border-secondary border-opacity-25">
                <h6 className="fw-bold text-white mb-2 d-flex align-items-center gap-2">
                  <FaCircleInfo className="text-warning" /> Symptom Feature Attribution (SHAP Importance)
                </h6>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {result.importantSymptoms.map((feat, i) => (
                    <span key={i} className="badge bg-secondary bg-opacity-25 text-white border border-secondary px-2.5 py-1.5">
                      {feat.symptom}: <strong className="text-cyan">{feat.importance}</strong>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description & Treatment details */}
            <div className="mb-4 pb-3 border-bottom border-secondary border-opacity-25">
              <h5 className="fw-bold text-white mb-2">Clinical Description</h5>
              <p className="text-muted mb-0">{result.description}</p>
            </div>

            <div className="row g-4 mb-4 pb-4 border-bottom border-secondary border-opacity-25">
              <div className="col-md-6">
                <div className="p-3 bg-dark rounded-3 h-100 border border-secondary border-opacity-25">
                  <h6 className="fw-bold text-cyan mb-2">Associated Symptoms</h6>
                  <p className="text-muted small mb-0">{result.symptoms}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 bg-dark rounded-3 h-100 border border-secondary border-opacity-25">
                  <h6 className="fw-bold text-cyan mb-2">Potential Causes</h6>
                  <p className="text-muted small mb-0">{result.causes}</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="d-flex flex-wrap gap-3 justify-content-end">
              <button type="button" className="btn btn-secondary-glow" onClick={() => navigate("/history")}>
                <FaClock className="me-2" /> View History
              </button>
              <button type="button" className="btn btn-primary-glow" onClick={() => navigate("/hospitals", { state: { specialization: result.specialistDoctor } })}>
                <FaStethoscope className="me-2" /> Find Specialist Doctor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Specialized Diabetes or Heart Risk Report Display */}
      {specializedResult && (
        <div className="glass-card overflow-hidden report-result-card fade-in mb-5">
          <div className="report-header-banner d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <span className="text-uppercase text-cyan fw-bold small tracking-wide">{specializedResult.model}</span>
              <h2 className="display-6 fw-bold text-white mb-0 mt-1">{specializedResult.riskAssessment}</h2>
            </div>
            <div>
              <span className={`badge-status ${getRiskBadgeClass(specializedResult.riskLevel)}`}>
                Risk Level: {specializedResult.riskLevel}
              </span>
            </div>
          </div>

          <div className="p-4 p-md-5">
            <div className="confidence-bar-wrapper mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-semibold text-secondary small">Vulnerability Score</span>
                <span className="fw-bold fs-4 text-cyan">{specializedResult.probability}%</span>
              </div>
              <div className="progress bg-dark" style={{ height: "10px", borderRadius: "10px" }}>
                <div className="progress-bar progress-bar-striped progress-bar-animated bg-warning" role="progressbar" style={{ width: `${specializedResult.probability}%` }}></div>
              </div>
            </div>

            {/* Feature Ranking Visualizer */}
            {specializedResult.importantFeatures && specializedResult.importantFeatures.length > 0 && (
              <div className="mb-4 p-3 rounded bg-dark border border-secondary border-opacity-25">
                <h6 className="fw-bold text-white mb-3">Key Influencing Clinical Factors</h6>
                <div className="d-flex flex-wrap gap-2">
                  {specializedResult.importantFeatures.map((feat, i) => (
                    <span key={i} className="badge bg-primary-subtle text-cyan border border-primary-subtle px-3 py-2">
                      {feat.feature}: <strong>{(feat.importance * 100).toFixed(1)}%</strong>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3 rounded bg-dark border border-warning border-opacity-25 mb-4">
              <p className="small text-muted mb-0">{specializedResult.disclaimer}</p>
            </div>

            <div className="d-flex gap-3 justify-content-end">
              <button type="button" className="btn btn-primary-glow" onClick={() => navigate("/hospitals")}>
                <FaStethoscope className="me-2" /> Consult a Medical Specialist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Prediction;