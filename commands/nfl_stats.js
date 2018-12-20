const lib = require('lib')({token: process.env.STDLIB_TOKEN});
var request = require("request");
var game_stats;
var player_stats;

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

    num_players = SeasonStats.players.length;

    let matches = SeasonStats.players.filter(val => {
      return val.name === text;
    });

    player_stats = matches[0].position + 
    '\n Team ' + matches[0].teamAbbr + 
    '\n Season Points ' + matches[0].seasonPts + 
    '\n Season Projected Pts ' + matches[0].seasonProjectedPts + 
    '\n Week Points ' + matches[0].weekPts + 
    '\n Week Projected Pts '+ matches[0].weekProjectedPts;

    switch(matches[0].position){

      case 'QB':        
          game_stats = 'Games played ' + matches[0].stats[1] +
          '\n Passing Attempts ' + matches[0].stats[2] + 
          '\n Completions  ' + matches[0].stats[3] + 
          '\n Passing Yards ' + matches[0].stats[5] +
          '\n Passing TDs ' + matches[0].stats[6] +
          '\n Interceptions ' + matches[0].stats[7];
          break;

      case 'RB':
          game_stats = 'Games Played ' + matches[0].stats[1] + 
          '\n Rushing Attempts ' + matches[0].stats[13] + 
          '\n Rushing Yards ' + matches[0].stats[14] + 
          '\n Rushing TDs ' + matches[0].stats[15] + 
          '\n Receptions ' + matches[0].stats[20] + 
          '\n Receiving Yards ' + matches[0].stats[21] + 
          '\n Receiving TDs ' + matches[0].stats[22];
          break;

      case 'K':
          game_stats = 'Games Played ' + matches[0].stats[1] +
          '\n Extra Points Made ' + matches[0].stats[33] +
          '\n Field Goalds Made 20-29 yds ' + matches[0].stats[36] +
          '\n Field Goalds Made 30-39 yds ' + matches[0].stats[37] + 
          '\n Field Goalds Made 40-49 yds ' + matches[0].stats[38] +
          '\n Field Goalds Made 50+ yds ' + matches[0].stats[39] + 
          '\n Missed Field Goals ' + matches[0].stats[44];
          break;

      case 'WR':
      case 'TE':
          game_stats = 'Games Played ' + matches[0].stats[1] +
          '\n Receptions ' + matches[0].stats[20] +
          '\n Receiving Yards ' + matches[0].stats[21] +
          '\n Receiving TDs ' + matches[0].stats[22];
          break;

      case 'DEF':
          game_stats = 'Games Played ' + matches[0].stats[1] +
          '\n Sacks ' + matches[0].stats[45] +
          '\n Interceptions ' + matches[0].stats[46] +
          '\n Forced Fumbles ' + matches[0].stats[48] +
          '\n Total Opponent Yards ' + matches[0].stats[62];
          break; 
    }

    //Prints generic player info and all available point stats

    callback(null, {
      //text: `TESTING 1 mr. <@${user}>\nNumber of players found: ${num_players}\nYou player is ${text}`
      text: `Stats for ${text}\nPosition ` + matches[0].position + 
            `\n Team ` + matches[0].teamAbbr + 
            `\n Season Points ` + matches[0].seasonPts + 
            `\n Season Projected Pts ` + matches[0].seasonProjectedPts + 
            `\n Week Points ` + matches[0].weekPts + 
            `\n Week Projected Pts `+ matches[0].weekProjectedPts +
            `\n` + game_stats,
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
