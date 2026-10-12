import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    const value = searchTerm.trim();

    if (value && onSearch) {
      onSearch(value);
    }
  };

  return (
    <form className="searchbar" onSubmit={handleSearch}>
      <div>
        <input
          type="text"
          placeholder="Search for city, restaurant or cuisine..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button type="submit" aria-label="Search">
          <FaSearch />
        </button>
      </div>
    </form>
  );
}

export default SearchBar;