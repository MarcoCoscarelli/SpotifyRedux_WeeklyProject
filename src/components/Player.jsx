import { Row, Col, Container } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { selectSong } from "../redux/actions/playerActions";

const Player = () => {
  const dispatch = useDispatch();
  const song = useSelector((state) => state.player.selectedSong);
  const playlist = useSelector((state) => state.player.playlist); 
  const favourites = useSelector((state) => state.favourites.favourites);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(1); 
  const [currentTime, setCurrentTime] = useState(0); 
  const [duration, setDuration] = useState(0); 
  const [isShuffle, setIsShuffle] = useState(false); 
  const [isRepeat, setIsRepeat] = useState(false); 
  const audioRef = useRef(null);

  useEffect(() => {
    if (favourites.length > 0) {
      // 
      dispatch({ type: 'SET_PLAYLIST', payload: favourites });
    }
  }, [favourites, dispatch]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [song]);

  useEffect(() => {
    if (isRepeat && audioRef.current) {
      audioRef.current.loop = true; 
    } else if (audioRef.current) {
      audioRef.current.loop = false; 
    }
  }, [isRepeat]);

  const handlePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    if (playlist.length > 0) {
      let nextIndex;
      if (isShuffle) {
        nextIndex = Math.floor(Math.random() * playlist.length); 
      } else {
        nextIndex = (playlist.findIndex((track) => track.id === song.id) + 1) % playlist.length; 
      }
      dispatch(selectSong(playlist[nextIndex])); 
    }
  };

  const handlePrevious = () => {
    if (playlist.length > 0) {
      const currentIndex = playlist.findIndex((track) => track.id === song.id);
      const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length; // Ciclo le tracce
      dispatch(selectSong(playlist[prevIndex])); 
    }
  };

  const handleShuffle = () => {
    setIsShuffle(!isShuffle); 
  };

  const handleRepeat = () => {
    setIsRepeat(!isRepeat); 
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  
  const handleEnded = () => {
    if (isRepeat) {
      audioRef.current.play(); 
    } else {
      handleNext(); 
    }
  };

  if (!song || song.length === 0) {
    return null;
  }

  // Calcola la percentuale di progresso
  const progress = (currentTime / duration) * 100;

  return (
    <Container fluid className="fixed-bottom bg-container pt-md-1">
      <Row>
        <Col lg={3} className="d-flex align-items-center offset-md-2">
          <img src={song.album?.cover_small} alt="album cover" className="mr-3" style={{ width: '60px' }} />
          <div>
            <div className="font-weight-bold text-light">{song.title || ""}</div>
            <div className="text-light">{song.artist?.name || ""}</div>
          </div>
        </Col>
        <Col lg={7}>
          <Row>
            <Col xs={12} md={8} lg={6} className="offset-md-3 mt-md-1" id="playerControls">
              <Row className="iconsImg justify-content-center">
                <Col xs={1} className="col-sm-1">
                  <a href="#" onClick={handleShuffle}>
                    <img src={isShuffle ? "/assets/images/playerbuttons/ShuffleOn.png" : "/assets/images/playerbuttons/Shuffle.png"} alt="shuffle" />
                  </a>
                </Col>
                <Col xs={1} className="col-sm-1">
                  <a href="#" onClick={handlePrevious}>
                    <img src="/assets/images/playerbuttons/Previous.png" alt="previous" />
                  </a>
                </Col>
                <Col xs={1} className="col-sm-1">
                  <a href="#" onClick={handlePlayPause}>
                    <img src={isPlaying ? "/assets/images/playerbuttons/Pause.png" : "/assets/images/playerbuttons/Play.png"} alt="play/pause" />
                  </a>
                </Col>
                <Col xs={1} className="col-sm-1">
                  <a href="#" onClick={handleNext}>
                    <img src="/assets/images/playerbuttons/Next.png" alt="next" />
                  </a>
                </Col>
                <Col xs={1} className="col-sm-1">
                  <a href="#" onClick={handleRepeat}>
                    <img src={isRepeat ? "/assets/images/playerbuttons/RepeatOn.png" : "/assets/images/playerbuttons/Repeat.png"} alt="repeat" />
                  </a>
                </Col>
                <Col xs={1} className="col-sm-1">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="volume-control"
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <div className="row justify-content-center py-3" id="playBar">
            <div className="col-12 col-md-8 col-lg-6">
              <div id="progress">
                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
          >
            <source src={song.preview} type="audio/mpeg" />
          </audio>
        </Col>
      </Row>
    </Container>
  );
};

export default Player;
