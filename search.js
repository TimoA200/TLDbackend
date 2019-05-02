const SEARCH = (SQL, Bot) => {

  this.searchPlayerByName = function(user = "", range = 3) {
    var Status = {
      status_ok: true,
      status_code: 0,
      data: []
    };

    return new Promise(function(resolve, reject) {
      SQL.query(`SELECT brawlhallaID,discordID,discordName,brawlhallaName,comment FROM cbl.playerdata WHERE cbl.levenshtein('${user}', brawlhallaName) <= ${range} OR cbl.levenshtein('${user}', discordName) <= ${range} ORDER BY cbl.levenshtein('${user}', brawlhallaName) ASC LIMIT 150;`).then(async (result) => {
        if (result.length < 1) {
          SQL.query(`SELECT * FROM cbl.playerdata LIMIT 9`, async function(err, res, f) {
            if (err) {
              Status.status_code = 99;
              Status.status_ok = false;
              reject(Status);
              throw err;
            }
            result = res;
          });
        }

        Status.data = result;

        for (var i = 0; i < Status.data.length; i++) {
          var dUser = await Bot.fetchUser(Status.data[i].discordID);
          Status.data[i].avatarURL = dUser.avatarURL;
        }

        resolve(Status);
      }).catch(err => {
        Status.status_code = 99;
        Status.status_ok = false;
        reject(Status);
        throw err;
      });
    });
  };

  return this;
};

module.exports = SEARCH;
