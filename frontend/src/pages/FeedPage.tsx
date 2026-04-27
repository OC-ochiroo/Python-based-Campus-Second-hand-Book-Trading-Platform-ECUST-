import { useState } from "react";
import { BOOKS } from "../data";
import BookCard from "../components/BookCard";

export default function FeedPage() {
  const [query, setQuery] = useState("");
  const filtered = BOOKS.filter(b =>
    b.title.toLowerCase().includes(query.toLowerCase()) ||
    b.author.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 40px" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: "#111", fontWeight: 300, letterSpacing: "-0.01em" }}>Browse Books</h2>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", color: "#bbb", letterSpacing: "0.1em" }}>({filtered.length} results)</span>
      </div>
      <div style={{ width: "100%", height: "1px", background: "#e8e8e8", marginBottom: 32 }} />

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 40 }}>
        <span style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", color: "#bbb", fontSize: "0.75rem", fontFamily: "'Space Mono', monospace" }}>→</span>
        <input
          style={{
            width: "100%", padding: "12px 32px 12px 20px",
            border: "none", borderBottom: "1px solid #ddd",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.78rem", outline: "none", background: "transparent",
            boxSizing: "border-box", transition: "border-color 0.2s", color: "#111",
            borderRadius: 0,
          }}
          placeholder="Search for a book or author…"
          value={query} onChange={e => setQuery(e.target.value)}
          onFocus={e => e.target.style.borderColor = "#111"}
          onBlur={e => e.target.style.borderColor = "#ddd"}
        />
        {query && (
          <button onClick={() => setQuery("")} style={{
            position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer", color: "#bbb", fontSize: "0.8rem",
            fontFamily: "'Space Mono', monospace",
          }}>✕</button>
        )}
      </div>

      {/* Book list */}
      <div>
        {filtered.length > 0
          ? filtered.map(b => <BookCard key={b.id} book={b} />)
          : <div style={{ padding: "60px 0", textAlign: "center", color: "#bbb", fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.08em" }}>No books found for "{query}"</div>
        }
      </div>
    </div>
  );
}