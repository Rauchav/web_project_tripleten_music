import bgVideo from "../assets/videos/player-background.mp4";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../services/authService";

const Player = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Player component - checking authentication. User:", user);
    console.log("isAuthenticated():", isAuthenticated());

    // Add a small delay to allow the auth state to be properly set
    const checkAuth = () => {
      if (!isAuthenticated()) {
        console.log("User not authenticated, redirecting to home");
        navigate("/");
      } else {
        console.log("User is authenticated, staying on player page");
      }
    };

    // Check immediately
    checkAuth();

    // Also check after a short delay to handle race conditions
    const timeoutId = setTimeout(checkAuth, 1000);

    return () => clearTimeout(timeoutId);
  }, [navigate, user]);

  if (!user) {
    console.log("Player component - no user prop, showing loading...");
    return (
      <div className="player">
        <div className="player__text-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const handleVideoLoad = () => {
    console.log("Video loaded successfully");
  };

  const handleVideoError = (error) => {
    console.error("Video loading error:", error);
  };

  const handleVideoCanPlay = () => {
    console.log("Video can play");
  };

  return (
    <div className="player">
      <video
        className="player__video-bg"
        src={bgVideo}
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={handleVideoLoad}
        onError={handleVideoError}
        onCanPlay={handleVideoCanPlay}
        preload="auto"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      />
      <div className="player__text-container">
        <h1 className="player__Lyrics-title">Scared Tissue</h1>
        <h2 className="player__Lyrics-artist">Red Hot Chili Peppers</h2>
        <p className="player__Lyrics">
          Scar tissue that I wish you saw
          <br />
          Sarcastic mister know-it-all
          <br /> Close your eyes and I'll kiss you,
          <br /> 'cause With the birds I'll share
          <br /> With the birds I'll share this lonely viewin'
          <br /> With the birds I'll share this lonely viewin'
          <br /> Push me up against the wall
          <br /> Young Kentucky girl in a push-up bra
          <br /> Fallin' all over myself
          <br /> To lick your heart and taste your health 'cause
          <br /> With the birds I'll share this lonely viewin'
          <br /> With the birds I'll share this lonely viewin'
          <br /> With the birds I'll share this lonely view Blood
          <br /> loss in a bathroom stall
          <br /> A southern girl with a scarlet drawl
          <br /> I wave goodbye to ma and pa 'Cause with the birds I'll share
          <br /> With the birds I'll share this lonely viewin'
          <br /> With the birds I'll share this lonely viewin'
          <br /> Soft spoken with a broken jaw
          <br /> Step outside but not to brawl and
          <br /> Autumn's sweet, we call it fall
          <br /> I'll make it to the moon if I have to crawl and
          <br /> With the birds I'll share this lonely viewin'
          <br /> With the birds I'll share this lonely viewin'
          <br /> With the birds I'll share this lonely view
          <br /> Scar tissue that I wish you saw
          <br /> Sarcastic mister know-it-all
          <br /> Close your eyes and I'll kiss you, 'cause
          <br /> With the birds I'll share
          <br /> With the birds I'll share this lonely viewin'
          <br /> With the birds I'll share this lonely viewin'
          <br /> With the birds I'll share this lonely view
        </p>
      </div>
    </div>
  );
};

export default Player;
