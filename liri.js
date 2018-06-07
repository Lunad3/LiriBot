require("dotenv").config();
var SpotifyAPI = require("node-spotify-api");
var TwitterAPI = require("twitter");
var keys = require("./keys.js");
var MySpotify = new SpotifyAPI(keys.spotify);
var MyTwitter = new TwitterAPI(keys.twitter);
