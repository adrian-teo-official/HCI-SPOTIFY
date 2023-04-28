import { useState, useEffect, useRef } from "react";
import Chart from 'chart.js/auto';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import TrackCard from "./TrackCard";
import "./ListeningHabit.css";

const ListeningHabit = ({accessToken, ChooseTrack}) =>{

    const [topTrackIds, setTopTrackIds] = useState([]);
    const [recentlyPlayIds, setRecentlyPlayIds] = useState([]);
    const [topArtists, setTopArtists] = useState([]);
    const [recentlyArtistsIds, setRecentlyArtistsIds] = useState([]);
    const [recentlyArtists, setRecentlyArtists] = useState([]);
    const [recommendationsTracks, setRecommendationsTracks] = useState([]);

    const [topGenres, setTopGenres] = useState({});
    const [mappingGenres, setMappingGenres] = useState(false);

    const [topTracksAudioFeatures, setTopTracksAudioFeatures] = useState([]);
    const [recentlyPlayAudioFeatures, setRecentlyPlayAudioFeatures] = useState([]);

    const [currentAvgTopTracksFeatures, setCurrentAvgTopTracksFeatures] = useState({});
    const [currentAvgRecentlyPlayedFeatures, setCurrentAvgRecentlyPlayedFeatures] = useState({});
    const [currentAvgCombinationTrackFeatures, setCurrentAvgCombinationTrackFeatures] = useState({});

    const [topTracksFinishFetch, setTopTracksFinishFetch] = useState(false);
    const [recentlyPlayedFinishFetch, setRecentlyPlayedFinishFetch] = useState(false);
    const [recentlyPlayFeaturesFinishFetch, setRecentlyPlayFeaturesFinishFetch] = useState(false);
    const [topTracksFeaturesFinishFetch, setTopTracksFeaturesFinishFetch] = useState(false);
    const [topArtistsFinishFetch, setTopArtistsFinishFetch] = useState(false);
    const [mappingRecentlyArtists, setMappingRecentlyArtists] = useState(false);
    const [recomandationFinishFetch, setRecomandationFinishFetch] = useState(false);

    const [artistsShowMore, setArtistsShowMore] = useState(false);
    const [trackShowMore, setTrackShowMore] = useState(false);

    const [expandedDecade, setExpandedDecade] = useState(null);

    // Get Top Track, Recently Play, Top Artists
    useEffect (() => {

        fetch("http://localhost:8888/getMyTopTracks", {
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
            setTopTrackIds(
                data.map((tracks) => {

                    const smallestAlbumImage = tracks.album.images.reduce((smallest, image) => {
                        return image.height === Math.min(tracks.album.images.map(image => image.height))? image : smallest;
                        }, tracks.album.images[0]
                    )
                    
                    return {
                        id: tracks.id,
                        name: tracks.name,
                        albumImage: smallestAlbumImage.url,
                        releaseDate: tracks.album.release_date
                    }
                })
            );
            setTopTracksFinishFetch (true);
        })

        fetch("http://localhost:8888/getMyRecentlyPlay", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                accessToken: accessToken
            }),
        })
        .then(response => response.json())
        .then(data =>{
            setRecentlyPlayIds(
                
                data.map((played) => {
                    const smallestAlbumImage = played.track.album.images.reduce((smallest, image) => {
                        return image.height === Math.min(played.track.album.images.map(image => image.height))? image : smallest;
                      }, played.track.album.images[0]
                    )

                    return {
                        id: played.track.id,
                        name: played.track.name,
                        artist: played.track.artists[0].id,
                        album: played.track.album.name,
                        albumImage: smallestAlbumImage.url,
                        releaseDate: played.track.album.release_date
                    }
                })
            );

            setRecentlyPlayedFinishFetch(true);
        });

        fetch("http://localhost:8888/getMyTopArtists", {
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
            setTopArtists(
                data.map((artists) => {  

                    const smallestArtistsImage = artists.images.reduce((smallest, image) => {
                    return image.height === Math.min(artists.images.map(image => image.height))? image : smallest;
                    }, artists.images[0]
                    )

                    return {
                        id: artists.id,
                        name: artists.name,
                        genres: artists.genres,
                        uri: artists.uri,
                        image: smallestArtistsImage.url
                    };
                })
            );

            setTopArtistsFinishFetch(true);
        })

    },[accessToken])

    //Getting genres from top artists
    useEffect (() => {
        const genres = {};
        if(topArtistsFinishFetch)
        {
            topArtists.forEach(artists => {
                console.log(artists);
                artists.genres.forEach(genre => {
                    if(genres[genre]){
                        genres[genre] += 1;
                    }
                    else {
                        genres[genre] = 1;
                    }
                    
                });
            
            });
        }
        setTopGenres(genres);
        setMappingGenres(true);


    },[topArtistsFinishFetch])

    // Get Track Audio Features for top track, recently play track, mapping recently play artists
    useEffect(() =>{

        if(recentlyPlayedFinishFetch && topTracksFinishFetch)
        {
            fetch("http://localhost:8888/getTracksAudioFeatures", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    accessToken: accessToken,
                    trackIds: topTrackIds.map((track) => track.id)
                }),
            })
            .then(response => response.json())
            .then(data =>{
                setTopTracksAudioFeatures(
                    data.map((topTrackFeatures) => {
                        return {
                            acousticness: topTrackFeatures.acousticness,
                            danceability: topTrackFeatures.danceability,
                            energy: topTrackFeatures.energy,
                            valence: topTrackFeatures.valence
                        }
                    })
                );
                setTopTracksFeaturesFinishFetch(true);
            });
    
            fetch("http://localhost:8888/getTracksAudioFeatures", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    accessToken: accessToken,
                    trackIds: recentlyPlayIds.map((track) => track.id)
                })
            })
            .then(response => response.json())
            .then(data =>{
                setRecentlyPlayAudioFeatures(
                    data.map((recentlyPlayFeatures) => {
                        return {
                            acousticness: recentlyPlayFeatures.acousticness,
                            danceability: recentlyPlayFeatures.danceability,
                            energy: recentlyPlayFeatures.energy,
                            valence: recentlyPlayFeatures.valence
                        }
                    })
                );
    
                setRecentlyPlayFeaturesFinishFetch(true);
            });

    
            recentlyPlayIds.map((track) => {
                if(!recentlyArtistsIds.includes(track.artist))
                {
                    recentlyArtistsIds.push(track.artist);
                }
            })
            setMappingRecentlyArtists(true);  

        } 
    },[accessToken, topTrackIds, recentlyPlayIds, topTracksFinishFetch, recentlyPlayedFinishFetch])

    // Recently play artists detail
    useEffect(() =>{

        if(recentlyArtistsIds.length > 0 && mappingRecentlyArtists)
        {
            fetch("http://localhost:8888/getRecentlyArtists", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    accessToken: accessToken,
                    recentlyArtistsIds: recentlyArtistsIds
                })
            })
            .then(response => response.json())
            .then(data =>{

                setRecentlyArtists(
                    data.map((artists) =>{

                        const smallestArtistsImage = artists.images.reduce((smallest, image) => {
                            return image.height === Math.min(artists.images.map(image => image.height))? image : smallest;
                            }, artists.images[0]
                        )
              
                        return {
                            id: artists.id,
                            name: artists.name,
                            uri: artists.uri,
                            image: smallestArtistsImage.url
                        };

                    })

                );
                
            });

        }

    }, [accessToken, recentlyArtistsIds, mappingRecentlyArtists])

    // calculating avg of the audio features
    const calculateAudioFeaturePreferences = (tracks) => {
        const totalTracks = tracks.length;
        let featureSums = {
            acousticness: 0,
            danceability: 0,
            energy: 0,
            valence: 0
        };
      
        tracks.forEach((track) => {
            featureSums.acousticness += track.acousticness;
            featureSums.danceability += track.danceability;
            featureSums.energy += track.energy;
            featureSums.valence += track.valence;
        });
      
        return {
            acousticness: featureSums.acousticness / totalTracks,
            danceability: featureSums.danceability / totalTracks,
            energy: featureSums.energy / totalTracks,
            valence: featureSums.valence / totalTracks
        };
    };

    // Calculating the combination of audio features recently play and top tracks
    const combineAudioFeaturePreferences = ( topTracksFeaturesPrefs, recentlyPlayedFeaturesPrefs, topTracksFeaturesWeight, recentlyPlayedFeaturesWeight) => {

        const totalWeight = topTracksFeaturesWeight + recentlyPlayedFeaturesWeight;
      
        return {

            acousticness:
                (topTracksFeaturesPrefs.acousticness * topTracksFeaturesWeight + recentlyPlayedFeaturesPrefs.acousticness * recentlyPlayedFeaturesWeight) / totalWeight,
            danceability:
                (topTracksFeaturesPrefs.danceability * topTracksFeaturesWeight + recentlyPlayedFeaturesPrefs.danceability * recentlyPlayedFeaturesWeight) / totalWeight,
            energy:
                (topTracksFeaturesPrefs.energy * topTracksFeaturesWeight + recentlyPlayedFeaturesPrefs.energy * recentlyPlayedFeaturesWeight) / totalWeight,
            valence:
                (topTracksFeaturesPrefs.valence *  topTracksFeaturesWeight + recentlyPlayedFeaturesPrefs.valence * recentlyPlayedFeaturesWeight) / totalWeight
        };
    };

    // Calculate audio features trigger...
    useEffect(() =>{

        if(recentlyPlayFeaturesFinishFetch && topTracksFeaturesFinishFetch)
        {
            setCurrentAvgTopTracksFeatures(calculateAudioFeaturePreferences(topTracksAudioFeatures));
            setCurrentAvgRecentlyPlayedFeatures(calculateAudioFeaturePreferences(recentlyPlayAudioFeatures));

            const topTracksFeaturesWeight = 0.4;
            const recentlyPlayedFeaturesWeight = 0.6;

            setCurrentAvgCombinationTrackFeatures(combineAudioFeaturePreferences(currentAvgTopTracksFeatures, currentAvgRecentlyPlayedFeatures, topTracksFeaturesWeight, recentlyPlayedFeaturesWeight));
        }

    },[recentlyPlayFeaturesFinishFetch, topTracksFeaturesFinishFetch, topTracksAudioFeatures, recentlyPlayAudioFeatures])

    // bar chart of the audio features
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            const chart = new Chart(chartRef.current, {
                type: 'bar',
                data: {
                    labels: Object.keys(currentAvgRecentlyPlayedFeatures).map((label) => label.charAt(0).toUpperCase() + label.slice(1) ),
                    datasets: [
                        {
                            label: 'Audio Features',
                            data: Object.values(currentAvgRecentlyPlayedFeatures),
                            backgroundColor: [
                                'rgba(29, 185, 84, 0.8)',
                                'rgba(29, 185, 84, 0.8)',
                                'rgba(29, 185, 84, 0.8)',
                                'rgba(29, 185, 84, 0.8)',
                            ],
                            borderColor: [
                                'rgba(29, 185, 84, 1)',
                                'rgba(29, 185, 84, 1)',
                                'rgba(29, 185, 84, 1)',
                                'rgba(29, 185, 84, 1)',
                            ],
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true, // Enable automatic resizing of the chart based on the container size
                    maintainAspectRatio: false, // Allow the chart to resize independently of its original aspect ratio
                    plugins: {
                        title: {
                            display: true, // Display the title
                            text: 'Current Average Music Taste', // The text of the title
                            position: 'top', // Position of the title
                            align: 'start', // Alignment of the title
                            color: 'rgba(255, 255, 255, 1)', // Color of the title text
                            font: {
                                size: 20, // Font size of the title
                            },
                            padding: {
                                bottom: 10, // Add some padding to the bottom of the title to separate it from the chart
                            },
                        },
                        legend: {
                            labels: {
                                color: 'rgba(255, 255, 255, 0.8)',
                            },
                        },
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.8)',
                                font: {
                                    size: '15',
                                },
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)',
                            },
                            barPercentage: 0.2,
                            categoryPercentage: 0.8, // Adjust the category width (0.8 = 80% of the available space)
                            //barThickness: 15, // Set the bar width to 15 pixels (overrides barPercentage and categoryPercentage)
                        },
                        y: {
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.8)',
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)',
                            },
                    
                        },
                    },
                },
            });
                
            return () => {
                chart.destroy();
            };
        }
      }, [currentAvgCombinationTrackFeatures, currentAvgRecentlyPlayedFeatures, currentAvgTopTracksFeatures]);

    // Decade listening pie
    const pieRef = useRef(null);

    // Process trackData to calculate track counts per year
    const releaseYearCountsDecade = (topTrackIds)? topTrackIds.reduce((acc, track) => {
        const releaseYear = new Date(track.releaseDate).getFullYear();
        const decadeStart = Math.floor(releaseYear / 10) * 10; // Calculate the starting year of the decade

        acc[decadeStart] = (acc[decadeStart] || 0) + 1;
        return acc;
    }, []) : null;

    useEffect(() => {

        const chart = new Chart(pieRef.current, {
            type: 'pie',
            data: {
                labels: Object.keys(releaseYearCountsDecade).map((decadeStart) => `${decadeStart}s`), // Append 's' to the decade starting year
                datasets: [
                {
                    data: Object.values(releaseYearCountsDecade),
                    backgroundColor: [
                        'rgba(29, 185, 84, 0.8)', // Spotify green
                        'rgba(255, 99, 132, 0.8)', // Reddish pink
                        'rgba(54, 162, 235, 0.8)', // Sky blue
                        'rgba(255, 206, 86, 0.8)', // Gold
                        // Add more colors if needed
                    ],
                },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true, // Display the title
                        text: 'Listening Tracks By the Decades', // The text of the title
                        position: 'top', // Position of the title
                        align: 'start', // Alignment of the title
                        color: 'rgba(255, 255, 255, 1)', // Color of the title text
                        font: {
                            size: 20, // Font size of the title
                        },
                        padding: {
                            top: 5,
                            bottom: 20, // Add some padding to the bottom of the title to separate it from the chart
                        },
                    },
                    legend: {
                        display: true,
                        position: 'right',
                        labels: {
                            color: 'rgba(255, 255, 255, 0.8)', // Light text for dark mode
                            padding: 20,
                            
                        },
                    },
                },
                layout: {
                    padding: {
                      left: 0, // Remove left padding to move the pie to the left
                    },
                }
            },
        });

        return () => {
            chart.destroy();
        };

    }, [topTrackIds]);

    // Generating the song of decade
    const generateSongsByDecade = (decade, tracks) => {
        // Replace this with the actual logic to filter the songs based on the decade
        const songs = tracks.filter((song) => {
            const releaseYear = new Date(song.releaseDate).getFullYear();

            return releaseYear >= parseInt(decade) && releaseYear <= parseInt(decade) + 9;
        });
    
        return songs;
    }

    //Reccomandation
    useEffect(() =>{

        if(topTracksFinishFetch && topArtistsFinishFetch 
            && recentlyPlayedFinishFetch && mappingRecentlyArtists 
            && topTracksFeaturesFinishFetch && recentlyPlayFeaturesFinishFetch && mappingGenres)
        {
            fetch("http://localhost:8888/getRecommendations", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    accessToken: accessToken,
                    target_energy: currentAvgCombinationTrackFeatures.energy,
                    target_acousticness: currentAvgCombinationTrackFeatures.acousticness,
                    target_danceability: currentAvgCombinationTrackFeatures.danceability,
                    target_valence: currentAvgCombinationTrackFeatures.valence,
                    seed_artists: [...topArtists.slice(0,1).map((artist) => artist.id), ...recentlyArtists.slice(0,1).map((artist) => artist.id)],
                    seed_genres: Object.keys(topGenres).slice(0,1).map((genre, count) => genre),
                    seed_tracks: [...topTrackIds.slice(0,1).map((track) => track.id), ...recentlyPlayIds.slice(0,1).map((track) => track.id)]
                }),
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.tracks);
                setRecommendationsTracks(
                    data.tracks.map((track) =>{

                        const smallestAlbumImage = track.album.images.reduce((smallest, image) => {
                            return image.height === Math.min(track.album.images.map(image => image.height))? image : smallest;
                            }, track.album.images[0]
                        )
                        
                        return {
                            id: track.id,
                            artist: track.artists[0].name,
                            album: track.album.name,
                            name: track.name,
                            albumImage: smallestAlbumImage.url,
                            uri: track.uri
                        }

                    })
                );
                
                setRecomandationFinishFetch(true);
                console.log(recommendationsTracks);
            })
            
        }

    },[accessToken, 
        topTracksFinishFetch, 
        topArtistsFinishFetch,
        recentlyPlayedFinishFetch, 
        mappingRecentlyArtists,topTracksFeaturesFinishFetch,
        recentlyPlayFeaturesFinishFetch,
        currentAvgCombinationTrackFeatures, mappingGenres])
    

    const ArtistsShowMore = (e) =>{
        e.preventDefault();
        if(artistsShowMore) {
            setArtistsShowMore(false);
        }
        else {
            setArtistsShowMore(true);
        }
    }
    const TracksShowMore = (e) =>{
        e.preventDefault();
        if(trackShowMore) {
            setTrackShowMore(false);
        }
        else {
            setTrackShowMore(true);
        }
    }

    return(
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    {
                        <div className="d-flex justify-content-start ">
                            <div className="chart-container">
                                <canvas ref={chartRef}></canvas>
                            </div>

                        </div> 
                    } 
                </div>

                <div className="col-md-6" style={{overflow: "auto"}}>
                    <div className="Explaination chart-container" style={{
                            textAlign: 'start',
                            color: 'white',
                        }}>
                            <h3>Description</h3>
                            <div className="row" style={{fontSize: "13px"}}>
                                <div className="col-md-6">
                                    <div className="rectangle rectangle-1">
                                        Your current taste is 
                                        <span style={{color: "pink", fontStyle: "italic"}}>{(currentAvgRecentlyPlayedFeatures.acousticness)? ` ${Math.round((currentAvgRecentlyPlayedFeatures.acousticness).toFixed(2) * 100)}% `: `N/A`}</span>
                                        acoustic.
                                        <br/>
                                        &emsp;Your all time taste is <span style={{color: "skyblue", fontStyle: "italic"}}>{(currentAvgCombinationTrackFeatures.acousticness)? ` ${Math.round((currentAvgCombinationTrackFeatures.acousticness).toFixed(2) * 100)}% `: `N/A`}</span>
                                        acoustic.
                                        {/* <br/>
                                        &emsp; <span style={{color: "orange", fontWeight:"bold"}}>{(currentAvgRecentlyPlayedFeatures.acousticness > currentAvgCombinationTrackFeatures.acousticness) 
                                        ? `You have a strong preference for acoustic music, which typically features natural-sounding instruments.` 
                                        : `You have a preference for electronic or synthesized music, which often includes electronic instruments.`}</span> */}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="rectangle rectangle-2">
                                        Your current taste is 
                                        <span style={{color: "pink", fontStyle: "italic"}}>{(currentAvgRecentlyPlayedFeatures.danceability)? ` ${Math.round((currentAvgRecentlyPlayedFeatures.danceability).toFixed(2) * 100)}% `: `N/A`}</span>
                                        danceable.
                                        <br/>
                                        &emsp;Your all time taste is <span style={{color: "skyblue", fontStyle: "italic"}}>{ (currentAvgCombinationTrackFeatures.danceability)? ` ${Math.round((currentAvgCombinationTrackFeatures.danceability).toFixed(2) * 100)}% `: `N/A`}</span>
                                        danceable.
                                        <br/>
                                        {/* &emsp; <span style={{color: "orange", fontWeight:"bold"}}>{(currentAvgRecentlyPlayedFeatures.danceability > currentAvgCombinationTrackFeatures.danceability) 
                                        ? `You have a strong preference for acoustic music, which typically features natural-sounding instruments.` 
                                        : `You have a preference for electronic or synthesized music, which often includes electronic instruments.`}</span> */}
                                    </div>
                                </div>
                            </div>
                            <div className="row" style={{fontSize: "13px"}}>
                                <div className="col-md-6">
                                    <div className="rectangle rectangle-1">
                                        Your current taste is 
                                        <span style={{color: "pink", fontStyle: "italic"}}>{(currentAvgRecentlyPlayedFeatures.energy)? ` ${Math.round((currentAvgRecentlyPlayedFeatures.energy).toFixed(2) * 100)}% `: `N/A`}</span>
                                        energetic.
                                        <br/>
                                        &emsp;Your all time taste is <span style={{color: "skyblue", fontStyle: "italic"}}>{ (currentAvgCombinationTrackFeatures.energy)? ` ${Math.round((currentAvgCombinationTrackFeatures.energy).toFixed(2) * 100)}% `: `N/A`}</span>
                                        energetic.
                                        <br/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="rectangle rectangle-3">
                                        Your current taste is 
                                        <span style={{color: "pink", fontStyle: "italic"}}>{(currentAvgRecentlyPlayedFeatures.valence)? ` ${Math.round((currentAvgRecentlyPlayedFeatures.valence).toFixed(2) * 100)}% `: `N/A`}</span>
                                        positive.
                                        <br/>
                                        &emsp;Your all time taste is <span style={{color: "skyblue", fontStyle: "italic"}}>{ (currentAvgCombinationTrackFeatures.valence)? ` ${Math.round((currentAvgCombinationTrackFeatures.valence).toFixed(2) * 100)}% `: `N/A`}</span>
                                        positive.
                                        <br/>
                                    </div>
                                </div>
                            </div>
                            <div className="row" style={{fontSize: "13px"}} >
                                <div className="col-md-12">
                                    <div className="rectangle rectangle-4">
                                       <span style={{color: "orange", fontWeight: "bold"}}>The Taste are calculated based on your recently play and the combination of your top played track in Spotify.</span>
                                    </div>
                                </div>
                            </div>
                    </div>
                    
                </div>

            </div>
            <div className="row border border-3 border-top-0 border-start-0 border-end-0"></div>
            <div className="row">
                <div className="col-md-6">
                    {
                        <div className="d-flex justify-content-start ">
                            <div className="chart-container">
                                <canvas ref={pieRef}></canvas>
                            </div>

                        </div> 
                    } 
                </div>
                <div className="col-md-6 mt-4">
                    {Object.keys(releaseYearCountsDecade).map((decadeStart) => {
                        const songs = generateSongsByDecade(decadeStart, topTrackIds);
                        return (
                            <div className="mt-4" key={decadeStart}>
                                <button
                                className="btn btn-link mb-2"
                                data-bs-toggle="collapse"
                                type="button"
                                data-bs-target={`#${decadeStart}`}
                                aria-expanded={decadeStart === expandedDecade}
                                aria-controls={decadeStart}
                                onClick={() => setExpandedDecade(decadeStart === expandedDecade ? null : decadeStart)}
                                style={{
                                    textDecoration: "none",
                                    fontSize: "1.5rem",
                                    padding: "10px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    backgroundColor: decadeStart === expandedDecade ? "#1db954" : "#282828",
                                    color: decadeStart === expandedDecade ? "#ffffff" : "#ffffff",
                                    borderRadius: "4px",
                                    width: "100%",
                                    transition: "0.3s",
                                }}
                                >
                                    {decadeStart}s
                                    {decadeStart === expandedDecade ? (
                                        <FaChevronUp style={{ fontSize: "1.2rem" }} />
                                    ) : (
                                        <FaChevronDown style={{ fontSize: "1.2rem" }} />
                                    )}
                                </button>
                                <div className="collapse" id={decadeStart}>
                                    <div>
                                        {songs.map((song) => (
                                            <div className="d-flex align-items-center mb-2" 
                                            style={{
                                                backgroundColor: "#f8f9fa",
                                                borderRadius: "5px",
                                                padding: "8px",
                                                transition: "0.3s",
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e9ecef"}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                                            >
                                            <div className="me-2">
                                                <img src={song.albumImage} alt={song.name} width="40" height="40" />
                                            </div>
                                            <div className="flex-grow-1" style={{ color: "#343a40" }}>{song.name}</div>
                                            <div style={{ color: "#343a40" }}>{new Date(song.releaseDate).getFullYear()}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                </div>
            </div>
            <div className="row border border-3 border-top-0 border-start-0 border-end-0 mt-2"></div>
            <div className="row text-white mt-2">
                <h3 className="text-white mb-2" style={{fontWeight: "bold" }}>Top Genres</h3>
                {Object.entries(topGenres).map(([genre, count], index) => (
                        <div
                        key={genre}
                        className="col-12 col-md-2 col-lg-2 d-flex my-1"
                        style={{
                        backgroundColor: "#282828",
                        borderRadius: "5px",
                        padding: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        }}
                        >
                            <div className="text-white" style={{ fontWeight: "bold" }}>
                                {`${index+1}/     ${genre}`}
                            </div>
                            <div
                            className="text-white"
                            style={{
                                backgroundColor: "#1db954",
                                borderRadius: "3px",
                                padding: "3px 6px",
                                fontWeight: "bold",
                            }}
                            >
                                {count}
                            </div>
                        </div>
                ))}
            </div>
            <div className="row border border-3 border-top-0 border-start-0 border-end-0 mt-2"></div>
            <div className="row">
                <div className="col-md-6 mt-2">
                    <h3 className="text-white mb-3">Top Tracks</h3>
                    <div className="track-artist-list" style = {{maxHeight: 64 * ((trackShowMore) ? topTrackIds.length : 5) + "px"}}>
                    {
                        topTrackIds.map((track) => (
                            <div
                            key={track.id}
                            className="d-flex align-items-center mb-2 track-artist-item-container"
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1db954")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#282828")}
                            >
                                <div className="me-2">
                                    <img src={track.albumImage} alt={track.name} width="40" height="40" />
                                </div>
                                <div className="flex-grow-1 text-white">{track.name}</div>
                            </div>
                        )) 
                    }
                    </div>
                    <button
                    className="btn"
                    style={{
                        backgroundColor: '#1db954', // Spotify green
                        borderColor: '#1db954',
                        color: '#ffffff', // White text color
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        transition: '0.3s',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#1ed760'; // Lighter green on hover
                        e.currentTarget.style.borderColor = '#1ed760';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#1db954'; // Restore original green color
                        e.currentTarget.style.borderColor = '#1db954';
                    }}
                    onClick={TracksShowMore}
                    >
                        {(trackShowMore) ? "Show Less" : "Show More"}
                    </button>
                </div>

                <div className="col-md-6 mt-2">
                    <h3 className="text-white mb-3">Top Artists</h3>
                    <div className="track-artist-list" style = {{maxHeight: 64 * ((artistsShowMore) ? topArtists.length : 5) + "px"}}> 
                    {
                        
                        topArtists.map((artist) => (
                            <div
                            key={artist.id}
                            className="d-flex align-items-center mb-2 track-artist-item-container"
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1db954")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#282828")}
                            >
                                <div className="me-2">
                                    <img src={artist.image} alt={artist.name} width="40" height="40" />
                                </div>
                                <div className="flex-grow-1 text-white">{artist.name}</div>
                            </div>
                        ))
                    }
                    </div>
                    <button
                    className="btn"
                    style={{
                        backgroundColor: '#1db954', // Spotify green
                        borderColor: '#1db954',
                        color: '#ffffff', // White text color
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        transition: '0.3s',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#1ed760'; // Lighter green on hover
                        e.currentTarget.style.borderColor = '#1ed760';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#1db954'; // Restore original green color
                        e.currentTarget.style.borderColor = '#1db954';
                    }}
                    onClick={ArtistsShowMore}
                    >
                        {(artistsShowMore) ? "Show Less" : "Show More"}
                    </button>
                </div>

            </div>
            <div className="row border border-3 border-top-0 border-start-0 border-end-0 mt-2"></div>
            <div className="row mt-2">
                <h3 className="text-white mb-3">Recomandation</h3>
                {
                    (recomandationFinishFetch) ?
                        recommendationsTracks.map((track) => <TrackCard accessToken={accessToken} Track={track} ChooseTrack={ChooseTrack}></TrackCard> )  
                        : <div className="loading-container d-flex justify-content-center align-items-start">
                            <h3 className="loading-text">Loading</h3>
                        </div>

                }
            </div>
            <div className="row" style={{ marginBottom: '7rem' }}/>
        </div>
        
    );

}

export default ListeningHabit;