import bgVideo from "../assets/videos/player-background.mp4";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../services/authService";
import SpotifyPlayback from "../components/SpotifyPlayback";
import "../styles/spotifyplayback.css";

const Player = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSong, setSelectedSong] = useState(null);
  const [playbackState, setPlaybackState] = useState(null);

  useEffect(() => {
    console.log("Player component - checking authentication. User:", user);
    console.log("isAuthenticated():", isAuthenticated());

    // Get song data from navigation state
    if (location.state?.selectedSong) {
      setSelectedSong(location.state.selectedSong);
      console.log("Received song data:", location.state.selectedSong);
    } else {
      console.log("No song data received, redirecting to home");
      navigate("/");
      return;
    }

    // Add a small delay to allow the auth state to be properly set
    const checkAuth = () => {
      if (!isAuthenticated()) {
        console.log("User not authenticated, redirecting to home");
        navigate("/");
      } else {
        console.log("User is authenticated, staying on player page");
      }
    };

    // Check immediately
    checkAuth();

    // Also check after a short delay to handle race conditions
    const timeoutId = setTimeout(checkAuth, 1000);

    return () => clearTimeout(timeoutId);
  }, [navigate, user, location.state]);

  const handlePlaybackStateChange = (state) => {
    setPlaybackState(state);
    console.log("Playback state changed:", state);
  };

  if (!user) {
    console.log("Player component - no user prop, showing loading...");
    return (
      <div className="player">
        <div className="player__text-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!selectedSong) {
    return (
      <div className="player">
        <div className="player__text-container">
          <p>No song selected. Redirecting...</p>
        </div>
      </div>
    );
  }

  const handleVideoLoad = () => {
    console.log("Video loaded successfully");
  };

  const handleVideoError = (error) => {
    console.error("Video loading error:", error);
  };

  const handleVideoCanPlay = () => {
    console.log("Video can play");
  };

  return (
    <div className="player">
      <video
        className="player__video-bg"
        src={bgVideo}
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={handleVideoLoad}
        onError={handleVideoError}
        onCanPlay={handleVideoCanPlay}
        preload="auto"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      />

      <div className="player__text-container">
        <h1 className="player__Lyrics-title">{selectedSong.title}</h1>
        <h2 className="player__Lyrics-artist">{selectedSong.artist}</h2>

        {/* Display current track info from Spotify if available */}
        {playbackState?.track_window?.current_track && (
          <div className="player__current-track-info">
            <p>Now playing: {playbackState.track_window.current_track.name}</p>
            <p>
              by{" "}
              {playbackState.track_window.current_track.artists
                .map((artist) => artist.name)
                .join(", ")}
            </p>
          </div>
        )}

        {/* Placeholder for lyrics - you can integrate with lyrics API later */}
        <div className="player__lyrics-placeholder">
          <p>🎵 Music is playing through Spotify</p>
          <p>Use the controls below to manage playback</p>
        </div>
      </div>

      {/* Spotify Playback Component */}
      <SpotifyPlayback
        songUri={selectedSong.uri}
        onPlaybackStateChange={handlePlaybackStateChange}
      />
    </div>
  );
};

export default Player;
