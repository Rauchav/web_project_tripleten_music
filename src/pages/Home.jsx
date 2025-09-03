import { useState, useEffect, useCallback } from "react";
import SongsList from "../components/SongsList";
import Preloader from "../components/Preloader";
import { getRandomGreatestHits } from "../services/spotifyService";

const Home = ({
  songs: searchResults,
  loading: searchLoading,
  error: searchError,
  user,
}) => {
  const [initialSongs, setInitialSongs] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [initialError, setInitialError] = useState(null);

  const fetchInitialSongs = useCallback(async () => {
    try {
      console.log(
        "Iniciando obtención de canciones iniciales desde la API de Spotify..."
      );
      setInitialLoading(true);
      setInitialError(null);

      const fetchedSongs = await getRandomGreatestHits();
      console.log(
        "Canciones obtenidas exitosamente desde Spotify:",
        fetchedSongs.length
      );
      setInitialSongs(fetchedSongs);
    } catch (err) {
      console.error("Error al obtener canciones desde la API de Spotify:", err);
      try {
        console.log("Usando datos de respaldo...");
        const mockupSongs = await import("../../mockupdata/songs.json");
        setInitialSongs(mockupSongs.default);
        console.log(
          "Usando datos de respaldo:",
          mockupSongs.default.length,
          "canciones"
        );
      } catch (fallbackErr) {
        console.error("El respaldo también falló:", fallbackErr);
        setInitialError(
          "Error al cargar canciones. Por favor, inténtalo de nuevo más tarde."
        );
      }
    } finally {
      console.log("Estableciendo carga como false");
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("Componente Home montado, obteniendo canciones iniciales...");

    // Siempre cargar canciones al cargar/refrescar la página
    const timer = setTimeout(() => {
      fetchInitialSongs();
    }, 1000); // 1 segundo de retraso

    return () => clearTimeout(timer);
  }, [fetchInitialSongs, user]);

  const displaySongs = searchResults.length > 0 ? searchResults : initialSongs;
  const isLoading = searchLoading || initialLoading;
  const hasError = searchError || initialError;

  const showEmptyState = displaySongs.length === 0 && !user && !isLoading;

  console.log(
    "Render de Home - cargando:",
    isLoading,
    "cantidad de canciones:",
    displaySongs.length
  );

  if (isLoading) {
    return <Preloader />;
  }

  if (hasError) {
    return (
      <div className="home">
        <div className="error-message">
          <p>{hasError}</p>
          <button onClick={fetchInitialSongs}>Intentar de nuevo</button>
        </div>
      </div>
    );
  }

  if (showEmptyState) {
    return (
      <div className="home">
        <div className="empty-state">
          <h2>Welcome to Tripleten Music</h2>
          <p>Please log in with Spotify to start listening to music.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <SongsList songs={displaySongs} user={user} />
    </div>
  );
};

export default Home;
