import { useState, useEffect, useCallback } from "react";
import SongsList from "../components/SongsList";
import Preloader from "../components/Preloader";
import { getRandomGreatestHits } from "../services/spotifyService";

const Home = ({
  songs: searchResults,
  loading: searchLoading,
  error: searchError,
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

      // Intentar obtener desde la API de Spotify primero
      const fetchedSongs = await getRandomGreatestHits();
      console.log(
        "Canciones obtenidas exitosamente desde Spotify:",
        fetchedSongs.length
      );
      setInitialSongs(fetchedSongs);
    } catch (err) {
      console.error("Error al obtener canciones desde la API de Spotify:", err);
      // Usar datos de respaldo si la API falla
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

  // Obtener canciones iniciales al montar el componente - solo una vez
  useEffect(() => {
    console.log("Componente Home montado, obteniendo canciones iniciales...");
    fetchInitialSongs();
  }, [fetchInitialSongs]);

  // Determinar qué canciones mostrar y estado de carga
  const displaySongs = searchResults.length > 0 ? searchResults : initialSongs;
  const isLoading = searchLoading || initialLoading;
  const hasError = searchError || initialError;

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

  return (
    <div className="home">
      <SongsList songs={displaySongs} />
    </div>
  );
};

export default Home;
