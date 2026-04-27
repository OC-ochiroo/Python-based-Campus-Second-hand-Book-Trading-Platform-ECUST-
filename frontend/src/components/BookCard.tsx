import type { Book } from "../Types";
import Btn from "./Btn";
import Stars from "./Stars";

export default function BookCard({ book, myPost = false }: { book: Book; myPost?: boolean }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "80px 1fr auto",
      gap: "0 24px",
      alignItems: "start",
      padding: "24px 0",
      borderBottom: "1px solid #e8e8e8",
      transition: "opacity 0.2s",
    }}
      onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
    >
      {/* Cover */}
      <div style={{
        width: 80, height: 108,
        background: book.cover,
        flexShrink: 0,
      }} />

      {/* Info */}
      <div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "1.05rem", color: "#111", marginBottom: 3, letterSpacing: "-0.01em" }}>{book.title}</div>
        <div style={{ fontSize: "0.72rem", color: "#999", marginBottom: 8, fontFamily: "'Space Mono', monospace", letterSpacing: "0.05em" }}>{book.author}</div>
        <Stars rating={book.rating} />
        <p style={{ color: "#666", marginTop: 10, lineHeight: 1.7, maxWidth: 400, fontFamily: "'EB Garamond', serif", fontSize: "0.9rem" }}>{book.description}</p>
        <div style={{ fontSize: "0.65rem", color: "#bbb", marginTop: 8, fontFamily: "'Space Mono', monospace", letterSpacing: "0.08em" }}>@{book.owner}</div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 4 }}>
        {myPost ? (
          <>
            <Btn label="Edit" secondary />
            <Btn label="Delete" danger />
          </>
        ) : (
          <>
            <Btn label="Trade" secondary />
            <Btn label="Buy" />
          </>
        )}
      </div>
    </div>
  );
}