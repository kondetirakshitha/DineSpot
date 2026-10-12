
import { useState } from "react";
import Navbar from "../components/Navbar";
import { FaCodeCompare, FaArrowLeft } from "react-icons/fa6";
import "./Compare.css";

function Compare({ setPage }) {
  const [restaurants, setRestaurants] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("dinespot_compare_list")
      );
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const [selectedIds, setSelectedIds] = useState([]);

  function toggleRestaurant(restaurant) {
    setSelectedIds((current) =>
      current.includes(restaurant.id)
        ? current.filter((id) => id !== restaurant.id)
        : current.length < 3
          ? [...current, restaurant.id]
          : current
    );
  }

  function removeRestaurant(id) {
    const updated = restaurants.filter((item) => item.id !== id);
    setRestaurants(updated);
    localStorage.setItem(
      "dinespot_compare_list",
      JSON.stringify(updated)
    );
    setSelectedIds((current) => current.filter((item) => item !== id));
  }

  const selected = restaurants.filter((restaurant) =>
    selectedIds.includes(restaurant.id)
  );

  return (
    <div className="compare-page">
      <Navbar setPage={setPage} activePage="explore" />

      <main className="compare-content">
        <button className="compare-back" onClick={() => setPage("explore")}>
          <FaArrowLeft /> Back to Explore
        </button>

        <h1><FaCodeCompare /> Compare Restaurants</h1>
        <p>Select up to three restaurants to compare their available details.</p>

        {restaurants.length === 0 ? (
          <div className="compare-empty">
            <h2>No restaurants added yet</h2>
            <p>Visit Explore and click “Add to Compare” on a restaurant card.</p>
            <button onClick={() => setPage("explore")}>
              Explore Restaurants
            </button>
          </div>
        ) : (
          <>
            <div className="compare-choices">
              {restaurants.map((restaurant) => (
                <div className="compare-choice" key={restaurant.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(restaurant.id)}
                      onChange={() => toggleRestaurant(restaurant)}
                      disabled={
                        selectedIds.length >= 3 &&
                        !selectedIds.includes(restaurant.id)
                      }
                    />
                    {restaurant.name}
                  </label>
                  <button onClick={() => removeRestaurant(restaurant.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {selected.length > 0 && (
              <div className="comparison-table-wrap">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Details</th>
                      {selected.map((restaurant) => (
                        <th key={restaurant.id}>{restaurant.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {
[
  ["Rating", (r) => r.rating ?? "Unavailable"],
  ["Price", (r) => r.price || "Unavailable"],
  ["Distance", (r) => r.distance || "Unavailable"],
  ["Match score", (r) =>
    r.match != null ? `${r.match}%` : "Unavailable"],
  ["Address", (r) => r.address || "Unavailable"],
  [
  "Website",
  (r) =>
    r.website ? (
      <a
        href={r.website.startsWith("http") ? r.website : `https://${r.website}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Visit website ↗
      </a>
    ) : (
      "Unavailable"
    ),
],
]
.map(([label, getValue]) => (
                      <tr key={label}>
                        <th>{label}</th>
                        {selected.map((restaurant) => (
                          <td key={restaurant.id}>
                            {getValue(restaurant)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Compare;
