import { useState, useEffect } from "react";

const Search = ({accessToken}) => {

    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const submitHandler = (e) => {
        e.preventDefault();
        setSearch(e.target.search.value);
      };
    
      //Search
      useEffect(() => {
        if (!search || !accessToken) {
          return setSearchResults([]);
        }
    
        async function Search() {
          try {
            const response = await fetch("http://localhost:8888/search", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                accessToken: accessToken,
                searchContent: search,
              }),
            });
    
            const data = await response.json();
    
            setSearchResults(
              data.map((tracks) => {
                return {
                  id: tracks.id,
                  name: tracks.name,
                  artist: tracks.artists[0].name,
                  album: tracks.album.name,
                };
              })
            );
    
            console.log(searchResults);
          } catch (error) {
            console.error(error);
          }
        }
    
        Search();
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
                  <button className="btn btn-outline-dark bg-black text-white mt-2" type="submit"> Search </button>
              </form>
            </div>
          </div>
    
          <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
            {
                searchResults.map((track) => {
    
                    return (
                    <div className="card" key={track.id}>
                        <div className="card-body">
                         <h5 className="card-title">{track.name}</h5>
                         <p className="card-text">{track.artist}</p>
                         <p className="card-text">{track.album}</p> 
                        </div>
                    </div>
                    )})
                    
            }
    
          </div>
            
        </div>
      );



}

export default Search;