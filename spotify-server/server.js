const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const spotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))


app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
    const credentials = {
        clientId: 'ee859872f4354d5093bba8275dd2ace1',
        clientSecret: 'a38b3dae7f6b47669a9f4d3e0bb9ba2b',
        redirectUri: 'http://localhost:3000',
        refreshToken: refreshToken
    };
    const spotifyApi = new spotifyWebApi(credentials);

    spotifyApi
        .refreshAccessToken()
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                expiresIn: data.body.expires_in
            })
        })
        .catch(err => {res.sendStatus(400); console.log(err);});


})

//own app server
// post request for login
app.post('/login', (req, res) => {
    const code = (req.body.code+'').trim(); // link to the web address "code"
    const credentials = {
        clientId: 'ee859872f4354d5093bba8275dd2ace1',
        clientSecret: 'a38b3dae7f6b47669a9f4d3e0bb9ba2b',
        redirectUri: 'http://localhost:3000'
    };
    const spotifyApi = new spotifyWebApi(credentials);

    spotifyApi
        .authorizationCodeGrant(code)
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in
            })
        })
        .catch(err => {
            // console.log(err);
        })

});

app.listen(8888);