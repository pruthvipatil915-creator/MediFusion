import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import { FaHeartPulse, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaShieldHalved } from "react-icons/fa6";
import "../Login/Login.css";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });

      const message = typeof response?.data === "string" ? response.data : "Registration successful!";
      setSuccessMsg(message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error("Register Error:", error);

      if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("Unable to complete registration. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container auth-wrapper py-5 fade-in">
      <div className="register-card-split">
        <div className="row g-0">
          
          {/* Left Graphic Panel */}
          <div className="col-lg-5 d-none d-lg-flex auth-panel-graphic">
            <div className="d-flex align-items-center gap-2 mb-4">
              <div className="brand-icon-wrapper">
                <FaHeartPulse />
              </div>
              <h3 className="brand-logo mb-0">MediFusion AI</h3>
            </div>

            <h2 className="fw-bold text-white display-6 mb-3">
              Join the Future of AI Healthcare
            </h2>

            <p className="text-muted leading-relaxed mb-4">
              Create your account to unlock AI disease predictions, discover specialist doctors in your city, and schedule clinical visits.
            </p>

            <div className="d-flex align-items-center gap-3 text-cyan small p-3 rounded bg-dark border border-secondary border-opacity-25">
              <FaShieldHalved className="fs-4 flex-shrink-0" />
              <span>Compliant with Medical Data Security Standards</span>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="col-lg-7 auth-panel-form">
            <div className="mb-4 text-center text-lg-start">
              <h2 className="fw-bold text-white h3 mb-2">Create Account</h2>
              <p className="text-muted small">Register your details below to get started.</p>
            </div>

            {successMsg && (
              <div className="alert alert-success alert-dismissible fade show rounded-3 mb-4" role="alert">
                <i className="bi bi-check-circle-fill me-2"></i>
                {successMsg} Redirecting to login...
              </div>
            )}

            {errorMsg && (
              <div className="alert alert-danger alert-dismissible fade show rounded-3 mb-4" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {errorMsg}
                <button type="button" className="btn-close" onClick={() => setErrorMsg("")}></button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="mb-3">
                <label className="form-label text-secondary small fw-semibold">
                  Full Name
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary border-opacity-25 text-muted">
                    <FaUser />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label text-secondary small fw-semibold">
                  Email Address
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary border-opacity-25 text-muted">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password & Confirm Password Row */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-semibold">
                    Password
                  </label>
                  <div className="input-password-group input-group">
                    <span className="input-group-text bg-dark border-secondary border-opacity-25 text-muted">
                      <FaLock />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control pe-5"
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-semibold">
                    Confirm Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary border-opacity-25 text-muted">
                      <FaLock />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary-glow w-100 py-3 mb-3 d-flex align-items-center justify-content-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Register Account</span>
                )}
              </button>

              <p className="text-center text-muted small mb-0">
                Already have an account?{" "}
                <Link to="/login" className="text-cyan text-decoration-none fw-semibold">
                  Login here
                </Link>
              </p>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;