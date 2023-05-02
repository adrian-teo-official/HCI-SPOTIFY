import React, { useEffect, useState } from 'react';
import TrackCard from './TrackCard';

function PlaylistTrack({accessToken, playlistId, ChooseTrack}) {

    const [isLoading, setIsLoading] = useState(true);
    const [playlistTracks, setPlaylistTracks] = useState([]);
    const [playlistTracksFeatures, setPlaylistTracksFeatures] = useState([]);

    const [playlistTracksFinishFetch, setPlaylistTracksFinishFetch] = useState(false);
    const [playlistTracksFeaturesFinishFetch, setPlaylistTracksFeaturesFinishFetch] = useState(false);

    useEffect (() => {

        if(!accessToken || !playlistId) return;

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

                        let smallestAlbumImage = {url: 'https://via.placeholder.com/150x150/181818/ffffff?text=Spotify'};

                        if(playlistTracks.track.album.images[0])
                        {
                            smallestAlbumImage = playlistTracks.track.album.images.reduce((smallest, image) => {
                                return image.height === Math.min(playlistTracks.track.album.images.map(image => image.height))? image : smallest;
                                }, playlistTracks.track.album.images[0]
                            );

                        }
              
                        return {
                            id: playlistTracks.track.id,
                            name: playlistTracks.track.name,
                            artist: playlistTracks.track.artists[0].name,
                            album: playlistTracks.track.album.name,
                            uri: playlistTracks.track.uri,
                            albumImage: (smallestAlbumImage.url) ? smallestAlbumImage.url : null
                        };

                    })

                );
            } 
            else 
            { 
                setPlaylistTracks ([]) 
            }
            setIsLoading(false);
            setPlaylistTracksFinishFetch(true);
        })
        .catch(error => {
            console.log(error);
        })

    },[accessToken, playlistId])

    useEffect(() => {

        if(!accessToken || ! playlistTracksFinishFetch) return;

        fetch("http://localhost:8888/getTracksAudioFeatures", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                accessToken: accessToken,
                trackIds: playlistTracks.map((track) => track.id)
            })
        })
        .then(response => response.json())
        .then(data =>{
            setPlaylistTracksFeatures(
                data.map((tracksFeatures) => {
                    return {
                        acousticness: tracksFeatures.acousticness,
                        danceability: tracksFeatures.danceability,
                        energy: tracksFeatures.energy,
                        valence: tracksFeatures.valence
                    }
                })
            );
            setPlaylistTracksFeaturesFinishFetch(true);
        });


    },[accessToken, playlistTracksFinishFetch])

    return (
        <div className="row row-cols-1 row-cols-md-5 g-4">  
           {
                (isLoading) ? 
                <div className="d-flex justify-content-center align-items-center" style={{height: '100%', width: '100%'}}>
                    <span className="text-warning mt-4" style={{fontFamily: 'Roboto Condensed, sans-serif', fontSize: '28px', fontWeight: '700'}}>Loading...</span>
                </div> :
                (playlistTracksFeaturesFinishFetch) ?
                    (playlistTracks.length > 0) ?
                    playlistTracks.slice(0,20).map((track, index) => {
                        return <TrackCard accessToken={accessToken} key={track.uri} Track={track} TrackFeatures={playlistTracksFeatures[index]} ChooseTrack={ChooseTrack}></TrackCard>
                    }) :
                    <div className="d-flex justify-content-center align-items-center" style={{height: '100%', width: '100%'}}>
                        <span className="text-warning mt-4" style={{fontFamily: 'Roboto Condensed, sans-serif', fontSize: '28px', fontWeight: '700'}}>No Track Found !</span>
                    </div>
                : 
                <div className="d-flex justify-content-center align-items-center" style={{height: '100%', width: '100%'}}>
                    <span className="text-warning mt-4" style={{fontFamily: 'Roboto Condensed, sans-serif', fontSize: '28px', fontWeight: '700'}}>Almost There....</span>
                </div>
           }
        </div>
    )
}

export default PlaylistTrack;
