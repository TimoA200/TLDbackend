const Logger = require("./logger.js");
const Express = require('./express.js')(3000);

const DEBUG = true;

Express.loadExpress(DEBUG);

const app = Express.getExpress();

app.post('/test', async function (req, res) {
  Logger.log('===== START TEST REQUEST =====');
  console.log(req.body);
  res.send('Your request was successful.');
  Logger.log('===== END TEST REQUEST =====');
});
