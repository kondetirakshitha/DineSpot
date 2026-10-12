import { useState } from "react";
import './Navbar.css'; 
import { MdRestaurantMenu, MdHome, MdExplore, MdFavorite } from "react-icons/md";
function Navbar({ setPage, activePage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = (page) => {
    setPage(page);
    setMenuOpen(false);
  };
  return (
    <div className="navbar">
      <div className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="logo-section">
          <span className="spot">
            < MdRestaurantMenu />
            </span>
            <span className="dine">
             Dine
             </span>
             <span className="spot">
             Spot
          </span>
        </div>
        <nav className="nav-menu">
          <button
            className={`nav-item ${activePage === "home" ? "active" : ""}`}
            onClick={() => navigate("home")}
          >
            <MdHome className="nav-icon" />
            <span> Home</span>
          </button>
          <button
            className={`nav-item ${activePage === "explore" ? "active" : ""}`}
            onClick={() => navigate("explore")}
          >
            <MdExplore className="nav-icon" />
            <span> Explore</span>
          </button>
          <button
            className={`nav-item ${activePage === "preferences" ? "active" : ""}`}
            onClick={() => navigate("preferences")}
          >
            <MdFavorite className="nav-icon" />
            <span> Preferences</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
export default Navbar;