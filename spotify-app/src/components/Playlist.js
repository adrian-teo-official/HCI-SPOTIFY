// src/components/PlaylistPage.js
import React, { useEffect, useState } from 'react';
import "./Playlist.css";
import TrackCard from './TrackCard';

const PlaylistPage = ({accessToken, ChooseTrack}) => {
  // Replace the array with your actual playlist data
    // const playlists = [
    // {
    //     name: 'Playlist 1',
    //     songs: [
    //     {
    //         title: 'Song 1',
    //         artist: 'Artist 1',
    //         album: 'Album 1',
    //     },
    //     {
    //         title: 'Song 2',
    //         artist: 'Artist 2',
    //         album: 'Album 2',
    //     },
    //     ],
    // },
    // {
    //     name: 'Playlist 2',
    //     songs: [
    //     {
    //         title: 'Song 3',
    //         artist: 'Artist 3',
    //         album: 'Album 3',
    //     },
    //     ],
    // },
    // ];

    const [userPlaylist, setUserPlaylist] = useState([]);
    const [activePlaylist, setActivePlaylist] = useState(0);

    useEffect(() => {

        if (!accessToken) return;

        fetch("http://localhost:8888/getMyPlaylist", {
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
        setUserPlaylist(
            data.map((playlist) => {

                // const smallestPlaylistImage = playlist.images.reduce((smallest, image) => {
                //     return image.height === Math.min(playlist.images.map(image => image.height))? image : smallest;
                //     }, playlist.images[0]
                // )


                return {
                    id: playlist.id,
                    name: playlist.name,
                    uri: playlist.uri,
                    image: playlist.images[0].url
                }
            })

        );
      })

    }, [accessToken])

    const onPlaylistClick = (index) => {
        setActivePlaylist(index);
    };

    const currentPlaylist = (userPlaylist)? userPlaylist[activePlaylist] : null;

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2 playlist-sidebar middle-line">
                <ul className="list-group">
                    {userPlaylist.map((playlist, index) => (
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
                    {
                        (currentPlaylist) ? (
                            <div>
                                <div className="playlist-details-header">
                                    <div className="header-background top-background"></div>
                                    <div className="header-background bottom-background"></div>
                                    <img src={currentPlaylist.smallestPlaylistImage} alt="Playlist" />
                                    <h2>{currentPlaylist.name}</h2>
                                </div>
                                <div className="playlist-details-content">
                                    <div className="row row-cols-1 row-cols-md-2 g-4">  
                                    {/* {currentPlaylist.map((track, index) => (
                                    <div key={index} className="col">
                                        <TrackCard accessToken={accessToken} Track={track} ChooseTrack={ChooseTrack}></TrackCard>
                                    </div>
                                    ))} */}
                                    </div>
                                </div>
                            </div>
                        ) : (<div></div>)
                    }
                </div>
            </div>
        </div>
    );
};

export default PlaylistPage;
