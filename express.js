const express = require("express");
const bp = require("body-parser");
const logger = require("./logger.js");
const https = require('https');
const http = require('http');
const fs = require('fs');

const Config = require('./config.js');

const EXPRESS = (_port = 3000) => {

  this.app = express();

  this.loadExpress = (debugMode = false, debugOptions = {
    host: "127.0.0.1",
    port: 3000
  }) => {

    const options = Config.DEBUG ? {
      key: "",
      cert: ""
    } : {
      key: fs.readFileSync("/etc/letsencrypt/live/tld.hopto.org/privkey.pem", "utf8"),
      cert: fs.readFileSync("/etc/letsencrypt/live/tld.hopto.org/fullchain.pem", "utf8"),
    };

    var app = this.app;

    app.set('port', process.env.PORT || (Config.DEBUG ? debugOptions.port : _port));
    if (Config.DEBUG) {
      app.set('host', process.env.HOST || debugOptions.host);
    }
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", Config.DEBUG === true ? 'http://192.168.178.43:3000/auth/steam/return' : 'https://tld.hopto.org:3000/auth/steam/return');
      res.header("Access-Control-Allow-Methods", 'DELETE, PUT, GET, POST, OPTIONS');
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Length");
      res.header("Access-Control-Allow-Credentials", "true");
      next();
    });

    app.use(bp.urlencoded({
      extended: false
    }));

    app.use(bp.json());

    if (!Config.DEBUG) {
      https.createServer(options, app).listen(app.get('port'), app.get('host'), () =>
        logger.log("Started on Port " + app.get('port') + " <PRODUCTION MODE>"));
    } else {
      http.createServer(app).listen(app.get('port'), () =>
        logger.log("Started on port " + app.get('port') + " <DEBUG MODE>"));
    }
  };

  this.getExpress = () => {
    return this.app;
  };

  return this;
};

module.exports = EXPRESS;
