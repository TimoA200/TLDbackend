const Discord = require("discord.js");
const logger = require("./logger.js");

const discordbot = function() {

  this.Bot = new Discord.Client({
    autoReconnect: true
  });

  this.getBot = () => {
    return this.Bot;
  }

  this.loadDiscordBot = () => {

    return new Promise(function(resolve, reject) {
      this.login();

      this.Bot.on("ready", () => {
        logger.log("Bot is now ready.");
        resolve();
      });

      this.Bot.on('error', () => {
        logger.log("There was an error in discord.js.\nReloading bot.");
        Bot.destroy().then(this.login());
      });
    });
  };

  this.login = () => {
    logger.log("Loading Discord..");
    Bot.login('NDYzMjg5NTY3ODg2MTgwMzg0.Dv1ykw.bZ76aTFeifY5Rblh-bAe1AX35CU');
  }

  return this;
}

module.exports = discordbot();
