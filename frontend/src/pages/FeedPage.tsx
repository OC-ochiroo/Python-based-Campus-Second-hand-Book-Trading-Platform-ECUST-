import { useState, useMemo, useEffect } from "react";
import type { Book } from "../Types";
import { getPosts } from "../api";
import BookCard from "../components/BookCard";
import BookCardSkeleton from "../components/BookCardSkeleton";
import LoadingSpinner from "../components/LoadingSpinner";
import "./FeedPage.css";

const PAGE_SIZE = 5;

// Deterministic cover colours so cards look consistent across reloads
const COVER_PALETTE = [
  { cover: "#2c3e50", spine: "#1a252f" },
  { cover: "#5c4a1e", spine: "#3d3014" },
  { cover: "#3d2b1f", spine: "#2a1d14" },
  { cover: "#1c3a2e", spine: "#122719" },
  { cover: "#4a2040", spine: "#321529" },
  { cover: "#1e3a5f", spine: "#132540" },
  { cover: "#4a3c1a", spine: "#342a10" },
  { cover: "#2d3a1e", spine: "#1e2812" },
];

function colorForId(id: number) {
  return COVER_PALETTE[id % COVER_PALETTE.length];
}

export default function FeedPage() {
  const [query, setQuery] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [minRating, setMinRating] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchBooks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const posts = await getPosts();
        if (!cancelled) {
          setBooks(
            posts.map((p) => {
              const c = colorForId(p.id);
              return {
                id: p.id,
                title: p.title,
                author: p.author ?? "",
                rating: p.rating ?? 0,
                description: p.description ?? "",
                owner: p.owner_username ?? String(p.user_id),
                owner_wechat: p.owner_wechat,
                cover: c.cover,
                spine: c.spine,
                year: p.year,
                price: p.price,
                status: p.status,
                created_at: p.created_at,
              };
            })
          );
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Failed to load books. Please try again.";
          setError(message);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchBooks();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    return books.filter((b) => {
      const matchesQuery =
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.author.toLowerCase().includes(query.toLowerCase());
      const matchesAuthor =
        !authorFilter || b.author.toLowerCase().includes(authorFilter.toLowerCase());
      const matchesYear = !yearFilter || String(b.year ?? "").includes(yearFilter);
      const matchesRating = !minRating || (b.rating ?? 0) >= parseFloat(minRating);
      const matchesPrice =
        !maxPrice || (b.price !== undefined && b.price <= parseFloat(maxPrice));
      return matchesQuery && matchesAuthor && matchesYear && matchesRating && matchesPrice;
    });
  }, [books, query, authorFilter, yearFilter, minRating, maxPrice]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const activeFilterCount = [authorFilter, yearFilter, minRating, maxPrice].filter(Boolean).length;

  const clearFilters = () => {
    setAuthorFilter(""); setYearFilter(""); setMinRating(""); setMaxPrice(""); setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageNumbers = (): (number | "…")[] => {
    const pages: (number | "…")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push("…");
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pages.push(i);
      if (safePage < totalPages - 2) pages.push("…");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">Browse Books</h2>
        {!isLoading && !error && (
          <span className="feed__count">({filtered.length} results)</span>
        )}
      </div>
      <div className="page__divider" />

      <div className="feed__search-wrap">
        <span className="feed__search-arrow">→</span>
        <input
          className="feed__search"
          placeholder="Search by title or author…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }}
          disabled={isLoading}
        />
        {query && (
          <button className="feed__search-clear" onClick={() => { setQuery(""); setCurrentPage(1); }}>✕</button>
        )}
      </div>

      <div className="feed__filter-bar">
        <button
          className={`feed__filter-toggle${filtersOpen ? " feed__filter-toggle--open" : ""}`}
          onClick={() => setFiltersOpen((o) => !o)}
          disabled={isLoading}
        >
          <span className="feed__filter-toggle-icon">{filtersOpen ? "▲" : "▼"}</span>
          Filters
          {activeFilterCount > 0 && (
            <span className="feed__filter-badge">{activeFilterCount}</span>
          )}
        </button>
        {activeFilterCount > 0 && (
          <button className="feed__filter-clear" onClick={clearFilters}>Clear all</button>
        )}
      </div>

      {filtersOpen && (
        <div className="feed__filters">
          <div className="feed__filter-group">
            <label className="field__label">Author</label>
            <input className="field__input feed__filter-input" placeholder="e.g. James Clear"
              value={authorFilter} onChange={(e) => { setAuthorFilter(e.target.value); setCurrentPage(1); }} />
          </div>
          <div className="feed__filter-group">
            <label className="field__label">Year</label>
            <input className="field__input feed__filter-input" placeholder="e.g. 2021" type="number"
              min="1900" max="2100" value={yearFilter}
              onChange={(e) => { setYearFilter(e.target.value); setCurrentPage(1); }} />
          </div>
          <div className="feed__filter-group">
            <label className="field__label">Min Rating</label>
            <div className="feed__filter-rating-wrap">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star}
                  className={`feed__rating-btn${minRating && parseFloat(minRating) >= star ? " feed__rating-btn--active" : ""}`}
                  onClick={() => { setMinRating(minRating === String(star) ? "" : String(star)); setCurrentPage(1); }}>
                  ●
                </button>
              ))}
              {minRating && <span className="feed__rating-label">{minRating}+ stars</span>}
            </div>
          </div>
          <div className="feed__filter-group">
            <label className="field__label">Max Price (¥)</label>
            <input className="field__input feed__filter-input" placeholder="e.g. 50" type="number" min="0"
              value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setCurrentPage(1); }} />
          </div>
        </div>
      )}

      {error && (
        <div className="feed__error" role="alert">
          <span>⚠ {error}</span>
          <button className="btn btn--secondary" onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {isLoading && (
        <div>
          {Array.from({ length: 3 }).map((_, i) => <BookCardSkeleton key={i} />)}
          <LoadingSpinner message="Fetching books…" size="sm" />
        </div>
      )}

      {!isLoading && !error && books.length === 0 && (
        <div className="feed__empty-state">
          <div className="feed__empty-icon">📚</div>
          <h3 className="feed__empty-title">No books yet</h3>
          <p className="feed__empty-sub">Be the first to list a book for trade!</p>
        </div>
      )}

      {!isLoading && !error && books.length > 0 && (
        <div>
          {paginated.length > 0
            ? paginated.map((b) => <BookCard key={b.id} book={b} />)
            : <div className="feed__empty">No books found{query ? ` for "${query}"` : ""}</div>
          }
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <div className="feed__pagination">
          <button className="feed__page-btn feed__page-btn--nav" onClick={() => goToPage(safePage - 1)} disabled={safePage === 1}>←</button>
          {pageNumbers().map((p, i) =>
            p === "…" ? (
              <span key={`e-${i}`} className="feed__page-ellipsis">…</span>
            ) : (
              <button key={p} className={`feed__page-btn${safePage === p ? " feed__page-btn--active" : ""}`}
                onClick={() => goToPage(p as number)}>{p}</button>
            )
          )}
          <button className="feed__page-btn feed__page-btn--nav" onClick={() => goToPage(safePage + 1)} disabled={safePage === totalPages}>→</button>
          <span className="feed__page-info">{(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
        </div>
      )}
    </div>
  );
}