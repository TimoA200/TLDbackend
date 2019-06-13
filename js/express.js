const express = require("express");
const bp = require("body-parser");
const logger = require("./logger.js");
const https = require('https');
const http = require('http');
const fs = require('fs');

const Config = require('./config.js');

const EXPRESS = () => {

  this.app = express();

  this.loadExpress = () => {

    const options = Config().DEBUG ? {
      key: "",
      cert: ""
    } : {
      key: fs.readFileSync("/etc/letsencrypt/live/tld.hopto.org/privkey.pem", "utf8"),
      cert: fs.readFileSync("/etc/letsencrypt/live/tld.hopto.org/fullchain.pem", "utf8"),
    };

    var app = this.app;

    app.set('port', process.env.PORT || Config().getPort());
    if(Config().DEBUG)
      app.set('host', process.env.HOST || Config().getHost());
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", Config().DEBUG ? Config().DEBUG_HOST + ':' + Config().DEBUG_WEB_PORT : Config().PRODUCTION_HOST);
      res.header("Access-Control-Allow-Methods", 'DELETE, PUT, GET, POST, OPTIONS');
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Length");
      res.header("Access-Control-Allow-Credentials", "true");
      next();
    });

    app.use(bp.urlencoded({
      extended: false
    }));

    app.use('/uploads', express.static('uploads'));

    app.use(bp.json());

    if (!Config().DEBUG) {
      https.createServer(options, app).listen(app.get('port'), app.get('host'), () =>
        logger.log("Started on Host " + app.get('host') + " with PORT " + app.get('port') + " <PRODUCTION MODE>"));
    } else {
      http.createServer(app).listen(app.get('port'), () =>
        logger.log("Started on Host " + app.get('host') + " with PORT " + app.get('port') + " <DEBUG MODE>"));
    }
  };

  this.getExpress = () => {
    return this.app;
  };
  return this;
};

module.exports = EXPRESS;
