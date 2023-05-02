import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import './Artist.css';
import TrackCard from "./TrackCard";

function Artist ({accessToken, ChooseTrack}) {

    const [currentArtistInfo, setCurrentArtistInfo] = useState({});
    const [artistTopTracks, setArtistTopTracks] = useState([]);
    const [artistAlbumsIds, setArtistAlbumsIds] = useState([]);
    const [artistAlbumsTracksIds, setArtistAlbumsTracksIds] = useState([]);
    const [albumsTracks, setAlbumsTracks] = useState([]);

    const [artistTopTracksFeatures, setArtistTopTracksFeatures] = useState([]);
    const [artistAlbumsTrackFeatures, setArtistAlbumsTrackFeatures] = useState([]);

    const [albumsFinishFetch, setAlbumsFinishFetch] = useState(false);
    const [albumsTracksIdsFinishFetch, setAlbumsTracksIdsFinishFetch] = useState(false);
    const [artistTopTrackFinishFetch, setArtistTopTrackFinishFetch] = useState(false);
    const [albumsTracksFinishFetch, setAlbumsTracksFinishFetch] = useState(false);

    const [artistTopTrackFeaturesFinishFetch, setArtistTopTrackFeaturesFinishFetch] = useState(false);
    const [artistAlbumTracksFeaturesFinishFetch, setArtistAlbumTracksFeaturesFinishFetch] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const artistId = searchParams.get('id');

    const handleClick = () => {
        navigate(-1);
    }

    useEffect(() => {

        fetch("http://localhost:8888/getArtist", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                accessToken: accessToken,
                artistId: artistId
            }),
        })
        .then(response => response.json())
        .then(data => {

            let smallestArtistsImage = {url: 'https://via.placeholder.com/164x164/181818/ffffff?text=Artists'};

            if(data.images[0])
            {
              smallestArtistsImage = data.images.reduce((smallest, image) => {
                return image.height === Math.min(data.images.map(image => image.height))? image : smallest;
                }, data.images[0]
              )

            }

            setCurrentArtistInfo({

                id: data.id,
                name: data.name,
                popularity: data.popularity,
                genres: data.genres,
                image: smallestArtistsImage.url,
                followers: data.followers.total

            });
        })

        fetch("http://localhost:8888/getArtistTopTracks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                accessToken: accessToken,
                artistId: artistId
            }),
        })
        .then(response => response.json())
        .then(data => {
            setArtistTopTracks (
                data.tracks.map((track => {

                    const smallestAlbumImage = track.album.images.reduce((smallest, image) => {
                        return image.height === Math.min(track.album.images.map(image => image.height))? image : smallest;
                        }, track.album.images[0]
                    )

                    return {
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri,
                        albumImage: smallestAlbumImage.url
                    }         

                }))
            );
            setArtistTopTrackFinishFetch(true);
        })

        fetch("http://localhost:8888/getAlbums", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                accessToken: accessToken,
                artistId: artistId
            }),
        })
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            setArtistAlbumsIds(
                data.items.map (Album => {
                    return {
                        id: Album.id
                    }
                })

            );
            setAlbumsFinishFetch(true);
            
        })

    },[accessToken]);

    useEffect (() => {
        if(albumsFinishFetch && artistAlbumsIds[0])
        {
            artistAlbumsIds.map(albumId => {
                fetch("http://localhost:8888/getAlbumTrack", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        accessToken: accessToken,
                        albumId: albumId.id
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    setArtistAlbumsTracksIds(
                        data.items.map((trackId) => {
                            return trackId.id;
                        })
                        
                    );
                    setAlbumsTracksIdsFinishFetch(true);
                })
            });

        }

    },[accessToken, albumsFinishFetch]);

    useEffect (() => {

        if(albumsTracksIdsFinishFetch && artistAlbumsTracksIds[0])
        {
            fetch("http://localhost:8888/getTracks", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        accessToken: accessToken,
                        trackIds: artistAlbumsTracksIds
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    setAlbumsTracks(
                        data.tracks.map (track => {

                            const smallestAlbumImage = track.album.images.reduce((smallest, image) => {
                                return image.height === Math.min(track.album.images.map(image => image.height))? image : smallest;
                                }, track.album.images[0]
                            )
        
                            return {
                                id: track.id,
                                name: track.name,
                                artist: track.artists[0].name,
                                album: track.album.name,
                                uri: track.uri,
                                albumImage: smallestAlbumImage.url
                            }   


                        })

                    );
                    setAlbumsTracksFinishFetch(true);
                })

        }



    }, [accessToken, albumsTracksIdsFinishFetch]);

    useEffect(() => {

        if(!accessToken || !albumsTracksFinishFetch || !artistTopTrackFinishFetch) return;
        
        fetch("http://localhost:8888/getTracksAudioFeatures", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                accessToken: accessToken,
                trackIds: artistTopTracks.map((track) => track.id)
            })
        })
        .then(response => response.json())
        .then(data =>{
            setArtistTopTracksFeatures(
                data.map((tracksFeatures) => {
                    return {
                        acousticness: tracksFeatures.acousticness,
                        danceability: tracksFeatures.danceability,
                        energy: tracksFeatures.energy,
                        valence: tracksFeatures.valence
                    }
                })
            );
            setArtistTopTrackFeaturesFinishFetch(true);
        });

        fetch("http://localhost:8888/getTracksAudioFeatures", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                accessToken: accessToken,
                trackIds: albumsTracks.map((track) => track.id)
            })
        })
        .then(response => response.json())
        .then(data =>{
            setArtistAlbumsTrackFeatures(
                data.map((tracksFeatures) => {
                    return {
                        acousticness: tracksFeatures.acousticness,
                        danceability: tracksFeatures.danceability,
                        energy: tracksFeatures.energy,
                        valence: tracksFeatures.valence
                    }
                })
            );
            setArtistAlbumTracksFeaturesFinishFetch(true);
        });



    }, [accessToken, albumsTracksFinishFetch, artistTopTrackFinishFetch])

    return (
        <div>
            <div className="artistProfile artistProfileGradient">
                <div className="row mb-2">
                    <div className="header mt-2">
                        <button className="backButton mt-2" onClick={handleClick}>
                            <IoIosArrowBack/>
                        </button>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row mb-3 artistProfileInfo">
                        <div className="col-xs-12 col-md-2 artistProfileImage">
                            <img src={currentArtistInfo.image} alt="Profile" className="img-fluid" />
                        </div>
                        <div className="col-xs-12 col-md-8 artistProfileDetails">
                            <h2>{currentArtistInfo.name}</h2>
                            <p>Popularity: {currentArtistInfo.popularity}</p>
                            <p>Followers: {currentArtistInfo.followers}</p>
                            <p>Genres: {(currentArtistInfo.genres) ? currentArtistInfo.genres.join(',') :'0'}</p>
                        </div>
                    </div>
                    <h3 className="mb-4">Top Tracks</h3>
                    <div className="row row-cols-1 row-cols-md-5">
                        {
                            (artistTopTrackFinishFetch && artistTopTrackFeaturesFinishFetch) ?
                            
                            artistTopTracks.map((track, index) => (
                            <TrackCard accessToken={accessToken} key={track.uri} Track={track} TrackFeatures={artistTopTracksFeatures[index]} ChooseTrack={ChooseTrack}></TrackCard>
                            )) : 
                            <div className="d-flex justify-content-center align-items-center" style={{height: '100%', width: '100%'}}>
                                <span className="mt-4 mb-5" style={{fontFamily: 'Roboto Condensed, sans-serif', fontSize: '28px', fontWeight: '700', color: "#1ed760"}}>Loading...</span>
                            </div>
                        }
                    </div>
                    <h3 className="mb-4">Albums Tracks</h3>
                    <div className="row row-cols-1 row-cols-md-5">
                        {
                            (albumsTracks.length > 0 && artistAlbumTracksFeaturesFinishFetch) ? 
                            albumsTracks.map((track, index) => (
                            <TrackCard accessToken={accessToken} key={track.uri} Track={track} TrackFeatures={artistAlbumsTrackFeatures[index]} ChooseTrack={ChooseTrack}></TrackCard>
                            )) :
                            <div className="d-flex justify-content-center align-items-center" style={{height: '100%', width: '100%'}}>
                                <span className="mt-4 mb-5" style={{fontFamily: 'Roboto Condensed, sans-serif', fontSize: '28px', fontWeight: '700', color: "#1ed760"}}>Loading...</span>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className="row" style={{ marginBottom: '7rem'}}/>
        </div>
    )


}


export default Artist;