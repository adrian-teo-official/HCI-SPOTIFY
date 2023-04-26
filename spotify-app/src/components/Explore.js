import { useState, useEffect } from "react";
import TrackCard from "./TrackCard";

const Explore = ({accessToken, ChooseTrack}) => {

    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [finishFetch, setFinishFetch] = useState(false);

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
          setFinishFetch(true);
        })
  
            
      }, [search, accessToken]);
    
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

              ( finishFetch && searchResults && search.length > 0 && searchResults.length > 0) ? 
              <div className="jumbotron jumbotron-fluid mx-auto w-50">
                <h2 className="display-8 text-white">Search Result</h2>
              </div> 
              : ( finishFetch && searchResults && search.length > 0 && searchResults.length === 0 ) ? 
              <div className="jumbotron jumbotron-fluid mx-auto w-50">
                <h2 className="display-8 text-warning">No Result Found!</h2>
              </div> : <div></div>

            }
            
          </div>
    
          <div className="row" style={{ marginBottom: '6rem' }} >
            {
                searchResults.map((track) => {
    
                    return (
                    <TrackCard  accessToken= {accessToken} Track = {track} key={track.uri} ChooseTrack = {ChooseTrack}></TrackCard>
                    )})
                    
            }
          </div>
            
        </div>
      );
}

export default Explore;