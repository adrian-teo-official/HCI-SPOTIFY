import React from 'react';

const client_id = "ee859872f4354d5093bba8275dd2ace1";
const redirect_uri = "http://localhost:3000/callback";

const clientParams = new URLSearchParams({
    response_type: 'code',
    client_id: client_id,
    scope: [
      'ugc-image-upload',
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-currently-playing',
      'app-remote-control',
      'streaming',
      'playlist-modify-public',
      'playlist-modify-private',
      'playlist-read-private',
      'playlist-read-collaborative',
      'user-follow-modify',
      'user-follow-read',
      'user-library-modify',
      'user-library-read',
      'user-read-email',
      'user-read-private'
    ].join(' '),
    redirect_uri: redirect_uri,
  });
  
const AUTH_URL = `https://accounts.spotify.com/authorize?${clientParams.toString()}`;
//const AUTH_URL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=ugc-image-upload user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative user-follow-modify user-follow-read user-library-modify user-library-read user-read-email user-read-private&redirect_uri=${redirect_uri}`;

  
function Login()
{
    return (
        <div className="container">
            <a className='btn btn-success btn-lg' href={AUTH_URL}>
                Login with Spotify
            </a>

        </div>
    );

}

export default Login;