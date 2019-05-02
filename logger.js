const LOGGER = function() {

  this.log = (msg, type = "INFO") => {
    var date = new Date();
    var t = "INFO";
    console.log(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}   ${type}   ${msg}`);
  }

  return this;
}

module.exports = LOGGER();
