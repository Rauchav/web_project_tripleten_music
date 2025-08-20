const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

// Verify that environment variables are loaded
if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error(
    "No se encontraron las credenciales de Spotify. Revisa tu archivo .env y asegúrate de que VITE_SPOTIFY_CLIENT_ID y VITE_SPOTIFY_CLIENT_SECRET estén configurados."
  );
}

// Endpoints de la API de Spotify
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

// Obtener token de credenciales del cliente para acceso público a la API
let clientCredentialsToken = null;
let tokenExpiry = 0;

const getClientCredentialsToken = async () => {
  // Verificar si tenemos un token válido
  if (clientCredentialsToken && Date.now() < tokenExpiry) {
    console.log("Usando token de credenciales del cliente en caché");
    return clientCredentialsToken;
  }

  console.log("Obteniendo nuevo token de credenciales del cliente...");
  // Obtener nuevo token
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) {
    console.error(
      "Error al obtener token de credenciales del cliente:",
      response.status,
      response.statusText
    );
    throw new Error("Error al obtener token de credenciales del cliente");
  }

  const data = await response.json();
  clientCredentialsToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000;
  console.log("Token de credenciales del cliente obtenido exitosamente");

  return clientCredentialsToken;
};

// Obtener canciones aleatorias de grandes éxitos
export const getRandomGreatestHits = async () => {
  try {
    // Lista de artistas populares conocidos por grandes éxitos
    const popularArtists = [
      "Queen",
      "The Beatles",
      "Michael Jackson",
      "Elvis Presley",
      "Madonna",
      "U2",
      "Pink Floyd",
      "Led Zeppelin",
      "The Rolling Stones",
      "Bob Dylan",
      "David Bowie",
      "Prince",
      "Stevie Wonder",
      "Aretha Franklin",
      "The Beach Boys",
      "The Doors",
      "Jimi Hendrix",
      "Janis Joplin",
      "Bob Marley",
      "Fleetwood Mac",
      "Eagles",
      "The Who",
      "Creedence Clearwater Revival",
      "Simon & Garfunkel",
      "Crosby, Stills, Nash & Young",
    ];

    // Mezclar el array de artistas
    const shuffledArtists = popularArtists.sort(() => Math.random() - 0.5);

    // Obtener pistas principales de los primeros 20 artistas
    const songs = [];
    const artistsToFetch = shuffledArtists.slice(0, 20);

    for (const artist of artistsToFetch) {
      try {
        // Primero, buscar el artista
        const searchResponse = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(
            artist
          )}&type=artist&limit=1`,
          {
            headers: {
              Authorization: `Bearer ${await getClientCredentialsToken()}`,
            },
          }
        );

        if (!searchResponse.ok) {
          console.warn(
            `Búsqueda fallida para ${artist}:`,
            searchResponse.status
          );
          continue;
        }

        const searchData = await searchResponse.json();
        if (searchData.artists.items.length === 0) {
          console.warn(`No se encontró artista para ${artist}`);
          continue;
        }

        const artistId = searchData.artists.items[0].id;

        // Obtener pistas principales para este artista
        const tracksResponse = await fetch(
          `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
          {
            headers: {
              Authorization: `Bearer ${await getClientCredentialsToken()}`,
            },
          }
        );

        if (!tracksResponse.ok) {
          console.warn(
            `Obtención de pistas fallida para ${artist}:`,
            tracksResponse.status
          );
          continue;
        }

        const tracksData = await tracksResponse.json();
        if (tracksData.tracks.length > 0) {
          const track = tracksData.tracks[0]; // Obtener la pista principal
          songs.push({
            _id: track.id,
            title: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            duration: formatDuration(track.duration_ms),
            image: track.album.images[0]?.url || "",
            spotify_uri: track.uri,
            preview_url: track.preview_url,
          });
        }
      } catch (error) {
        console.error(`Error al obtener datos para ${artist}:`, error);
        continue;
      }
    }

    console.log(`Se obtuvieron exitosamente ${songs.length} canciones`);
    return songs;
  } catch (error) {
    console.error("Error en getRandomGreatestHits:", error);
    throw error;
  }
};

// Formatear duración de milisegundos a MM:SS
const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

// Buscar canciones por consulta
export const searchSongs = async (query) => {
  const token = await getClientCredentialsToken();

  const response = await fetch(
    `${SPOTIFY_API_BASE}/search?q=${encodeURIComponent(
      query
    )}&type=track&limit=20`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al buscar canciones");
  }

  const data = await response.json();

  return data.tracks.items.map((track) => ({
    _id: track.id,
    title: track.name,
    artist: track.artists[0].name,
    album: track.album.name,
    duration: formatDuration(track.duration_ms),
    image: track.album.images[0]?.url || "",
    spotify_uri: track.uri,
    preview_url: track.preview_url,
  }));
};
