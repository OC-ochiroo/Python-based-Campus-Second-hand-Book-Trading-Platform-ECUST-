import "./BookCardSkeleton.css";

export default function BookCardSkeleton() {
  return (
    <div className="book-card skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton--cover" />
      <div className="skeleton-body">
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--author" />
        <div className="skeleton skeleton--stars" />
        <div className="skeleton skeleton--desc" />
        <div className="skeleton skeleton--desc skeleton--desc-short" />
      </div>
      <div className="skeleton-actions">
        <div className="skeleton skeleton--btn" />
        <div className="skeleton skeleton--btn" />
      </div>
    </div>
  );
}
