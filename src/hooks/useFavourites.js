
import { useEffect, useState } from "react";

const STORAGE_KEY = "dinespot_favorites";

function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export default function useFavorites() {
  const [favorites, setFavorites] = useState(readFavorites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  function toggleFavorite(restaurant) {
    setFavorites((current) => {
      const exists = current.some(
        (item) => item.id === restaurant.id
      );

      return exists
        ? current.filter((item) => item.id !== restaurant.id)
        : [...current, restaurant];
    });
  }

  function isFavorite(restaurant) {
    return favorites.some((item) => item.id === restaurant.id);
  }

  return { favorites, toggleFavorite, isFavorite };
}
