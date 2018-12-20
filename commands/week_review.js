const lib = require('lib')({token: process.env.STDLIB_TOKEN});
var request = require("request");
var arraySort = require('array-sort');
var all_players_Sorted;
var num_players;
var rank;
var percentile;

/**
* /hello
*
*   Basic "Hello World" command.
*   All Commands use this template, simply create additional files with
*   different names to add commands.
*
*   See https://api.slack.com/slash-commands for more details.
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
        SeasonStats = result;
    
        let matches = SeasonStats.players.filter(val => {
            return val.name === text;
        });

        let all_players = SeasonStats.players.filter(val => {
            return val.position == matches[0].position;
        })

        all_players_Sorted = arraySort(all_players, 'weekPts');

        num_players = all_players_Sorted.length;
    
        for(i = 0; i < num_players; i++){
            if (all_players_Sorted[i].name == text) 
                rank = i;
        }
        
        percentile = rank / num_players * 100;

  callback(null, {
    text: `${text} week points ` + matches[0].weekPts +
           `\n${text} is in the ` + percentile.toPrecision(4) + ` percentile for week points for ` + matches[0].position,
    attachments: [
      // You can customize your messages with attachments.
      // See https://api.slack.com/docs/message-attachments for more info.
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
