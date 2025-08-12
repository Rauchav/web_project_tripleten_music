import spotifyIcon from "../assets/images/spotify-icon.png";
import SearchBar from "./SearchBar";

const NavBar = () => {
  return (
    <div className="topbar">
      <div className="navbar">
        <div className="navbar__logo">
          <img
            className="navbar__logo-icon"
            src={spotifyIcon}
            alt="spotify logo"
          />
          <h3 className="navbar__logo-text">Tripleten Music</h3>
        </div>
        <div className="navbar__logged-out">
          <button className="navbar__logged-out-button">SIGN IN</button>
        </div>
      </div>
      <SearchBar />
    </div>
  );
};

export default NavBar;
