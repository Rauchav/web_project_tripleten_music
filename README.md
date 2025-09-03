Proyecto final Tripleten Full Stack bootcamp
"Tripleten Music"

Mi proyecto final del Bootcamp Fullstack de Tripleten. Una aplicación web de música que te permite buscar canciones, reproducirlas con Spotify y ver las letras en tiempo real.

## ¿Qué hace esta app?

- **🎧 Escuchar música**: Conecta con tu cuenta de Spotify y reproduce canciones directamente
- **🔍 Buscar canciones**: Encuentra cualquier canción, artista o álbum
- **📝 Ver letras**: Muestra las letras de las canciones mientras las escuchas
- **📱 Funciona en cualquier dispositivo**: Diseño responsive para móvil y desktop

## Tecnologías que usé

- **React** - Para la interfaz
- **Spotify API** - Para buscar y reproducir música
- **CSS** - Para el diseño
- **Vite** - Para desarrollo rápido

## Cómo instalarlo

1. **Clona el repositorio**

```bash
git clone [URL_DEL_REPO]
cd tripleten-music
```

2. **Instala las dependencias**

```bash
npm install
```

3. **Configura Spotify**

- Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
- Crea una nueva app
- Copia el Client ID y Client Secret
- Agrega `http://127.0.0.1:5173/callback` a las Redirect URIs

4. **Crea el archivo .env**

```env
VITE_SPOTIFY_CLIENT_ID=tu_client_id
VITE_SPOTIFY_CLIENT_SECRET=tu_client_secret
VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/callback
```

5. **Ejecuta la app**

```bash
npm run dev
```

## Cómo funciona

1. **Inicia sesión** con tu cuenta de Spotify
2. **Busca canciones** en la barra de búsqueda
3. **Haz clic** en cualquier canción para reproducirla
4. **Disfruta** de la música y las letras

## Estructura del proyecto

```
src/
├── components/     # Componentes reutilizables
├── pages/         # Páginas principales
├── services/      # Conexiones con APIs
├── styles/        # Archivos CSS
└── assets/        # Imágenes y videos
```

## Lo que aprendí

Este proyecto me ayudó a entender:

- Cómo integrar APIs externas (Spotify)
- Autenticación OAuth
- Manejo de estado en React
- Diseño responsive
- Optimización de rendimiento

## Sobre mí

**Raúl Chávez Valdivia Velarde**

- Estudiante del Bootcamp Fullstack de Tripleten
- Me encanta la música y la programación
- Este es mi primer proyecto independiente completo con React

---

Este projecto esta disponible en:
https://rauchav.github.io/web_project_tripleten_music/

¡Espero que te guste mi proyecto!
