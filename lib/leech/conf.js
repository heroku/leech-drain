var env = function(k) {
  var v = process.env[k];
  if (v) {
    return v;
  } else {
    throw("Error: missing process.env[" + k + "]");
  }
}

var deploy = function() { return env("DEPLOY"); }
var port = function() { return env("PORT"); }
var redisUrl = function() { return env("REDIS_URL"); }

exports.env = env;
exports.deploy = deploy;
exports.port = port;
exports.redisUrl = redisUrl;
