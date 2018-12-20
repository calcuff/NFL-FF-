const lib = require('lib')({token: process.env.STDLIB_TOKEN});
var request = require("request");
var arraySort = require('array-sort'); 
var top_players; 



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
    
    initializePromise.then(function(result) {
      SeasonStats = result;

      top_players = "";

      let matches = SeasonStats.players.filter(val => {
          return val.position === text;
      });
        
      //Sorts matches array based on week proj pts
      var pos_Sorted = (arraySort(matches, 'weekProjectedPts'));
      //Revereses to get values in descending order
      var pos_Sort_Right = pos_Sorted.reverse();
      //Slices players to get top 5
      var final_pos = pos_Sort_Right.slice(0,10);
      //var num_at_pos = final_pos.length();
          

      for (var i = 0; i < 10; i++){
        top_players += i+1 + '. ' + final_pos[i].name.padEnd(24, ' ') + final_pos[i].weekProjectedPts.toString() + "\n";
      }


    callback(null, {
    text: `Player --- Top 10 ${text} --- Week Projected Points\n` + top_players,
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

