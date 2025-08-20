# Tripleten Music

A React-based music application that integrates with the Spotify API to provide music search and playback functionality.

## Environment Setup

This project requires Spotify API credentials to function properly. Follow these steps to set up your environment:

### 1. Create a `.env` file

Create a `.env` file in the root directory of the project with the following content:

```env
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
```

### 2. Get Spotify API Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Create a new application
4. Copy the Client ID and Client Secret
5. Replace the placeholder values in your `.env` file

### 3. Security Notes

- The `.env` file is already added to `.gitignore` to prevent committing sensitive data
- Never commit your actual API credentials to version control
- For production deployment, set these environment variables in your hosting platform

## Development

This project uses Vite for fast development and building. The main plugins are:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
