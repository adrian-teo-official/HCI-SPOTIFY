import { useState, useEffect } from "react";
import AuthAgent from "./AuthAgent";
// import SpotifyWebApi from "spotify-web-api-node";

// const spotifyCredentials = {
//     clientId: 'ee859872f4354d5093bba8275dd2ace1',
//     clientSecret: 'a38b3dae7f6b47669a9f4d3e0bb9ba2b',
//     redirectUri: 'http://localhost:3000'
// };

const Dashboard = ({ code }) => {
  const accessToken = AuthAgent(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // const spotifyApi = new SpotifyWebApi({spotifyCredentials});

  const submitHandler = (e) => {
    e.preventDefault();
    setSearch(e.target.search.value);
  };

  // //Access token change
  // UseEffect(() => {

  //     if(!accessToken){
  //         return;
  //     }

  //     spotifyApi.setAccessToken(accessToken);

  // }, [accessToken]);

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
    <div
      className="Container d-flex flex-column py-2"
      style={{ height: "100vh" }}
    >
      <div className="Search">
        <form onSubmit={submitHandler}>
          <div className="form-row">

            <div className="form-group col-lg-4 mr-3">
              <input
                className="form-control"
                name="search"
                defaultValue={search}
                placeholder="Search Songs/Artists"
                minLength="2"
                required
              />
            </div>

            <div className="form-group">
              <button className="btn btn-outline-primary" style={{ transform: "translateY(10px)" }} type="submit"> Search </button>
            </div>

          </div>
        </form>
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
};

export default Dashboard;
