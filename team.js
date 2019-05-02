const TEAM = (Logger, SQL, BOT) => {

  this.getTeam = () => {
    var Status = {
      status_ok: true,
      status_code: 0,
      data: []
    };
    return new Promise((resolve, reject) => {
      SQL.query(`SELECT brawlhallaID, discordID, discordName, brawlhallaName, role FROM cbl.playerdata WHERE role IS NOT NULL ORDER BY FIELD(role, 'Lead','Developer','Helper','Tester', 'Gay')`).then(async res => {

        Status.data = res;

        for (var i = 0; i < Status.data.length; i++) {
          var dUser = await Bot.fetchUser(Status.data[i].discordID);
          Status.data[i].discriminator = dUser.discriminator;
          Status.data[i].avatarURL = dUser.avatarURL;
        }

        resolve(Status);
      }).catch(err => {
        Status.status_ok = false;
        reject(Status);
      });
    });
  };
  return this;
};

module.exports = TEAM;
