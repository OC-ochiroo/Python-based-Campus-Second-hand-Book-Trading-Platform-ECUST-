import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
import type { Page } from "./Types";

// ── Stars component ────────────────────────────────────────────────────────
import Stars from "./components/Stars";

// ── Book Card ──────────────────────────────────────────────────────────────
import BookCard from "./components/BookCard";

// ── Button helper ──────────────────────────────────────────────────────────
import Btn from "./components/Btn";

// ── Navbar ─────────────────────────────────────────────────────────────────
import Navbar from "./components/Navbar";

// ── HOME PAGE ──────────────────────────────────────────────────────────────
import HomePage from "./pages/HomePage";

// ── AUTH PAGE ──────────────────────────────────────────────────────────────
import AuthPage from "./pages/AuthPage";

// ── FEED PAGE ──────────────────────────────────────────────────────────────
import FeedPage from "./pages/FeedPage";

// ── PROFILE PAGE ───────────────────────────────────────────────────────────
import ProfilePage from "./pages/ProfilePage";

// ── MY POSTS PAGE ──────────────────────────────────────────────────────────
import MyPostsPage from "./pages/MyPostsPage";

// ── ROOT APP ───────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [loggedIn, setLoggedIn] = useState(false);

  const navigate = (p: Page) => {
    if ((p === "feed" || p === "profile" || p === "my-posts") && !loggedIn) {
      setPage("auth");
    } else {
      setPage(p);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Space Mono', monospace" }}>
      {/* Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,600&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fff; }
        ::placeholder { color: #ccc; }
        input { -webkit-appearance: none; }
      `}</style>

      <Navbar page={page} setPage={navigate} loggedIn={loggedIn} />

      {page === "home" && <HomePage setPage={navigate} />}
      {page === "auth" && <AuthPage setPage={navigate} setLoggedIn={setLoggedIn} />}
      {page === "feed" && <FeedPage />}
      {page === "profile" && <ProfilePage setPage={navigate} />}
      {page === "my-posts" && <MyPostsPage />}
    </div>
  );
}
