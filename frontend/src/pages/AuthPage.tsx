import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

export default function AuthPage({ setLoggedIn }: { setLoggedIn: (v: boolean) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email && password) {
      setLoggedIn(true);
      navigate("/feed");
    }
  };

  return (
    <div className="auth">
      <div className="auth__left">
        <div className="auth__tagline">
          Your next<br />favourite book<br />is waiting.
        </div>
      </div>

      <div className="auth__form-panel">
        <div className="auth__form">
          <div className="auth__welcome">Welcome back</div>
          <h2 className="auth__title">Book2Go</h2>

          <div className="auth__field">
            <label className="auth__label">Email</label>
            <input
              className="auth__input"
              type="email"
              placeholder="you@university.edu"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="auth__field auth__field--last">
            <label className="auth__label">Password</label>
            <input
              className="auth__input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button className="auth__submit" onClick={handleLogin}>
            Log in
          </button>

          <p className="auth__footer">
            No account? <span className="auth__signup-link">Sign up</span>
          </p>
        </div>
      </div>

      <div className="auth__right">
        <div className="auth__quote">
          "A reader lives<br />a thousand lives."
        </div>
      </div>
    </div>
  );
}