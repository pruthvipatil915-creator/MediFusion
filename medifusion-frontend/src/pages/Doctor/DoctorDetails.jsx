import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllDoctors } from "../../services/doctorService";
import GlassCard from "../../components/GlassCard/GlassCard";
import {
  FaUserDoctor,
  FaHospital,
  FaStethoscope,
  FaCalendarCheck,
  FaClock,
  FaPhone,
  FaLocationDot,
  FaMoneyBillWave,
  FaShieldHalved,
  FaArrowLeft,
} from "react-icons/fa6";

function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    setLoading(true);
    try {
      const doctors = await getAllDoctors();
      const doc = doctors.find((d) => String(d.id) === String(id));
      setDoctor(doc || null);
    } catch (err) {
      console.error("Failed to load doctor profile:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <div className="spinner-border text-cyan" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted small">Loading doctor profile...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="container text-center my-5 py-5">
        <h3 className="text-white fw-bold mb-3">Doctor Not Found</h3>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/hospitals")}>
          <FaArrowLeft className="me-2" /> Back to Doctor Discovery
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5 fade-in max-w-xl">
      <button className="btn btn-secondary-glow btn-sm mb-4" onClick={() => navigate(-1)}>
        <FaArrowLeft className="me-2" /> Back
      </button>

      <GlassCard className="p-4 p-md-5 overflow-hidden">
        <div className="d-flex align-items-center gap-4 flex-wrap pb-4 border-bottom border-secondary border-opacity-25">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold display-5 flex-shrink-0"
            style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
            }}
          >
            <FaUserDoctor />
          </div>

          <div>
            <span className="badge bg-primary-subtle text-cyan border border-primary-subtle px-3 py-1 rounded-pill small fw-semibold mb-1 d-inline-block">
              {doctor.specialization || "General Physician"}
            </span>
            <h2 className="fw-bold text-white mb-1">{doctor.fullName}</h2>
            <p className="text-muted small mb-0 d-flex align-items-center gap-2">
              <FaHospital className="text-cyan" /> {doctor.hospitalName || "MediFusion Partner Hospital"} • <FaLocationDot className="text-warning" /> {doctor.city || "Available Location"}
            </p>
          </div>
        </div>

        <div className="row g-4 my-3">
          <div className="col-md-6">
            <div className="p-3 bg-dark rounded border border-secondary border-opacity-25 h-100">
              <span className="text-muted small d-block mb-1">Experience</span>
              <span className="fw-bold text-white fs-5">{doctor.experience ? `${doctor.experience} Years` : "Experienced Practitioner"}</span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="p-3 bg-dark rounded border border-secondary border-opacity-25 h-100">
              <span className="text-muted small d-block mb-1">Consultation Fee</span>
              <span className="fw-bold text-cyan fs-5">
                <FaMoneyBillWave className="me-1" /> ₹{doctor.consultationFee || 500}
              </span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="p-3 bg-dark rounded border border-secondary border-opacity-25 h-100">
              <span className="text-muted small d-block mb-1">Available Days</span>
              <span className="fw-semibold text-white small d-flex align-items-center gap-1.5 mt-1">
                <FaCalendarCheck className="text-success" /> {doctor.availableDays || "Monday - Saturday"}
              </span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="p-3 bg-dark rounded border border-secondary border-opacity-25 h-100">
              <span className="text-muted small d-block mb-1">Available Hours</span>
              <span className="fw-semibold text-white small d-flex align-items-center gap-1.5 mt-1">
                <FaClock className="text-warning" /> {doctor.availableTime || "09:00 AM - 05:00 PM"}
              </span>
            </div>
          </div>
        </div>

        {doctor.phone && (
          <div className="p-3 bg-dark rounded border border-secondary border-opacity-25 mb-4 d-flex align-items-center justify-content-between">
            <span className="text-muted small d-flex align-items-center gap-2">
              <FaPhone className="text-cyan" /> Direct Contact: {doctor.phone}
            </span>
            <a href={`tel:${doctor.phone}`} className="btn btn-sm btn-outline-primary rounded-pill px-3">
              Call Doctor
            </a>
          </div>
        )}

        <div className="text-end pt-3 border-top border-secondary border-opacity-25">
          <button
            className="btn btn-primary-glow btn-lg px-5 rounded-pill"
            onClick={() => navigate("/appointments", { state: { doctor } })}
          >
            <FaCalendarCheck className="me-2" /> Book Appointment Now
          </button>
        </div>
      </GlassCard>
    </div>
  );
}

export default DoctorDetails;
