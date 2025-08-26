# Tripleten Music

A React-based music application that integrates with the Spotify API to provide music search and playback functionality.

## Environment Setup

This project requires Spotify API credentials to function properly. Follow these steps to set up your environment:

### 1. Create a `.env` file

Create a `.env` file in the root directory of the project with the following content:

```env
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/callback
```

### 2. Get Spotify API Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Create a new application
4. Copy the Client ID and Client Secret
5. In your Spotify app settings, add `http://127.0.0.1:5173/callback` to the Redirect URIs
6. Replace the placeholder values in your `.env` file

### 3. Security Notes

- The `.env` file is already added to `.gitignore` to prevent committing sensitive data
- Never commit your actual API credentials to version control
- For production deployment, set these environment variables in your hosting platform

## Development

This project uses Vite for fast development and building. The main plugins are:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh

## Features

- **Spotify OAuth Authentication**: Users can log in with their Spotify accounts
- **Music Search**: Search for songs, artists, and albums using Spotify's API
- **User Profile**: Display user information and handle authentication state
- **Responsive Design**: Works on desktop and mobile devices

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

Successfully Implemented Spotify OAuth Authentication

Key Features Working:

✅ User Login Flow - Users can click "INICIAR SESIÓN" and get redirected to Spotify's authorization page
✅ OAuth Callback Handling - After authorization, users are redirected back to the app
✅ Authentication State Management - The app properly stores and manages access tokens and user info
✅ Protected Routes - Users are redirected to the Player page when authenticated
✅ Logout Functionality - Users can sign out and return to the home page
✅ Conditional UI - The NavBar shows different content based on authentication status
✅ Song Card Behavior - Clicking songs takes authenticated users directly to Player, unauthenticated users see the login modal

Technical Fixes Applied:

Fixed State Parameter Issue - Modified clearInvalidAuth() to not clear the OAuth state parameter during authentication flow
Environment Variables - Moved Spotify credentials to .env file for security
Error Handling - Implemented proper error handling for authentication failures
Route Protection - Added authentication checks to protect the Player page
UI State Management - Properly managed authentication state across components
User Flow:
Unauthenticated User → Clicks song → LoginModal appears → Clicks "Iniciar sesión con Spotify" → Redirected to Spotify → Authorizes → Redirected back to Player page
Authenticated User → Clicks song → Directly taken to Player page
Logout → User signs out → Returns to home page → Can log in again
The authentication system is now fully functional and ready for production use! 🚀
