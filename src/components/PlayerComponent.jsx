import { FaPlayCircle } from "react-icons/fa";

const PlayerComponent = () => {
  return (
    <div className="playerbar">
      <div className="playerbar__container-left">
        <img
          className="playerbar__image"
          src="https://i.scdn.co/image/ab67616d0000b27394d08ab63e57b0cae74e8595"
        />
        <FaPlayCircle color="white" size={30} />
      </div>
      <div className="playerbar__line"></div>
      <p className="playerbar__song-duration">03:25</p>
    </div>
  );
};

export default PlayerComponent;
