import { useState } from "react";
import LoginModal from "./LoginModal";
import { GoHeartFill } from "react-icons/go";
import { GoHeart } from "react-icons/go";

const SongCard = ({ song }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleCardClick = () => {
    // Mostrar modal de login cuando se hace clic en la canción
    setShowLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  return (
    <>
      <div
        className="song__card"
        onClick={handleCardClick}
        style={{ cursor: "pointer" }}
      >
        <div className="song__card-block-left">
          <div className="song__card-image-container">
            <img
              className="song__card-image"
              src={song.image}
              alt="imagen de la canción"
            />
          </div>
          <div className="song__card-info">
            <h3 className="song__card-title">{song.title}</h3>
            <h4 className="song__card-artist">{song.artist}</h4>
            <p className="song__card-album">Álbum: {song.album}</p>
          </div>
        </div>
        <div className="song__card-block-right">
          <p>{song.duration}</p>
        </div>
      </div>

      {showLoginModal && <LoginModal onClose={handleCloseLoginModal} />}
    </>
  );
};

export default SongCard;
