const lib = require('lib')({token: process.env.STDLIB_TOKEN});
var request = require("request");
var arraySort = require('array-sort');
var all_players_Sorted;
var num_players;
var rank;
var percentile;

/**
* /week_review
*
* This program takes command line input for first name, last name as an argument variable.
* It calls the NFL FF API to retrieve data, and filters all players in the NFL at the same position.
* The file initiates calculations that will return what percentile the player is in based on their week points compared 
* to others at the same position. The player's week points and what percentile they are in are then printed as output.
* percentile player is in comapred with entire NFL.
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

    initializePromise.then(function(result)   {
        //Stores data pulled from API in SeasonStats as array
        SeasonStats = result;
    
        //Retrieves specific player from SeasonStats if name matches text input from user
        let matches = SeasonStats.players.filter(val => {
            return val.name === text;
        });

        //Filters all players for only those that match the position of the desired player 
        let all_players = SeasonStats.players.filter(val => {
            return val.position === matches[0].position;
        })

        //Number of players at matching position
        num_players = all_players.length;

        //Sorts all players at position based on week points
        all_players_Sorted = arraySort(all_players, 'weekPts');
    
        //Finds the rank of desired player in the sorted data set
        for(i = 0; i < num_players; i++){
            if (all_players_Sorted[i].name == text) 
                rank = i;
        }
        
        //Calculates percentile of entered player
        percentile = rank / num_players * 100;

  //Outputs entered player name, week points, what percentile they are in, and position
  callback(null, {
    text: `${text} week points ` + matches[0].weekPts +
           `\n${text} is in the ` + percentile.toPrecision(4) + ` percentile for week points for ` + matches[0].position,
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
