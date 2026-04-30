import type { Book } from "../Types";
import Btn from "./Btn";
import Stars from "./Stars";
import "./BookCard.css";

export default function BookCard({ book, myPost = false }: { book: Book; myPost?: boolean }) {
  return (
    <div className="book-card">
      <div className="book-card__cover" style={{ background: book.cover }} />

      <div>
        <div className="book-card__title">{book.title}</div>
        <div className="book-card__author">{book.author}</div>
        <Stars rating={book.rating} />
        <p className="book-card__description">{book.description}</p>
        <div className="book-card__owner">@{book.owner}</div>
      </div>

      <div className="book-card__actions">
        {myPost ? (
          <>
            <Btn label="Edit" secondary />
            <Btn label="Delete" danger />
          </>
        ) : (
          <>
            <Btn label="Trade" secondary />
            <Btn label="Buy" />
          </>
        )}
      </div>
    </div>
  );
}