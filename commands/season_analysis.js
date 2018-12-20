const lib = require('lib')({token: process.env.STDLIB_TOKEN});
var request = require("request");
var SeasonStats;
var mean;
var variance;
var std_deviation;
var z_score;
var summation;
var sum;

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
  var intializePromise = initialize();

  intializePromise.then(function(result)  {
    SeasonStats = result;


    let matches = SeasonStats.players.filter(val => {
            return val.name === text;
        });
        
        //Filters all players for only those that match the position of the desired player //
        let all_players = SeasonStats.players.filter(val => {
            return val.position == matches[0].position;
        })

        //Gets number of players at the matching position//
        var num_players = all_players.length;
        
        //Calculated sum for all players at pos//
        sum = 0;
        for (var i = 0; i < num_players - 1; i++) {
            sum += (all_players[i].seasonPts);
        }
        //Mean of seaspn pts
        mean = sum / num_players;
        
        //Summation of the difference between each player's season pts and the mean, squared
        summation = 0;
        for (var i = 0; i < num_players - 1; i++) {
            summation += Math.pow((all_players[i].seasonPts - mean),2);
        }
        //Calculates variance for desired player
        variance = summation / (num_players);
        //Standard deviation for desired player
        std_deviation = Math.sqrt(variance);      

        //Z-score, i.e., how many standard deviations away from the mean
        z_score = (matches[0].seasonPts - mean) / std_deviation;
    
    //Prints generic player info and all available point stats

    callback(null, {
      //text: `TESTING 1 mr. <@${user}>\nNumber of players found: ${num_players}\nYou player is ${text}`
      text: `${text} 's Season Points of ` + matches[0].seasonPts + ` are ` + z_score.toPrecision(4) + ` standard deviations away from the mean for ` + matches[0].position,
      attachments: [
      // You can customize your messages with attachments.
      // See https://api.slack.com/docs/message-attachments for more info.
    ]
  });
  }, function(err) {
      console.log(err);
})
};

function initialize() {
  //Setting URL and headers for request
  var options = {
      url: 'https://api.fantasy.nfl.com/v1/players/stats?statType=seasonStats&format=json',
      headers: {
          'User-Agent': 'request'
      }
  };

  //Return new promise - to parse NFL stats
  return new Promise(function(resolve, reject){
    //Do async job
      request.get(options, function(err, resp, body){
        if (err)  {
          reject(err);
        }  else{
            resolve(JSON.parse(body));
          }
      })
   })
}
