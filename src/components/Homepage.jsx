import { Row } from "react-bootstrap";
import AlbumList from "./AlbumList";
import FetchAlbumsData from "./FetchAlbumsData";
import { useSelector } from "react-redux";
import SearchResults from "./SearchResults";
import { useEffect, useState } from "react";

const Home = () => {
  let rockArtists = [
    'queen',
    'arcticmonkeys',
    'thepolice',
    'linkinpark',
    'phil collins',
    
  ]

  let popArtists = [
    'maroon5',
    'billie eilish',
    'stevie wonder',
    'taylorswift',
    
  ]

  let hipHopArtists = [
    'eminem',
    'snoopdogg',
    
    'drake',
    'kanyewest',
  ]
  const rockAlbums = FetchAlbumsData(rockArtists);
  const popAlbums = FetchAlbumsData(popArtists);
  const hiphopAlbums = FetchAlbumsData(hipHopArtists);

  const results = useSelector((state) => state.search.searchResults);
  
  useEffect(() => {
    console.log('Funziona')
  })

  return (
    <Row className="col-12 col-md-9" id="mainPage">
      <SearchResults results={results} />
      <AlbumList title="Rock Classics" albums={rockAlbums} />
      <AlbumList title="Pop Culture" albums={popAlbums} />
      <AlbumList title="#HipHop" albums={hiphopAlbums} />
    </Row>
  );
};

export default Home;
