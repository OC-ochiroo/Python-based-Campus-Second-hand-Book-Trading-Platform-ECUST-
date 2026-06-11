import { useState, useEffect, useCallback } from "react";
import type { Book, Comment } from "../Types";
import { getComments, createComment } from "../api";
import Btn from "./Btn";
import Stars from "./Stars";
import TradeModal from "./TradeModal";
import "./BookCard.css";

interface BookCardProps {
  book: Book;
  myPost?: boolean;
  onDelete?: (id: number) => void;
}

export default function BookCard({ book, myPost = false, onDelete }: BookCardProps) {
  const [tradeOpen, setTradeOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    setCommentsLoading(true);
    try {
      const data = await getComments(book.id);
      setComments(data);
    } catch {
      // non-critical; leave empty
    } finally {
      setCommentsLoading(false);
    }
  }, [book.id]);

  useEffect(() => {
    if (commentsOpen && comments.length === 0) {
      loadComments();
    }
  }, [commentsOpen, comments.length, loadComments]);

  const submitComment = async () => {
    const text = newComment.trim();
    if (!text) return;
    setSubmitError(null);
    try {
      const created = await createComment(book.id, { text });
      setComments((prev) => [...prev, created]);
      setNewComment("");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setSubmitError(axiosErr?.response?.data?.detail ?? "Failed to post comment.");
    }
  };

  const wechat = book.owner_wechat ?? book.owner;

  return (
    <>
      <div className="book-card">
        <div className="book-card__cover" style={{ background: book.cover }} />

        <div>
          <div className="book-card__title">{book.title}</div>
          <div className="book-card__author">{book.author}</div>
          <Stars rating={book.rating} />
          <p className="book-card__description">{book.description}</p>
          <div className="book-card__owner">@{book.owner}</div>

          <button
            className="book-card__comments-toggle"
            onClick={() => setCommentsOpen((o) => !o)}
          >
            💬 {comments.length > 0
              ? `${comments.length} comment${comments.length > 1 ? "s" : ""}`
              : "Add a comment"}
          </button>

          {commentsOpen && (
            <div className="book-card__comments">
              {commentsLoading && (
                <p className="book-card__no-comments">Loading comments…</p>
              )}
              {!commentsLoading && comments.length === 0 && (
                <p className="book-card__no-comments">No comments yet. Be the first!</p>
              )}
              {comments.map((c) => (
                <div key={c.id} className="book-card__comment">
                  <span className="book-card__comment-author">{c.author_username}</span>
                  <span className="book-card__comment-date">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                  <p className="book-card__comment-text">{c.text}</p>
                </div>
              ))}
              {submitError && (
                <p className="book-card__no-comments" style={{ color: "var(--color-danger, #e74c3c)" }}>
                  ⚠ {submitError}
                </p>
              )}
              <div className="book-card__comment-form">
                <input
                  className="book-card__comment-input"
                  placeholder="Write a comment…"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") submitComment(); }}
                />
                <button
                  className="book-card__comment-submit"
                  onClick={submitComment}
                  disabled={!newComment.trim()}
                >→</button>
              </div>
            </div>
          )}
        </div>

        <div className="book-card__actions">
          {myPost ? (
            <>
              <Btn label="Edit" secondary />
              <Btn label="Delete" danger onClick={() => onDelete?.(book.id)} />
            </>
          ) : (
            <>
              <Btn label="Trade" secondary onClick={() => setTradeOpen(true)} />
              <Btn label="Buy" />
            </>
          )}
        </div>
      </div>

      {tradeOpen && (
        <TradeModal
          bookTitle={book.title}
          ownerName={book.owner}
          wechatUsername={wechat}
          onClose={() => setTradeOpen(false)}
        />
      )}
    </>
  );
}