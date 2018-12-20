const lib = require('lib')({token: process.env.STDLIB_TOKEN});
/**
*
*
*   Basic "Help" command.
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
  callback(null, {
      //${text}, <@${user}>
    text: `Hello, welcome to the NFL Fantasy Football slakcbot "HELP" function. 
          \n This module has a bunch of different funcitons that will help you win your fantasy football league.
          \n The "nfl_stats" function takes a player's full first and last name as input and will return all available info, point statistics and position relevant game statistics.
          \n "position_rankings" will return the top 10 players at a desired position when you enter the abbreviation, such as QB, RB, WR, TE, DEF.`,
    attachments: [
      // You can customize your messages with attachments.
      // See https://api.slack.com/docs/message-attachments for more info.
    ]
  });
};
