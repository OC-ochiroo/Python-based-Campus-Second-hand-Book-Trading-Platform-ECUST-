import { useState } from "react";
import type { Page } from "../Types";
import { MY_BOOKS } from "../data";
import Btn from "../components/Btn";
import BookCard from "../components/BookCard";
import Stars from "../components/Stars";

export default function ProfilePage({ setPage }: { setPage: (p: Page) => void }) {
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("alex_reader");
  const [wechat, setWechat] = useState("alex_wechat");
  const [city, setCity] = useState("Taichung / NCHU");

  const fieldStyle: React.CSSProperties = {
    width: "100%", padding: "10px 0", borderRadius: 0,
    border: "none", borderBottom: "1px solid #ddd",
    fontFamily: "'Space Mono', monospace",
    fontSize: "0.78rem", outline: "none", background: "transparent",
    boxSizing: "border-box", color: "#111",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 40px" }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: "#111", marginBottom: 4, fontWeight: 300, letterSpacing: "-0.01em" }}>My Profile</h2>
      <div style={{ width: "100%", height: "1px", background: "#e8e8e8", marginBottom: 40 }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 40 }}>
        {/* Left: avatar + fields */}
        <div style={{ borderTop: "1px solid #e8e8e8", paddingTop: 32 }}>
          {/* Avatar */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
            <div style={{
              width: 96, height: 96,
              background: "#111",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2rem", color: "#fff", fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
            }}>A</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {[
              { label: "Username", value: username, setter: setUsername },
              { label: "WeChat username", value: wechat, setter: setWechat },
              { label: "University / City", value: city, setter: setCity },
            ].map(f => (
              <div key={f.label}>
                <label style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", color: "#bbb", fontWeight: 400, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.14em" }}>{f.label}</label>
                <input
                  style={fieldStyle} value={f.value} readOnly={!editing}
                  onChange={e => f.setter(e.target.value)}
                  onFocus={e => e.target.style.borderColor = "#111"}
                  onBlur={e => e.target.style.borderColor = "#ddd"}
                />
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 36 }}>
            <button
              onClick={() => setEditing(!editing)}
              style={{
                flex: 1, padding: "11px", borderRadius: 0,
                border: "1px solid #111", background: editing ? "#111" : "transparent",
                color: editing ? "#fff" : "#111",
                fontFamily: "'Space Mono', monospace", fontWeight: 400,
                fontSize: "0.65rem", cursor: "pointer", letterSpacing: "0.1em",
                textTransform: "uppercase", transition: "all 0.2s",
              }}
            >{editing ? "Save" : "Edit profile"}</button>
            <button style={{
              flex: 1, padding: "11px", borderRadius: 0,
              border: "1px solid #ddd", background: "transparent",
              color: "#ccc", fontFamily: "'Space Mono', monospace",
              fontWeight: 400, fontSize: "0.65rem", cursor: "pointer",
              letterSpacing: "0.1em", textTransform: "uppercase",
              transition: "all 0.2s",
            }}>Delete profile</button>
          </div>
        </div>

        {/* Right: recent posts */}
        <div style={{ borderTop: "1px solid #e8e8e8", paddingTop: 32 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 28 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: "#111", margin: 0, fontWeight: 400 }}>Recent posts</h3>
            <button onClick={() => setPage("my-posts")} style={{
              background: "none", border: "none",
              cursor: "pointer", fontFamily: "'Space Mono', monospace",
              fontSize: "0.62rem", color: "#aaa", letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}>My posts →</button>
          </div>
          {MY_BOOKS.slice(0, 2).map(b => (
            <div key={b.id} style={{ display: "flex", gap: 16, padding: "16px 0", borderBottom: "1px solid #ececec" }}>
              <div style={{ width: 44, height: 60, background: b.cover, flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: "1rem", color: "#111" }}>{b.title}</div>
                <div style={{ fontSize: "0.65rem", color: "#bbb", fontFamily: "'Space Mono', monospace", marginTop: 2, letterSpacing: "0.05em" }}>{b.author}</div>
                <div style={{ marginTop: 6 }}><Stars rating={b.rating} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}