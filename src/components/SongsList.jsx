import SongCard from "./SongCard";
import songs from "../../mockupdata/songs.json";

const SongsList = () => {
  return (
    <div className="songs__list">
      {songs.map((song) => (
        <SongCard key={song._id} song={song} />
      ))}
    </div>
  );
};

export default SongsList;
