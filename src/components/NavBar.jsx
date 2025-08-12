import { useState } from "react";
import spotifyIcon from "../assets/images/spotify-icon.png";
import SearchBar from "./SearchBar";
import { FiLogOut } from "react-icons/fi";
import { FiMenu } from "react-icons/fi";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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
        {/*
        <div className="navbar__loggedout">
          <button className="navbar__loggedout-button">SIGN IN</button>
        </div>
        */}

        <div className="navbar__loggedin navbar__loggedin--desktop">
          <p className="navbar__loggedin-hello-user">Hello Raul</p>
          <FiLogOut className="navbar__loggedin-signout-icon" />
        </div>

        <div className="navbar__burger" onClick={() => setMenuOpen(!menuOpen)}>
          <FiMenu />
        </div>
      </div>

      {menuOpen && (
        <div className="navbar__loggedin--mobile">
          <p className="navbar__loggedin-hello-user">Hello Raul</p>
          <div className="navbar__loggedin-signout">
            <FiLogOut className="navbar__loggedin-signout-icon" />
            <p className="navbar__loggedin-signout-text">Sign out</p>
          </div>
        </div>
      )}
      <SearchBar />
    </div>
  );
};

export default NavBar;
