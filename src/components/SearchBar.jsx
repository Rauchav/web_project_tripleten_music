import { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { IoChevronBackCircle } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";

const SearchBar = ({ onSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isPlayerPage = location.pathname === "/player";
  const [searchQuery, setSearchQuery] = useState("");
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!onSearch) return;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        onSearch(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div className="searchbar">
      <div className="searchbar__back-icon-container">
        {isPlayerPage && (
          <IoChevronBackCircle
            className="searchbar__back-icon"
            onClick={handleBackClick}
            style={{ cursor: "pointer" }}
          />
        )}
      </div>
      {!isPlayerPage && (
        <form className="searchbar__form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="searchbar__input"
            placeholder="Buscar canciones, artistas o álbumes"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="searchbar__search-button">
            <FaSearch className="searchbar__search-icon" />
          </button>
        </form>
      )}
    </div>
  );
};

export default SearchBar;
