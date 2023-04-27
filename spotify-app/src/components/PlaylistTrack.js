import React, { useEffect, useState } from 'react';
import TrackCard from './TrackCard';

function PlaylistTrack({accessToken, playlistId, ChooseTrack}) {

    const [isLoading, setIsLoading] = useState(true);
    const [playlistTracks, setPlaylistTracks] = useState([]);

    useEffect (() => {

        if(!accessToken) return;
        console.log(playlistId);

        setIsLoading(true);

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
            if(data.items[0]) {
                setPlaylistTracks (
                    data.items.map(playlistTracks => {

                        const smallestAlbumImage = playlistTracks.track.album.images.reduce((smallest, image) => {
                            return image.height === Math.min(playlistTracks.track.album.images.map(image => image.height))? image : smallest;
                            }, playlistTracks.track.album.images[0]
                        )
              
                        return {
                            id: playlistTracks.track.id,
                            name: playlistTracks.track.name,
                            artist: playlistTracks.track.artists[0].name,
                            album: playlistTracks.track.album.name,
                            uri: playlistTracks.track.uri,
                            albumImage: smallestAlbumImage.url
                        };

                    })

                );
            } 
            else 
            { 
                setPlaylistTracks ([]) 
            }
            setIsLoading(false);
        })
        .catch(error => {
            console.log(error);
        })

    },[accessToken, playlistId])

    return (
        <div className="row row-cols-1 row-cols-md-5 g-4">  
           {
                (isLoading) ? 
                <div className="d-flex justify-content-center align-items-center" style={{height: '100%', width: '100%'}}>
                    <span className="text-warning mt-4" style={{fontFamily: 'Roboto Condensed, sans-serif', fontSize: '28px', fontWeight: '700'}}>Loading...</span>
                </div> :
                (playlistTracks[0]) ?
                playlistTracks.map((track) => {
                    return <TrackCard accessToken={accessToken} Track={track} ChooseTrack={ChooseTrack}></TrackCard>
                }) :
                <div className="d-flex justify-content-center align-items-center" style={{height: '100%', width: '100%'}}>
                    <span className="text-warning mt-4" style={{fontFamily: 'Roboto Condensed, sans-serif', fontSize: '28px', fontWeight: '700'}}>No Track Found !</span>
                </div>
           }
        </div>
    )
}

export default PlaylistTrack;
