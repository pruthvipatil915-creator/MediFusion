import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getAllDoctors,
  searchDoctors,
} from "../../services/doctorService";
import "./Hospitals.css";

const COMMON_SPECIALIZATIONS = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Oncology",
  "Dermatology",
  "General Medicine",
  "ENT",
];

function Hospitals() {
  const navigate = useNavigate();
  const location = useLocation();

  // State Management
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);

  // Form Filter State
  const [cityInput, setCityInput] = useState("");
  const [specializationInput, setSpecializationInput] = useState("");

  // Sorting & Favorites State
  const [sortBy, setSortBy] = useState("default");
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("medifusion_fav_hospitals");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toggle Favorite in localStorage
  const toggleFavorite = (hospitalId) => {
    let updated;
    if (favorites.includes(hospitalId)) {
      updated = favorites.filter((id) => id !== hospitalId);
    } else {
      updated = [...favorites, hospitalId];
    }
    setFavorites(updated);
    localStorage.setItem("medifusion_fav_hospitals", JSON.stringify(updated));
  };

  /**
   * Helper: Map Specialization to Medical Badging Colors
   */
  const getSpecializationBadgeClass = (spec) => {
    const s = spec?.toLowerCase() || "";
    if (s.includes("cardio")) return "spec-cardiology";
    if (s.includes("neuro")) return "spec-neurology";
    if (s.includes("ortho")) return "spec-orthopedics";
    if (s.includes("pedia")) return "spec-pediatrics";
    if (s.includes("onco")) return "spec-oncology";
    if (s.includes("derma")) return "spec-dermatology";
    return "spec-default";
  };

  /**
   * Load Hospitals or Handle Auto-Filter from Prediction Navigation
   */
  const initializeHospitals = useCallback(async () => {
    setLoading(true);
    setError(null);

    const recommendedSpec = location.state?.specialization;

    // Clear router state via React Router so page refreshes don't re-lock the filter
    if (recommendedSpec) {
      navigate(location.pathname, { replace: true, state: {} });
    }

    try {
      if (recommendedSpec) {
        setSpecializationInput(recommendedSpec);
        const data = await searchDoctors("", recommendedSpec);
        setHospitals(Array.isArray(data) ? data : []);
      } else {
        const data = await getAllDoctors();
        setHospitals(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load doctors:", err);
      setError("Unable to fetch doctors. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [location.state?.specialization, location.pathname, navigate]);

  useEffect(() => {
    initializeHospitals();
  }, [initializeHospitals]);

  /**
   * Centralized Search Form Handler
   */
  const executeSearch = async (city, spec) => {
    setSearching(true);
    setError(null);

    try {
      const data = await searchDoctors(city, spec);
      setHospitals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to perform doctor search. Please check your query and try again.");
    } finally {
      setSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    executeSearch(cityInput, specializationInput);
  };

  /**
   * Remove single active search badge
   */
  const handleRemoveCityBadge = () => {
    setCityInput("");
    executeSearch("", specializationInput);
  };

  const handleRemoveSpecBadge = () => {
    setSpecializationInput("");
    executeSearch(cityInput, "");
  };

  /**
   * Reset Search Filters & Reload All
   */
  const handleReset = async () => {
    setCityInput("");
    setSpecializationInput("");
    setLoading(true);
    setError(null);
    try {
      const data = await getAllDoctors();
      setHospitals(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Unable to fetch doctors.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Native Mobile Web Share API + Safe Clipboard Fallback
   */
  const handleShareHospital = async (hospital) => {
    const name = hospital.name || hospital.hospitalName;
    const shareText = `${name} - ${hospital.address || ""}, ${hospital.city || ""}`.trim();
    const shareData = {
      title: name,
      text: `Check out ${name} located in ${hospital.city || "your area"} on MediFusion AI!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share dismissed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        alert("Hospital details copied to clipboard!");
      } catch (err) {
        console.error("Clipboard write failed:", err);
        alert("Sharing is not supported on this device or permission was denied.");
      }
    }
  };

  /**
   * Navigate to Appointments
   */
  const handleBookAppointment = (hospital) => {
    navigate("/appointments", {
      state: { hospital },
    });
  };

  /**
   * Sorted Hospitals Array
   */
  const sortedHospitals = useMemo(() => {
    const list = [...hospitals];
    if (sortBy === "name") {
      return list.sort((a, b) =>
        (a.name || a.hospitalName || "").localeCompare(b.name || b.hospitalName || "")
      );
    }
    if (sortBy === "city") {
      return list.sort((a, b) => (a.city || "").localeCompare(b.city || ""));
    }
    if (sortBy === "favorites") {
      return list.sort((a, b) => {
        const idA = a.id || a.hospitalId;
        const idB = b.id || b.hospitalId;
        return (favorites.includes(idB) ? 1 : 0) - (favorites.includes(idA) ? 1 : 0);
      });
    }
    return list;
  }, [hospitals, sortBy, favorites]);

  return (
    <div className="container medifusion-hospitals-container my-5 fade-in">
      {/* Header Section */}
      <div className="text-center mb-5">
        <h1 className="fw-bold text-primary display-6 mb-2">
          <i className="bi bi-hospital me-2"></i>Nearby Hospitals
        </h1>
        <p className="text-muted fs-6 mb-0">
          Find trusted hospitals and medical specialists near you.
        </p>
      </div>

      {/* Search & Filter Section */}
      <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 medifusion-card">
        <form onSubmit={handleSearchSubmit}>
          <div className="row g-3 align-items-end">
            {/* City Input */}
            <div className="col-md-5">
              <label htmlFor="citySearch" className="form-label fw-semibold text-secondary small">
                City / Location
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <i className="bi bi-geo-alt"></i>
                </span>
                <input
                  id="citySearch"
                  type="text"
                  className="form-control border-start-0 ps-0 shadow-none hospital-search-input"
                  placeholder="Enter city (e.g. Mumbai, Pune)..."
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  disabled={searching || loading}
                />
                {cityInput && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary border-start-0"
                    onClick={() => setCityInput("")}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Specialization Select / Autocomplete Input */}
            <div className="col-md-4">
              <label htmlFor="specSearch" className="form-label fw-semibold text-secondary small">
                Specialization
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <i className="bi bi-person-badge"></i>
                </span>
                <input
                  id="specSearch"
                  type="text"
                  list="specializationOptions"
                  className="form-control border-start-0 ps-0 shadow-none hospital-search-input"
                  placeholder="Select or type specialization..."
                  value={specializationInput}
                  onChange={(e) => setSpecializationInput(e.target.value)}
                  disabled={searching || loading}
                />
                <datalist id="specializationOptions">
                  {COMMON_SPECIALIZATIONS.map((spec) => (
                    <option key={spec} value={spec} />
                  ))}
                </datalist>
                {specializationInput && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary border-start-0"
                    onClick={() => setSpecializationInput("")}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="col-md-3 d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary w-100 py-2.5 rounded-3 fw-semibold shadow-sm search-btn d-flex align-items-center justify-content-center gap-2"
                disabled={searching || loading}
              >
                {searching ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                    Searching...
                  </>
                ) : (
                  <>
                    <i className="bi bi-search"></i> Search
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary py-2.5 px-3 rounded-3 fw-semibold"
                onClick={handleReset}
                disabled={searching || loading || (!cityInput && !specializationInput)}
                title="Reset filters"
              >
                <i className="bi bi-arrow-counterclockwise"></i>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Error Alert with Retry Action */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show rounded-3 mb-4 shadow-sm" role="alert">
          <div className="d-flex align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-exclamation-triangle-fill fs-5"></i>
              <div>{error}</div>
            </div>
            <button
              className="btn btn-sm btn-outline-danger fw-semibold px-3 text-nowrap"
              onClick={initializeHospitals}
            >
              <i className="bi bi-arrow-clockwise me-1"></i> Retry
            </button>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Results Header: Sorting & Active Badges */}
      {!loading && !error && (
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle fs-6 px-3 py-2 rounded-pill fw-semibold">
              Showing {hospitals.length} {hospitals.length === 1 ? "Hospital" : "Hospitals"}
            </span>

            {/* Clean Bootstrap Search Badges */}
            {cityInput.trim() && (
              <span className="badge bg-light text-dark border px-3 py-2 rounded-pill d-flex align-items-center gap-1">
                <i className="bi bi-building text-secondary me-1"></i>
                {cityInput.trim()}
                <button
                  type="button"
                  className="btn-close btn-close-small ms-1"
                  onClick={handleRemoveCityBadge}
                ></button>
              </span>
            )}
            {specializationInput.trim() && (
              <span className="badge bg-light text-dark border px-3 py-2 rounded-pill d-flex align-items-center gap-1">
                <i className="bi bi-person-badge text-secondary me-1"></i>
                {specializationInput.trim()}
                <button
                  type="button"
                  className="btn-close btn-close-small ms-1"
                  onClick={handleRemoveSpecBadge}
                ></button>
              </span>
            )}
          </div>

          {/* Sorting Dropdown */}
          {hospitals.length > 0 && (
            <div className="d-flex align-items-center gap-2">
              <label htmlFor="sortSelect" className="small text-muted fw-semibold text-nowrap">
                Sort By:
              </label>
              <select
                id="sortSelect"
                className="form-select form-select-sm shadow-none rounded-3 border"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="name">Name (A-Z)</option>
                <option value="city">City (A-Z)</option>
                <option value="favorites">Favorites First</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Skeleton Loaders */}
      {loading && (
        <div className="row g-4">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div className="col-lg-4 col-md-6 col-sm-12" key={idx}>
              <div className="card h-100 border-0 shadow-sm rounded-4 p-4 skeleton-card">
                <div className="skeleton skeleton-title mb-3"></div>
                <div className="skeleton skeleton-text mb-2"></div>
                <div className="skeleton skeleton-text w-75 mb-4"></div>
                <div className="skeleton skeleton-btn mt-auto"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && hospitals.length === 0 && (
        <div className="card shadow-sm border-0 rounded-4 p-5 text-center my-4 empty-hospital-card">
          <div className="display-1 mb-3 opacity-50 text-muted">
            <i className="bi bi-hospital"></i>
          </div>
          <h4 className="fw-bold text-dark mb-2">No hospitals found</h4>
          <p className="text-muted mb-4 max-w-md mx-auto">
            We couldn't find any medical facilities matching your criteria. Try adjusting your city or specialization filters.
          </p>
          <div>
            <button className="btn btn-outline-primary rounded-pill px-4" onClick={handleReset}>
              Reset All Filters
            </button>
          </div>
        </div>
      )}

      {/* Staggered Hospital Cards Grid */}
      {!loading && !error && sortedHospitals.length > 0 && (
        <div className="row g-4">
          {sortedHospitals.map((hospital, index) => {
            const hospitalId = hospital.id || hospital.hospitalId || index;
            const isFav = favorites.includes(hospitalId);
            const hospitalName = hospital.name || hospital.hospitalName;

            return (
              <div
                className="col-lg-4 col-md-6 col-sm-12 staggered-card"
                key={hospitalId}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="card h-100 border-0 shadow-sm rounded-4 hospital-card overflow-hidden">
                  {/* Banner Header */}
                  <div className="hospital-card-banner position-relative">
                    <div className="banner-overlay p-3 d-flex justify-content-between align-items-start">
                      <span className="badge bg-white text-success border border-success-subtle rounded-pill px-2.5 py-1.5 fw-semibold small d-flex align-items-center gap-1 shadow-sm">
                        <i className="bi bi-patch-check-fill text-success"></i>
                        <span>Verified Hospital</span>
                      </span>

                      {/* Favorite Button */}
                      <button
                        type="button"
                        className={`btn btn-sm rounded-circle fav-btn ${isFav ? "active" : ""}`}
                        onClick={() => toggleFavorite(hospitalId)}
                        title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                      >
                        <i className={`bi ${isFav ? "bi-heart-fill text-danger" : "bi-heart text-secondary"}`}></i>
                      </button>
                    </div>

                    {/* Hospital Avatar Icon */}
                    <div className="hospital-avatar-icon shadow-sm text-primary">
                      <i className="bi bi-hospital-fill"></i>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="card-body p-4 pt-5 d-flex flex-column">
                    {/* Header Badges */}
                    <div className="d-flex flex-wrap gap-2 mb-2">
                      {hospital.specialization && (
                        <span className={`badge rounded-pill px-3 py-1.5 fw-medium small ${getSpecializationBadgeClass(hospital.specialization)}`}>
                          <i className="bi bi-person-badge-fill me-1"></i>
                          {hospital.specialization}
                        </span>
                      )}
                      {hospital.city && (
                        <span className="badge bg-light text-secondary border rounded-pill px-2.5 py-1.5 small">
                          <i className="bi bi-building me-1"></i>
                          {hospital.city}
                        </span>
                      )}
                    </div>

                    <h5 className="card-title fw-bold text-dark mb-3 hospital-name">
                      {hospitalName}
                    </h5>

                    {/* Details List */}
                    <div className="hospital-info-list flex-grow-1 d-flex flex-column gap-2 mb-4">
                      <div className="d-flex align-items-start gap-2 text-muted small">
                        <i className="bi bi-geo-alt-fill text-primary flex-shrink-0 mt-0.5"></i>
                        <span className="text-break">{hospital.address || "Address not specified"}</span>
                      </div>

                      {hospital.phone && (
                        <div className="d-flex align-items-center gap-2 text-muted small">
                          <i className="bi bi-telephone-fill text-primary flex-shrink-0"></i>
                          <a href={`tel:${hospital.phone}`} className="text-decoration-none text-muted hospital-contact-link">
                            {hospital.phone}
                          </a>
                        </div>
                      )}

                      {hospital.email && (
                        <div className="d-flex align-items-center gap-2 text-muted small">
                          <i className="bi bi-envelope-fill text-primary flex-shrink-0"></i>
                          <a href={`mailto:${hospital.email}`} className="text-decoration-none text-muted hospital-contact-link text-truncate">
                            {hospital.email}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex flex-column gap-2 mt-auto pt-3 border-top">
                      {/* Call / Email Row */}
                      <div className="row g-2">
                        <div className="col-5">
                          <a
                            href={hospital.phone ? `tel:${hospital.phone}` : "#"}
                            className={`btn btn-light btn-sm w-100 rounded-3 border fw-medium d-flex align-items-center justify-content-center gap-1 ${
                              !hospital.phone ? "disabled opacity-50" : ""
                            }`}
                          >
                            <i className="bi bi-telephone"></i> Call
                          </a>
                        </div>
                        <div className="col-5">
                          <a
                            href={hospital.email ? `mailto:${hospital.email}` : "#"}
                            className={`btn btn-light btn-sm w-100 rounded-3 border fw-medium d-flex align-items-center justify-content-center gap-1 ${
                              !hospital.email ? "disabled opacity-50" : ""
                            }`}
                          >
                            <i className="bi bi-envelope"></i> Email
                          </a>
                        </div>
                        <div className="col-2">
                          <button
                            type="button"
                            className="btn btn-light btn-sm w-100 rounded-3 border fw-medium"
                            onClick={() => handleShareHospital(hospital)}
                            title="Share Hospital"
                          >
                            <i className="bi bi-share"></i>
                          </button>
                        </div>
                      </div>

                      {/* Google Maps Link */}
                      <a
                        href={`https://www.google.com/maps/search/${encodeURIComponent(
                          `${hospitalName} ${hospital.address || ""} ${hospital.city || ""}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary btn-sm rounded-3 fw-medium d-flex align-items-center justify-content-center gap-1"
                      >
                        <i className="bi bi-map"></i> Open in Google Maps
                      </a>

                      {/* Book Appointment */}
                      <button
                        type="button"
                        className="btn btn-primary rounded-3 fw-semibold py-2 d-flex align-items-center justify-content-center gap-1 shadow-sm book-apt-btn"
                        onClick={() => handleBookAppointment(hospital)}
                      >
                        <i className="bi bi-calendar-check me-1"></i> Book Appointment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Hospitals;