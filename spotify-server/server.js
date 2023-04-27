const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const spotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const credentials = {
    clientId: "ee859872f4354d5093bba8275dd2ace1",
    clientSecret: "a38b3dae7f6b47669a9f4d3e0bb9ba2b",
    redirectUri: "http://localhost:3000",
    refreshToken: refreshToken,
  };
  const spotifyApi = new spotifyWebApi(credentials);

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      //console.log(err.message);
      return res.sendStatus(400);
    });
});

//own app server
// post request for login
app.post("/login", (req, res) => {
  const code = req.body.code; // link to the web address "code"
  const credentials = {
    clientId: "ee859872f4354d5093bba8275dd2ace1",
    clientSecret: "a38b3dae7f6b47669a9f4d3e0bb9ba2b",
    redirectUri: "http://localhost:3000",
  };
  const spotifyApi = new spotifyWebApi(credentials);

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      return res.sendStatus(400);
    });
});

app.post("/search", (req, res) => {
  const accessToken = req.body.accessToken; // link to the web address "accesstoken"
  const searchContent = req.body.searchContent; // link to the web address "searchContent"

  const credentials = {
    clientId: "ee859872f4354d5093bba8275dd2ace1",
    clientSecret: "a38b3dae7f6b47669a9f4d3e0bb9ba2b",
    redirectUri: "http://localhost:3000",
  };

  const spotifyApi = new spotifyWebApi(credentials);

  spotifyApi.setAccessToken(accessToken);

  spotifyApi
    .searchTracks(searchContent)
    .then((data) => {
      console.log(data);
      res.json(data.body.tracks.items);
    })
    .catch((err) => {
      return res.sendStatus(500);
    });
});

app.post("/getMyTopTracks", (req, res) => {
  const accessToken = req.body.accessToken; // link to the web address "accesstoken"

  const credentials = {
    clientId: "ee859872f4354d5093bba8275dd2ace1",
    clientSecret: "a38b3dae7f6b47669a9f4d3e0bb9ba2b",
    redirectUri: "http://localhost:3000",
  };

  const spotifyApi = new spotifyWebApi(credentials);

  spotifyApi.setAccessToken(accessToken);

  spotifyApi
    .getMyTopTracks()
    .then((data) => {
      res.json(data.body.items);
    })
    .catch((err) => {
      //console.log(err.message);
      return res.sendStatus(400);
    });
});


app.post("/getMyTopArtists", (req, res) => {
  const accessToken = req.body.accessToken; // link to the web address "accesstoken"

  const credentials = {
    clientId: "ee859872f4354d5093bba8275dd2ace1",
    clientSecret: "a38b3dae7f6b47669a9f4d3e0bb9ba2b",
    redirectUri: "http://localhost:3000",
  };

  const spotifyApi = new spotifyWebApi(credentials);

  spotifyApi.setAccessToken(accessToken);

  spotifyApi
    .getMyTopArtists()
    .then((data) => {
      res.json(data.body.items);
    })
    .catch((err) => {
    
      return res.sendStatus(400);
    });
});

app.post("/getMyRecentlyPlay", (req, res) => {
  const accessToken = req.body.accessToken; // link to the web address "accesstoken"

  const credentials = {
    clientId: "ee859872f4354d5093bba8275dd2ace1",
    clientSecret: "a38b3dae7f6b47669a9f4d3e0bb9ba2b",
    redirectUri: "http://localhost:3000",
  };

  const spotifyApi = new spotifyWebApi(credentials);

  spotifyApi.setAccessToken(accessToken);

  spotifyApi
    .getMyRecentlyPlayedTracks()
    .then((data) => {
      res.json(data.body.items);
    })
    .catch((err) => {
      console.log(err.message);
      return res.sendStatus(400);
    });
});

app.post("/getTracksAudioFeatures", (req, res) => {
  const accessToken = req.body.accessToken; // link to the web address "accesstoken"
  const tracksIds = req.body.trackIds;

  const credentials = {
    clientId: "ee859872f4354d5093bba8275dd2ace1",
    clientSecret: "a38b3dae7f6b47669a9f4d3e0bb9ba2b",
    redirectUri: "http://localhost:3000",
  };

  const spotifyApi = new spotifyWebApi(credentials);

  spotifyApi.setAccessToken(accessToken);

  spotifyApi
    .getAudioFeaturesForTracks([tracksIds])
    .then((data) => {
      res.json(data.body.audio_features); // need change
    })
    .catch((err) => {
      //console.log(err); 
      return res.sendStatus(400);
    });
});

