// src/components/PlaylistPage.js
import React, { useState } from 'react';
import "./Playlist.css";

const PlaylistPage = () => {
  // Replace the array with your actual playlist data
    const playlists = [
    {
        name: 'Playlist 1',
        songs: [
        {
            title: 'Song 1',
            artist: 'Artist 1',
            album: 'Album 1',
        },
        {
            title: 'Song 2',
            artist: 'Artist 2',
            album: 'Album 2',
        },
        ],
    },
    {
        name: 'Playlist 2',
        songs: [
        {
            title: 'Song 3',
            artist: 'Artist 3',
            album: 'Album 3',
        },
        ],
    },
    ];

    const [activePlaylist, setActivePlaylist] = useState(0);

    const onPlaylistClick = (index) => {
    setActivePlaylist(index);
    };

    const currentPlaylist = playlists[activePlaylist];

 // src/components/PlaylistPage.js
// ...
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2 playlist-sidebar middle-line">
                <ul className="list-group">
                    {playlists.map((playlist, index) => (
                    <li
                        key={index}
                        className={`list-group-item list-group-item-action text-white bg-dark${
                        activePlaylist === index ? ' active' : ''
                        }`}
                        onClick={() => onPlaylistClick(index)}
                    >
                        {playlist.name}
                    </li>
                    ))}
                </ul>
                </div>
                <div className="col-md-10 playlist-details">
                    <div className="playlist-details-header">
                        <div className="header-background top-background"></div>
                        <div className="header-background bottom-background"></div>
                        <img src="https://via.placeholder.com/150" alt="Playlist" />
                        <h2>{currentPlaylist.name}</h2>
                    </div>
                    <div className="playlist-details-content">
                        <div className="row row-cols-1 row-cols-md-2 g-4">  
                            {currentPlaylist.songs.map((song, index) => (
                            <div key={index} className="col">
                                <div className="card h-100 text-white bg-dark">
                                <div className="card-body" style={{ position: 'relative' }}>
                                    <h5 className="card-title">{song.title}</h5>
                                    <p className="card-text">{song.artist}</p>
                                    <p className="card-text">{song.album}</p>
                                </div>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaylistPage;
