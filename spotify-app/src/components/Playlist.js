import React, { useEffect, useState } from 'react';
import "./Playlist.css";
import PlaylistTrack from "./PlaylistTrack";
import { IoPlaySharp } from 'react-icons/io5';


const Playlist = ({accessToken, ChooseTrack}) => {

    const [userPlaylist, setUserPlaylist] = useState([]);
    const [activePlaylist, setActivePlaylist] = useState(0);

    const [disableButton, setDisableButton] = useState(true);

    const [playlistFinishFetch, setPlaylistFinishFetch] = useState(false);


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
                        image: smallestPlaylistImage.url,
                        trackAmount: playlist.tracks.total
                    }
                })

            );

            setPlaylistFinishFetch(true);

        })
    }, [accessToken])


    const onPlaylistClick = (index) => {
        setActivePlaylist(index);
    };

    const currentPlaylist = (userPlaylist)? userPlaylist[activePlaylist] : null;

    useEffect(() => {
        if(!currentPlaylist) return;

        if(currentPlaylist.trackAmount > 0) {
            setDisableButton(false);
        }
        else {
            setDisableButton(true);
        }

    },[currentPlaylist])

    const PlayPlaylist = (e, playlist) => {
        if(disableButton)
        {
            e.preventDefault();
            return;
        }
        else {
            ChooseTrack(playlist);
        }
    }



    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2 playlist-sidebar middle-line" style={{marginBottom: '6rem'}}>
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
                <div className="col-md-10 playlist-details" style={{marginBottom: '6rem'}}>
                    {
                        (playlistFinishFetch && userPlaylist.length > 0 && currentPlaylist) ? (
                            <div>
                                <div className="playlist-details-header">
                                    <div className="header-background top-background"></div>
                                    <div className="header-background bottom-background"></div>
                                    <img src={currentPlaylist.image} alt="Playlist" />
                                    <div className="d-flex align-items-center justify-content-between w-100">
                                        <h2>{currentPlaylist.name}</h2>

                                        <button type="button" className="btn playlist-play-button" onClick={(e) => PlayPlaylist(e, currentPlaylist)} style={{ zIndex: "1" }} disabled = {disableButton}>
                                            <IoPlaySharp/>
                                            <span>Play</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="playlist-details-content">
                                    <PlaylistTrack accessToken={accessToken} playlistId={currentPlaylist.id} ChooseTrack={ChooseTrack} ></PlaylistTrack>
                                </div>
                            </div>
                        ) : ((playlistFinishFetch) ? <div className='mt-5 mb-5'> <h2 className="text text-warning text-center">No Playlist Found !</h2> </div> : <div className='mt-5 mb-5'><h2 className="text text-warning text-center">Loading...</h2></div>)
                    }
                </div>
            </div>
        </div>
    );
};

export default Playlist;
