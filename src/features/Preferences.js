
import { useState } from "react";
import Navbar from "../components/Navbar";
import "./Preferences.css";

const cuisineOptions = [
  "Indian",
  "Italian",
  "Chinese",
  "Mexican",
  "Japanese",
  "Thai",
  "Fast Food",
  "Mediterranean",
];

const defaultPreferences = {
  cuisines: [],
  budget: "moderate",
  diet: "any",
  restaurantStyle: [],
};

function getPreferences() {
  try {
    const saved = localStorage.getItem("dinespot_preferences");
    return saved ? { ...defaultPreferences, ...JSON.parse(saved) } : defaultPreferences;
  } catch {
    return defaultPreferences;
  }
}

function Preferences({ setPage }) {
  const [preferences, setPreferences] = useState(getPreferences);
  const [savedMessage, setSavedMessage] = useState("");

  function toggleOption(field, value) {
    setPreferences((current) => {
      const selected = current[field].includes(value);

      return {
        ...current,
        [field]: selected
          ? current[field].filter((item) => item !== value)
          : [...current[field], value],
      };
    });

    setSavedMessage("");
  }

  function savePreferences(event) {
    event.preventDefault();
    localStorage.setItem(
      "dinespot_preferences",
      JSON.stringify(preferences)
    );
    setSavedMessage("Preferences saved successfully!");
  }

  return (
    <div className="preferences-page">
      <Navbar setPage={setPage} activePage="preferences" />

      <main className="preferences-content">
        <header className="preferences-header">
          <p className="preferences-eyebrow">YOUR TASTE, YOUR RULES</p>
          <h1>Food preferences</h1>
          <p>Tell us what you enjoy so you can discover places that suit you.</p>
        </header>

        <form className="preferences-form" onSubmit={savePreferences}>
          <section className="preference-section">
            <h2>Favorite cuisines</h2>
            <p>Select all the cuisines you enjoy.</p>

            <div className="preference-chips">
              {cuisineOptions.map((cuisine) => (
                <button
                  type="button"
                  key={cuisine}
                  className={`preference-chip ${
                    preferences.cuisines.includes(cuisine) ? "selected" : ""
                  }`}
                  onClick={() => toggleOption("cuisines", cuisine)}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </section>

          <section className="preference-section">
            <h2>Budget per person</h2>
            <div className="preference-options">
              {[
                ["budget", "budget", "Budget friendly", "₹ Under 300"],
                ["moderate", "moderate", "Moderate", "₹₹ 300–800"],
                ["premium", "premium", "Premium", "₹₹₹ 800+"],
              ].map(([value, id, title, subtitle]) => (
                <label
                  key={id}
                  className={`budget-option ${
                    preferences.budget === value ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="budget"
                    value={value}
                    checked={preferences.budget === value}
                    onChange={() => {
                      setPreferences((current) => ({
                        ...current,
                        budget: value,
                      }));
                      setSavedMessage("");
                    }}
                  />
                  <strong>{title}</strong>
                  <span>{subtitle}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="preference-section">
            <h2>Food choices</h2>
            <div className="preference-chips">
              {["Any", "Vegetarian", "Vegan", "Jain", "Halal"].map((diet) => (
                <button
                  type="button"
                  key={diet}
                  className={`preference-chip ${
                    preferences.diet === diet.toLowerCase() ? "selected" : ""
                  }`}
                  onClick={() => {
                    setPreferences((current) => ({
                      ...current,
                      diet: diet.toLowerCase(),
                    }));
                    setSavedMessage("");
                  }}
                >
                  {diet}
                </button>
              ))}
            </div>
          </section>

          <section className="preference-section">
            <h2>Restaurant atmosphere</h2>
            <p>Choose the settings you prefer.</p>

            <div className="preference-chips">
              {["Outdoor seating", "Quiet", "Family friendly", "Casual", "Date night"].map(
                (style) => (
                  <button
                    type="button"
                    key={style}
                    className={`preference-chip ${
                      preferences.restaurantStyle.includes(style) ? "selected" : ""
                    }`}
                    onClick={() => toggleOption("restaurantStyle", style)}
                  >
                    {style}
                  </button>
                )
              )}
            </div>
          </section>

          <div className="preferences-footer">
            <button className="save-preferences" type="submit">
              Save Preferences
            </button>

            {savedMessage && (
              <p className="preferences-success" role="status">
                {savedMessage}
              </p>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}

export default Preferences;
