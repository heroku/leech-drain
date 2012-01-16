var data = require(__dirname + "/data");
var conf = require(__dirname + "/conf");
var logu = require(__dirname + "/log");
var parse = require(__dirname + "/parse");
var split = require(__dirname + "/split");
var redis = require("redis-url");
var http = require("http");

var searches = [];

var log = function(msg, f) {
  logu.log("ns=web " + msg, f);
}

var millis = function() {
  return (new Date).getTime();
}

var maxMatchRate = 25;

var compileCrit = function(critK, critV) {
  if (!data.isString(critV) || (critV.split(",").length == 1)) {
    var critC = parse.coerceVal(critV);
    return function(evt) { return (evt[critK] == critC); };
  } else {
    var critCs = map(critV.split(","), function(v) { return parse.coerceVal(v); });
    return function(evt) {
      var evtV = evt[critK];
      return data.any(critCs, function(critC) { return (evtV == critC); });
    }
  }
}

var compilePred = function(query) {
  var crits = parse.parseMessageAttrs(query);
  var k = 0;
  var critPs = new Array();
  for (critK in crits) {
    var critV = crits[critK];
    var critP = compileCrit(critK, critV);
    critPs[k] = critP;
    k += 1;
  }
  return function(evt) {
    return data.all(critPs, function(critP) { return critP(evt); });
  }
}

var startTrap = function() {
  log("fn=start_trap", function(log) {
    process.on("SIGTERM", function() {
      log("at=catch signal=TERM");
      log("at=exit status=0");
      process.exit(0);
    });
  });
}

var logSearchStats = function(searches) {
  for (var i=0; i<searches.length; i++) {
    var search = searches[i];
    log("fn=log_search_stats at=emit search_id=" + search["search_id"] + " query='" + search["query"] + "' event_matched_rate=" + search.stats.eventMatchedRate + " match_dropped_rate=" + search.stats.matchDroppedRate + " match_publish_rate=" + search.stats.matchPublishedRate);
    search.stats.eventMatchedRate = 0;
    search.stats.matchDroppedRate = 0;
    search.stats.matchPublishedRate = 0;
  }
}

var startSearchStats = function() {
  log("fn=start_search_stats", function() {
    setInterval(function() { logSearchStats(searches); }, 1000);
  });
}

var startSearches = function(redisClient) {
  log("fn=start_searches", function(log) {
    redisClient.on("ready", function() {
      log("at=readying");
      setInterval(function() {
        redisClient.zrangebyscore("searches", millis() - 3000, millis() + 3000, function(err, res) {
          if (err) {
            log("at=error name=" + err.name);
          } else {
            var searchData = data.map(res, function(str) { return JSON.parse(str); });
            var searchIds = data.map(searchData, function(search) { return search["search_id"]; });
            var prevSearchIds = data.map(searches, function(search) { return search["search_id"]; });
            if (!data.areEqual(searchIds, prevSearchIds)) {
              searches = data.map(searchData, function(search) {
                search.stats = {eventMatchedRate: 0, matchDroppedRate: 0, matchPublishedRate: 0};
                search.matchPred = compilePred(search["query"]);
                return search;
              });
            }
          }
        });
      }, 250);
      log("at=ready");
    });
  });
}

var resetConnStats = function(connStats) {
  connStats.dataReceivedRate = 0;
  connStats.eventReceivedRate = 0;
}

var logConnStats = function(connStats) {
  log("fn=log_conn_stats at=emit request_id=" + connStats.requestId + " data_received_rate=" + connStats.dataReceivedRate + " event_received_rate=" + connStats.eventReceivedRate + " incoming_age=" + (millis() - connStats.incomingAt));
}

var handler = function(redisClient, globalStats) {
  return function(req, res) {
    var requestId = req.headers["x-request-id"];
    log("fn=handler request_id=" + requestId, function(log) {
      var connStats = {requestId: requestId, incomingAt: millis()};
      resetConnStats(connStats);
      var connStatsInterval = setInterval(function() {
        logConnStats(connStats);
        resetConnStats(connStats);
      }, 1000);
      var connHeartbeatInterval = setInterval(function() {
        res.write("\n");
      }, 5000);

      req.setEncoding("utf8");
      res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
      res.write("\n");

      req.on("end", function(d) {
        log("at=end");
        clearInterval(connStatsInterval);
        clearInterval(connHeartbeatInterval);
        res.end();
      });

      req.on("close", function(d) {
        log("at=close");
        clearInterval(connStatsInterval);
        clearInterval(connHeartbeatInterval)
      });

      var splitter = split.init();
      req.on("data", function(data) {
        connStats.incomingAt = globalStats.incomingAt = millis();
        connStats.dataReceivedRate += 1;
        globalStats.dataReceivedRate += 1;
        split.apply(splitter, data, function(line) {
          var event = JSON.parse(line);
          parse.inflateEvent(event)
          connStats.eventReceivedRate += 1;
          globalStats.eventReceivedRate += 1;
          for (var i=0; i<searches.length; i++) {
            var search = searches[i];
            if (search.matchPred(event)) {
              search.stats.eventMatchedRate += 1;
              globalStats.eventMatchedRate += 1;
              if (search.stats.eventMatchedRate < maxMatchRate) {
                search.stats.matchPublishedRate += 1;
                globalStats.matchPublishedRate += 1;
                redisClient.rpush(search["events_key"], JSON.stringify(event));
              } else {
                search.stats.matchDroppedRate += 1;
                globalStats.matchDroppedRate += 1;
              }
            }
          }
        });
      });
    });
  }
}

var startReceiver = function(redisClient, globalStats) {
  log("fn=start_receiver port=" + conf.port(), function(log) {
    var server = http.createServer(handler(redisClient, globalStats));
    log("at=listen");
    server.listen(conf.port(), "0.0.0.0");
  });
}

var resetGlobalStats = function(globalStats) {
  globalStats.dataReceivedRate = 0;
  globalStats.eventReceivedRate = 0;
  globalStats.eventMatchedRate = 0;
  globalStats.matchDroppedRate = 0;
  globalStats.matchPublishedRate = 0;
}

var logGlobalStats = function(globalStats) {
  log("fn=log_global_stats at=emit data_received_rate=" + globalStats.dataReceivedRate + " event_received_rate=" + globalStats.eventReceivedRate + " event_matched_rate=" + globalStats.eventMatchedRate + " match_dropped_rate=" + globalStats.matchDroppedRate + " match_published_rate=" + globalStats.matchPublishedRate + " incoming_age=" + (millis() - globalStats.incomingAt) + " search_count=" + searches.length);
}

var startGlobalStats = function(globalStats) {
  log("fn=start_global_stats", function() {
    resetGlobalStats(globalStats);
    setInterval(function() { logGlobalStats(globalStats); resetGlobalStats(globalStats); }, 1000);
  });
}

var start = function() {
  log("fn=start", function() {
    var redisClient = redis.createClient(conf.redisUrl());
    var globalStats = {incomingAt: millis()};
    startGlobalStats(globalStats);
    startSearchStats();
    startTrap();
    startSearches(redisClient);
    startReceiver(redisClient, globalStats);
  });
}

exports.start = start;
