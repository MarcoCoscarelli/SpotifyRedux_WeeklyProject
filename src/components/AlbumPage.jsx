import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import SingleTrack from "./SingleTrack";
import { selectSong, setPlaylist } from "../redux/actions/playerActions"; 

const AlbumPage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [albumToShow, setAlbumToShow] = useState(null);

  let headers = new Headers({
    "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
    "X-RapidAPI-Key": "222902beabmshb95a65b737cead6p1f3ac9jsn23ced94c0d20",
  });

  const fetchAlbum = async () => {
    try {
      const response = await fetch(
        `https://striveschool-api.herokuapp.com/api/deezer/album/${params.id}`,
        {
          method: "GET",
          headers: headers,
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAlbumToShow(data);
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAlbum();
  }, [params.id]);

  // Funzione  "Play"
  const handlePlayAlbum = () => {
    if (albumToShow && albumToShow.tracks.data.length > 0) {
      dispatch(setPlaylist(albumToShow.tracks.data)); // Imposto la playlist
      dispatch(selectSong(albumToShow.tracks.data[0])); // Seleziono la prima traccia 
    }
  };

  return (
    <div>
      {albumToShow ? (
        <Container fluid id="mainPage">
          <Row>
            <Col md={3} className="pt-5 text-center" id="img-container">
              <img
                src={albumToShow.cover}
                className="card-img img-fluid"
                alt="Album"
              />
              <div className="mt-4 text-center">
                <p className="album-title">{albumToShow.title}</p>
              </div>
              <div className="text-center">
                <Link
                  to={"/artist/" + albumToShow.artist.id}
                  className="artist-name"
                >
                  {albumToShow.artist.name}
                </Link>
              </div>
              <div className="mt-4 text-center">
                <button
                  id="btnPlay"
                  className="btn btn-success"
                  type="button"
                  onClick={handlePlayAlbum} // Chiamo handlePlayAlbum quando si clicca
                >
                  Play
                </button>
              </div>
            </Col>
            <Col md={8} className="p-md-5">
              <Row>
                <Col md={10} className="mb-5" id="trackList">
                  {albumToShow.tracks.data.map((track) => {
                    return <SingleTrack key={track.id} track={track} />;
                  })}
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      ) : null}
    </div>
  );
};

export default AlbumPage;
