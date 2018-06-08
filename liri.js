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
            needsArg: false,
            run:function(){
                console.log("running liri.mytweets()");
            }        
        },
        "spotify-this-song":{
            name:"spotify-this-song",
            description: "N/A",
            needsArg: false,
            run:function(){
                console.log("running liri.spotify-this-song()");
            },
        },
        "movie-this":{
            name:"movie-this",
            description: "N/A",
            run:function(){
                console.log("running liri.movie-this()");
            },
        },
        "do-what-it-says":{
            name:"do-what-it-says",
            description: "N/A",
            needsArg: false,
            run:function(){
                console.log("running liri.do-what-it-says()");
            },
        },
        "help":{
            name:"help",
            description: "display liri commands",
            needsArg: false,
            run:function(){
                console.log("====== LIRI COMMANDS =====");
                console.log("\t( command ) [ needs arguments? ] { description }");
                for(cmd in liri.commands){
                    liri.helperFunctions.displayCommand(cmd)
                }
            },
        }    
    },
    helperFunctions:{
        displayCommand:function(cmdName){
            console.log("\t( " + liri.commands[cmdName].name + " ) [ " + liri.commands[cmdName].needsArg + " ] { " + liri.commands[cmdName].description + " }");
        }
    }
};

// --------------------------------------------- LIRI-INTERFACE ----------------------------------------
// process user input
if ( 2 < process.argv.length <= 4){
    var cmd = process.argv[2];
    var invalidCommand = true;
    console.log("  CMD : "+cmd);

// --------------------------------------------- PROTOTYPE WAY ----------------------------------------
var commandObj = liri.commands[cmd];
if (commandObj != undefined){
    if (commandObj.needsArg){
        if (process.argv[3] != undefined){
            commandObj.run(process.argv[3]);
        }
        else{
            console.log("LIRI::ERROR::" + commandObj.name + "::ImporperUseOfCommand:: command needs an argument");
            liri.helperFunctions.displayCommand(commandObj);
        }
    }
    else{
        if (process.argv[3] == undefined){
            commandObj.run();
        }
        else{
            console.log("LIRI::ERROR::" + commandObj.name + "::ImporperUseOfCommand:: command does NOT needs an argument");
            liri.helperFunctions.displayCommand(commandObj);
        }
    }
    return;
}
else{
    console.log("LIRI::ERROR::InvalidCommand:: try 'help'");
}
// --------------------------------------------- ORIGINAL WAY ----------------------------------------
// for (var commandObj in liri.commands){
//         if (cmd == commandObj.name){
//             console.log("--command found!")
//             invalidCommand = false;
//             if (commandObj.needsArg){
//                 if (process.argv[3] != undefined){
//                     commandObj.run(process.argv[3]);
//                 }
//                 else{
//                     console.log("LIRI::ERROR::" + commandObj.name + "::ImporperUseOfCommand:: command needs an argument");
//                     liri.helperFunctions.displayCommand(commandObj);
//                 }
//             }
//             else{
//                 if (process.argv[3] == undefined){
//                     commandObj.run();
//                 }
//                 else{
//                     console.log("LIRI::ERROR::" + commandObj.name + "::ImporperUseOfCommand:: command does NOT needs an argument");
//                     liri.helperFunctions.displayCommand(commandObj);
//                 }
//             }
//             return;
//         }
//         console.log("  CMD != " + commandObj.name);
//     }
//     if (invalidCommand){
//         console.log("LIRI::ERROR::InvalidCommand:: try 'help'");
//     }
// --------------------------------------------- ORIGINAL WAY END ----------------------------------------
}
else{
    console.log("LIRI::ERROR::ArgumentError:: use -> node liri.js (command) (paramater)");
}