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
            description: "Display 20 most recent tweets",
            run:function(){
                console.log("running liri.mytweets()");
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
                console.log("================================ LIRI COMMANDS ===============================");
                console.log("  ExampleCommand [default] -  description ");
                console.log("==============================================================================")
                for(cmd in liri.commands){
                    liri.helperFunctions.displayCommand(cmd)
                }
                console.log("==============================================================================")

            },
        }    
    },
    helperFunctions:{
        displayCommand:function(cmdName){
            var str = "\t" + liri.commands[cmdName].name;
            if (liri.commands[cmdName].defaultArg != undefined){
                str += " [" + liri.commands[cmdName].defaultArg + "]";
            }
            str += " -  " + liri.commands[cmdName].description;
            console.log(str);
        }
    }
};

// --------------------------------------------- LIRI-INTERFACE ----------------------------------------
// process user input
if ( 2 < process.argv.length <= 4){
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
        console.log("LIRI::ERROR::InvalidCommand:: try 'help'");
    }
}
else{
    console.log("LIRI::ERROR::ArgumentError:: use -> node liri.js (command) (paramater)");
}