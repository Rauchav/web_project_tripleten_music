import spotifyIcon from "../assets/images/spotify-icon.png";
import { IoClose } from "react-icons/io5";

const LoginModal = ({ onClose, message }) => {
  const defaultMessage =
    "Para disfrutar de esta canción, necesitas iniciar sesión con tu cuenta de Spotify. Los usuarios Premium pueden escuchar canciones completas, mientras que los usuarios gratuitos pueden disfrutar de vistas previas y leer letras.";

  const displayMessage = message || defaultMessage;

  const handleLogin = () => {
    // Este código viene en la siguiente etapa
    console.log("Este código viene en la siguiente etapa");
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
        <button className="login__modal-button" onClick={handleLogin}>
          Iniciar sesión con Spotify
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
