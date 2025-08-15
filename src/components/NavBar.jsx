import { useState } from "react";
import spotifyIcon from "../assets/images/spotify-icon.png";
import SearchBar from "./SearchBar";
import { FiMenu } from "react-icons/fi";
import LoginModal from "./LoginModal";

const NavBar = ({ onSearch }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  return (
    <div className="topbar">
      <div className="navbar">
        <div className="navbar__logo">
          <img
            className="navbar__logo-icon"
            src={spotifyIcon}
            alt="logo de spotify"
          />
          <h3 className="navbar__logo-text">Tripleten Music</h3>
        </div>

        <div className="navbar__loggedout">
          <button
            className="navbar__loggedout-button"
            onClick={handleLoginClick}
          >
            INICIAR SESIÓN
          </button>
        </div>

        <div className="navbar__burger" onClick={() => setMenuOpen(!menuOpen)}>
          <FiMenu />
        </div>
      </div>

      {menuOpen && (
        <div className="navbar__loggedin--mobile">
          <p className="navbar__loggedin-hello-user">Hola Usuario</p>
          <div className="navbar__loggedin-signout">
            <p className="navbar__loggedin-signout-text">Cerrar sesión</p>
          </div>
        </div>
      )}
      <SearchBar onSearch={onSearch} />
      {showLoginModal && (
        <LoginModal
          onClose={handleCloseLoginModal}
          message="Para que puedas disfrutar de cualquier canción en Tripleten Music, debes iniciar sesión con tu cuenta de Spotify"
        />
      )}
    </div>
  );
};

export default NavBar;
