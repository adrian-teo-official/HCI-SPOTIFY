import { useState, useEffect, useRef } from "react";
import Chart from 'chart.js/auto';

const ListeningHabit = ({accessToken}) =>{

    const [topTrackIds, setTopTrackIds] = useState([]);
    const [recentlyPlayIds, setRecentlyPlayIds] = useState([]);

    const [topTracksAudioFeatures, setTopTracksAudioFeatures] = useState([]);
    const [recentlyPlayAudioFeatures, setRecentlyPlayAudioFeatures] = useState([]);

    const [currentAvgTopTracksFeatures, setCurrentAvgTopTracksFeatures] = useState([]);
    const [currentAvgRecentlyPlayedFeatures, setCurrentAvgRecentlyPlayedFeatures] = useState([]);

    const [currentAvgCombinationTrackFeatures, setCurrentAvgCombinationTrackFeatures] = useState([]);

    const [topTracksfinishFetch, setTopTracksFinishFetch] = useState(false);
    const [recentlyPlayedfinishFetch, setRecentlyPlayedfinishFetch] = useState(false);
    const [finishFetch, setFinishFetch] = useState(false);



    useEffect (() => {

        const abortController = new AbortController();
        const signal = abortController.signal;

        fetch("http://localhost:8888/getMyTopTracks", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                accessToken: accessToken
            }),
            signal : signal
        })
        .then(response => response.json())
        .then(data => {
            setTopTrackIds(
                data.map((tracks) => {

                    return tracks.id;
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
            signal : signal
        })
        .then(response => response.json())
        .then(data =>{
            setRecentlyPlayIds(
                data.map((played) => {
                    return played.track.id; 
                })
            );

            setRecentlyPlayedfinishFetch(true);
        });

        return () => {
            abortController.abort(); // Cancel the fetch requests when the accessToken changes
        };

    },[accessToken])

    useEffect(() =>{

        if(recentlyPlayedfinishFetch && topTracksfinishFetch)
        {
            const abortController = new AbortController();
            const signal = abortController.signal;

            fetch("http://localhost:8888/getTracksAudioFeatures", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    accessToken: accessToken,
                    trackIds: topTrackIds
                }),
                signal : signal
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
            });
    
            fetch("http://localhost:8888/getTracksAudioFeatures", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    accessToken: accessToken,
                    trackIds: recentlyPlayIds
                }),
                signal : signal
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
    
                setFinishFetch(true);
            });

            return () => {
                abortController.abort(); // Cancel the fetch requests when the accessToken changes
            };

        } 
    },[accessToken, topTrackIds, recentlyPlayIds, topTracksfinishFetch, recentlyPlayedfinishFetch])

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

    useEffect(() =>{
        if(topTracksAudioFeatures.length > 0 && recentlyPlayAudioFeatures.length >0)
        {
            setCurrentAvgTopTracksFeatures(calculateAudioFeaturePreferences(topTracksAudioFeatures));
            setCurrentAvgRecentlyPlayedFeatures(calculateAudioFeaturePreferences(recentlyPlayAudioFeatures));

            const topTracksFeaturesWeight = 0.4;
            const recentlyPlayedFeaturesWeight = 0.6;

            setCurrentAvgCombinationTrackFeatures(combineAudioFeaturePreferences(currentAvgTopTracksFeatures, currentAvgRecentlyPlayedFeatures, topTracksFeaturesWeight, recentlyPlayedFeaturesWeight));
        }

    },[topTracksAudioFeatures, recentlyPlayAudioFeatures])

    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            const chart = new Chart(chartRef.current, {
                type: 'bar',
                data: {
                    labels: Object.keys(currentAvgCombinationTrackFeatures).map((label) => label.charAt(0).toUpperCase() + label.slice(1) ),
                    datasets: [
                        {
                        label: 'Audio Features',
                        data: Object.values(currentAvgCombinationTrackFeatures),
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
      }, [currentAvgCombinationTrackFeatures]);


    return(
        <div className="row">
            <div className="col-md-6">
                {
                    (finishFetch) ? 
                    <div className="d-flex justify-content-start ">
                        <div className="chart-container">
                            <canvas ref={chartRef}></canvas>
                        </div>

                    </div> : <div></div>
                }
                
                
            </div>

            <div className="col-md-6">
                <div className="Explaination" style={{
                        backgroundColor: 'rgba(40, 40, 40, 1)',
                        borderRadius: '5px',
                        color: 'white',
                        padding: '1rem',
                        textAlign: 'justify',
                    }}>
                        <h3>Explain</h3>
                </div>
                
            </div>

        </div>

        
    );

}

export default ListeningHabit;