import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import RestaurantCard from "../components/RestaurantCard";
import { searchRestaurants } from "../services/restaurantApi";
import useFavorites from "../hooks/useFavourites.js";
import "./home.css";
import getRestaurantImage from "../services/restaurantImages";

import {
  FaPizzaSlice,
  FaBowlFood,
  FaBurger,
  FaArrowRight,
} from "react-icons/fa6";

const cuisines = [
  { name: "Italian", icon: <FaPizzaSlice /> },
  { name: "Indian", icon: <FaBowlFood /> },
  { name: "Chinese", icon: <FaBowlFood /> },
  { name: "Mexican", icon: "🌮" },
  { name: "Fast Food", icon: <FaBurger /> },
];

function Home({ setPage }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    let cancelled = false;

    async function loadRestaurants() {
      try {
        setLoading(true);
        setError("");

        const data = await searchRestaurants({
          location: "Hyderabad, Telangana, India",
          query: "restaurant",
          limit: 4,
          sort: "RATING",
        });

        const formatted = data.map((restaurant) => ({
          id: restaurant.fsq_place_id,
          name: restaurant.name,
          rating: restaurant.rating || "N/A",
          price: restaurant.price
            ? "₹".repeat(restaurant.price)
            : "Price unavailable",
          distance:
            restaurant.distance != null
              ? `${(restaurant.distance / 1000).toFixed(1)} km`
              : "Distance unavailable",
          match: null,
          image: getRestaurantImage(restaurant),
          website: restaurant.website,
          tel: restaurant.tel,
        }));

        if (!cancelled) setRestaurants(formatted);
      } catch (err) {
        if (!cancelled) {
          setError(
            "Restaurant listings are temporarily unavailable. You can still explore cuisines and set your preferences."
          );
        }
        console.error("Home restaurant search failed:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadRestaurants();

    return () => {
      cancelled = true;
    };
  }, []);

  
function explore(query = "") {
  localStorage.setItem("dinespot_search_query", query.trim());
  setPage("explore");
}


  function openRestaurant(restaurant) {
    localStorage.setItem(
      "dinespot_selected_restaurant",
      JSON.stringify(restaurant)
    );
    setPage("details");
  }

  return (
    <div className="home">
      <Navbar setPage={setPage} activePage="home" />

      <main className="home-content">
        <section className="hero-section">
          <div className="hero-text">
            <span className="hero-eyebrow">
              YOUR NEXT FAVOURITE PLACE
            </span>

            <h1>
              Find the right place,
              <br />
              <span>not just a place.</span>
            </h1>

            <p>
              Discover restaurants that match your taste,
              <br className="desktop-break" />
              budget and mood.
            </p>

            <div className="hero-search">
              <SearchBar onSearch={(query) => explore(query)} />
            </div>
          </div>

          <div className="hero-image" role="img" aria-label="Delicious food" />
        </section>

        <section className="popular-section">
          <div className="section-heading">
            <h2>Popular Cuisines</h2>
          </div>

          <div className="cuisine-list">
            {cuisines.map((cuisine) => (
              <button
                className="cuisine-card"
                key={cuisine.name}
                onClick={() => explore(cuisine.name)}
              >
                <span className="cuisine-icon">{cuisine.icon}</span>
                <span>{cuisine.name}</span>
                <FaArrowRight className="cuisine-arrow" />
              </button>
            ))}
          </div>
        </section>

        <section className="trending-section">
          <div className="trending-heading">
            <div>
              <h2>Trending Near You</h2>
              <p>Explore places to eat and enjoy.</p>
            </div>

            <button
              className="view-all"
              onClick={() => explore("")}
            >
              View All <FaArrowRight />
            </button>
          </div>

          {loading && (
            <p className="restaurant-status">
              Finding restaurants near you...
            </p>
          )}

          {!loading && error && (
            <div className="home-empty-state">
              <div className="empty-state-icon">
                <FaBowlFood />
              </div>
              <h3>Good food is still out there.</h3>
              <p>{error}</p>
              <button onClick={() => explore("")}>
                Explore Restaurants <FaArrowRight />
              </button>
            </div>
          )}

          {!loading && !error && restaurants.length === 0 && (
            <div className="home-empty-state">
              <h3>No restaurants found yet.</h3>
              <p>Try exploring a cuisine or searching for a location.</p>
              <button onClick={() => explore("")}>
                Explore Restaurants <FaArrowRight />
              </button>
            </div>
          )}

          {!loading && !error && restaurants.length > 0 && (
            <div className="restaurant-grid">
              {restaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onSelect={() => openRestaurant(restaurant)}
                  onFavorite={toggleFavorite}
                  isFavorite={isFavorite(restaurant)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Home;
