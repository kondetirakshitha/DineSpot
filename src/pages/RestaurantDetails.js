
import Navbar from "../components/Navbar";
import {
  FaArrowLeft,
  FaStar,
  FaLocationDot,
  FaHeart,
  FaGlobe,
  FaPhone,
} from "react-icons/fa6";
import "./RestaurantDetails.css";

function RestaurantDetails({ setPage }) {
  const savedRestaurant = localStorage.getItem(
    "dinespot_selected_restaurant"
  );

  const restaurant = savedRestaurant
    ? JSON.parse(savedRestaurant)
    : null;

  if (!restaurant) {
    return (
      <div className="restaurant-details">
        <Navbar setPage={setPage} activePage="explore" />
        <main className="details-content">
          <h2>No restaurant selected</h2>
          <button onClick={() => setPage("explore")}>
            Explore Restaurants
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="restaurant-details">
      <Navbar setPage={setPage} activePage="explore" />

      <main className="details-content">
        <button
          className="back-button"
          onClick={() => setPage("explore")}
        >
          <FaArrowLeft /> Back to Explore
        </button>

        <div className="details-hero">
          <img
            src={restaurant.image}
            alt={restaurant.name}
          />

          <div className="details-overlay">
            <h1>{restaurant.name}</h1>

            <div className="details-meta">
              <span>
                <FaStar /> {restaurant.rating || "Rating unavailable"}
              </span>

              <span>{restaurant.price || "Price unavailable"}</span>

              <span>
                <FaLocationDot /> {restaurant.distance || "Distance unavailable"}
              </span>
            </div>
          </div>
        </div>

        <section className="details-info">
          <h2>About this restaurant</h2>

          <p>
            Explore this restaurant and check its available information
            before planning your visit.
          </p>

          <div className="details-actions">
            {restaurant.website && (
              <a
                href={restaurant.website}
                target="_blank"
                rel="noreferrer"
              >
                <FaGlobe /> Visit Website
              </a>
            )}

            {restaurant.tel && (
              <a href={`tel:${restaurant.tel}`}>
                <FaPhone /> Call Restaurant
              </a>
            )}

            <button onClick={() => setPage("explore")}>
              <FaArrowLeft /> More Restaurants
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default RestaurantDetails;
console.log("RestaurantDetails file loaded");