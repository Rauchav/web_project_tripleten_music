import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { handleAuthCallback } from "../services/authService";
import Preloader from "../components/Preloader";
import "../styles/callback.css";

// Función para recargar la página y refrescar el estado de autenticación
const refreshPage = () => {
  window.location.reload();
};

// Función para mostrar modal de error estableciendo parámetro en la URL
const showErrorModal = (message) => {
  const url = new URL(window.location);
  url.searchParams.set("error", encodeURIComponent(message));
  window.history.replaceState({}, "", url);
};

const Authorize = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  // Verificar si estamos en React Strict Mode (useEffect se ejecuta dos veces)
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    console.log("=== AUTHORIZE COMPONENT MOUNTED ===");
    console.log("Current URL:", window.location.href);
    console.log("Search params:", Object.fromEntries(searchParams.entries()));
    console.log("Is processing:", isProcessing);

    // Verificar si ya estamos procesando este callback
    if (isProcessing) {
      console.log("Already processing, skipping...");
      return;
    }

    // Verificar si ya hemos procesado este callback
    const code = searchParams.get("code");
    const processedKey = `callback_processed_${code}`;

    if (localStorage.getItem(processedKey)) {
      console.log("Callback already processed, skipping...");
      return;
    }

    // Marcar este callback como procesándose inmediatamente
    setIsProcessing(true);
    localStorage.setItem(processedKey, "processing");

    const handleCallback = async () => {
      try {
        console.log("=== HANDLING CALLBACK ===");
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const error = searchParams.get("error");

        console.log("Code exists:", !!code);
        console.log("State exists:", !!state);
        console.log("Error exists:", !!error);
        console.log(
          "Stored state:",
          localStorage.getItem("spotify_auth_state")
        );

        // Verificar si hubo un error de Spotify
        if (error) {
          console.error("Spotify error:", error);
          showErrorModal("Authorization was denied or cancelled");
          navigate("/");
          return;
        }

        // Verificar si tenemos los parámetros requeridos
        if (!code || !state) {
          console.error("Missing required parameters");
          console.log("Code:", code);
          console.log("State:", state);
          showErrorModal("Invalid authorization response");
          navigate("/");
          return;
        }

        // Manejar el callback de OAuth
        let result;
        try {
          console.log("Calling handleAuthCallback...");
          result = await handleAuthCallback(code, state);
          console.log("Auth callback result:", result);
        } catch (error) {
          console.error("Error in handleAuthCallback:", error);
          throw error;
        }

        if (result.success) {
          // Marcar este callback como procesado
          localStorage.setItem(processedKey, "true");

          console.log("=== AUTHENTICATION SUCCESSFUL ===");
          console.log("User:", result.user);
          console.log("Access token exists:", !!result.accessToken);

          // Add a small delay to ensure authentication state is properly set
          setTimeout(() => {
            console.log("Redirecting to player...");
            // Redirigir a la página del reproductor después de autenticación exitosa
            // Use navigate instead of window.location.href to avoid race conditions
            navigate("/player", { replace: true });
          }, 500);
        } else {
          // Marcar este callback como procesado
          localStorage.setItem(processedKey, "true");

          console.error("Authentication failed:", result.error);
          showErrorModal("Authentication failed. Please try again.");
          navigate("/");
        }
      } catch (error) {
        console.error("Unexpected error in callback:", error);
        showErrorModal("An unexpected error occurred");
        navigate("/");
      }
    };

    handleCallback();

    // Limpiar callbacks procesados antiguos (más antiguos que 1 hora)
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("callback_processed_")) {
        const timestamp = localStorage.getItem(key);
        if (timestamp && new Date(timestamp).getTime() < oneHourAgo) {
          localStorage.removeItem(key);
        }
      }
    });
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="callback-error">
        <div className="callback-error-container">
          <h2>Authentication Error</h2>
          <p>{error}</p>
          <p>Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="callback-loading">
      <Preloader />
      <p>Completing authentication...</p>
    </div>
  );
};

export default Authorize;
