import { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { getCurrentAccessToken } from "../services/authService";

const SpotifyPlayback = ({ songUri, onPlaybackStateChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [error, setError] = useState(null);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const initializePlayer = async () => {
      try {
        const token = getCurrentAccessToken();
        if (!token) {
          setError("No access token available");
          return;
        }

        if (!window.Spotify) {
          const script = document.createElement("script");
          script.src = "https://sdk.scdn.co/spotify-player.js";
          script.async = true;
          document.body.appendChild(script);

          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
          });
        }

        playerRef.current = new window.Spotify.Player({
          name: "Tripleten Music Player",
          getOAuthToken: (cb) => cb(token),
          volume: volume / 100,
        });

        playerRef.current.addListener("initialization_error", ({ message }) => {
          console.error("Failed to initialize player:", message);
          setError("Failed to initialize Spotify player");
        });

        playerRef.current.addListener("authentication_error", ({ message }) => {
          console.error("Failed to authenticate:", message);
          setError("Authentication failed");
        });

        playerRef.current.addListener("account_error", ({ message }) => {
          console.error("Failed to validate Spotify account:", message);
          setError("Account validation failed");
        });

        playerRef.current.addListener("playback_error", ({ message }) => {
          console.error("Failed to perform playback:", message);
          setError("Playback error");
        });

        playerRef.current.addListener("player_state_changed", (state) => {
          if (state) {
            setIsPlaying(!state.paused);
            setCurrentTrack(state.track_window.current_track);
            if (onPlaybackStateChange) {
              onPlaybackStateChange(state);
            }
          }
        });

        playerRef.current.addListener("ready", ({ device_id }) => {
          console.log("Ready with Device ID", device_id);
          setDeviceId(device_id);
        });

        playerRef.current.addListener("not_ready", ({ device_id }) => {
          console.log("Device ID has gone offline", device_id);
        });

        const connected = await playerRef.current.connect();
        if (connected) {
          console.log("Successfully connected to Spotify!");
        }
      } catch (error) {
        console.error("Error initializing Spotify player:", error);
        setError("Failed to initialize player");
      }
    };

    initializePlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (deviceId && songUri && playerRef.current) {
      playSong(songUri);
    }
  }, [deviceId, songUri]);

  const playSong = async (uri) => {
    try {
      const token = getCurrentAccessToken();
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: "PUT",
          body: JSON.stringify({ uris: [uri] }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        console.log("Started playing:", uri);
        setIsPlaying(true);
      } else {
        console.error("Failed to start playback");
        setError("Failed to start playback");
      }
    } catch (error) {
      console.error("Error playing song:", error);
      setError("Error playing song");
    }
  };

  const togglePlayPause = async () => {
    if (!playerRef.current) return;

    try {
      const token = getCurrentAccessToken();
      const endpoint = isPlaying ? "pause" : "play";

      const response = await fetch(
        `https://api.spotify.com/v1/me/player/${endpoint}?device_id=${deviceId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setIsPlaying(!isPlaying);
      } else {
        console.error(`Failed to ${endpoint}`);
      }
    } catch (error) {
      console.error("Error toggling playback:", error);
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume / 100);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      handleVolumeChange(volume);
      setIsMuted(false);
    } else {
      handleVolumeChange(0);
      setIsMuted(true);
    }
  };

  if (error) {
    return (
      <div className="spotify-playback-error">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!deviceId) {
    return (
      <div className="spotify-playback-loading">
        <p>Connecting to Spotify...</p>
      </div>
    );
  }

  return (
    <div className="spotify-playback">
      <div className="spotify-playback__track-info">
        {currentTrack && (
          <>
            <img
              src={currentTrack.album.images[0]?.url}
              alt={currentTrack.name}
              className="spotify-playback__track-image"
            />
            <div className="spotify-playback__track-details">
              <h4>{currentTrack.name}</h4>
              <p>
                {currentTrack.artists.map((artist) => artist.name).join(", ")}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="spotify-playback__controls">
        <button
          className="spotify-playback__play-pause"
          onClick={togglePlayPause}
          disabled={!currentTrack}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>

        <div className="spotify-playback__volume-controls">
          <button className="spotify-playback__mute" onClick={toggleMute}>
            {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
            className="spotify-playback__volume-slider"
          />
        </div>
      </div>

      <div className="spotify-playback__song-duration">
        {currentTrack ? "03:25" : "--:--"}
      </div>
    </div>
  );
};

export default SpotifyPlayback;
