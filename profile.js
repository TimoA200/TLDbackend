const PROFILE = (Logger, SQL, Brawlhalla) => {

  this.getPlayerByBhID = (bid, update = true) => {
    var Status = {
      status_ok: true,
      status_code: 0,
      data: {
        cblData: {},
        brawlhallaData: {},
        discordData: {}
      }
    };
    if (bid == NaN) {
      Status.status_ok = false;
      status_code.status_code = -2;
      reject(Status);
    }
    return new Promise((resolve, reject) => {
      SQL.query(`SELECT * FROM cbl.playerdata WHERE brawlhallaID='${bid}'`).then(async (res) => {
        Status.data.cblData = res[0];
        Status.data.brawlhallaData = await Brawlhalla.getPlayerRanked(Status.data.cblData.brawlhallaID);
        Status.data.discordData = await Bot.fetchUser(Status.data.cblData.discordID);
        Logger.log(Status.data.discordData.avatarURL);
        if (update) {
          this.updateCBLPlayerFromBrawlhalla(Status.data.brawlhallaData).catch((err) => {
            Logger.log("Failed to update player : " + err)
          });
        }
        resolve(Status);
      }); //
    });
  };

  this.updateCBLPlayerFromBrawlhalla = (brawlhallaData) => {
    return new Promise((resolve, reject) => {
      if (brawlhallaData == undefined)
        reject("No brawlhallaData given");
      else {
        SQL.query(`UPDATE cbl.playerdata SET brawlhallaName='${brawlhallaData.name}', peakRating='${brawlhallaData.peak_rating}', lastUpdate='${new Date().getTime()}' WHERE brawlhallaID='${brawlhallaData.brawlhalla_id}'`)
          .then((res) => {
            Logger.log(`Updated player : ${brawlhallaData.brawlhalla_id}`);
          });
          this.updateBrawlHistory(brawlhallaData);
      }
    });
  };

  this.updateBrawlHistory = (brawlhalaData) => {
    bid = brawlhalaData.brawlhalla_id;
    return new Promise((resolve, reject) => {
      SQL.query(`SELECT brawlhallaDataHistory,brawlhallaID FROM cbl.playerdata WHERE brawlhallaID='${bid}'`).then(res => {
        var data = [];

        if (res.brawlhallaDataHistory != null)
          data = res.brawlhallaDataHistory;

        if (data.length > 0) {
          data.sort((a, b) => a.date + b.date);
          //compare

          if (!(contains = () => {
              for (var i = 0; i < data.length; i++)
                if (JSON.stringify(data[i]) == JSON.stringify(brawlhalaData))
                  return true;
              return false;
            })) {
            data.push({
              data: brawlhalaData,
              date: new Date().getTime()
            });
          }
        } else {
          data.push({
            data: brawlhalaData,
            date: new Date().getTime()
          });
        }
        SQL.query(`UPDATE cbl.playerdata SET brawlhallaDataHistory='${JSON.stringify(data)}' WHERE brawlhallaID=${bid}`).then(
          Logger.log(`Updated History of : ${bid}`)
        );

        resolve(data);
      }).catch(err => {
        throw err;
        reject("Error : " + err);
      })
    });
  };

  this.getClanByName = (clanName) => {
    var Status = {
      status_ok: true,
      status_code: 0,
      data: []
    };

    return new Promise(function(resolve, reject) {
      SQL.query(`SELECT * FROM cbl.clandata WHERE clanName='${clanName}';`).then(res => {
        Status.data = res;
        resolve(Status);
      }).catch((err) => {
        reject(Status);
        throw err;
      });
    });
  };

  return this;
};

module.exports = PROFILE;
