import { useState, useEffect } from "react";
import TrackCard from "./TrackCard";
import "./Explore.css"
import ArtistCard from "./ArtistCard";

const Explore = ({accessToken, ChooseTrack}) => {

    const [search, setSearch] = useState("");
    const [historySearch, setHistorySearch] = useState(sessionStorage.getItem('historySearch')?  JSON.parse(sessionStorage.getItem('historySearch')) : ['']);
    const [searchResults, setSearchResults] = useState([]);
    const [searchArtist, setSearchArtist] = useState([]);
    const [searchResultsFinishFetch, setSearchResultsFinishFetch] = useState(false);

    const [resultsTrackFeatures, setResultsTrackFeatures] = useState([]);
    const [resultsTrackFeaturesFinishFetch, setResultsTrackFeaturesFinishFetch] = useState(false);
    const [resultArtistFinishFetch, setResultArtistFinishFetch] = useState(false);

    const submitHandler = (e) => {
        e.preventDefault();

        setSearch(e.target.search.value);

        const filteredHistorySearch = historySearch.filter((query) => query !== e.target.search.value);

        if (filteredHistorySearch.length >= 4) {
          setHistorySearch([e.target.search.value, ...filteredHistorySearch.slice(0, 4)]);
        } else {
          setHistorySearch([e.target.search.value, ...filteredHistorySearch]);
        }
    };

    useEffect(() => {
      sessionStorage.setItem('historySearch', JSON.stringify(historySearch));
    }, [historySearch]);
    
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

        fetch("http://localhost:8888/searchArtists", {
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
          setSearchArtist(
            data.artists.items.map((artist) =>{

              let smallestArtistsImage = {url: 'https://via.placeholder.com/164x164/181818/ffffff?text=Artists'};

              if(artist.images[0])
              {
                smallestArtistsImage = artist.images.reduce((smallest, image) => {
                  return image.height === Math.min(artist.images.map(image => image.height))? image : smallest;
                  }, artist.images[0]
                )

              }
            
              return {
                id: artist.id,
                name: artist.name,
                genres: artist.genres,
                uri: artist.uri,
                image: smallestArtistsImage.url
              };

            })

          );

          setResultArtistFinishFetch(true);
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
                  list="historySearch"
                  defaultValue={search}
                  placeholder="Search Songs/Artists"
                  minLength="2"
                  required
                />
                <datalist id="historySearch">
                  {
                    
                      historySearch.map((value, index)=>(
                        <option key={index} value={value}>{value}</option>
                      ))
                  }
                </datalist>
              </div>
              <button className="btn custom-search-button ms-2 mb-4" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>

          <div className="row mb-3">
            {

              ( searchResultsFinishFetch && resultArtistFinishFetch && searchResults && search.length > 0 && searchResults.length > 0) ? 
              <div className="jumbotron jumbotron-fluid mx-auto w-50">
                <h2 className="display-8 text-white">Track Search Result</h2>
              </div> 
              : ( searchResultsFinishFetch && resultArtistFinishFetch && searchResults && search.length > 0 && searchResults.length === 0 ) ? 
              <div className="jumbotron jumbotron-fluid mx-auto w-50">
                <h2 className="display-8 text-warning">No Track Found!</h2>
              </div> : <div></div>

            }
            
          </div>
    
          <div className="row row-cols-1 row-cols-md-6 " style={{ marginBottom: '2rem'}}>
          {
            (searchResults[0] && resultsTrackFeaturesFinishFetch) ?
            searchResults.slice(0,18).map((track,index) => {
              return (
                <TrackCard accessToken={accessToken} key={track.uri} Track={track} TrackFeatures={resultsTrackFeatures[index]} ChooseTrack={ChooseTrack}></TrackCard>
              )
            }) : null
          }
          </div>

          <div className="row mb-3">
          {

            ( searchResultsFinishFetch && resultArtistFinishFetch && searchResults && search.length > 0 && searchResults.length > 0) ? 
            <div className="jumbotron jumbotron-fluid mx-auto w-50">
              <h2 className="display-8 text-white">Artist Search Result</h2>
            </div> 
            : ( searchResultsFinishFetch && resultArtistFinishFetch && searchResults && search.length > 0 && searchResults.length === 0 ) ? 
            <div className="jumbotron jumbotron-fluid mx-auto w-50">
              <h2 className="display-8 text-warning">No Artist Found!</h2>
            </div> : <div></div>

          }
          </div>
    
          <div className="row row-cols-1 row-cols-md-6 " style={{ marginBottom: '6rem'}}>
          {
            (resultArtistFinishFetch && searchArtist.length > 0) ?
            searchArtist.slice(0,18).map((artist) => {
              return (
                <ArtistCard Artist={artist} key={artist.id}></ArtistCard>
              )
            }) : null
          }
          </div>

            
        </div>
      );
}

export default Explore;