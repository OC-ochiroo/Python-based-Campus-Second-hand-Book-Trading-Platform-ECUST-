import { useState } from "react";
import { MY_BOOKS } from "../data";
import BookCard from "../components/BookCard";
import Btn from "../components/Btn";
import "./MyPostsPage.css";

export default function MyPostsPage() {
  const [books] = useState(MY_BOOKS);

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">My Posts</h2>
        <Btn label="+ Add book" />
      </div>
      <div className="page__divider" />

      <div>
        {books.map(b => <BookCard key={b.id} book={b} myPost />)}
        {books.length === 0 && (
          <div className="my-posts__empty">
            You haven't posted any books yet.
          </div>
        )}
      </div>
    </div>
  );
}