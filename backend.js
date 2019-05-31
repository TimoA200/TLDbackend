const Express = require('./express.js')();
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const SteamStrategy = require('passport-steam').Strategy;
const multer = require('multer');

const Logger = require("./logger.js");
const Config = require("./config");

mongoose.connect('mongodb://tld.hopto.org/tld', {
  useNewUrlParser: true
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new SteamStrategy({
        returnURL: Config().getHost() + ':' + Config().getPort() + '/auth/steam/return',
        realm: Config().getHost() + ':' + Config().getPort(),
        apiKey: 'A81E42AF2DDFDC28A9B13CE43901F112'
},
    function(identifier, profile, done) {
      process.nextTick(function () {
        profile.identifier = identifier;
        return done(null, profile);
      });
    }
));

Express.loadExpress();

const app = Express.getExpress();
app.use(cookieParser());
app.use(session({
  secret: 'your secret',
  name: 'not_sessionid',
  store: new MongoStore({ mongooseConnection: db }),
  resave: false,
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
        Logger.log('test');
      res.redirect('/');
});

app.get('/auth/steam/return',
    passport.authenticate('steam', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect(Config().DEBUG ? Config().DEBUG_HOST + ':' + Config().DEBUG_WEB_PORT + '/account' : Config().PRODUCTION_HOST + '/account');
        console.log('sessionid: ' + req.cookies['not_sessionid']);
    });

app.post('/test', async function (req, res) {
  Logger.log('===== START TEST REQUEST =====');
  console.log(req.body);
  res.send(JSON.stringify('Your request was successful.'));
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

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    filename: String
});

const ImageModel = mongoose.model('uploads', ImageSchema);

/*const image_instace = new ImageModel({ filename: 'test' });
image_instace.save( (err) => {
    if(err) console.log(err);
});*/

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.filename + ' - ');
    }
});

const upload = multer({ storage: storage });


app.post('/upload', upload.single('image'), async function (req, res) {
    Logger.log('===== START UPLOAD REQUEST =====');
    //console.log(req.body + '');
    res.send(JSON.stringify('Upload was successful.'));
    Logger.log('===== END UPLOAD REQUEST =====');
});
