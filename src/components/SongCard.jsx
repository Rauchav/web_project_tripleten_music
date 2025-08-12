import { GoHeartFill } from "react-icons/go";
import { GoHeart } from "react-icons/go";

const SongCard = ({ song }) => {
  return (
    <div className="song__card">
      <div className="song__card-block-left">
        <div className="song__card-image-container">
          <img className="song__card-image" src={song.image} alt="song image" />
        </div>
        <div className="song__card-info">
          <h3 className="song__card-title">{song.title}</h3>
          <h4 className="song__card-artist">{song.artist}</h4>
          <p className="song__card-album">Album: {song.album}</p>
        </div>
      </div>
      <div className="song__card-block-right">
        <p>{song.duration}</p>
      </div>
    </div>
  );
};

export default SongCard;
