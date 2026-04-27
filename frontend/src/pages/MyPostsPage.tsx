import { useState } from "react";
import { MY_BOOKS } from "../data";
import BookCard from "../components/BookCard";
import Btn from "../components/Btn";

export default function MyPostsPage() {
  const [books, setBooks] = useState(MY_BOOKS);

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 40px" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: "#111", margin: 0, fontWeight: 300, letterSpacing: "-0.01em" }}>My Posts</h2>
        <Btn label="+ Add book" />
      </div>
      <div style={{ width: "100%", height: "1px", background: "#e8e8e8", marginBottom: 0 }} />

      <div>
        {books.map(b => (
          <BookCard key={b.id} book={b} myPost />
        ))}
        {books.length === 0 && (
          <div style={{ padding: "80px 0", textAlign: "center", color: "#ccc", fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.08em" }}>
            You haven't posted any books yet.
          </div>
        )}
      </div>
    </div>
  );
}