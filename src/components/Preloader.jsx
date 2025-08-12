import preloader from "../assets/videos/loading.webm";

const Preloader = () => {
  return (
    <div className="preloader">
      <video
        className="loop-video"
        src={preloader}
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
};

export default Preloader;
