const lib = require('lib')({token: process.env.STDLIB_TOKEN});
var request = require("request");
var game_stats;
var player_stats;

/**
* /nfl_stats
*
* This program takes command line argument for a player's full first and last name. It calls the NFL FF API to fetch all player data.
* It then returns all generic player info and point stats. Using a series of cases based on the entered player's position, 
* the program combines relevant game statistics into the desired output. 
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
        player_stats = 'Incorrect or missing player name. Please try re-entering or choose a different player.';
        game_stats = '';
        break l1;                 //Exits directly to output
      }

    //Stores player's individual fantasy point statistics in player_stats
    player_stats = 'Position ' + matches[0].position + 
    '\n Team ' + matches[0].teamAbbr + 
    '\n Season Points ' + matches[0].seasonPts + 
    '\n Season Projected Pts ' + matches[0].seasonProjectedPts + 
    '\n Week Points ' + matches[0].weekPts + 
    '\n Week Projected Pts '+ matches[0].weekProjectedPts;


    //Switch statement stores only position-relevant game statistics which correspond to individual elements of stat array (vary by position)
    l2: switch(matches[0].position){

      //QUARTERBACK
      case 'QB':        
          game_stats = 'Games played ' + matches[0].stats[1] +
          '\n Passing Attempts ' + matches[0].stats[2] + 
          '\n Completions  ' + matches[0].stats[3] + 
          '\n Passing Yards ' + matches[0].stats[5] +
          '\n Passing TDs ' + matches[0].stats[6] +
          '\n Interceptions ' + matches[0].stats[7];
          break l2;

      //RUNNING BACK
      case 'RB':
          game_stats = 'Games Played ' + matches[0].stats[1] + 
          '\n Rushing Attempts ' + matches[0].stats[13] + 
          '\n Rushing Yards ' + matches[0].stats[14] + 
          '\n Rushing TDs ' + matches[0].stats[15] + 
          '\n Receptions ' + matches[0].stats[20] + 
          '\n Receiving Yards ' + matches[0].stats[21] + 
          '\n Receiving TDs ' + matches[0].stats[22];
          break l2;

      //KICKER
      case 'K':
          game_stats = 'Games Played ' + matches[0].stats[1] +
          '\n Extra Points Made ' + matches[0].stats[33] +
          '\n Field Goalds Made 20-29 yds ' + matches[0].stats[36] +
          '\n Field Goalds Made 30-39 yds ' + matches[0].stats[37] + 
          '\n Field Goalds Made 40-49 yds ' + matches[0].stats[38] +
          '\n Field Goalds Made 50+ yds ' + matches[0].stats[39] + 
          '\n Missed Field Goals ' + matches[0].stats[44];
          break l2;

      //WIDE RECEIVER, TIGHT END
      case 'WR':
      case 'TE':
          game_stats = 'Games Played ' + matches[0].stats[1] +
          '\n Receptions ' + matches[0].stats[20] +
          '\n Receiving Yards ' + matches[0].stats[21] +
          '\n Receiving TDs ' + matches[0].stats[22];
          break l2;

      //TEAM DEFENSE
      case 'DEF':
          game_stats = 'Games Played ' + matches[0].stats[1] +
          '\n Sacks ' + matches[0].stats[45] +
          '\n Interceptions ' + matches[0].stats[46] +
          '\n Forced Fumbles ' + matches[0].stats[48] +
          '\n Total Opponent Yards ' + matches[0].stats[62];
          break l2; 

       default:
         game_stats = 'Game stats only available for players at valid positions. Please choose a player at one of the following positions: QB, RB, WR, TE, K, or DEF.';
         break l2;
    }

    //Exits infinite while loop
    break l1; 
  }


    //Outputs generic player info, all available point stats, and position-relevant game statistics
    callback(null, {
      text: `Stats for ${text}\n` + player_stats + `\n` + game_stats,
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
