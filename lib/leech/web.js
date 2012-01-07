var data = require(__dirname + "/data");
var conf = require(__dirname + "/conf");
var logu = require(__dirname + "/log");
var watch = require(__dirname + "/watch");
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
  log("fn=start-trap", function() {
    process.on("SIGTERM", function() {
      log("fn=start-trap at=catch signal=TERM");
      log("fn=start-trap at=exit status=0");
      process.exit(0);
    });
    log("fn=start-trap at=trapping signal=TERM");
  });
}

var startWatches = function(receiveWatch, publishWatch) {
  log("fn=start-watches", function() {
    setInterval(function() {
      var receivedCount = watch.count(receiveWatch);
      var receiveRate = watch.rate(receiveWatch);
      var publishedCount = watch.count(publishWatch);
      var publishRate = watch.rate(publishWatch);
      watch.tick(receiveWatch);
      watch.tick(publishWatch);
      log("fn=start-watches at=watch-global " +
          "received-count=" + receivedCount + " receive-rate=" + receiveRate + " " +
          "published-count=" + publishedCount + " publish-rate=" + publishRate + " search-count=" + searches.length);
      for (var i=0; i<searches.length; i++) {
        var search = searches[i];
        var matchWatch = search.matchWatch;
        var matchedCount = watch.count(matchWatch);
        var matchRate = watch.rate(matchWatch);
        watch.tick(matchWatch);
        log("fn=start-watch at=watch-search search-id=" + search["search-id"] + " query='" + search["query"] + "' " +
            "matched-count=" + matchedCount + " match-rate=" + matchRate)
      }
    }, 1000);
  });
}

var startSearches = function(redisClient) {
  log("fn=start-searches", function() {
    redisClient.on("ready", function() {
      log("fn=start-searches at=readying");
      setInterval(function() {
        redisClient.zrangebyscore("searches", millis() - 3000, millis() + 3000, function(err, res) {
          if (err) {
            log("fn=start-searches at=error name=" + err.name);
          } else {
            var searchData = data.map(res, function(str) { return JSON.parse(str); });
            var searchIds = data.map(searchData, function(search) { return search["search-id"]; });
            var prevSearchIds = data.map(searches, function(search) { return search["search-id"]; });
            if (!data.areEqual(searchIds, prevSearchIds)) {
              searches = data.map(searchData, function(search) {
                search.matchWatch = watch.init();
                search.matchPred = compilePred(search["query"]);
                return search;
              });
            }
          }
        });
      }, 250);
      log("fn=start-searches at=ready");
    });
  });
}

var startReceiver = function(redisClient, receiveWatch, publishWatch) {
  log("fn=start-receiver", function() {
    var server = http.createServer(function(req, res) {
      log("fn=handler at=request");
      req.setEncoding("utf8");
      res.writeHead(200, {"Content-Type": "application/json"});
      res.write("\n");
      var heartbeatId = setInterval(function() {
        res.write("\n");
        log("fn=handler at=heartbeat");
      }, 5000);

      req.on("end", function(d) {
        log("fn=handler at=end");
        clearInterval(heartbeatId);
        res.end();
      });

      req.on("close", function(d) {
        log("fn=handler at=close");
        clearInterval(heartbeatId);
      });

      var splitter = split.init();
      req.on("data", function(data) {
        split.apply(splitter, data, function(line) {
          watch.hit(receiveWatch);
          var event = JSON.parse(line);
          parse.inflateEvent(event)
          for (var i=0; i<searches.length; i++) {
            var search = searches[i];
            if (search.matchPred(event)) {
              watch.hit(search.matchWatch);
              var matchRate = watch.rate(search.matchWatch);
              if (matchRate < maxMatchRate) {
                watch.hit(publishWatch);
                redisClient.rpush(search["events-key"], JSON.stringify(event));
              }
            }
          }
        });
      });
    });

    log("fn=start-receiver at=bind port=" + conf.port());
    server.listen(conf.port(), "0.0.0.0");
  });
}

var start = function() {
  log("fn=start", function() {
    var receiveWatch = watch.init();
    var publishWatch = watch.init();
    var redisClient = redis.createClient(conf.redisUrl());
    startTrap();
    startSearches(redisClient, receiveWatch, publishWatch);
    startReceiver(redisClient, receiveWatch, publishWatch);
    startWatches(receiveWatch, publishWatch);
  });
}

exports.start = start;
