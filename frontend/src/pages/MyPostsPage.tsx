import { useState, useEffect } from "react";
import { MY_BOOKS } from "../data";
import type { Book } from "../Types";
import BookCard from "../components/BookCard";
import BookCardSkeleton from "../components/BookCardSkeleton";
import LoadingSpinner from "../components/LoadingSpinner";
import Btn from "../components/Btn";
import AddPostModal from "../components/AddPostModal";
import "./MyPostsPage.css";

export default function MyPostsPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchMyPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await new Promise<void>((res) => setTimeout(res, 700));
        if (!cancelled) setBooks(MY_BOOKS);
      } catch (err: unknown) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Failed to load your posts.";
          setError(message);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchMyPosts();
    return () => { cancelled = true; };
  }, []);

  const handleAdd = (book: Book) => {
    setBooks(prev => [book, ...prev]);
  };

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">My Posts</h2>
        <Btn label="+ Add book" onClick={() => setAddOpen(true)} />
      </div>
      <div className="page__divider" />

      {isLoading && (
        <div>
          {Array.from({ length: 2 }).map((_, i) => <BookCardSkeleton key={i} />)}
          <LoadingSpinner message="Loading your posts…" size="sm" />
        </div>
      )}

      {error && (
        <div className="feed__error" role="alert">
          <span>⚠ {error}</span>
          <button className="btn btn--secondary" onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {!isLoading && !error && books.length === 0 && (
        <div className="my-posts__empty">
          <div>📖</div>
          <p>You haven't posted any books yet.</p>
          <Btn label="Post your first book" onClick={() => setAddOpen(true)} />
        </div>
      )}

      {!isLoading && !error && books.length > 0 && (
        <div>
          {books.map(b => <BookCard key={b.id} book={b} myPost />)}
        </div>
      )}

      {addOpen && (
        <AddPostModal onClose={() => setAddOpen(false)} onAdd={handleAdd} />
      )}
    </div>
  );
}