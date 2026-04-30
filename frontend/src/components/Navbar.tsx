import { useNavigate, useLocation } from "react-router-dom";
import Btn from "./Btn";
import "./Navbar.css";

export default function Navbar({ loggedIn }: { loggedIn: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();

  const link = (label: string, path: string) => (
    <button
      onClick={() => navigate(path)}
      className={`navbar__link ${location.pathname === path ? "navbar__link--active" : "navbar__link--inactive"}`}
    >
      {label}
    </button>
  );

  return (
    <nav className="navbar">
      <button className="navbar__logo" onClick={() => navigate("/")}>
        Book2Go
      </button>

      <div className="navbar__links">
        {loggedIn && link("Feed", "/feed")}
        {loggedIn && link("My posts", "/my-posts")}
        {loggedIn && link("Profile", "/profile")}
      </div>

      <div>
        {loggedIn
          ? <Btn label="Log out" secondary onClick={() => navigate("/")} />
          : <Btn label="Log in" onClick={() => navigate("/auth")} />}
      </div>
    </nav>
  );
}