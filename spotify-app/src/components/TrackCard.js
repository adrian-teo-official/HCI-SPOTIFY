import React from "react";
import "./Card.css";

function TrackCard({ accessToken, Track, TrackFeatures, ChooseTrack}) {

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
                            <li>{`Acousticness: ${(TrackFeatures?.acousticness)? Math.round(TrackFeatures.acousticness.toFixed(2) * 100) : 'N/A'}%`}</li>
                            <li>{`Danceability: ${(TrackFeatures?.danceability)? Math.round(TrackFeatures.danceability.toFixed(2) * 100) : 'N/A'}%`}</li>
                            <li>{`Energy: ${(TrackFeatures?.energy)? Math.round(TrackFeatures.energy.toFixed(2) * 100) : 'N/A'}%`}</li>
                            <li>{`Valence: ${(TrackFeatures?.valence)? Math.round(TrackFeatures.valence.toFixed(2) * 100) : 'N/A'}%`}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TrackCard;
