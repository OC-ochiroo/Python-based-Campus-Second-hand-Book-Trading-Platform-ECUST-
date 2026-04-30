import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout({ loggedIn }: { loggedIn: boolean }) {
  return (
    <div className="app">
      <Navbar loggedIn={loggedIn} />
      <Outlet />
    </div>
  );
}