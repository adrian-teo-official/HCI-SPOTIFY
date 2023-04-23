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
      res.sendStatus(400);
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
      res.sendStatus(400);
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
      res.json(data.body.tracks.items);
    })
    .catch((err) => {
      res.sendStatus(400);
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
      
      res.sendStatus(400);
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
    
      res.sendStatus(400);
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
      res.sendStatus(400);
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
      console.log(err); 
      res.sendStatus(400);
    });
});

app.listen(8888);
