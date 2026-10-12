import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import RestaurantCard from "../components/RestaurantCard";
import { searchRestaurants } from "../services/restaurantApi";
import useFavorites from "../hooks/useFavourites.js";
import { calculateMatch } from "../services/matchScore";
import "./Explore.css";
import getRestaurantImage from "../services/restaurantImages";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
  "https://images.unsplash.com/photo-1515003197210-e0cd7184f8b5?w=800",
];

function Explore({ setPage }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [minRating, setMinRating] = useState(0);

  const { toggleFavorite, isFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState(() => {
  return localStorage.getItem("dinespot_search_query") || "";
});
  const [compareList, setCompareList] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("dinespot_compare_list")
      );
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });
const [preferences, setPreferences] = useState(() => {
  try {
    return JSON.parse(
      localStorage.getItem("dinespot_preferences")
    );
  } catch {
    return null;
  }
});

useEffect(() => {
  function updatePreferences() {
    try {
      setPreferences(
        JSON.parse(localStorage.getItem("dinespot_preferences"))
      );
    } catch {
      setPreferences(null);
    }
  }

  window.addEventListener("focus", updatePreferences);
  window.addEventListener("pageshow", updatePreferences);

  return () => {
    window.removeEventListener("focus", updatePreferences);
    window.removeEventListener("pageshow", updatePreferences);
  };
}, []);


  function toggleCompare(restaurant) {
    setCompareList((current) => {
      const exists = current.some(
        (item) => item.id === restaurant.id
      );

      if (exists) {
        const updated = current.filter(
          (item) => item.id !== restaurant.id
        );
        localStorage.setItem(
          "dinespot_compare_list",
          JSON.stringify(updated)
        );
        return updated;
      }

      if (current.length >= 3) {
        alert("You can compare up to 3 restaurants at a time.");
        return current;
      }

      const updated = [...current, restaurant];
      localStorage.setItem(
        "dinespot_compare_list",
        JSON.stringify(updated)
      );
      return updated;
    });
  }

  useEffect(() => {
  const savedQuery = localStorage.getItem("dinespot_search_query") || "";

  if (savedQuery.trim()) {
    setSearchQuery(savedQuery);
    setActiveFilter("All");
    loadRestaurants(savedQuery.trim());
    localStorage.removeItem("dinespot_search_query");
  } else {
    loadRestaurants("restaurant");
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
  
useEffect(() => {
  setRestaurants((current) =>
    current.map((restaurant) => ({
      ...restaurant,
      match: calculateMatch(
        {
          categories: restaurant.categories || [],
          cuisines: (restaurant.categories || []).map((category) =>
            typeof category === "string"
              ? category
              : category.name || ""
          ),
          priceLevel: null,
          diet: [],
        },
        preferences
      ),
    }))
  );
}, [preferences]);

  async function loadRestaurants(query = "restaurant") {
    try {
      setLoading(true);
      setError("");

      const data = await searchRestaurants({
        location: "Hyderabad, Telangana, India",
        query,
        limit: 20,
      });

      const formattedRestaurants = data.map((restaurant, index) => {
        const categories = Array.isArray(restaurant.categories)
          ? restaurant.categories
          : [];
          const image = getRestaurantImage(restaurant);


        return {
          id: restaurant.fsq_place_id || restaurant.id,
          name: restaurant.name,
          rating: restaurant.rating ?? null,
          price: restaurant.price
            ? "₹".repeat(Number(restaurant.price))
            : null,
          distance:
            restaurant.distance != null
              ? `${(Number(restaurant.distance) / 1000).toFixed(1)} km`
              : "Nearby",
          match: calculateMatch(
  {
    categories,
    cuisines: categories.map((category) =>
      typeof category === "string"
        ? category
        : category.name || ""
    ),
    priceLevel: restaurant.price,
    diet: restaurant.attributes?.dietary_options || [],
  },
  preferences
),
          image,
          website: restaurant.website || null,
          tel: restaurant.tel || null,
          address:
            restaurant.location?.formatted ||
            restaurant.location?.address ||
            "",
          categories,
        };
      });

      setRestaurants(formattedRestaurants);
    } catch (err) {
      console.error("Restaurant search failed:", err);
      setError(err.message || "Unable to find restaurants.");
    } finally {
      setLoading(false);
    }
  }

  function resetFilters() {
    setActiveFilter("All");
    setSearchQuery("");
    setSelectedPrice("");
    setMinRating(0);
    loadRestaurants("restaurant");
  }

  return (
    <div className="explore">
      <Navbar setPage={setPage} activePage="explore" />

      <main className="explore-content">
        <section className="explore-header">
          <div>
            <h1>Explore Restaurants</h1>
            <p>Discover restaurants around you.</p>
          </div>

          <SearchBar
            onSearch={(query) => {
              setSearchQuery(query);
              setActiveFilter("All");
              loadRestaurants(query);
            }}
          />
        </section>

        <div className="explore-layout">
          <aside className="explore-filters">
            <div className="filter-title">
              <h3>Filters</h3>
              <button onClick={resetFilters}>Reset</button>
            </div>

            <label htmlFor="cuisine-filter">Cuisine</label>
            <select
              id="cuisine-filter"
              value={activeFilter}
              onChange={(event) => {
                const value = event.target.value;
                setActiveFilter(value);
                setSearchQuery(value === "All" ? "" : value);
                loadRestaurants(
                  value === "All" ? "restaurant" : value
                );
              }}
            >
              {[
                "All",
                "Italian",
                "Indian",
                "Chinese",
                "Mexican",
                "Fast Food",
                "Vegetarian",
              ].map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All Cuisines" : item}
                </option>
              ))}
            </select>

            <label>Price Range</label>
            <div className="price-options">
              {["₹", "₹₹", "₹₹₹"].map((price) => (
                <button
                  key={price}
                  className={selectedPrice === price ? "active" : ""}
                  onClick={() =>
                    setSelectedPrice(
                      selectedPrice === price ? "" : price
                    )
                  }
                >
                  {price}
                </button>
              ))}
            </div>

            <label htmlFor="rating-filter">Minimum Rating</label>
            <select
              id="rating-filter"
              value={minRating}
              onChange={(event) =>
                setMinRating(Number(event.target.value))
              }
            >
              <option value={0}>Any Rating</option>
              <option value={3}>3+ stars</option>
              <option value={4}>4+ stars</option>
              <option value={4.5}>4.5+ stars</option>
            </select>

            <button className="reset-filters" onClick={resetFilters}>
              Reset Filters
            </button>
          </aside>

          <section className="explore-results">
            <div className="results-heading">
              <div>
                <h2>
                  {searchQuery
                    ? `Results for "${searchQuery}"`
                    : "Restaurants Near You"}
                </h2>
                <p>
  {restaurants.filter((restaurant) => {
    const rating = Number(restaurant.rating);

    const priceMatch =
      !selectedPrice ||
      restaurant.price == null ||
      restaurant.price === selectedPrice;

    const ratingMatch =
      minRating === 0 ||
      (restaurant.rating != null &&
        !Number.isNaN(rating) &&
        rating >= minRating);

    return priceMatch && ratingMatch;
  }).length} places found
</p>
              </div>

              <button
                className="open-compare-button"
                onClick={() => setPage("compare")}
              >
                Compare ({compareList.length})
              </button>
            </div>

            {loading && (
              <p className="restaurant-status">
                Finding restaurants...
              </p>
            )}

            {error && (
              <p className="restaurant-status error">{error}</p>
            )}

            {!loading && !error && (
              <div className="restaurant-grid">
                {restaurants
                  .filter((restaurant) => {
                    const rating = Number(restaurant.rating);
                    const priceMatch =
  !selectedPrice ||
  restaurant.price == null ||
  restaurant.price === selectedPrice;

                    const ratingMatch =
                      minRating === 0 ||
                      (restaurant.rating != null &&
                        !Number.isNaN(rating) &&
                        rating >= minRating);

                    return priceMatch && ratingMatch;
                  })
                  .map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      onSelect={() => {
                        localStorage.setItem(
                          "dinespot_selected_restaurant",
                          JSON.stringify(restaurant)
                        );
                        setPage("details");
                      }}
                      onFavorite={toggleFavorite}
                      isFavorite={isFavorite(restaurant)}
                      onCompare={toggleCompare}
                      isCompared={compareList.some(
                        (item) => item.id === restaurant.id
                      )}
                    />
                  ))}
              </div>
            )}

            {!loading &&
  !error &&
  restaurants.filter((restaurant) => {
    const rating = Number(restaurant.rating);

    const priceMatch =
      !selectedPrice || restaurant.price === selectedPrice;

    const ratingMatch =
      minRating === 0 ||
      (restaurant.rating != null &&
        !Number.isNaN(rating) &&
        rating >= minRating);

    return priceMatch && ratingMatch;
  }).length === 0 && (
    <p className="restaurant-status">
      No restaurants match your search and filters. Try changing your filters or resetting them.
    </p>
)}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Explore;
