import { useState } from "react";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    if (!email || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const normalizedEmail =
        email.trim().toLowerCase();

      if (
        normalizedEmail ===
          "tanisha@campusprep.com" &&
        password === "campus123"
      ) {
        onLogin("student");
        return;
      }

      if (
        normalizedEmail ===
          "admin@campusprep.com" &&
        password === "admin123"
      ) {
        onLogin("admin");
        return;
      }

      setError(
        "Invalid login details. Please check your credentials."
      );

      setLoading(false);
    }, 650);
  };

  const fillStudent = () => {
    setEmail("tanisha@campusprep.com");
    setPassword("campus123");
    setError("");
  };

  const fillAdmin = () => {
    setEmail("admin@campusprep.com");
    setPassword("admin123");
    setError("");
  };

  return (
    <main className="auth-page">
      <div className="auth-particles">
        {Array.from({ length: 18 }).map(
          (_, index) => (
            <span
              key={index}
              style={{
                "--i": index,
              }}
            />
          )
        )}
      </div>

      <div className="auth-grid" />

      <div className="auth-glow auth-glow-one" />
      <div className="auth-glow auth-glow-two" />
      <div className="auth-glow auth-glow-three" />

      <div className="auth-orbit orbit-one" />
      <div className="auth-orbit orbit-two" />

      <div className="auth-noise" />

      <div className="auth-container">
        <section className="auth-hero">
          <div className="auth-brand">
            <div className="auth-brand-mark">
              <span>CP</span>
            </div>

            <div>
              <strong>CampusPrep</strong>

              <span>
                Academic Intelligence Platform
              </span>
            </div>
          </div>

          <div className="auth-hero-content">
            <div className="auth-eyebrow">
              <span className="live-dot" />

              YOUR CAMPUS. YOUR PREP. YOUR PROGRESS.
            </div>

            <h1>
              Prepare smarter.
              <br />
              <span>Perform stronger.</span>
            </h1>

            <p>
              One focused space for previous-year
              questions, repeated-question analysis,
              timed tests and performance tracking.
            </p>

            <div className="auth-feature-stack">
              <div className="auth-floating-card feature-main">
                <div className="feature-icon purple-icon">
                  ✦
                </div>

                <div>
                  <strong>
                    Smart PYQ Library
                  </strong>

                  <span>
                    Find, filter and practice your
                    college questions.
                  </span>
                </div>

                <div className="feature-arrow">
                  ↗
                </div>
              </div>

              <div className="auth-feature-row">
                <div className="auth-floating-card mini-feature">
                  <div className="feature-icon cyan-icon">
                    ↻
                  </div>

                  <div>
                    <strong>
                      Repeated
                    </strong>

                    <span>
                      Patterns
                    </span>
                  </div>
                </div>

                <div className="auth-floating-card mini-feature">
                  <div className="feature-icon pink-icon">
                    ◈
                  </div>

                  <div>
                    <strong>
                      Timed Tests
                    </strong>

                    <span>
                      Instant results
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="auth-bottom-line">
              <span>
                Built for students who want less
                searching, more studying.
              </span>

              <div className="auth-student-stack">
                <div>TS</div>
                <div>IT</div>
                <div>V</div>
              </div>
            </div>
          </div>
        </section>

        <section className="auth-panel-wrap">
          <div className="auth-panel-glow" />

          <div className="auth-panel">
            <div className="auth-panel-top">
              <div className="auth-shield">
                🛡️
              </div>

              <div className="auth-secure">
                <span className="secure-dot" />
                SECURE COLLEGE ACCESS
              </div>
            </div>

            <div className="auth-heading">
              <span>WELCOME BACK</span>

              <h2>
                Continue your journey.
              </h2>

              <p>
                Sign in to your CampusPrep account.
              </p>
            </div>

            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >
              <div className="auth-input-group">
                <label htmlFor="email">
                  Email
                </label>

                <div className="auth-input-wrap">
                  <span className="auth-input-icon">
                    @
                  </span>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    placeholder="Enter your email"
                    autoComplete="email"
                    onChange={(event) => {
                      setEmail(
                        event.target.value
                      );
                      setError("");
                    }}
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <div className="auth-label-row">
                  <label htmlFor="password">
                    Password
                  </label>

                  <button
                    type="button"
                    className="auth-forgot"
                    onClick={() =>
                      setError(
                        "Use one of the demo accounts below."
                      )
                    }
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="auth-input-wrap">
                  <span className="auth-input-icon">
                    ●
                  </span>

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    onChange={(event) => {
                      setPassword(
                        event.target.value
                      );
                      setError("");
                    }}
                  />

                  <button
                    type="button"
                    className="auth-eye"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >
                    {showPassword
                      ? "◉"
                      : "◌"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="auth-error">
                  <span>!</span>
                  {error}
                </div>
              )}

              <button
                className="auth-submit"
                type="submit"
                disabled={loading}
              >
                <span>
                  {loading
                    ? "Signing you in..."
                    : "Sign In"}
                </span>

                {!loading && (
                  <span className="auth-submit-arrow">
                    →
                  </span>
                )}

                {loading && (
                  <span className="auth-spinner" />
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span />
              <p>DEMO ACCOUNTS</p>
              <span />
            </div>

            <button
              className="demo-account"
              type="button"
              onClick={fillStudent}
            >
              <div className="demo-icon">
                TS
              </div>

              <div className="demo-details">
                <span>
                  Student Account
                </span>

                <strong>
                  tanisha@campusprep.com
                </strong>
              </div>

              <div className="demo-fill">
                Use
              </div>
            </button>

            <button
              className="demo-account admin-demo"
              type="button"
              onClick={fillAdmin}
            >
              <div className="demo-icon admin-demo-icon">
                AD
              </div>

              <div className="demo-details">
                <span>
                  Administrator
                </span>

                <strong>
                  admin@campusprep.com
                </strong>
              </div>

              <div className="demo-fill">
                Use
              </div>
            </button>

            <div className="auth-college">
              <div className="college-icon">
                🎓
              </div>

              <div>
                <span>
                  College workspace
                </span>

                <strong>
                  Thakur Shyamnarayan
                  Degree College
                </strong>
              </div>
            </div>

            <div className="auth-footer">
              <span>
                CampusPrep v1.0
              </span>

              <span>
                Made for focused preparation
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;