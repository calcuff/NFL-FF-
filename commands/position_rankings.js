const lib = require('lib')({token: process.env.STDLIB_TOKEN});
var request = require("request");
var arraySort = require('array-sort'); 
var top_players; 

/**
* /position_rankings
*
* This program takes a command line argument as an abbreviation for a desired offensive position or team defense.
* It calls the NFL FF API and returns back all players at the matching position. It then sorts those players based on their week 
* projected points and returns the top 10. It then prints the names and week projected points for those players in descending order.
*
*    
* @param {string} user The user id of the user that invoked this command (name is usable as well)
* @param {string} channel The channel id the command was executed in (name is usable as well)
* @param {string} text The text contents of the command
* @param {object} command The full Slack command object
* @param {string} botToken The bot token for the Slack bot you have activated
* @returns {object}
*/

module.exports = (user, channel, text = '', command = {}, botToken = null, callback) => {
    var initializePromise = initialize();
    
    initializePromise.then(function(result) {
      //Stores data pulled from API in SeasonStats as array
      SeasonStats = result;

      //Declare as empty string so results are not carried over from runs
      top_players = "";

      //Retrieves all players from SeasonStats of the same position as the user input (text)
      let matches = SeasonStats.players.filter(val => {
          return val.position === text;
      });

      l1: while(true){  
        if (matches.length == 0){    //Error message if input does not match any data
          top_players = 'Incorrect or missing positional abbreviation. Please try re-entering or choose a different position.';
          break l1;                  //Exits directly to ouptut
        }
        
        //Sorts matches array based on week proj pts
        var pos_Sorted = (arraySort(matches, 'weekProjectedPts'));
        //Revereses to get values in descending order
        var pos_Sort_Right = pos_Sorted.reverse();
        //Slices players to get top 5
        var final_pos = pos_Sort_Right.slice(0,10);
    
        //Builds string for numbers 1 through 10, next to player name and corresponding week projected points
        for (var i = 0; i < 10; i++){
          top_players += i+1 + '. ' + final_pos[i].name.padEnd(24, ' ') + final_pos[i].weekProjectedPts.toString() + "\n";
        }

        //Exits infinite while loop
        break l1;  
      }

    //Outputs the top 10 players with their week projected points and heading
    callback(null, {
    text: `Player --- Top 10 ${text} --- Week Projected Points\n` + top_players,
    attachments: [
    ]
  });
}, function(err) {
    console.log(err);
})
};

// Initialize creates a promise to Promise which waits for the json download
function initialize() {
    // Setting URL and headers for request
    var options = {
        url: 'https://api.fantasy.nfl.com/v1/players/stats?statType=seasonStats&format=json',
        headers: {
            'User-Agent': 'request'
        }
    };
    // Return new promise - to parse the NFL stats
    return new Promise(function(resolve, reject) {
    	// Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } 
            else {
                resolve(JSON.parse(body));
            }
        })
    })

}

