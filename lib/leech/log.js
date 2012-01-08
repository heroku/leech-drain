var conf = require(__dirname + "/conf");

var log = function(msg, f) {
  if (f) {
    log(msg + " at=start");
    var ret = f(function(m) { log(msg + " " + m)});
    log(msg + " at=finish");
    return ret;
  } else {
    console.log("app=leech_drain deploy=" + conf.deploy() + " " + msg);
  }
}

exports.log = log;
