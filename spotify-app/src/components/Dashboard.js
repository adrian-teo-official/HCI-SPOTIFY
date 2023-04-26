import { React, useState, useEffect } from "react";
import TrackCard from "./TrackCard";

const Dashboard = ({ accessToken, ChooseTrack}) => {

  const [myTopTracks, setMyTopTracks] = useState([]);
  const [myTopArtists, setMyTopArtists] = useState([]);
  const [myRecentlyPlay, setMyRecentlyPlay] = useState([]);
  const [finishFetch, setFinishFetch] = useState(false);

  useEffect(() => {

    if(!accessToken) return;

    fetch("http://localhost:8888/getMyTopTracks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken: accessToken
        }),
      })
      .then(response => response.json())
      .then(data => {
        setMyTopTracks(
          data.map((tracks) => {

            const smallestAlbumImage = tracks.album.images.reduce((smallest, image) => {
              return image.height === Math.min(tracks.album.images.map(image => image.height))? image : smallest;
              }, tracks.album.images[0]
            )

            return {
              id: tracks.id,
              name: tracks.name,
              artist: tracks.artists[0].name,
              album: tracks.album.name,
              uri: tracks.uri,
              albumImage: smallestAlbumImage.url
            };
          })
        );
      })

    fetch("http://localhost:8888/getMyTopArtists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken: accessToken
        }),
      })
      .then(response => response.json())
      .then(data => {
        setMyTopArtists(
          data.map((artists) => {  

            const smallestArtistsImage = artists.images.reduce((smallest, image) => {
              return image.height === Math.min(artists.images.map(image => image.height))? image : smallest;
              }, artists.images[0]
            )

            return {
              id: artists.id,
              name: artists.name,
              genres: artists.genres,
              uri: artists.uri,
              image: smallestArtistsImage.url
            };
          })
        );
      })

    fetch("http://localhost:8888/getMyRecentlyPlay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken: accessToken
      }),
    })
    .then(response => response.json())
    .then(data =>{
      setMyRecentlyPlay(
        data.map((played) => {

          const smallestAlbumImage = played.track.album.images.reduce((smallest, image) => {
              return image.height === Math.min(played.track.album.images.map(image => image.height))? image : smallest;
            }, played.track.album.images[0]
          )

          return {
            id: played.track.id,
            name: played.track.name,
            artist: played.track.artists[0].name,
            album: played.track.album.name,
            uri: played.track.uri,
            albumImage: smallestAlbumImage.url
          };
        })
      );

      setFinishFetch(true);
    })
    
  },[accessToken]);

  return (

    <div className="container">
      <div className="row mb-3 mt-3">
        <div className="jumbotron jumbotron-fluid text-white mx-auto">
          <h2 className="display-8">Recently Play Tracks</h2>
        </div>
      </div>
      <div className="row">
        {
          (finishFetch)? myRecentlyPlay.slice(0,6).map((tracks, index)=>{
            return (
              <TrackCard accessToken={accessToken} Track={tracks} ChooseTrack={ChooseTrack}/>
            )
          }) : <h5 className="text text-info text-center">Loading....</h5>
        }
      </div>
      <div className="row mb-3">
        <div className="jumbotron jumbotron-fluid text-white mx-auto">
          <h2 className="display-8">Your Top Tracks</h2>
        </div>
      </div>
      <div className="row">
        {
          (finishFetch)? myTopTracks.slice(0,6).map((tracks, index)=>{
            return (
              <TrackCard accessToken={accessToken} Track={tracks} ChooseTrack={ChooseTrack}/>
            )
          }) : <h5 className="text text-info text-center">Loading....</h5>
        }
      </div>
      <div className="row mb-3">
        <div className="jumbotron jumbotron-fluid text-white mx-auto">
          <h2 className="display-8">Your Top Artists</h2>
        </div>
      </div>
      <div className="row">
        {
          (finishFetch)? myTopArtists.slice(0,6).map((artists, index)=>{
            return (
              <div className="col-2 card-container" key={index} style={{ cursor: "pointer" }}>
                <div className="card bg-dark">
                  <img src = {`${artists.image}`} className="card-img-top" alt="Card image cap" />
                  <div className="card-body text-white">
                    <h6 className="card-title text-truncate">{`${artists.name}`}</h6>
                    <p className="card-text text-truncate small-p">{`Genres: ${artists.genres}`}</p>
                  </div>
                </div>
              </div>
            )
          }) : <h5 className="text text-info text-center">Loading....</h5>
        }
      </div>
      <div className="row" style={{ marginBottom: '7rem' }}/>
    </div>

  );


};

export default Dashboard;
