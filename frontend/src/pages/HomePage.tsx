import { useNavigate } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="home__hero">
        <div className="home__grid" />
        <div className="home__eyebrow">Community Book Exchange</div>
        <h1 className="home__title">
          Exchange your<br />
          <em>knowledge</em>
        </h1>
        <p className="home__subtitle">
          Trade, buy, and share books with students and readers across your city and university.
        </p>
        <button className="home__cta" onClick={() => navigate("/feed")}>
          Search for books →
        </button>
      </div>
    </div>
  );
}