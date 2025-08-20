import { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { IoChevronBackCircle } from "react-icons/io5";

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const isInitialMount = useRef(true);

  // Efecto de búsqueda con debounce - solo ejecutar si onSearch está proporcionado
  useEffect(() => {
    if (!onSearch) return;

    // Saltar el primer render para evitar activar búsqueda al montar
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
      // Solo activar búsqueda si hay una consulta real
      if (searchQuery.trim()) {
        onSearch(searchQuery);
      }
      // No activar búsqueda cuando la consulta está vacía
    }, 500); // 500ms de retraso

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

  return (
    <div className="searchbar">
      <IoChevronBackCircle className="searchbar__back-icon" />
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
      <div className="searchbar__space"></div>
    </div>
  );
};

export default SearchBar;
