const express = require("express");
const bp = require("body-parser");
const logger = require("./logger.js");
const https = require('https');
const http = require('http');
const fs = require('fs');

const EXPRESS = (_port = 3000) => {

  this.app = express();

  this.loadExpress = (debugMode = false, debugOptions = {
    host: "127.0.0.1",
    port: 3000
  }) => {

    const options = debugMode ? {
      key: "",
      cert: ""
    } : {
      key: fs.readFileSync("/etc/letsencrypt/live/tld.hopto.org/privkey.pem", "utf8"),
      cert: fs.readFileSync("/etc/letsencrypt/live/tld.hopto.org/fullchain.pem", "utf8"),
    };

    var app = this.app;

    app.set('port', process.env.PORT || (debugMode ? debugOptions.port : _port));
    if (debugMode) {
      app.set('host', process.env.HOST || debugOptions.host);
    }
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "https://tld.hopto.org");
      res.header("Access-Control-Allow-Methods", 'DELETE, PUT, GET, POST, OPTIONS');
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Length");
      res.header("Access-Control-Allow-Credentials", "true");
      next();
    });

    app.use(bp.urlencoded({
      extended: false
    }));

    app.use(bp.json());

    if (!debugMode) {
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
;}

module.exports = EXPRESS;
