// Servicio de Autenticación OAuth de Spotify

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

if (!CLIENT_ID || !REDIRECT_URI) {
  throw new Error(
    "Spotify OAuth credentials not found. Please check your .env file and ensure VITE_SPOTIFY_CLIENT_ID and VITE_SPOTIFY_REDIRECT_URI are set."
  );
}

const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

const SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "streaming",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-library-read",
  "user-top-read",
  "user-read-recently-played",
].join(" ");

const generateRandomString = (length) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const storeAuthState = (state) => {
  localStorage.setItem("spotify_auth_state", state);
};

const getStoredAuthState = () => {
  return localStorage.getItem("spotify_auth_state");
};

const clearStoredAuthState = () => {
  localStorage.removeItem("spotify_auth_state");
};

const storeAccessToken = (token) => {
  localStorage.setItem("spotify_access_token", token);
};

const getStoredAccessToken = () => {
  return localStorage.getItem("spotify_access_token");
};

const clearStoredAccessToken = () => {
  localStorage.removeItem("spotify_access_token");
};

const storeUserInfo = (userInfo) => {
  localStorage.setItem("spotify_user_info", JSON.stringify(userInfo));
};

const getStoredUserInfo = () => {
  const userInfo = localStorage.getItem("spotify_user_info");
  return userInfo ? JSON.parse(userInfo) : null;
};

const clearStoredUserInfo = () => {
  localStorage.removeItem("spotify_user_info");
};

export const initiateSpotifyLogin = () => {
  try {
    console.log("=== INITIATING SPOTIFY LOGIN ===");

    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_user_info");
    localStorage.removeItem("spotify_auth_state");
    localStorage.removeItem("spotify_login_attempt");
    localStorage.removeItem("spotify_login_errors");
    localStorage.removeItem("spotify_redirect_attempt");
    localStorage.removeItem("debug_login_attempt");
    localStorage.removeItem("spotify_logout_in_progress");

    if (!CLIENT_ID || !REDIRECT_URI) {
      throw new Error(
        "Missing Spotify credentials. Please check your .env file."
      );
    }

    const state = generateRandomString(16);
    storeAuthState(state);

    const authUrl = new URL(AUTH_ENDPOINT);
    authUrl.searchParams.append("client_id", CLIENT_ID);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
    authUrl.searchParams.append("state", state);
    authUrl.searchParams.append("scope", SCOPES);

    console.log("Redirecting to Spotify authorization...");
    console.log("Auth URL:", authUrl.toString());

    window.location.href = authUrl.toString();
  } catch (error) {
    console.error("Error in initiateSpotifyLogin:", error);
    throw error;
  }
};

export const handleAuthCallback = async (code, state) => {
  try {
    console.log("=== HANDLE AUTH CALLBACK STARTED ===");
    console.log("Code length:", code?.length);
    console.log("State:", state);

    const storedState = getStoredAuthState();
    console.log("Stored state:", storedState);
    console.log("State match:", state === storedState);

    if (state !== storedState) {
      console.error("State mismatch! Expected:", storedState, "Got:", state);
      throw new Error("State parameter mismatch");
    }

    console.log("=== EXCHANGING CODE FOR TOKEN ===");
    console.log("Token endpoint:", TOKEN_ENDPOINT);
    console.log("Client ID exists:", !!CLIENT_ID);
    console.log(
      "Client secret exists:",
      !!import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
    );
    console.log("Redirect URI:", REDIRECT_URI);

    const tokenResponse = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          btoa(CLIENT_ID + ":" + import.meta.env.VITE_SPOTIFY_CLIENT_SECRET),
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    console.log("Token response status:", tokenResponse.status);
    console.log("Token response ok:", tokenResponse.ok);

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange failed:", errorText);
      throw new Error(
        `Failed to exchange authorization code for token: ${tokenResponse.status} - ${errorText}`
      );
    }

    const tokenData = await tokenResponse.json();
    console.log("Token data received:", {
      access_token_exists: !!tokenData.access_token,
      token_type: tokenData.token_type,
      expires_in: tokenData.expires_in,
      refresh_token_exists: !!tokenData.refresh_token,
    });

    storeAccessToken(tokenData.access_token);
    console.log("Access token stored in localStorage");

    console.log("=== FETCHING USER INFO ===");
    const userResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    console.log("User response status:", userResponse.status);
    console.log("User response ok:", userResponse.ok);

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error("User info fetch failed:", errorText);
      throw new Error("Failed to get user information");
    }

    const userData = await userResponse.json();
    console.log("User data received:", {
      id: userData.id,
      display_name: userData.display_name,
      email: userData.email,
    });

    storeUserInfo(userData);
    console.log("User info stored in localStorage");

    clearStoredAuthState();
    console.log("Auth state cleared");

    console.log("=== AUTHENTICATION COMPLETE ===");
    return {
      success: true,
      user: userData,
      accessToken: tokenData.access_token,
    };
  } catch (error) {
    console.error("=== AUTHENTICATION ERROR ===");
    console.error("Error details:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    clearStoredAuthState();
    clearStoredAccessToken();
    clearStoredUserInfo();

    return {
      success: false,
      error: error.message,
    };
  }
};

