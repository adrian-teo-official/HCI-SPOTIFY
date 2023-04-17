import { useState, useEffect } from "react";
import SearchResult from "./SearchResult";

const Search = ({accessToken, ChooseTrack}) => {

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
              <form onSubmit={submitHandler} className="form-inline">
                  <div className="form-group">
                    <input
                      className="form-control border border-black"
                      name="search"
                      defaultValue={search}
                      placeholder="Search Songs/Artists"
                      minLength="2"
                      required />
                  </div>
                  <button className="btn btn-outline-dark bg-black text-white mt-2 mb-4" type="submit"> Search </button>
              </form>
            </div>
          </div>

          <div className="row mb-3">
            {

              ( finishFetch && search.length > 0 && searchResults.length > 0) ? 
              <div className="jumbotron jumbotron-fluid mx-auto w-50">
                <h2 className="display-8 text-white">Search Result</h2>
              </div> 
              : ( finishFetch && search.length > 0 && searchResults.length === 0 ) ? 
              <div className="jumbotron jumbotron-fluid mx-auto w-50">
                <h2 className="display-8 text-warning">No Result Found!</h2>
              </div> : <div></div>

            }
            
          </div>
    
          <div className="row" style={{ marginBottom: '6rem' }} >
            {
                searchResults.map((track) => {
    
                    return (
                    <SearchResult Track = {track} key={track.uri} ChooseTrack = {ChooseTrack}></SearchResult>
                    )})
                    
            }
          </div>
            
        </div>
      );
}

export default Search;