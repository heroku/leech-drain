var env = function(k) {
  var v = process.env[k];
  if (v) {
    return v;
  } else {
    throw("Error: missing process.env[" + k + "]");
  }
}

exports.deploy = function() { return env("DEPLOY"); }
exports.port = function() { return env("PORT"); }
exports.redisUrl = function() { return env("REDIS_URL"); }
