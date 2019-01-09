const lib = require('lib')({token: process.env.STDLIB_TOKEN});
var request = require("request");
var SeasonStats;
var mean;
var variance;
var std_deviation;
var z_score;
var summation;
var sum;
var output;

/**
* /season_analysis
*
* Takes command line argument for a player's full first and last name. The program then calls the NFL FF API  
* to retrieve player data. The program then identifies the position of entered player and filters all NFL players
* and returns only those at desired position. It then computes a series of mathematical procedures to return how
* many standard deviations the player's cumulative season points are away from the mean for all players at that position. 
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
    //Stores data pulled from API in SeasonStats as array
    SeasonStats = result;

    //Retrieves specific player from SeasonStats if name matches text input from user
    let matches = SeasonStats.players.filter(val => {
            return val.name === text;
        });
    
    l1: while(true){
            if (matches.length == 0){   //Error message if input does not match any data
              output =  '\nIncorrect or missing player name. Please try re-entering or choose a different player.';
              break l1;                 //Exits directly to output
            }
        
        //Filters all players for only those that match the position of the desired player 
        let all_players = SeasonStats.players.filter(val => {
            return val.position === matches[0].position;
        })

          //Gets number of players at the matching position
          var num_players = all_players.length;
        
          //Calculated sum of Season Points for all players at position
          sum = 0;
          for (var i = 0; i < num_players; i++) {
            sum += (all_players[i].seasonPts);
          }

          //Mean of season pts
          mean = sum / num_players;
        
          //Summation of the difference between each player's season pts and the mean, squared
          summation = 0;
          for (var i = 0; i < num_players; i++) {
              summation += Math.pow((all_players[i].seasonPts - mean),2);
          }

        //Calculates variance for desired player
        variance = summation / (num_players);

        //Standard deviation for desired player
        std_deviation = Math.sqrt(variance);      

        //Z-score, i.e., how many standard deviations away from the mean
        z_score = (matches[0].seasonPts - mean) / std_deviation;
        output = 's Season Points of ' + matches[0].seasonPts + ' are ' + z_score.toPrecision(4) + ' standard deviations away from the mean for ' + matches[0].position;
        
        //Exits infinite while loop
        break l1;       
      }
    //Outputs player's season points, z-score, and position
    callback(null, {
      text: `${text}` + output,
      attachments: [
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
