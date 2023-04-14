import React from "react";

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
      <div className="card mb-2">
        <img
          src={`${Track.albumImage}`}
          className="card-img-top"
          alt="Card image cap"
        />
        <div className="card-body">
          <h5 className="card-title">{`${Track.name}`}</h5>
          <p className="card-text">{`Artists: ${Track.artist}`}</p>
          <p className="card-text">{`Album: ${Track.album}`}</p>
        </div>
      </div>
    </div>
  );
}

export default SearchResult;
