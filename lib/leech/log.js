var conf = require(__dirname + "/conf");

var log = function(msg, f) {
  if (f) {
    var start = (new Date).getTime();
    log(msg + " at=start");
    var ret = f();
    log(msg + " at=finish");
    return ret;
  } else {
    console.log("app=leech-drain deploy=" + conf.deploy() + " " + msg);
  }
}

exports.log = log;