app.post("/getTrackAudioFeatures", (req, res) => {
  const accessToken = req.body.accessToken; // link to the web address "accesstoken"
  const tracksId = req.body.trackId;

  const credentials = {
    clientId: "ee859872f4354d5093bba8275dd2ace1",
    clientSecret: "a38b3dae7f6b47669a9f4d3e0bb9ba2b",
    redirectUri: "http://localhost:3000",
  };

  const spotifyApi = new spotifyWebApi(credentials);

  spotifyApi.setAccessToken(accessToken);

  spotifyApi
    .getAudioFeaturesForTrack(tracksId)
    .then((data) => {
      res.json(data.body);
    })
    .catch((err) => {
      // console.log(err); 
      return res.sendStatus(400);
    });
});

app.post("/getRecentlyArtists", (req, res) => {
  const accessToken = req.body.accessToken; // link to the web address "accesstoken"
  const recentlyArtistsIds = req.body.recentlyArtistsIds;

  const credentials = {
    clientId: "ee859872f4354d5093bba8275dd2ace1",
    clientSecret: "a38b3dae7f6b47669a9f4d3e0bb9ba2b",
    redirectUri: "http://localhost:3000",
  };

  const spotifyApi = new spotifyWebApi(credentials);

  spotifyApi.setAccessToken(accessToken);

  spotifyApi
    .getArtists(recentlyArtistsIds)
    .then((data) => {
      res.json(data.body.artists); // need change
    })
    .catch((err) => {
      //console.log(err); 
      return res.sendStatus(400);
    });
});

app.post('/getRecommendations', (req, res) => {

  const accessToken = req.body.accessToken;

  const target_energy = req.body.energy;
  const target_acousticness = req.body.acousticness;
  const target_danceability = req.body.danceability;
  const target_valence = req.body.valence;

  const seed_artists = req.body.seed_artists;
  const seed_genres = req.body.seed_genres;
  const seed_tracks = req.body.seed_tracks;

  const credentials = {
    clientId: "ee859872f4354d5093bba8275dd2ace1",
    clientSecret: "a38b3dae7f6b47669a9f4d3e0bb9ba2b",
    redirectUri: "http://localhost:3000",
  };

  const spotifyApi = new spotifyWebApi(credentials);

  spotifyApi.setAccessToken(accessToken);

  spotifyApi
  .getRecommendations({
    target_energy: target_energy,
    target_acousticness: target_acousticness,
    target_danceability: target_danceability,
    target_valence: target_valence,
    seed_artists: seed_artists,
    seed_genres: seed_genres,
    seed_tracks: seed_tracks,
    limit: 24
  })
  .then(
    function (data) {
      res.json(data.body);
    },
    function (err) {
      //console.error(err.message);
      return res.status(500).json({ error: "Failed to get recommendations" });
    }
  );

});

// app.post("/getMyPlaylist", (req, res) => {
//   const accessToken = req.body.accessToken; // link to the web address "accesstoken"

//   const credentials = {
//     clientId: "ee859872f4354d5093bba8275dd2ace1",
//     clientSecret: "a38b3dae7f6b47669a9f4d3e0bb9ba2b",
//     redirectUri: "http://localhost:3000",
//   };

//   const spotifyApi = new spotifyWebApi(credentials);

//   spotifyApi.setAccessToken(accessToken);

//   spotifyApi
//     .getUserPlaylists()
//     .then((data) => {
//       res.json(data.body.items); // need change
//     })
//     .catch((err) => {
//       //console.log(err); 
//       return res.sendStatus(400);
//     });
// });

app.post("/getPlaylist", (req, res) => {
  const accessToken = req.body.accessToken; // link to the web address "accesstoken"
  const playlistId = req.body.playlistId;

  const credentials = {
    clientId: "ee859872f4354d5093bba8275dd2ace1",
    clientSecret: "a38b3dae7f6b47669a9f4d3e0bb9ba2b",
    redirectUri: "http://localhost:3000",
  };

  const spotifyApi = new spotifyWebApi(credentials);

  spotifyApi.setAccessToken(accessToken);

  spotifyApi
    .getPlaylist(playlistId)
    .then((data) => {
      res.json(data.body); // need change
    })
    .catch((err) => {
      console.log(err.message); 
      return res.sendStatus(400);
    });
});

app.listen(8888);
