import { React, useState, useEffect } from "react";
import TrackCard from "./TrackCard";
import ArtistCard from "./ArtistCard";

const Dashboard = ({ accessToken, ChooseTrack}) => {

  const [myTopTracks, setMyTopTracks] = useState([]);
  const [myTopArtists, setMyTopArtists] = useState([]);
  const [myRecentlyPlay, setMyRecentlyPlay] = useState([]);

  const [topTracksAudioFeatures, setTopTrackAudioFeatures] = useState([]);
  const [recentlyPlayAudioFeatures, setRecentlyPlayAudioFeatures] = useState([]);

  const [topTrackFinishFetch, setTopTrackFinishFetch] = useState(false);
  const [recentlyPlayFinishFetch, setRecentlyPlayFinishFetch] = useState(false);
  const [artistFinishFetch, setArtistFinishFetch] = useState(false);

  const [topTrackFeaturesFinishFetch, setTopTrackFeaturesFinishFetch] = useState(false);
  const [recentlyPlayFeaturesFinishFetch, setRecentlyPlayFeaturesFinishFetch] = useState(false);


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

        setTopTrackFinishFetch(true);
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

            let smallestArtistsImage = {url: 'https://via.placeholder.com/164x164/181818/ffffff?text=Artists'};

            if(artists.images[0])
            {
              smallestArtistsImage = artists.images.reduce((smallest, image) => {
                return image.height === Math.min(artists.images.map(image => image.height))? image : smallest;
                }, artists.images[0]
              )

            }

            return {
              id: artists.id,
              name: artists.name,
              genres: artists.genres,
              uri: artists.uri,
              image: smallestArtistsImage.url
            };
          })
        );

        setArtistFinishFetch(true);
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
        setRecentlyPlayFinishFetch(true);
      })
    
  },[accessToken]);

  useEffect(() => {
    if(!recentlyPlayFinishFetch || !topTrackFinishFetch) return;

    fetch("http://localhost:8888/getTracksAudioFeatures", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          accessToken: accessToken,
          trackIds: myRecentlyPlay.map((track) => track.id)
      })
    })
    .then(response => response.json())
    .then(data =>{

        if(data[0])
        {
          setRecentlyPlayAudioFeatures(
            data.map((tracksFeatures) => {
                return {
                    acousticness: tracksFeatures.acousticness,
                    danceability: tracksFeatures.danceability,
                    energy: tracksFeatures.energy,
                    valence: tracksFeatures.valence
                }
            })
          );

        }
      
        setRecentlyPlayFeaturesFinishFetch(true);
    });

    fetch("http://localhost:8888/getTracksAudioFeatures", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          accessToken: accessToken,
          trackIds: myTopTracks.map((track) => track.id)
      })
    })
    .then(response => response.json())
    .then(data =>{
        if(data[0])
        {
          setTopTrackAudioFeatures(
            data.map((tracksFeatures) => {
                return {
                    acousticness: tracksFeatures.acousticness,
                    danceability: tracksFeatures.danceability,
                    energy: tracksFeatures.energy,
                    valence: tracksFeatures.valence
                }
            })
          );

        }
        setTopTrackFeaturesFinishFetch(true);
    });


  },[accessToken, recentlyPlayFinishFetch, topTrackFinishFetch])

  return (

    <div className="container">
      <div className="row mb-3 mt-3">
        <div className="jumbotron jumbotron-fluid text-white mx-auto">
          <h2 className="display-8">Recently Play Tracks</h2>
        </div>
      </div>
      <div className="row">
        {
          (recentlyPlayFinishFetch && recentlyPlayFeaturesFinishFetch)?
            (myRecentlyPlay.length > 0) ?
              myRecentlyPlay.slice(0,12).map((tracks, index)=>{
                return (
                  <TrackCard accessToken={accessToken} key={tracks.uri} Track={tracks} TrackFeatures={recentlyPlayAudioFeatures[index]} ChooseTrack={ChooseTrack}/>
                )
              })
              :
              <div className="d-flex justify-content-center align-items-center" style={{height: '100%', width: '100%'}}>
                    <span className="text-warning mt-4 mb-4" style={{fontFamily: 'Roboto Condensed, sans-serif', fontSize: '28px', fontWeight: '700'}}>No Track Found !</span>
              </div>
          : 
          <div className="d-flex justify-content-center align-items-center" style={{height: '100%', width: '100%'}}>
            <span className="text-warning mt-4 mb-4" style={{fontFamily: 'Roboto Condensed, sans-serif', fontSize: '28px', fontWeight: '700'}}>Loading...</span>
          </div>
        }
      </div>
      <div className="row mb-3">
        <div className="jumbotron jumbotron-fluid text-white mx-auto">
          <h2 className="display-8">Your Top Tracks</h2>
        </div>
      </div>
      <div className="row">
        {
          (topTrackFinishFetch && topTrackFeaturesFinishFetch)? 
            (myTopTracks.length > 0) ? 
            myTopTracks.slice(0,12).map((tracks, index)=>{
              return (
                <TrackCard accessToken={accessToken} key={tracks.uri} Track={tracks} TrackFeatures={topTracksAudioFeatures[index]} ChooseTrack={ChooseTrack}/>
              )
            }) 
            :
            <div className="d-flex justify-content-center align-items-center" style={{height: '100%', width: '100%'}}>
                    <span className="text-warning mt-4 mb-4" style={{fontFamily: 'Roboto Condensed, sans-serif', fontSize: '28px', fontWeight: '700'}}>No Track Found !</span>
            </div>
          :
          <div className="d-flex justify-content-center align-items-center" style={{height: '100%', width: '100%'}}>
                    <span className="text-warning mt-4 mb-4" style={{fontFamily: 'Roboto Condensed, sans-serif', fontSize: '28px', fontWeight: '700'}}>Loading...</span>
          </div>
        }
      </div>
      <div className="row mb-3">
        <div className="jumbotron jumbotron-fluid text-white mx-auto">
          <h2 className="display-8">Your Top Artists</h2>
        </div>
      </div>
      <div className="row">
        {
          (artistFinishFetch)?
            (myTopArtists.length > 0)?
            myTopArtists.slice(0,12).map((artist, index)=>{
              return (
                <ArtistCard Artist={artist} key={index}></ArtistCard>
              )
            }) :
            <div className="d-flex justify-content-center align-items-center" style={{height: '100%', width: '100%'}}>
                    <span className="text-warning mt-4 mb-4" style={{fontFamily: 'Roboto Condensed, sans-serif', fontSize: '28px', fontWeight: '700'}}>No Arists Found !</span>
            </div>
          : 
          <div className="d-flex justify-content-center align-items-center" style={{height: '100%', width: '100%'}}>
                    <span className="text-warning mt-4 mb-4" style={{fontFamily: 'Roboto Condensed, sans-serif', fontSize: '28px', fontWeight: '700'}}>Loading...</span>
          </div>
        }
      </div>
      <div className="row" style={{ marginBottom: '6rem' }}/>
    </div>

  );


};

export default Dashboard;
