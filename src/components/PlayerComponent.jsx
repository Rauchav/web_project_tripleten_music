import SpotifyPlayback from "./SpotifyPlayback";

const PlayerComponent = ({ songUri, onPlaybackStateChange }) => {
  return (
    <SpotifyPlayback
      songUri={songUri}
      onPlaybackStateChange={onPlaybackStateChange}
    />
  );
};

export default PlayerComponent;
