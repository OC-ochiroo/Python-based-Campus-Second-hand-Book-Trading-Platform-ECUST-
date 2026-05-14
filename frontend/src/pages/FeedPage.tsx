import { useState, useMemo } from "react";
import { BOOKS } from "../data";
import BookCard from "../components/BookCard";
import "./FeedPage.css";

const PAGE_SIZE = 5;

export default function FeedPage() {
  const [query, setQuery] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [minRating, setMinRating] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return BOOKS.filter(b => {
      const matchesQuery =
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.author.toLowerCase().includes(query.toLowerCase());

      const matchesAuthor =
        !authorFilter ||
        b.author.toLowerCase().includes(authorFilter.toLowerCase());

      const matchesYear =
        !yearFilter ||
        String((b as any).year ?? "").includes(yearFilter);

      const matchesRating =
        !minRating || b.rating >= parseFloat(minRating);

      const matchesPrice =
        !maxPrice ||
        ((b as any).price !== undefined && (b as any).price <= parseFloat(maxPrice));

      return matchesQuery && matchesAuthor && matchesYear && matchesRating && matchesPrice;
    });
  }, [query, authorFilter, yearFilter, minRating, maxPrice]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const activeFilterCount = [authorFilter, yearFilter, minRating, maxPrice].filter(Boolean).length;

  const clearFilters = () => {
    setAuthorFilter("");
    setYearFilter("");
    setMinRating("");
    setMaxPrice("");
    setCurrentPage(1);
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
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) {
        pages.push(i);
      }
      if (safePage < totalPages - 2) pages.push("…");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">Browse Books</h2>
        <span className="feed__count">({filtered.length} results)</span>
      </div>
      <div className="page__divider" />

      {/* ── Search bar ── */}
      <div className="feed__search-wrap">
        <span className="feed__search-arrow">→</span>
        <input
          className="feed__search"
          placeholder="Search by title or author…"
          value={query}
          onChange={e => { setQuery(e.target.value); setCurrentPage(1); }}
        />
        {query && (
          <button className="feed__search-clear" onClick={() => { setQuery(""); setCurrentPage(1); }}>✕</button>
        )}
      </div>

      {/* ── Filter toggle ── */}
      <div className="feed__filter-bar">
        <button
          className={`feed__filter-toggle${filtersOpen ? " feed__filter-toggle--open" : ""}`}
          onClick={() => setFiltersOpen(o => !o)}
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

      {/* ── Filter panel ── */}
      {filtersOpen && (
        <div className="feed__filters">
          <div className="feed__filter-group">
            <label className="field__label">Author</label>
            <input
              className="field__input feed__filter-input"
              placeholder="e.g. James Clear"
              value={authorFilter}
              onChange={e => { setAuthorFilter(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <div className="feed__filter-group">
            <label className="field__label">Year</label>
            <input
              className="field__input feed__filter-input"
              placeholder="e.g. 2021"
              value={yearFilter}
              onChange={e => { setYearFilter(e.target.value); setCurrentPage(1); }}
              type="number"
              min="1900"
              max="2100"
            />
          </div>

          <div className="feed__filter-group">
            <label className="field__label">Min Rating</label>
            <div className="feed__filter-rating-wrap">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  className={`feed__rating-btn${minRating && parseFloat(minRating) >= star ? " feed__rating-btn--active" : ""}`}
                  onClick={() => {
                    setMinRating(minRating === String(star) ? "" : String(star));
                    setCurrentPage(1);
                  }}
                >
                  ●
                </button>
              ))}
              {minRating && <span className="feed__rating-label">{minRating}+ stars</span>}
            </div>
          </div>

          <div className="feed__filter-group">
            <label className="field__label">Max Price (¥)</label>
            <input
              className="field__input feed__filter-input"
              placeholder="e.g. 50"
              value={maxPrice}
              onChange={e => { setMaxPrice(e.target.value); setCurrentPage(1); }}
              type="number"
              min="0"
            />
          </div>
        </div>
      )}

      {/* ── Book list ── */}
      <div>
        {paginated.length > 0
          ? paginated.map(b => <BookCard key={b.id} book={b} />)
          : <div className="feed__empty">No books found{query ? ` for "${query}"` : ""}</div>
        }
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="feed__pagination">
          <button
            className="feed__page-btn feed__page-btn--nav"
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage === 1}
          >
            ←
          </button>

          {pageNumbers().map((p, i) =>
            p === "…" ? (
              <span key={`ellipsis-${i}`} className="feed__page-ellipsis">…</span>
            ) : (
              <button
                key={p}
                className={`feed__page-btn${safePage === p ? " feed__page-btn--active" : ""}`}
                onClick={() => goToPage(p as number)}
              >
                {p}
              </button>
            )
          )}

          <button
            className="feed__page-btn feed__page-btn--nav"
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage === totalPages}
          >
            →
          </button>

          <span className="feed__page-info">
            {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
        </div>
      )}
    </div>
  );
}
