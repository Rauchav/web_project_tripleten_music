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

const Callback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  // Verificar si estamos en React Strict Mode (useEffect se ejecuta dos veces)
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Verificar si ya estamos procesando este callback
    if (isProcessing) {
      return;
    }

    // Verificar si ya hemos procesado este callback
    const code = searchParams.get("code");
    const processedKey = `callback_processed_${code}`;

    if (localStorage.getItem(processedKey)) {
      return;
    }

    // Marcar este callback como procesándose inmediatamente
    setIsProcessing(true);
    localStorage.setItem(processedKey, "processing");

    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const error = searchParams.get("error");

        // Verificar si hubo un error de Spotify
        if (error) {
          showErrorModal("Authorization was denied or cancelled");
          navigate("/");
          return;
        }

        // Verificar si tenemos los parámetros requeridos
        if (!code || !state) {
          showErrorModal("Invalid authorization response");
          navigate("/");
          return;
        }

        // Manejar el callback de OAuth
        let result;
        try {
          result = await handleAuthCallback(code, state);
        } catch (error) {
          throw error;
        }

        if (result.success) {
          // Marcar este callback como procesado
          localStorage.setItem(processedKey, "true");

          // Redirigir a la página del reproductor después de autenticación exitosa
          window.location.href = "/player";
        } else {
          // Marcar este callback como procesado
          localStorage.setItem(processedKey, "true");

          showErrorModal("Authentication failed. Please try again.");
          navigate("/");
        }
      } catch (error) {
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

export default Callback;
