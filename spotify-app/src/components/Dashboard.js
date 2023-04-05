import { React, useState, useEffect } from "react";

const Dashboard = ({ accessToken }) => {

  const [myTopTracks, setMyTopTracks] = useState([]);
  const [myTopArtists, setMyTopArtists] = useState([]);
  const [myRecentlyPlay, setMyRecentlyPlay] = useState([]);
  const [finishFetch, setFinishFetch] = useState(false);

  useEffect(() => {

    try {
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
              return {
                id: tracks.id,
                name: tracks.name,
                artist: tracks.artists[0].name,
                album: tracks.album.name,
                uri: tracks.uri
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
              return {
                id: artists.id,
                name: artists.name,
                genres: artists.genres,
                uri: artists.uri
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

            console.log(played);

            const smallestAlbumImage = played.track.album.images.reduce(
              (smallest, image) => {
                if (image.height < smallest.height) return image
                return smallest
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
    } catch (error) {
      console.error(error);
    }
    
  },[accessToken]);

  return (

    <div className="container">
      <div className="row mb-3">
        <div className="jumbotron jumbotron-fluid border border-success mx-auto">
          <h2 className="display-8">Recently Play Tracks</h2>
        </div>
      </div>
      <div className="row mb-3">
        {
          (finishFetch)? myRecentlyPlay.slice(0,4).map((tracks)=>{
            return (
              <div className="col-sm-3">
                <div className="card">
                  <img src = {`${tracks.albumImage}`} className="card-img-top" alt="Card image cap" />
                  <div className="card-body">
                    <h5 className="card-title">{`${tracks.name}`}</h5>
                    <p className="card-text">{`Artists: ${tracks.artist}`}</p>
                    <p className="card-text">{`Album: ${tracks.album}`}</p>
                  </div>
                </div>
              </div>
            )
          }) : <h5 className="text text-info text-center">Loading....</h5>
        }
      </div>
    </div>

  );


};

export default Dashboard;
