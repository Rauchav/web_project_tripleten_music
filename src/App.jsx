import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useCallback } from "react";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import { searchSongs } from "./services/spotifyService";

function App() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = useCallback(async (query) => {
    console.log("Búsqueda activada con consulta:", query);

    // Si la búsqueda está vacía, no hacer nada
    if (!query.trim()) {
      console.log("Consulta de búsqueda vacía, ignorando");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const searchResults = await searchSongs(query);
      setSongs(searchResults);
    } catch (err) {
      console.error("Error al buscar canciones:", err);
      setError("Error al buscar canciones. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Router>
      <div className="app">
        <NavBar onSearch={handleSearch} />
        <Routes>
          <Route
            path="/"
            element={<Home songs={songs} loading={loading} error={error} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
