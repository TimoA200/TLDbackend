const REGISTRATION = (MySQL, Bot, Brawlhalla, Recaptcha) => {

  this.getRegErrorCodeName = (code) => {
    switch (code) {
      case -1:
        return "ReCaptcha invalid";
      case 0:
        return "ok";
      case 1:
        return "DiscordID error";
      case 2:
        return "BrawlhallaID error";
      case 3:
        return "BrawlhallaName error";
      case 4:
        return "SteamID error";
      case 5:
        return "API error (timeout)";
      case 6:
        return "Not a steam link";
      case 7:
        return "Not a steam link";
      case 8:
        return "Brawlhalla Stats API error";
      case 9:
        return "No player stats";

      default:
        return "ok";
    }
  }

  /**
    ###################
    PLAYER REGISTRATION
    ###################
  */

  this.registerPlayer = async (Form, validateCaptcha = true) => {
    return new Promise(async (resolve) => {
      var discordUSER;

      var Player = {
        discordID: 0,
        brawlhallaID: 0,
        steamID: 0,
        discordName: "",
        BrawlhallaName: "",
        comment: Form["comment"],
        clanID: 0,
        strikeMeta: [],
        settings: {
          profile_private: false
        },
        permission: "USER", // TODO:
        registrationDate: new Date().getTime()
      };

      var Status = {
        "status_ok": true,
        "status_code": [],
        "status_message": ""
      };

      if (Form["discord_name"].includes("#")) {
        var name = Form["discord_name"].split("#");
        var count;
        for (count in Bot.users.array()) {
          var User = Bot.users.array()[count];
          if (User.username == name[0] && User.discriminator == name[1]) {
            discordUSER = User;
            Player.discordID = User.id;
            Player.discordName = User.username;
          }
        }
      }

      if (Form["steam_profile"].startsWith("https://steamcommunity.com/")) {
        //GET recaptcha confirmation
        if (validateCaptcha) {
          Recaptcha.isValid(Form["g-recaptcha-response"]).then(res => {
            if (res === false)
              Status.status_code.push(-1);
          });

          if (!Status.status_code.includes(0)) Status.status_ok = false;
          return Status;
        }

        if (Player.discordID === 0) {
          Status.status_code.push(1);
        }

        //SET bhid etc..
        await Brawlhalla.getBhidBySteamUrl(Form["steam_profile"]).then((bh) => {
          Player.steamID = bh.steamId;
          Player.brawlhallaID = bh.brawlhalla_id;
          Player.BrawlhallaName = bh.name;
        }, rea => {
          Status.status_code.push(5);
        }).catch(err => {
          console.log(err);
          Status.status_code.push(5);
        });

        await Brawlhalla.getPlayerStats(Player.brawlhallaID).then(stats => {
          if (JSON.stringify(stats).length <= 2) {
            Status.status_code.push(9);
            return;
          } else
          if (!JSON.stringify(stats).includes("\"clan:\"")) {
            return;
          } else {
            Player.clanID = stats.clan.clan_id;
          }
        }, rea => {
          console.log(err);
          Status.status_code.push(8);
        }).catch(err => {
          console.log(err);
          Status.status_code.push(8);
        });

      } else { //Not a steam URL
        Status.status_code.push(6);
      }

      if (Player.brawlhallaID === 0) {
        Status.status_code.push(2);
      }

      if (Player.BrawlhallaName === "") {
        Status.status_code.push(3);
      }

      if (Player.steamID === 0) {
        Status.status_code.push(4);
      }

      if (!(Player.discordID == 0 || Player.steamID == 0 || Player.discordName == "" || Player.comment == "")) {
        await new Promise(function(resolve) {
          MySQL.query(`SELECT * FROM cbl.playerdata WHERE brawlhallaID=${Player.brawlhallaID}`).then(res => {
            if (res.length >= 1) {
              Status.status_code.push(7);
              resolve();
            } else {
              MySQL.query(`INSERT INTO cbl.playerdata (brawlhallaID, discordID, steamID, clanID, discordName, brawlhallaName, registrationDate, permission, strikeMeta, settings, comment, lastUpdate) VALUES
                ('${Player.brawlhallaID}', '${Player.discordID}', '${Player.steamID}', '${Player.clanID}', '${Player.discordName}', '${Player.BrawlhallaName}', '${new Date().getTime()}', '${Player.permission}', '[]', '${JSON.stringify(Player.settings)}', '${Player.comment}', '${new Date().getTime()}')`)
                .then(() => {
                  Status.status_code.push(0);
                  discordUSER.send("You have been successfully registered at CBL.");
                });
            }
            resolve();
          });
        });
        if (Status.status_code.length === 0)
          Status.status_code.push(0);
      }
      if (!Status.status_code.includes(0)) Status.status_ok = false;
      Status.status_message = this.getRegErrorCodeName(Status.status_code[0]);
      resolve(Status);
    });
  }

  return this;
}

module.exports = REGISTRATION;
