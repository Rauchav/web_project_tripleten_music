import spotifyIcon from "../assets/images/spotify-icon.png";
import { IoClose } from "react-icons/io5";

const LoginModal = () => {
  return (
    <div className="login__modal">
      <div className="login__modal-close-container">
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
          Para que puedas disfrutar de esta canción, debes hacer Login en tu
          cuenta de Spotify PREMIUM.
        </p>
        <button className="login__modal-button">OK</button>
      </div>
    </div>
  );
};

export default LoginModal;
