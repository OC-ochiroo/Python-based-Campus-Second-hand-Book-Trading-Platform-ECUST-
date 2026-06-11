import { useState } from "react";
import type { Book } from "../Types";
import "./AddPostModal.css";

interface AddPostModalProps {
  onClose: () => void;
  onAdd: (book: Book) => void;
}

const COVER_COLORS = [
  { cover: "#2c3e50", spine: "#1a252f" },
  { cover: "#5c4a1e", spine: "#3d3014" },
  { cover: "#3d2b1f", spine: "#2a1d14" },
  { cover: "#1c3a2e", spine: "#122719" },
  { cover: "#4a2040", spine: "#321529" },
  { cover: "#1e3a5f", spine: "#132540" },
  { cover: "#4a3c1a", spine: "#342a10" },
  { cover: "#2d3a1e", spine: "#1e2812" },
];

export default function AddPostModal({ onClose, onAdd }: AddPostModalProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [colorIdx, setColorIdx] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Title is required";
    if (!author.trim()) e.author = "Author is required";
    if (rating === 0) e.rating = "Please select a rating";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    const newBook: Book = {
      id: Date.now(),
      title: title.trim(),
      author: author.trim(),
      description: description.trim() || "No description provided.",
      rating,
      owner: "me",
      cover: COVER_COLORS[colorIdx].cover,
      spine: COVER_COLORS[colorIdx].spine,
    };
    onAdd(newBook);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal add-modal" onClick={e => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose}>✕</button>
        <h3 className="modal__title" style={{ textAlign: "left", marginBottom: 24 }}>Post a book</h3>

        <div className="add-modal__field">
          <label className="add-modal__label">Title</label>
          <input
            className={`add-modal__input${errors.title ? " add-modal__input--error" : ""}`}
            placeholder="e.g. Clean Code"
            value={title}
            onChange={e => { setTitle(e.target.value); setErrors(p => ({ ...p, title: "" })); }}
          />
          {errors.title && <span className="add-modal__error">{errors.title}</span>}
        </div>

        <div className="add-modal__field">
          <label className="add-modal__label">Author</label>
          <input
            className={`add-modal__input${errors.author ? " add-modal__input--error" : ""}`}
            placeholder="e.g. Robert C. Martin"
            value={author}
            onChange={e => { setAuthor(e.target.value); setErrors(p => ({ ...p, author: "" })); }}
          />
          {errors.author && <span className="add-modal__error">{errors.author}</span>}
        </div>

        <div className="add-modal__field">
          <label className="add-modal__label">Description</label>
          <textarea
            className="add-modal__textarea"
            placeholder="What's this book about?"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="add-modal__field">
          <label className="add-modal__label">Rating</label>
          <div className="add-modal__stars">
            {[1, 2, 3, 4, 5].map(s => (
              <button
                key={s}
                className={`add-modal__star${rating >= s ? " add-modal__star--active" : ""}`}
                onClick={() => { setRating(s); setErrors(p => ({ ...p, rating: "" })); }}
              >●</button>
            ))}
          </div>
          {errors.rating && <span className="add-modal__error">{errors.rating}</span>}
        </div>

        <div className="add-modal__field">
          <label className="add-modal__label">Cover colour</label>
          <div className="add-modal__colors">
            {COVER_COLORS.map((c, i) => (
              <button
                key={i}
                className={`add-modal__color${colorIdx === i ? " add-modal__color--active" : ""}`}
                style={{ background: c.cover }}
                onClick={() => setColorIdx(i)}
              />
            ))}
          </div>
        </div>

        <div className="add-modal__actions">
          <button className="btn btn--primary" onClick={handleSubmit}>Post book</button>
          <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}