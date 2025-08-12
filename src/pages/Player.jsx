import bgVideo from "../assets/videos/player-background.mp4";

const Player = () => {
  return (
    <div className="player">
      <video
        className="player__video-bg"
        src={bgVideo}
        autoPlay
        loop
        muted
        playsInline
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
