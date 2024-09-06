import { Row, Col, Container } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { selectSong } from "../redux/actions/playerActions";

const Player = () => {
  const dispatch = useDispatch();
  const song = useSelector((state) => state.player.selectedSong);
  const playlist = useSelector((state) => state.player.playlist); // Playlist completa
  const currentIndex = playlist.findIndex((track) => track.id === song.id); // Indice del brano corrente

  const coverSmall = song.album && song.album.cover_small;
  const title = song.title || "";
  const artistName = (song.artist && song.artist.name) || "";

  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(1); 
  const [currentTime, setCurrentTime] = useState(0); 
  const [duration, setDuration] = useState(0); 
  const audioRef = useRef(null);

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
    if (currentIndex < playlist.length - 1) {
      dispatch(selectSong(playlist[currentIndex + 1])); // Seleziona la canzone successiva
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      dispatch(selectSong(playlist[currentIndex - 1])); // Seleziona la canzone precedente
    }
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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [song]);

  if (!song || song.length === 0) {
    return null;
  }

  // Calcola la percentuale di progresso
  const progress = (currentTime / duration) * 100;

  return (
    <Container fluid className="fixed-bottom bg-container pt-md-1">
      <Row>
        <Col lg={3} className="d-flex align-items-center offset-md-2">
          <img src={coverSmall} alt="album cover" className="mr-3" style={{ width: '60px' }} />
          <div>
            <div className="font-weight-bold text-light">{title}</div>
            <div className="text-light">{artistName}</div>
          </div>
        </Col>
        <Col lg={7}>
          <Row>
            <Col xs={12} md={8} lg={6} className="offset-md-3 mt-md-1" id="playerControls">
              <Row className="iconsImg justify-content-center">
                <Col xs={1} className="col-sm-1">
                  <a href="#">
                    <img src="/assets/images/playerbuttons/Shuffle.png" alt="shuffle" />
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
                  <a href="#">
                    <img src="/assets/images/playerbuttons/Repeat.png" alt="repeat" />
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
          >
            <source src={song.preview} type="audio/mpeg" />
          </audio>
        </Col>
      </Row>
    </Container>
  );
};

export default Player;
