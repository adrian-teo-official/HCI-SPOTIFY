import React, {useState} from "react";

function TrackCard({ Track, ChooseTrack}) {

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
                    <h6 className="card-title text-truncate">{`${Track.name}`}</h6>
                    <p className="card-text text-truncate mb-0 small-p">{`Artists: ${Track.artist}`}</p>
                    <p className="card-text text-truncate mb-0 small-p">{`Album: ${Track.album}`}</p>
                </div>
            </div>
        </div>
    );
}

export default TrackCard;
