import React from 'react';

const client_id = "ee859872f4354d5093bba8275dd2ace1";
const redirect_uri = "http://localhost:3000";

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
      'user-read-playback-position',
      'user-top-read',
      'user-read-recently-played',
      'user-library-modify',
      'user-library-read',
      'user-read-email',
      'user-read-private'
    ].join(' '),
    redirect_uri: redirect_uri,
    state: 'play-with-me',
    //show_dialog: true
  });
  
const AUTH_URL = `https://accounts.spotify.com/authorize?${clientParams.toString()}`;
  
function Login()
{
    return (
        <div className="container">
            <h1 className='text-center text-white'>Welcome to HCI-Spotify</h1>
            <p className='text-center text-white' style={{fontSize: '20px'}}>supported by <span style={{color: '#1ed760', fontWeight: 'bold', fontStyle: 'italic'}}>Spotify Api</span></p>
            <a className='btn btn-success btn-lg' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}} href={AUTH_URL}>
                Login with Spotify
            </a>

        </div>
    );

}

export default Login;