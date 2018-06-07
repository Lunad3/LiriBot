//get API keys for spotify and twitter
require("dotenv").config();
var keys = require("./keys.js");

//set up spotify API module - https://www.npmjs.com/package/node-spotify-api
var SpotifyAPI = require("node-spotify-api");
var MySpotify = new SpotifyAPI(keys.spotify);

//set up twitter API module - https://www.npmjs.com/package/twitter
var TwitterAPI = require("twitter");
var MyTwitter = new TwitterAPI(keys.twitter);

var liri = {
    "my-tweets":{
        needsArg: false,
        run:function(){
            console.log("running liri.mytweets()");
        }
    },
    "spotify-this-song":{
        needsArg: false,
        run:function(){
            console.log("running liri.spotify-this-song()");
        }
    },
    "movie-this":{
        needsArg: false,
        run:function(){
            console.log("running liri.movie-this()");
        }
    },
    "do-what-it-says":{
        needsArg: false,
        run:function(){
            console.log("running liri.do-what-it-says()");
        }
    },
}

if (process.argv.length > 3){
    var cmd = process.argv[2];
    var param = process.argv[3];
    for (var command in liri){
        if (cmd == command){
            if (liri[command].needsArg && (process.argv.length == 4))
            liri[command](param);
        }
    }
}
else{
    console.log("Liri: invalid input, use format : [node liri.js (command) (paramater)]");
}