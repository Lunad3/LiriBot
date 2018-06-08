//get API keys for spotify and twitter
require("dotenv").config();
var keys = require("./keys.js");

//set up spotify API module - https://www.npmjs.com/package/node-spotify-api
var SpotifyAPI = require("node-spotify-api");
var MySpotify = new SpotifyAPI(keys.spotify);

//set up twitter API module - https://www.npmjs.com/package/twitter
var TwitterAPI = require("twitter");
var MyTwitter = new TwitterAPI(keys.twitter);

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
                  });
            }        
        },
        "spotify-this-song":{
            name:"spotify-this-song",
            description: "display song information",
            defaultArg: "The Sign - Ace of Base",
            run:function(){
                console.log("running liri.spotify-this-song()");
            },
        },
        "movie-this":{
            name:"movie-this",
            // movie title, release year, IMBD rating, Rotten Tomatoes rating, coutry produced in, language, plot, and actors
            description: "display movie details",
            defaultArg: "Mr. Nobody",
            run:function(){
                console.log("running liri.movie-this()");
            },
        },
        "do-what-it-says":{
            name:"do-what-it-says",
            description: "",
            run:function(){
                console.log("running liri.do-what-it-says()");
            },
        },
        "help":{
            name:"help",
            description: "display liri commands",
            run:function(){
                var cmdStrArr = ["  -- EXAMPLE [DEFAULT]  -  DESCRIPTION --"];
                for(cmd in liri.commands){
                    cmdStrArr.push(liri.helperFunctions.commandStr(cmd));
                }
                liri.helperFunctions.displayMsg(cmdStrArr);
            },
        }    
    },
    helperFunctions:{
        commandStr:function(cmdName){
            var str = "  " + liri.commands[cmdName].name;
            if (liri.commands[cmdName].defaultArg != undefined){
                str += " [" + liri.commands[cmdName].defaultArg + "]";
            }
            str += "  -  " + liri.commands[cmdName].description;
            return str;
        },
        displayMsg:function(msgArr){
            console.log("================================ LIRI ========================================");
            for(var i=0; i<msgArr.length; i++){
                console.log(msgArr[i]);
            }
            console.log("==============================================================================")
        }
    }
};

// --------------------------------------------- LIRI-INTERFACE ----------------------------------------
// process user input
if (process.argv.length <= 4){
    var cmd = process.argv[2];
    var param = process.argv[3];
    var invalidCommand = true;
    var commandObj = liri.commands[cmd];
    if (commandObj != undefined){
        if (param != undefined){
            commandObj.run()
        }
        else{
            commandObj.run(param);
        }
    }
    else{
        liri.helperFunctions.displayMsg(["  ERROR::InvalidCommand:: try 'help'"]);
    }
}
else{
    liri.helperFunctions.displayMsg(["  ERROR::ArgumentError:: use -> node liri.js (command) (paramater)"]);
}