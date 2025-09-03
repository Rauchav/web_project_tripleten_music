import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import spotifyIcon from "../assets/images/spotify-icon.png";
import SearchBar from "./SearchBar";
import { FiMenu } from "react-icons/fi";
import LoginModal from "./LoginModal";
import {
  logout,
  isAuthenticated,
  initiateSpotifyLogin,
} from "../services/authService";

const NavBar = ({ onSearch, user }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Verificar si estamos en la página del reproductor
  const isPlayerPage = location.pathname === "/player";

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    logout();
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="topbar">
      <div className="navbar">
        <div
          className="navbar__logo"
          onClick={handleLogoClick}
          style={{ cursor: "pointer" }}
        >
          <img
            className="navbar__logo-icon"
            src={spotifyIcon}
            alt="logo de spotify"
          />
          <h3 className="navbar__logo-text">Tripleten Music</h3>
        </div>

        {user ? (
          <div className="navbar__loggedin--desktop">
            <p className="navbar__loggedin-hello-user">
              Hola {user.display_name}
            </p>
            <button className="navbar__loggedin-signout" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        ) : (
          <div className="navbar__loggedout">
            <button
              className="navbar__loggedout-button"
              onClick={handleLoginClick}
            >
              INICIAR SESIÓN
            </button>
          </div>
        )}

        <div className="navbar__burger" onClick={() => setMenuOpen(!menuOpen)}>
          <FiMenu />
        </div>
      </div>

      {menuOpen && user && (
        <div className="navbar__loggedin--mobile">
          <p className="navbar__loggedin-hello-user">
            Hola {user.display_name}
          </p>
          <div className="navbar__loggedin-signout" onClick={handleLogout}>
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
