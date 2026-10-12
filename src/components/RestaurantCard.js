
import { useEffect, useState } from "react";
import {
  FaHeart,
  FaStar,
  FaLocationDot,
  FaCodeCompare
} from "react-icons/fa6";
import "./RestaurantCard.css";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1515003197210-e0cd7184f8b5?auto=format&fit=crop&w=800&q=80"
];

function RestaurantCard({
  restaurant,
  onSelect,
  onFavorite,
  isFavorite = false,
  onCompare,
  isCompared = false
}) {
  const [imageIndex, setImageIndex] = useState(0);

  const imageSources = [
    ...(restaurant.image ? [restaurant.image] : []),
    ...FALLBACK_IMAGES
  ].filter((src, index, list) => list.indexOf(src) === index);

  useEffect(() => {
    setImageIndex(0);
  }, [restaurant.id, restaurant.image]);

  return (
    <div
      className="restaurant-card"
      onClick={() => onSelect?.(restaurant)}
    >
      <div className="restaurant-image">
        {imageIndex < imageSources.length ? (
          <img
            key={imageSources[imageIndex]}
            src={imageSources[imageIndex]}
            alt={restaurant.name || "Restaurant"}
            onError={() => setImageIndex((current) => current + 1)}
          />
        ) : (
          <div className="restaurant-image-placeholder">
            {restaurant.name}
          </div>
        )}

        <button
          className={`favorite-button ${isFavorite ? "favorite-active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onFavorite?.(restaurant);
          }}
          aria-label="Toggle favorite"
        >
          <FaHeart />
        </button>
      </div>

      <div className="restaurant-info">
        <h3>{restaurant.name}</h3>

        <div className="restaurant-meta">
          <span><FaStar /> {restaurant.rating ?? "N/A"}</span>
          <span>{restaurant.price || "Price unknown"}</span>
          <span>
            <FaLocationDot /> {restaurant.distance || "Nearby"}
          </span>
        </div>

        {restaurant.match != null && (
          <span className="match-badge">
            {restaurant.match}% Match
          </span>
        )}

        <button
          className={`compare-card-button ${isCompared ? "compared" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onCompare?.(restaurant);
          }}
        >
          <FaCodeCompare />
          {isCompared ? "Added to Compare" : "Add to Compare"}
        </button>
      </div>
    </div>
  );
}

export default RestaurantCard;
