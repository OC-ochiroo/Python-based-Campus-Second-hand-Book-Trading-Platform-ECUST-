import { useState, useEffect } from "react";
import type { Book } from "../Types";
import { getMyPosts, deletePost } from "../api";
import BookCard from "../components/BookCard";
import BookCardSkeleton from "../components/BookCardSkeleton";
import LoadingSpinner from "../components/LoadingSpinner";
import Btn from "../components/Btn";
import AddPostModal from "../components/AddPostModal";
import "./MyPostsPage.css";

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
        const posts = await getMyPosts();
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
                owner: p.owner_username ?? "me",
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

  // Called by AddPostModal after a successful POST — receives the server-created Book
  const handleAdd = (book: Book) => {
    setBooks((prev) => [book, ...prev]);
  };

  const handleDelete = async (bookId: number) => {
    try {
      await deletePost(bookId);
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete post.";
      setError(message);
    }
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
          {books.map((b) => (
            <BookCard key={b.id} book={b} myPost onDelete={handleDelete} />
          ))}
        </div>
      )}

      {addOpen && (
        <AddPostModal onClose={() => setAddOpen(false)} onAdd={handleAdd} />
      )}
    </div>
  );
}