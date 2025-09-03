import spotifyIcon from "../assets/images/spotify-icon.png";
import { IoClose } from "react-icons/io5";

const ErrorModal = ({ onClose, message }) => {
  const defaultMessage =
    "Lo sentimos, no pudimos iniciar sesión con tu cuenta de Spotify. Revisa si tus credenciales de acceso son correctas y vuelve a intentarlo.";

  const displayMessage = message || defaultMessage;

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
            alt="spotify logo"
          />
          <h3 className="login__modal-logo-text">Tripleten Music</h3>
        </div>
        <p className="login__modal-message">{displayMessage}</p>
        <button className="login__modal-button" onClick={handleClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
