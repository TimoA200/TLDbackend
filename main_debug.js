const File = require("fs");
const MySQL = require("./mysql");
const Bot = require("./discordbot.js");
const Logger = require("./logger.js");
const Captcha = require("./captcha.js");
const Brawlhalla = require('brawlhalla-api')("KL6KDVRGG6GUF22M8KF13IIDUJMVL");
const Search = require('./search.js')(MySQL, Bot.getBot());
const Registration = require('./registration.js')(MySQL, Bot.getBot(), Brawlhalla, Captcha);
const Profile = require('./profile')(Logger, MySQL, Brawlhalla);
const Express = require('./express.js')(3333);
const Team = require('./team.js')(Logger, MySQL, Bot.getBot());

const DEBUG = true;

MySQL.loadMySQL();
Bot.loadDiscordBot().then(() => {
  Express.loadExpress(DEBUG)

  const app = Express.getExpress();
  Profile.getPlayerByBhID(2382230).then(res => {}).catch(err => {
    throw err
  });
});
