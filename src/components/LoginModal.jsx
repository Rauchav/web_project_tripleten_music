import spotifyIcon from "../assets/images/spotify-icon.png";
import { IoClose } from "react-icons/io5";
import {
  initiateSpotifyLogin,
  forceCompleteLogout,
} from "../services/authService";

const LoginModal = ({ onClose, message }) => {
  const defaultMessage =
    "Para disfrutar de esta canción, necesitas iniciar sesión con tu cuenta de Spotify. Los usuarios Premium pueden escuchar canciones completas, mientras que los usuarios gratuitos pueden disfrutar de vistas previas y leer letras.";

  const displayMessage = message || defaultMessage;

  const handleLogin = () => {
    try {
      console.log("=== LOGIN BUTTON CLICKED ===");
      console.log("Current URL:", window.location.href);
      console.log("Environment variables check:");
      console.log(
        "CLIENT_ID exists:",
        !!import.meta.env.VITE_SPOTIFY_CLIENT_ID
      );
      console.log(
        "REDIRECT_URI exists:",
        !!import.meta.env.VITE_SPOTIFY_REDIRECT_URI
      );
      console.log(
        "REDIRECT_URI value:",
        import.meta.env.VITE_SPOTIFY_REDIRECT_URI
      );

      // Clear any invalid auth state first
      localStorage.removeItem("spotify_access_token");
      localStorage.removeItem("spotify_user_info");
      // DON'T clear spotify_auth_state - it's needed for the callback

      // Set flag to indicate login is in progress
      localStorage.setItem(
        "spotify_login_attempt",
        JSON.stringify({
          timestamp: new Date().toISOString(),
          step: "login_initiated",
        })
      );

      // Simple direct redirect to Spotify
      const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
      const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
      const SCOPES = [
        "user-read-private",
        "user-read-email",
        "user-read-playback-state",
        "user-modify-playback-state",
        "user-read-currently-playing",
        "streaming",
        "playlist-read-private",
        "playlist-read-collaborative",
        "user-library-read",
        "user-top-read",
        "user-read-recently-played",
      ].join(" ");

      const state = Math.random().toString(36).substring(7);
      localStorage.setItem("spotify_auth_state", state);

      const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}&scope=${encodeURIComponent(SCOPES)}`;

      console.log("=== REDIRECTING TO SPOTIFY ===");
      console.log("Auth URL:", authUrl);
      console.log("State:", state);
      console.log("Redirect URI:", REDIRECT_URI);

      window.location.href = authUrl;
    } catch (error) {
      console.error("Error in handleLogin:", error);
      alert(`Error al iniciar sesión: ${error.message}`);
    }
  };

  const handleDebugClear = () => {
    try {
      console.log("=== DEBUG CLEAR BUTTON CLICKED ===");
      console.log("Clearing all auth data...");

      // Call the force complete logout function
      forceCompleteLogout();

      console.log("All auth data cleared successfully");
      alert(
        "All authentication data has been cleared. You can now try logging in again."
      );
    } catch (error) {
      console.error("Error in handleDebugClear:", error);
      alert(`Error clearing data: ${error.message}`);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className="login__modal"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="login__modal-close-container" onClick={handleClose}>
        <IoClose className="login__modal-close-icon" />
      </div>
      <div
        className="login__modal-container"
        style={{
          backgroundColor: "black",
          border: "1px solid white",
          borderRadius: "10px",
          color: "white",
          padding: "50px 20px",
          maxWidth: "250px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="login__modal-logo">
          <img
            className="login__modal-logo-icon"
            src={spotifyIcon}
            alt="logo de spotify"
          />
          <h3 className="login__modal-logo-text">Tripleten Music</h3>
        </div>
        <p className="login__modal-message">{displayMessage}</p>

        <button
          className="login__modal-button"
          onClick={handleLogin}
          style={{ cursor: "pointer", marginBottom: "10px" }}
        >
          Iniciar sesión con Spotify
        </button>

        {/* Debug button - temporary */}
        <button
          onClick={handleDebugClear}
          style={{
            cursor: "pointer",
            backgroundColor: "#ff4444",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "5px",
            fontSize: "12px",
            marginTop: "10px",
          }}
        >
          🧹 Clear All Auth Data (Debug)
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
