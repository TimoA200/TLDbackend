const MYSQL = require("mysql");
const SQL = MYSQL.createConnection({
  host: "clanbattleleague.com",
  user: "mastermind",
  password: "greyhound-avert-plop",
  supportBigNumbers: true,
  bigNumberStrings: true
});
const logger = require("./logger");

const MySQL = function() {

  this.getMySQL = () => {
    return this;
  };

  this.pool = undefined;

  this.loadMySQL = function() {

    this.pool = MYSQL.createPool({
      host: "clanbattleleague.com",
      user: "mastermind",
      password: "greyhound-avert-plop",
      supportBigNumbers: true,
      bigNumberStrings: true
    });
  };

  this.query = (sql = "") => {
    return new Promise((resolve, reject) => {
      pool.getConnection(function(err, connection) {
        if (err) {
          console.log("Error accoured in MYSQL [34:0] : " + err);
          reject(err);
        }
        connection.query(sql, [], function(err, results) {
          connection.release(); // always put connection back in pool after last query
          if (err) {
            console.log(err);
            reject("MySQL Error : " + err);
          }
          resolve(results);
        });
      });
    });
  };

  this.handleDisconnect = () => {
    this.pool = MYSQL.createPool({
      host: "clanbattleleague.com",
      user: "mastermind",
      password: "greyhound-avert-plop",
      supportBigNumbers: true,
      bigNumberStrings: true
    });
    logger.log(`(Re)creating MySQL Pool: ${SQL.config.user}@${SQL.config.host}`);
  };

  this.getUserIdByName = (name, limit = 150) => {
    return new Promise((resolve, reject) => {
      SQL.query(`SELECT * FROM cbl.playerdata WHERE '${name}' IN (discordName, brawlhallaName) LIMIT ${limit};`, async function(err, result, fields) {
        if (err) {
          reject("ERROR in SQL");
          throw err;
        }
        resolve(result);
      });
    });
  }


  return this;
}

module.exports = MySQL();
