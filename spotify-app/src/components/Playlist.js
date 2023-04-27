// src/components/PlaylistPage.js
import React, { useEffect, useState } from 'react';
import "./Playlist.css";
import PlaylistTrack from "./PlaylistTrack";

const PlaylistPage = ({accessToken, ChooseTrack}) => {

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
            accessToken: accessToken,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setUserPlaylist(
                data.map((playlist, index) => {

                    let smallestPlaylistImage = {url: 'https://via.placeholder.com/150x150/181818/ffffff?text=Spotify'};

                    if(playlist.images[0]) {

                        smallestPlaylistImage = playlist.images.reduce((smallest, image) => {
                            return image.height === Math.min(playlist.images.map(image => image.height))? image : smallest;
                            }, playlist.images[0]
                        )
                    }


                    return {
                        id: playlist.id,
                        name: playlist.name,
                        uri: playlist.uri,
                        image: smallestPlaylistImage.url
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
                                    <img src={currentPlaylist.image} alt="Playlist" />
                                    <h2>{currentPlaylist.name}</h2>
                                </div>
                                <div className="playlist-details-content">
                                    <PlaylistTrack accessToken={accessToken} playlistId={currentPlaylist.id} ChooseTrack={ChooseTrack} ></PlaylistTrack>
                                    {/* <div className="row row-cols-1 row-cols-md-2 g-4">  
                                    {currentPlaylist.map((track, index) => (
                                    <div key={index} className="col">
                                        <TrackCard accessToken={accessToken} Track={track} ChooseTrack={ChooseTrack}></TrackCard>
                                    </div>
                                    ))}
                                    </div> */}
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
