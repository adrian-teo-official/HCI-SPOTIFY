import React from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';


function Player({accessToken, trackUri}) {

  if(!accessToken) {return null};
  console.log(trackUri);
  return (
    <SpotifyPlayer
    token = {accessToken}
    showSaveIcon = {true}
    uris = {trackUri? [trackUri] : []}


    ></SpotifyPlayer>
  );
}

export default Player;
