const lib = require('lib')({token: process.env.STDLIB_TOKEN});
/**
*  /info
*
* This is a basic info command that instructs the user on the functionality of the Fantasy Football App. All the different functions,
* their parameters, and return values are specified.
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
  callback(null, {
    text: `Hello, welcome to the NFL Fantasy Football slakcbot "INFO" function. 
          \n This slackbot has a bunch of different funcitons that will help you win your fantasy football league.
          \n\n The "nfl_stats" function takes a player's full first and last name as input and will return all available info, point statistics and position relevant game statistics.
          \n\n When you call "position_rankings" will return the top 10 players at a desired position based on Projected Week Points when you enter the corresponding abbreviation, such as QB, RB, WR, TE, DEF.
          \n\n Calling "season_analysis" followed by a particular player's first and last name will initiate a call to filter their cumulative season points and compare them against those of all the other players in the NFL at that position.
               The function will calculate and return how many standard deviations away from the mean your player's Season Points are.
          \n\n The "week_review" command will take input for a desired player's name and willl filter all other players at the same position.
               The player's actual Week Points will be compared against their counterparts and the program returns what percentile the player resides in.`,
    attachments: [
    ]
  });
};
