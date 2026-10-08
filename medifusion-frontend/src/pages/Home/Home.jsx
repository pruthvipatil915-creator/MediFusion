import { Link } from "react-router-dom";
import { FaHeartPulse, FaStethoscope, FaCalendarCheck, FaClock, FaShieldHalved, FaLock, FaUserCheck } from "react-icons/fa6";
import { FiArrowRight } from "react-icons/fi";
import "./Home.css";

function Home() {
  const token = localStorage.getItem("token");

  return (
    <div className="container fade-in">
      {/* Hero Section */}
      <div className="row align-items-center home-hero g-5">
        <div className="col-lg-6">
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-semibold mb-3 d-inline-flex align-items-center gap-2">
            <FaHeartPulse className="text-cyan" /> AI-Driven Healthcare Intelligence
          </span>

          <h1 className="hero-title mb-3">
            AI-Powered Healthcare, Personalized for You
          </h1>

          <p className="hero-subtitle mb-4">
            Understand your symptoms, explore possible health conditions, find suitable doctors, and manage appointments from one unified platform.
          </p>

          <div className="d-flex flex-wrap gap-3">
            <Link
              to={token ? "/prediction" : "/login"}
              className="btn btn-primary-glow d-flex align-items-center gap-2"
            >
              <span>Start Prediction</span>
              <FiArrowRight />
            </Link>

            <Link
              to={token ? "/hospitals" : "/login"}
              className="btn btn-secondary-glow d-flex align-items-center gap-2"
            >
              <FaStethoscope />
              <span>Find Doctors</span>
            </Link>
          </div>
        </div>

        {/* Hero Visual Card Panel */}
        <div className="col-lg-6">
          <div className="glass-card p-4 text-center position-relative overflow-hidden" style={{ animation: 'floatAnimation 6s ease-in-out infinite' }}>
            <div className="position-absolute top-0 end-0 p-3 opacity-25">
              <FaHeartPulse style={{ fontSize: '10rem', color: '#06b6d4' }} />
            </div>
            
            <div className="py-4 position-relative z-1">
              <div className="d-inline-flex p-4 rounded-circle bg-primary-subtle text-cyan mb-4" style={{ boxShadow: '0 0 30px rgba(6,182,212,0.4)' }}>
                <FaHeartPulse style={{ fontSize: '3.5rem' }} />
              </div>
              <h3 className="fw-bold mb-2">RandomForest AI Clinical Engine</h3>
              <p className="text-muted small max-w-md mx-auto mb-4">
                Analyzing multi-symptom pattern inputs against validated clinical disease databases.
              </p>

              <div className="row g-2 text-start">
                <div className="col-6">
                  <div className="p-2.5 rounded bg-dark border border-secondary border-opacity-25 small">
                    <span className="text-muted d-block fs-7">Accuracy Metric</span>
                    <span className="fw-bold text-success">95%+ Pattern Match</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-2.5 rounded bg-dark border border-secondary border-opacity-25 small">
                    <span className="text-muted d-block fs-7">Disease Library</span>
                    <span className="fw-bold text-cyan">Integrated Database</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="my-5 py-4">
        <div className="text-center mb-5">
          <h2 className="fw-bold display-6">Comprehensive Healthcare Features</h2>
          <p className="text-muted">Everything you need for personal medical insight and doctor connectivity.</p>
        </div>

        <div className="row g-4">
          <div className="col-lg-3 col-md-6">
            <div className="feature-card-home">
              <div className="feature-icon-box">
                <FaHeartPulse />
              </div>
              <h4 className="fw-bold h5 mb-2">AI Disease Prediction</h4>
              <p className="text-muted small mb-0">
                Input your symptoms to receive an instant machine learning health risk assessment.
              </p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="feature-card-home">
              <div className="feature-icon-box">
                <FaStethoscope />
              </div>
              <h4 className="fw-bold h5 mb-2">Doctor Discovery</h4>
              <p className="text-muted small mb-0">
                Search licensed medical specialists by city, experience, and consultation fees.
              </p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="feature-card-home">
              <div className="feature-icon-box">
                <FaCalendarCheck />
              </div>
              <h4 className="fw-bold h5 mb-2">Appointment Booking</h4>
              <p className="text-muted small mb-0">
                Book convenient time slots with top doctors and manage cancellations easily.
              </p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="feature-card-home">
              <div className="feature-icon-box">
                <FaClock />
              </div>
              <h4 className="fw-bold h5 mb-2">Prediction History</h4>
              <p className="text-muted small mb-0">
                Track past predictions over time to observe health patterns and specialist notes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How MediFusion Works Section */}
      <div className="my-5 py-4">
        <div className="glass-card p-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold display-6">How MediFusion Works</h2>
            <p className="text-muted">Four simple steps from symptoms to specialized medical care.</p>
          </div>

          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="step-card">
                <div className="step-number">1</div>
                <h5 className="fw-bold mb-2">Select Symptoms</h5>
                <p className="text-muted small mb-0">Search and select your active physical symptoms.</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="step-card">
                <div className="step-number">2</div>
                <h5 className="fw-bold mb-2">AI Prediction</h5>
                <p className="text-muted small mb-0">ML model analyzes pattern matches and generates confidence.</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="step-card">
                <div className="step-number">3</div>
                <h5 className="fw-bold mb-2">Find Specialist</h5>
                <p className="text-muted small mb-0">Explore recommended specialist doctors for your condition.</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="step-card">
                <div className="step-number">4</div>
                <h5 className="fw-bold mb-2">Book Appointment</h5>
                <p className="text-muted small mb-0">Confirm your visit slot and receive instant confirmation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Trust Section */}
      <div className="my-5 pb-4">
        <div className="row g-4 align-items-center">
          <div className="col-md-4">
            <div className="trust-badge">
              <FaShieldHalved className="text-cyan fs-2" />
              <div>
                <h6 className="fw-bold mb-0 text-white">Data Security</h6>
                <small className="text-muted">Encrypted JWT tokens & stateless API</small>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="trust-badge">
              <FaLock className="text-primary fs-2" />
              <div>
                <h6 className="fw-bold mb-0 text-white">Privacy First</h6>
                <small className="text-muted">Your health history is strictly protected</small>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="trust-badge">
              <FaUserCheck className="text-success fs-2" />
              <div>
                <h6 className="fw-bold mb-0 text-white">Verified Specialists</h6>
                <small className="text-muted">Connect directly with licensed physicians</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;