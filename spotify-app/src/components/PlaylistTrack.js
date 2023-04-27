import React, { useEffect } from 'react';
import TrackCard from './TrackCard';

function PlaylistTrack({accessToken, playlistId, ChooseTrack}) {

    useEffect (() => {

        if(!accessToken) return;
        console.log(playlistId);

        fetch("http://localhost:8888/getPlaylist", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                accessToken: accessToken,
                playlistId: playlistId,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.log(error);
        })

    },[accessToken, playlistId])

    return (
        <div className="row row-cols-1 row-cols-md-2 g-4">  
            {/* {currentPlaylist.map((track, index) => (
            <div key={index} className="col">
                <TrackCard accessToken={accessToken} Track={track} ChooseTrack={ChooseTrack}></TrackCard>
            </div>
            ))} */}
        </div>
    )
}

export default PlaylistTrack;
