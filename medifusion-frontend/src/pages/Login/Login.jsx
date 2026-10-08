import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { FaHeartPulse, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaShieldHalved } from "react-icons/fa6";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await loginUser({
        email: email.trim(),
        password,
      });

      const data = response?.data || response;

      if (!data || !data.token || !data.userId) {
        setErrorMsg(data?.message || "Login failed: Invalid response from server.");
        setLoading(false);
        return;
      }

      // Save JWT Token & User Context safely
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", String(data.userId));
      if (data.fullName) {
        localStorage.setItem("fullName", data.fullName);
      }

      // Redirect to Dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error("Login Error:", error);

      if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else if (error.response?.data?.error) {
        setErrorMsg(error.response.data.error);
      } else {
        setErrorMsg("Unable to connect to the server. Please verify your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container auth-wrapper py-5 fade-in">
      <div className="auth-card-split">
        <div className="row g-0">
          
          {/* Left Graphic Panel */}
          <div className="col-lg-6 d-none d-lg-flex auth-panel-graphic">
            <div className="d-flex align-items-center gap-2 mb-4">
              <div className="brand-icon-wrapper">
                <FaHeartPulse />
              </div>
              <h3 className="brand-logo mb-0">MediFusion AI</h3>
            </div>

            <h2 className="fw-bold text-white display-6 mb-3">
              Secure Access to Your Healthcare Intelligence
            </h2>

            <p className="text-muted leading-relaxed mb-4">
              Sign in to manage your symptom assessments, specialist appointments, and medical history powered by machine learning algorithms.
            </p>

            <div className="d-flex align-items-center gap-3 text-cyan small p-3 rounded bg-dark border border-secondary border-opacity-25">
              <FaShieldHalved className="fs-4 flex-shrink-0" />
              <span>Stateless JWT Authentication with End-to-End Encryption</span>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="col-lg-6 auth-panel-form">
            <div className="mb-4 text-center text-lg-start">
              <h2 className="fw-bold text-white h3 mb-2">Welcome Back</h2>
              <p className="text-muted small">Enter your credentials to access your account.</p>
            </div>

            {errorMsg && (
              <div className="alert alert-danger alert-dismissible fade show rounded-3 mb-4" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {errorMsg}
                <button type="button" className="btn-close" onClick={() => setErrorMsg("")}></button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
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

              {/* Password */}
              <div className="mb-4">
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
                    placeholder="Enter your password"
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

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary-glow w-100 py-3 mb-3 d-flex align-items-center justify-content-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>

              <p className="text-center text-muted small mb-0">
                Don't have an account?{" "}
                <Link to="/register" className="text-cyan text-decoration-none fw-semibold">
                  Register here
                </Link>
              </p>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;