import { useState } from "react";
import type { Book } from "../Types";
import Btn from "./Btn";
import Stars from "./Stars";
import TradeModal from "./TradeModal";
import "./BookCard.css";

interface Comment {
  id: number;
  author: string;
  text: string;
  date: string;
}

// Fake wechat usernames per owner (replace with real API data when backend is ready)
const WECHAT_MAP: Record<string, string> = {
  alice_tw: "alice_wechat",
  bob_reads: "bob_reads_wx",
  carol_uni: "carol_uni_wx",
  dave_lib: "dave_lib_wx",
  me: "my_wechat_id",
};

export default function BookCard({ book, myPost = false }: { book: Book; myPost?: boolean }) {
  const [tradeOpen, setTradeOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const wechat = WECHAT_MAP[book.owner] ?? book.owner;

  const submitComment = () => {
    const text = newComment.trim();
    if (!text) return;
    setComments(prev => [
      ...prev,
      { id: Date.now(), author: "You", text, date: new Date().toLocaleDateString() },
    ]);
    setNewComment("");
  };

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

          {/* Comments toggle */}
          <button
            className="book-card__comments-toggle"
            onClick={() => setCommentsOpen(o => !o)}
          >
            💬 {comments.length > 0 ? `${comments.length} comment${comments.length > 1 ? "s" : ""}` : "Add a comment"}
          </button>

          {/* Comments section */}
          {commentsOpen && (
            <div className="book-card__comments">
              {comments.length === 0 && (
                <p className="book-card__no-comments">No comments yet. Be the first!</p>
              )}
              {comments.map(c => (
                <div key={c.id} className="book-card__comment">
                  <span className="book-card__comment-author">{c.author}</span>
                  <span className="book-card__comment-date">{c.date}</span>
                  <p className="book-card__comment-text">{c.text}</p>
                </div>
              ))}
              <div className="book-card__comment-form">
                <input
                  className="book-card__comment-input"
                  placeholder="Write a comment…"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") submitComment(); }}
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
              <Btn label="Delete" danger />
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