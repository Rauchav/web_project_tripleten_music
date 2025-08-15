import spotifyIcon from "../assets/images/spotify-icon.png";
import { IoClose } from "react-icons/io5";

const ErrorModal = () => {
  return (
    <div className="login__modal">
      <div className="login__modal-close-container" onClick={handleClose}>
        <IoClose className="login__modal-close-icon" />
      </div>
      <div className="login__modal-container">
        <div className="login__modal-logo">
          <img
            className="login__modal-logo-icon"
            src={spotifyIcon}
            alt="spotify logo"
          />
          <h3 className="login__modal-logo-text">Tripleten Music</h3>
        </div>
        <p className="login__modal-message">
          We are sorry that you couldn't login to your Spotify account in order
          to enjoy this song, keep tryng.
        </p>
        <button className="login__modal-button" onClick={handleLogin}>
          OK
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
