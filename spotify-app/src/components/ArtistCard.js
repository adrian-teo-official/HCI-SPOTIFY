import React from "react";
import { useNavigate } from 'react-router-dom';
import "./Card.css";

function ArtistCard ({Artist, Key}) {
    const navigate = useNavigate();

    const handleClick = (artistId) => {
        navigate(`/artist?id=${artistId}`);
    };

    return (
        <div className="col-sm-2 card-container mb-4 d-flex" key={Key} style={{ cursor: "pointer" }} onClick={(e) => {e.preventDefault(); handleClick(Artist.id);}}>
                <div className="card bg-dark">
                  <img src = {`${Artist.image}`} style={{Height: '160.4px'}} className="card-img-top" alt="Card image cap" />
                  <div className="card-body text-white">
                    <h6 className="card-title text-truncate">{`${Artist.name}`}</h6>
                    <p className="card-text text-truncate small-p">{`Genres: ${(Artist.genres[0])? Artist.genres : 'N/A'}`}</p>
                </div>
            </div>
        </div>
    )


}


export default ArtistCard;