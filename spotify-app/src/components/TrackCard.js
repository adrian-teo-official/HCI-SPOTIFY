import React, {useEffect, useState} from "react";
import { FiPlayCircle } from 'react-icons/fi';

function TrackCard({ accessToken, Track, ChooseTrack}) {

    const [trackFeatures, setTrackFeatures] = useState([]);

    useEffect (()=>{
        fetch("http://localhost:8888/getTrackAudioFeatures", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    accessToken: accessToken,
                    trackId: Track.id
                }),
            })
            .then(response => response.json())
            .then(data =>{
                setTrackFeatures({
                    acousticness: data.acousticness,
                    danceability: data.danceability,
                    energy: data.energy,
                    valence: data.valence
                })
            });
    },[accessToken])

    const playHandler = () => {
        ChooseTrack(Track);
    };

    return (
        <div
        className="col-sm-2 card-container"
        style={{ cursor: "pointer" }}
        onClick={playHandler}
        >
            <div className="card mb-4 bg-dark" >
                <img
                src={`${Track.albumImage}`} 
                className="card-img-top"
                alt="Card image cap"
                />
                <div className="card-body text-white">
                    <h6 className="card-title text-truncate" style={{fontWeight: "bold"}}>{`${Track.name}`}</h6>
                    <p className="card-text text-truncate mb-0 small-p">{`Artists: ${Track.artist}`}</p>
                    <p className="card-text text-truncate mb-0 small-p">{`Album: ${Track.album}`}</p>
                    <div className="features hidden">
                        <span className="features-title mt-1 mb-1">Features:</span>
                        <ul className="features-list text-truncate small-p">
                            <li>{`Acousticness: ${(trackFeatures.acousticness)? Math.round(trackFeatures.acousticness.toFixed(2) * 100) : 'N/A'}%`}</li>
                            <li>{`Danceability: ${(trackFeatures.danceability)? Math.round(trackFeatures.danceability.toFixed(2) * 100) : 'N/A'}%`}</li>
                            <li>{`Energy: ${(trackFeatures.energy)? Math.round(trackFeatures.energy.toFixed(2) * 100) : 'N/A'}%`}</li>
                            <li>{`Valence: ${(trackFeatures.valence)? Math.round(trackFeatures.valence.toFixed(2) * 100) : 'N/A'}%`}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TrackCard;
