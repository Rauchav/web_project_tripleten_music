import { useState, useEffect } from "react";
import {
  searchLyrics,
  getCachedLyrics,
  cacheLyrics,
} from "../services/lyricsService";

const Lyrics = ({ artist, title, isVisible = true }) => {
  const [lyrics, setLyrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [source, setSource] = useState(null);

  useEffect(() => {
    if (!artist || !title || !isVisible) {
      setLyrics(null);
      setError(null);
      return;
    }

    const fetchLyrics = async () => {
      setLoading(true);
      setError(null);

      try {
        const cachedLyrics = getCachedLyrics(artist, title);
        if (cachedLyrics) {
          console.log("Using cached lyrics");
          setLyrics(cachedLyrics.lyrics);
          setSource(cachedLyrics.source);
          setLoading(false);
          return;
        }

        const result = await searchLyrics(artist, title);

        if (result.success && result.lyrics) {
          setLyrics(result.lyrics);
          setSource(result.source);
          cacheLyrics(artist, title, result);
        } else {
          setError(result.error || "No lyrics found");
        }
      } catch (err) {
        console.error("Error fetching lyrics:", err);
        setError("Failed to load lyrics");
      } finally {
        setLoading(false);
      }
    };

    fetchLyrics();
  }, [artist, title, isVisible]);

  if (!isVisible) {
    return null;
  }

  if (loading) {
    return (
      <div className="lyrics-container">
        <div className="lyrics-loading">
          <div className="lyrics-loading-spinner"></div>
          <p>Cargando las letras...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lyrics-container">
        <div className="lyrics-error">
          <p>{error}</p>
          <p className="lyrics-error-subtitle">
            Las letras de esta canción no estan disponibles
          </p>
        </div>
      </div>
    );
  }

  if (!lyrics || lyrics.length === 0) {
    return (
      <div className="lyrics-container">
        <div className="lyrics-placeholder">
          <p>Estas escuchando esta canción a travez de Spotify</p>
          <p>Puedes pausar y volver a reproducir esta canción</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lyrics-container">
      <div className="lyrics-header">
        <h3>Letras</h3>
        {source && (
          <span className="lyrics-source">
            Potenciado por {source === "lyrics.ovh" ? "Lyrics.ovh" : source}
          </span>
        )}
      </div>

      <div className="lyrics-content">
        {lyrics.map((line, index) => (
          <p key={index} className="lyrics-line">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Lyrics;
