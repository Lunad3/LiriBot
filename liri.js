//get API keys for spotify and twitter
require("dotenv").config();
var keys = require("./keys.js");

//set up spotify API module - https://www.npmjs.com/package/node-spotify-api
var SpotifyAPI = require("node-spotify-api");
var MySpotify = new SpotifyAPI(keys.spotify);

//set up twitter API module - https://www.npmjs.com/package/twitter
var TwitterAPI = require("twitter");
var MyTwitter = new TwitterAPI(keys.twitter);

//set up request
var request = require("request");

//set up fs
var fs = require("fs");

//--------------------------------------------- LIRI-OBJ ----------------------------------------
//liri.commands holds cmd obj that have:
// + name       : comand in string
// + description: description of what the run function will do
// + needsArg   : bool that determines if command.run function needs an argument
// + run        : function that executes

var liri = {
    commands:{
        "my-tweets":{
            name:"my-tweets",
            description: "Display 20(max) most recent tweets",
            run:function(){
                MyTwitter.get('statuses/user_timeline',{screen_name: "LiriBot4"}, function(error, tweets, response) {
                    if (!error) {
                        var tweetArr = [];
                        var maxIndex = 20;
                        if (tweets.length < maxIndex){
                            maxIndex = tweets.length;
                        }
                        for(var tweetIndex = 0; tweetIndex < maxIndex; tweetIndex++){
                            tweetArr.push("  " + tweets[tweetIndex].text + "  @  " + tweets[tweetIndex].created_at);
                        }
                        liri.helperFunctions.displayMsg(tweetArr);
                    }
                    else{
                        liri.helperFunctions.displayMsg(["LIRI::ERROR::my-tweets:: request error",response])
                    }
                });
            }        
        },
        "spotify-this-song":{
            name:"spotify-this-song",
            description: "display song information",
            defaultArg: "The Sign - Ace of Base",
            run:function(song){
                if (song == undefined)
                    {song = this.defaultArg;}
                MySpotify.search({ type: 'track', query: song ,limit:1}, function(error, response) {
                    var trackInfoArr = [];
                    if (!error) {
                        trackInfoArr.push("Artist   : " + response.tracks.items[0].artists[0].name);
                        trackInfoArr.push("Song     : " + response.tracks.items[0].name);
                        trackInfoArr.push("Prev Link: " + response.tracks.items[0].preview_url);
                        trackInfoArr.push("Album    : " + response.tracks.items[0].album.name);
                        liri.helperFunctions.displayMsg(trackInfoArr);
                    }
                    else{
                        liri.helperFunctions.displayMsg(["LIRI::ERROR::spotify-this-song:: request error",response])
                    }
                });
            }
        },
        "movie-this":{
            name:"movie-this",
            // movie title, release year, IMBD rating, Rotten Tomatoes rating, coutry produced in, language, plot, and actors
            description: "display movie details",
            defaultArg: "Mr. Nobody",
            run:function(movie){
                if (movie == undefined)
                    {movie = this.defaultArg;}
                
                request( "http://www.omdbapi.com/?apikey=trilogy&plot=short&t=" + encodeURIComponent(movie), function(error, response,body) {
                    var movieInfoArr = [];
                    if (!error) {
                        var bodyObj = JSON.parse(body);
                        movieInfoArr.push("Title                 : " + bodyObj.Title);
                        movieInfoArr.push("Released              : " + bodyObj.Released);
                        for(var ratingIndex in bodyObj.Ratings){
                            console.log(bodyObj.Ratings[ratingIndex]);
                            if (bodyObj.Ratings[ratingIndex].Source == "Internet Movie Database"){
                                movieInfoArr.push("IMBD Rating           : " + bodyObj.Ratings[ratingIndex].Value);                                
                            }
                            if (bodyObj.Ratings[ratingIndex].Source == "Rotten Tomatoes"){
                                movieInfoArr.push("Rotten Tomatoes Rating: " + bodyObj.Ratings[ratingIndex].Value);
                            }
                        }
                        movieInfoArr.push("Produced in           : " + bodyObj.Country);
                        movieInfoArr.push("Language              : " + bodyObj.Language);
                        movieInfoArr.push("Plot                  : " + bodyObj.Plot);
                        movieInfoArr.push("actors                : " + bodyObj.Actors);                        
                        liri.helperFunctions.displayMsg(movieInfoArr);
                    }
                    else{
                        liri.helperFunctions.displayMsg(["LIRI::ERROR::spotify-this-song:: request error",response])
                    }
                });
            },
        },
        "do-what-it-says":{
            name:"do-what-it-says",
            description: "read random.txt and execute its contents as cmd and param",
            run:function(){
                fs.readFile("random.txt","utf8", function(error, data){
                    if (!error){
                        var argArr = data.split(",");
                        liri.executeCommand(argArr[0],argArr[1]);
                    }
                    else{
                        liri.helperFunctions.displayMsg(["LIRI::ERROR::do-what-it-says:: request error"])
                    }
                });
            },
        },
        "help":{
            name:"help",
            description: "display liri commands",
            run:function(){
                var cmdStrArr = ["EXAMPLE: \n\t+ DEFAULT ARG (if args needed)\n\t- DESCRIPTION\n"];
                for(cmd in liri.commands){
                    cmdStrArr.push(liri.helperFunctions.commandStr(cmd));
                }
                liri.helperFunctions.displayMsg(cmdStrArr);
            },
        }    
    },
    helperFunctions:{
        commandStr:function(cmdName){
            var str = liri.commands[cmdName].name + ":\n\t";
            if (liri.commands[cmdName].defaultArg != undefined){
                str += "+ " + liri.commands[cmdName].defaultArg + "\n\t";
            }
            str += "- " + liri.commands[cmdName].description + "\n";
            return str;
        },
        displayMsg:function(msgArr){
            console.log("================================ LIRI ========================================");
            for(var i=0; i<msgArr.length; i++){
                console.log("  " + msgArr[i]);
            }
            console.log("==============================================================================")
        }
    },
    executeCommand: function(cmd,param){
        var commandObj = liri.commands[cmd];
        if (commandObj != undefined){
            if (param == undefined){
                commandObj.run()
            }
            else{
                commandObj.run(param);
            }
        }
        else{
            liri.helperFunctions.displayMsg(["LIRI::ERROR::InvalidCommand:: try 'help' for list of commands"]);
        }    
    },
    Start: function(){
        if (process.argv.length <= 4){
            var cmd = process.argv[2];
            var param = process.argv[3];
            liri.executeCommand(cmd,param);
        }
        else{
            liri.helperFunctions.displayMsg(["ERROR::ArgumentError:: use -> node liri.js (command) (paramater)"]);
        }
    }
};

liri.Start();