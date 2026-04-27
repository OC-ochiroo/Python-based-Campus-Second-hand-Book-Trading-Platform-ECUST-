import type { Page } from "../Types";

export default function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div style={{ minHeight: "calc(100vh - 56px)", display: "flex", flexDirection: "column" }}>
      {/* Hero */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", textAlign: "center", padding: "100px 40px",
        background: "#fff",
        position: "relative", overflow: "hidden",
      }}>
        {/* Fine grid lines — decorative */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(#f0f0f0 1px, transparent 1px), linear-gradient(90deg, #f0f0f0 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.5,
        }} />

        <div style={{
          fontSize: "0.62rem", fontFamily: "'Space Mono', monospace",
          letterSpacing: "0.2em", textTransform: "uppercase", color: "#aaa",
          marginBottom: 24,
        }}>Community Book Exchange</div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(3rem, 7vw, 5.5rem)",
          fontWeight: 300, color: "#111", lineHeight: 1.05,
          margin: "0 0 24px", maxWidth: 700, letterSpacing: "-0.02em",
        }}>
          Exchange your<br />
          <span style={{ fontStyle: "italic" }}>knowledge</span>
        </h1>

        <p style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem",
          color: "#888", maxWidth: 440, lineHeight: 1.8, marginBottom: 48,
          fontWeight: 400,
        }}>
          Trade, buy, and share books with students and readers across your city and university.
        </p>

        <button
          onClick={() => setPage("feed")}
          style={{
            padding: "13px 36px", border: "1px solid #111",
            background: "#111", color: "#fff",
            fontFamily: "'Space Mono', monospace", fontWeight: 400,
            fontSize: "0.68rem", cursor: "pointer", letterSpacing: "0.12em",
            textTransform: "uppercase",
            transition: "all 0.25s",
            borderRadius: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#111"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#111"; e.currentTarget.style.color = "#fff"; }}
        >
          Search for books →
        </button>
      </div>
    </div>
  );
}