export const isAuthenticated = () => {
  const token = getStoredAccessToken();
  const userInfo = getStoredUserInfo();
  return !!(token && userInfo);
};

export const getCurrentUser = () => {
  return getStoredUserInfo();
};

export const getCurrentAccessToken = () => {
  return getStoredAccessToken();
};

export const clearInvalidAuth = () => {
  clearStoredAccessToken();
  clearStoredUserInfo();

  localStorage.removeItem("spotify_login_attempt");
  localStorage.removeItem("spotify_login_errors");
  localStorage.removeItem("spotify_redirect_attempt");
  localStorage.removeItem("debug_login_attempt");
};

export const logout = () => {
  console.log("=== STARTING LOGOUT PROCESS ===");

  localStorage.removeItem("spotify_access_token");
  localStorage.removeItem("spotify_user_info");
  localStorage.removeItem("spotify_auth_state");
  localStorage.removeItem("spotify_login_attempt");
  localStorage.removeItem("spotify_login_errors");
  localStorage.removeItem("spotify_redirect_attempt");
  localStorage.removeItem("debug_login_attempt");
  localStorage.removeItem("spotify_debug_info");
  localStorage.removeItem("login_debug_info");
  localStorage.removeItem("callback_debug_info");
  localStorage.removeItem("auth_result_debug");
  localStorage.removeItem("auth_error_debug");
  localStorage.removeItem("pre_redirect_url");
  localStorage.removeItem("spotify_auth_url");
  localStorage.removeItem("token_exchange_attempt");
  localStorage.removeItem("token_exchange_error");
  localStorage.removeItem("callback_useEffect_triggered");
  localStorage.removeItem("callback_error");
  localStorage.removeItem("callback_missing_params");

  sessionStorage.clear();

  document.cookie.split(";").forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });

  if ("caches" in window) {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName);
      });
    });
  }

  console.log("=== LOGOUT COMPLETE ===");

  const spotifyLogoutUrl = "https://accounts.spotify.com/logout";

  const popup = window.open(
    spotifyLogoutUrl,
    "_blank",
    "width=1,height=1,left=-1000,top=-1000"
  );

  setTimeout(() => {
    if (popup) {
      popup.close();
    }
    window.location.href = "/";
  }, 500);
};

export const forceCompleteLogout = () => {
  console.log("=== FORCE COMPLETE LOGOUT ===");

  localStorage.clear();

  sessionStorage.clear();

  document.cookie.split(";").forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });

  if (window.indexedDB) {
    window.indexedDB.databases().then((databases) => {
      databases.forEach((db) => {
        window.indexedDB.deleteDatabase(db.name);
      });
    });
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister();
      });
    });
  }

  if ("caches" in window) {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName);
      });
    });
  }

  console.log("=== ALL DATA CLEARED ===");

  const spotifyLogoutUrl = "https://accounts.spotify.com/logout";

  const popup = window.open(
    spotifyLogoutUrl,
    "_blank",
    "width=1,height=1,left=-1000,top=-1000"
  );

  setTimeout(() => {
    if (popup) {
      popup.close();
    }
    window.location.href = "/";
  }, 500);
};

export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          btoa(CLIENT_ID + ":" + import.meta.env.VITE_SPOTIFY_CLIENT_SECRET),
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    storeAccessToken(data.access_token);

    return data.access_token;
  } catch (error) {
    console.error("Token refresh error:", error);
    logout();
    throw error;
  }
};
