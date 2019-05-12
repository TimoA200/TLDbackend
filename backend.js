const Logger = require("./logger.js");
const Express = require('./express.js')(3000);
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const MySQLStore = require('express-mysql-session')(session);
const SteamStrategy = require('passport-steam').Strategy;

const DEBUG = false;

const options = {
  host: 'clanbattleleague.com',
  port: '3306',
  user: 'mastermind',
  password: 'greyhound-avert-plop',
  database: 'test'
};

const connection = mysql.createConnection(options);
const sessionStore = new MySQLStore({
  createDatabaseTable: true,
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
}, connection);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new SteamStrategy({
  returnURL: DEBUG === true ? 'http://192.168.178.43:3000/auth/steam/return' : 'https://tld.hopto.org:3000/auth/steam/return',
  realm: DEBUG === true ? 'http://192.168.178.43:3000' : 'https://tld.hopto.org:3000',
  apiKey: 'A81E42AF2DDFDC28A9B13CE43901F112'
},
    function(identifier, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {

        // To keep the example simple, the user's Steam profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the Steam account with a user record in your database,
        // and return that user instead.
        profile.identifier = identifier;
        return done(null, profile);
      });
    }
));

Express.loadExpress(DEBUG);

const app = Express.getExpress();
app.use(cookieParser());
app.use(session({
  secret: 'your secret',
  name: 'not_sessionid',
  store: sessionStore,
  resave: true,
  saveUninitialized: true}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/account', ensureAuthenticated, function(req, res){
  //res.render('account', { user: req.user });
  res.send(req.user);
});

app.get('/logout', function(req, res){
  req.logout();
  res.send(JSON.stringify('logout success'));
});

app.get('/auth/steam',
    passport.authenticate('steam', { failureRedirect: '/' }),
    function(req, res) {
      res.redirect('/');
});

app.get('/auth/steam/return',
    passport.authenticate('steam', { failureRedirect: '/' }),
    function(req, res) {
      res.redirect(DEBUG === true ? 'http://192.168.178.43:4400/account' : 'https://tld.hopto.org/account');
      console.log('sessionid: ' + req.cookies['not_sessionid']);
    });

app.post('/test', async function (req, res) {
  Logger.log('===== START TEST REQUEST =====');
  console.log(req.body);
  res.send('Your request was successful.');
  Logger.log('===== END TEST REQUEST =====');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('ensureAuthenticated -> true');
    return next();
  } else {
    console.log('ensureAuthenticated -> false');
  }
  res.redirect('/');
}
