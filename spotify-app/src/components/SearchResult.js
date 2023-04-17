import React, {useState} from "react";
import ImageComponent from "./ImageComponent";

function SearchResult({ Track, ChooseTrack}) {

    const playHandler = () => {
        ChooseTrack(Track);
    };

    return (
        <div
        className="col-sm-3"
        style={{ cursor: "pointer" }}
        onClick={playHandler}
        >
            <div className="card mb-2 bg-dark" >
                <img
                src={`${Track.albumImage}`} 
                className="card-img-top"
                alt="Card image cap"
                style={{ width: '200px', height: '200px' }}
                />
                {/* <ImageComponent imageSrc={`${Track.albumImage}`} width={300} height={200}></ImageComponent> */}
                <div className="card-body text-white ">
                    <h5 className="card-title text-truncate">{`${Track.name}`}</h5>
                    <p className="card-text text-truncate">{`Artists: ${Track.artist}`}</p>
                    <p className="card-text text-truncate">{`Album: ${Track.album}`}</p>
                </div>
            </div>
        </div>
    );
}

export default SearchResult;
