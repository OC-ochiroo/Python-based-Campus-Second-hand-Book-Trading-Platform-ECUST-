import { useState } from "react";
import { BOOKS } from "../data";
import BookCard from "../components/BookCard";
import "./FeedPage.css";

export default function FeedPage() {
  const [query, setQuery] = useState("");
  const filtered = BOOKS.filter(b =>
    b.title.toLowerCase().includes(query.toLowerCase()) ||
    b.author.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">Browse Books</h2>
        <span className="feed__count">({filtered.length} results)</span>
      </div>
      <div className="page__divider" />

      <div className="feed__search-wrap">
        <span className="feed__search-arrow">→</span>
        <input
          className="feed__search"
          placeholder="Search for a book or author…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {query && (
          <button className="feed__search-clear" onClick={() => setQuery("")}>✕</button>
        )}
      </div>

      <div>
        {filtered.length > 0
          ? filtered.map(b => <BookCard key={b.id} book={b} />)
          : <div className="feed__empty">No books found for "{query}"</div>
        }
      </div>
    </div>
  );
}