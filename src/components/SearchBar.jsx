import { FaSearch } from "react-icons/fa";
import { IoChevronBackCircle } from "react-icons/io5";

const SearchBar = () => {
  return (
    <div className="searchbar">
      <IoChevronBackCircle className="searchbar__back-icon" />
      <form className="searchbar__form">
        <input
          type="text"
          className="searchbar__input"
          placeholder="Busca nombres de canciones o artistas"
        />
        <button className="searchbar__search-button">
          <FaSearch className="searchbar__search-icon" />
        </button>
      </form>
      <div className="searchbar__space"></div>
    </div>
  );
};

export default SearchBar;
