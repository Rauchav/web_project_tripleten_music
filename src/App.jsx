import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import Home from "./pages/Home";
import Player from "./pages/Player";
import Authorize from "./oauth/authorize";
import NavBar from "./components/NavBar";
import ErrorModal from "./components/ErrorModal";
import { searchSongs } from "./services/spotifyService";
import {
  isAuthenticated,
  getCurrentUser,
  clearInvalidAuth,
} from "./services/authService";

function App() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) {
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

  useEffect(() => {
    const checkAuthAndUpdateUser = () => {
      console.log("Checking authentication state...");
      if (isAuthenticated()) {
        const currentUser = getCurrentUser();
        console.log("User is authenticated:", currentUser);
        setUser(currentUser);
      } else {
        const userInfo = localStorage.getItem("spotify_user_info");
        const token = localStorage.getItem("spotify_access_token");
        console.log(
          "User not authenticated. UserInfo:",
          !!userInfo,
          "Token:",
          !!token
        );
        if (userInfo && !token) {
          clearInvalidAuth();
        }
        setUser(null);
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get("error");
    const logoutParam = urlParams.get("logout");

    if (errorParam) {
      const decodedError = decodeURIComponent(errorParam);
      showError(decodedError);
      window.history.replaceState({}, "", window.location.pathname);
    }

    if (logoutParam) {
      console.log("Logout parameter detected, cleaning up URL");
      window.history.replaceState({}, "", window.location.pathname);
    }

    // Check auth immediately
    checkAuthAndUpdateUser();

    // Also check after a delay to handle race conditions
    const timeoutId = setTimeout(() => {
      checkAuthAndUpdateUser();
    }, 500);

    // Check again after a longer delay to ensure auth state is properly set
    const timeoutId2 = setTimeout(() => {
      checkAuthAndUpdateUser();
    }, 1500);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
    };
  }, []);

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  return (
    <Router>
      <div className="app">
        <NavBar onSearch={handleSearch} user={user} />
        <Routes>
          <Route
            path="/"
            element={
              <Home songs={songs} loading={loading} error={error} user={user} />
            }
          />
          <Route path="/player" element={<Player user={user} />} />
          <Route path="/callback" element={<Authorize />} />
        </Routes>
        {showErrorModal && (
          <ErrorModal onClose={handleErrorModalClose} message={errorMessage} />
        )}
      </div>
    </Router>
  );
}

export default App;
