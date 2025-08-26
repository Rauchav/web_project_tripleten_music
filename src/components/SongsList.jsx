import SongCard from "./SongCard";

const SongsList = ({ songs = [], user }) => {
  if (songs.length === 0) {
    return (
      <div className="songs__list">
        <div className="no-songs-message">
          <p>
            No se encontraron canciones. Intenta con un término de búsqueda
            diferente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="songs__list">
      {songs.map((song) => (
        <SongCard key={song._id} song={song} user={user} />
      ))}
    </div>
  );
};

export default SongsList;
