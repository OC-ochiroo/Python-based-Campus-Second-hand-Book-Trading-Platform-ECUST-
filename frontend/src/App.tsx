import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";
import MyPostsPage from "./pages/MyPostsPage";
import "./App.css";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout loggedIn={loggedIn} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage setLoggedIn={setLoggedIn} />} />
          <Route path="/feed" element={loggedIn ? <FeedPage /> : <Navigate to="/auth" />} />
          <Route path="/profile" element={loggedIn ? <ProfilePage /> : <Navigate to="/auth" />} />
          <Route path="/my-posts" element={loggedIn ? <MyPostsPage /> : <Navigate to="/auth" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}