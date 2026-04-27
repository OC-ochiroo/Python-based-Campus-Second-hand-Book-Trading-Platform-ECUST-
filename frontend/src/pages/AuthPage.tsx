import { useState } from "react";
import type { Page } from "../Types";
import Btn from "../components/Btn";

export default function AuthPage({ setPage, setLoggedIn }: { setPage: (p: Page) => void; setLoggedIn: (v: boolean) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email && password) {
      setLoggedIn(true);
      setPage("feed");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 0", borderRadius: 0,
    border: "none",
    borderBottom: "1px solid #ddd",
    fontFamily: "'Space Mono', monospace",
    fontSize: "0.78rem", outline: "none", background: "transparent",
    boxSizing: "border-box", transition: "border-color 0.2s",
    color: "#111",
  };

  return (
    <div style={{
      minHeight: "calc(100vh - 56px)", display: "grid",
      gridTemplateColumns: "1fr 460px 1fr",
    }}>
      {/* Left panel */}
      <div style={{
        background: "#111",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ textAlign: "center", color: "#fff", padding: 48 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", fontWeight: 300, lineHeight: 1.2, letterSpacing: "-0.01em" }}>
            Your next<br />favourite book<br />is waiting.
          </div>
        </div>
      </div>

      {/* Form */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "#fff", padding: "60px 52px",
        borderLeft: "1px solid #e8e8e8", borderRight: "1px solid #e8e8e8",
      }}>
        <div style={{ width: "100%" }}>
          <div style={{
            fontFamily: "'Space Mono', monospace", fontSize: "0.62rem",
            letterSpacing: "0.18em", textTransform: "uppercase", color: "#bbb",
            marginBottom: 12,
          }}>Welcome back</div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem",
            fontWeight: 300, color: "#111", marginBottom: 40, letterSpacing: "-0.01em",
          }}>Book2Go</h2>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", color: "#aaa", fontWeight: 400, display: "block", marginBottom: 8, letterSpacing: "0.12em", textTransform: "uppercase" }}>Email</label>
            <input
              style={inputStyle} type="email" placeholder="you@university.edu"
              value={email} onChange={e => setEmail(e.target.value)}
              onFocus={e => e.target.style.borderColor = "#111"}
              onBlur={e => e.target.style.borderColor = "#ddd"}
            />
          </div>

          <div style={{ marginBottom: 36 }}>
            <label style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", color: "#aaa", fontWeight: 400, display: "block", marginBottom: 8, letterSpacing: "0.12em", textTransform: "uppercase" }}>Password</label>
            <input
              style={inputStyle} type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              onFocus={e => e.target.style.borderColor = "#111"}
              onBlur={e => e.target.style.borderColor = "#ddd"}
            />
          </div>

          <button
            onClick={handleLogin}
            style={{
              width: "100%", padding: "13px", border: "1px solid #111",
              background: "#111", color: "#fff",
              fontFamily: "'Space Mono', monospace", fontWeight: 400,
              fontSize: "0.68rem", cursor: "pointer",
              letterSpacing: "0.1em", textTransform: "uppercase",
              transition: "all 0.2s", borderRadius: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#111"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#111"; e.currentTarget.style.color = "#fff"; }}
          >
            Log in
          </button>

          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "#ccc", textAlign: "center", marginTop: 24, letterSpacing: "0.05em" }}>
            No account? <span style={{ color: "#111", cursor: "pointer" }}>Sign up</span>
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        background: "#f5f5f5",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ textAlign: "center", color: "#999", padding: 48 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontStyle: "italic", fontWeight: 300, lineHeight: 1.6 }}>
            "A reader lives<br />a thousand lives."
          </div>
        </div>
      </div>
    </div>
  );
}