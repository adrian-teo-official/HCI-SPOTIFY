import { useState, useEffect } from "react";
import TrackCard from "./TrackCard";
import "./Explore.css"

const Explore = ({accessToken, ChooseTrack}) => {

    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchResultsFinishFetch, setSearchResultsFinishFetch] = useState(false);

    const [resultsTrackFeatures, setResultsTrackFeatures] = useState([]);
    const [resultsTrackFeaturesFinishFetch, setResultsTrackFeaturesFinishFetch] = useState(false);

    const submitHandler = (e) => {
        e.preventDefault();
        setSearch(e.target.search.value);
    };
    
    //Search
    useEffect(() => {
      if (!search || !accessToken) {
        return setSearchResults([]);
      }
  
      fetch("http://localhost:8888/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessToken: accessToken,
            searchContent: search,
          }),
        })
        .then(response => response.json())
        .then(data => {
          setSearchResults(
            data.map((tracks) => {

              const smallestAlbumImage = tracks.album.images.reduce((smallest, image) => {
                return image.height === Math.min(tracks.album.images.map(image => image.height)) ? image : smallest;
              }, tracks.album.images[0]);
                

              return {
                id: tracks.id,
                name: tracks.name,
                artist: tracks.artists[0].name,
                album: tracks.album.name,
                albumImage: smallestAlbumImage.url,
                uri: tracks.uri
              };
            })
          );
          setSearchResultsFinishFetch(true);
        })  
            
    }, [search, accessToken]);

    useEffect(() => {

      if(!searchResultsFinishFetch) return;

      fetch("http://localhost:8888/getTracksAudioFeatures", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            accessToken: accessToken,
            trackIds: searchResults.map((track) => track.id)
        })
      })
      .then(response => response.json())
      .then(data =>{
          setResultsTrackFeatures(
              data.map((tracksFeatures) => {
                  return {
                      acousticness: tracksFeatures.acousticness,
                      danceability: tracksFeatures.danceability,
                      energy: tracksFeatures.energy,
                      valence: tracksFeatures.valence
                  }
              })
          );
          setResultsTrackFeaturesFinishFetch(true);
      });

    },[accessToken, searchResultsFinishFetch])
    
      return (
        <div className="Container">
         <div className="Search row justify-content-center">
          <div className="col-md-6">
            <form onSubmit={submitHandler} className="d-flex custom-search-form">
              <div className="form-group flex-grow-1 mr-2">
                <input
                  className="form-control custom-search-input w-100"
                  name="search"
                  defaultValue={search}
                  placeholder="Search Songs/Artists"
                  minLength="2"
                  required
                />
              </div>
              <button className="btn custom-search-button ms-2 mb-4" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>

          <div className="row mb-3">
            {

              ( searchResultsFinishFetch && searchResults && search.length > 0 && searchResults.length > 0) ? 
              <div className="jumbotron jumbotron-fluid mx-auto w-50">
                <h2 className="display-8 text-white">Search Result</h2>
              </div> 
              : ( searchResultsFinishFetch && searchResults && search.length > 0 && searchResults.length === 0 ) ? 
              <div className="jumbotron jumbotron-fluid mx-auto w-50">
                <h2 className="display-8 text-warning">No Result Found!</h2>
              </div> : <div></div>

            }
            
          </div>
    
          <div className="row row-cols-1 row-cols-md-6 " style={{ marginBottom: '6rem'}}>
          {
            (searchResults[0] && resultsTrackFeaturesFinishFetch) ?
            searchResults.map((track,index) => {
              return (
                <TrackCard accessToken={accessToken} Track={track} key={track.uri} TrackFeatures={resultsTrackFeatures[index]} ChooseTrack={ChooseTrack}></TrackCard>
              )
            }) : null
          }
          </div>

            
        </div>
      );
}

export default Explore;