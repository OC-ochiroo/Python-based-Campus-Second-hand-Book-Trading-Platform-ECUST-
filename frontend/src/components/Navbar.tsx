import type { Page } from "../Types";
import Btn from "./Btn";

export default function Navbar({ page, setPage, loggedIn }: { page: Page; setPage: (p: Page) => void; loggedIn: boolean }) {
  const link = (label: string, target: Page) => (
    <button onClick={() => setPage(target)} style={{
      background: "none", border: "none", cursor: "pointer",
      fontFamily: "'Space Mono', monospace",
      fontWeight: 400,
      fontSize: "0.68rem",
      letterSpacing: "0.1em",
      color: page === target ? "#111" : "#aaa",
      padding: "0",
      textTransform: "uppercase",
      transition: "color 0.2s",
      textDecoration: page === target ? "underline" : "none",
      textUnderlineOffset: "4px",
    }}>{label}</button>
  );

  return (
    <nav style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 40px", height: 56, borderBottom: "1px solid #e8e8e8",
      background: "#fff", position: "sticky", top: 0, zIndex: 100,
    }}>
      <button onClick={() => setPage("home")} style={{
        background: "none", border: "none", cursor: "pointer",
        fontFamily: "'Cormorant Garamond', serif", fontWeight: 600,
        fontSize: "1.15rem", color: "#111", letterSpacing: "0.02em",
      }}>Book2Go</button>

      <div style={{ display: "flex", gap: 32 }}>
        {loggedIn && link("Feed", "feed")}
        {loggedIn && link("My posts", "my-posts")}
        {loggedIn && link("Profile", "profile")}
      </div>

      <div>
        {loggedIn
          ? <Btn label="Log out" secondary onClick={() => setPage("home")} />
          : <Btn label="Log in" onClick={() => setPage("auth")} />}
      </div>
    </nav>
  );
}