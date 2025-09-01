import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import { GoHeartFill } from "react-icons/go";
import { GoHeart } from "react-icons/go";

const SongCard = ({ song, user }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (user) {
      // User is already authenticated, navigate to player with song data
      console.log("User authenticated, navigating to player with song:", song);

      // Create song data object with Spotify URI
      const songData = {
        uri:
          song.spotify_uri ||
          song.uri ||
          `spotify:track:${song.id || song._id}`,
        title: song.title,
        artist: song.artist,
        album: song.album,
        image: song.image,
        duration: song.duration,
        id: song.id || song._id,
      };

      // Navigate to player with song data in state
      navigate("/player", {
        state: { selectedSong: songData },
      });
    } else {
      // User not authenticated, show login modal
      console.log("User not authenticated, showing login modal");
      setShowLoginModal(true);
    }
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
