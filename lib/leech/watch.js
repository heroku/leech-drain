var init = function() {
  return {count: 0, prevCount: 0};
}

var rate = function(w) {
  return w.count - w.prevCount;
}

var count = function(w) {
  return w.count;
}

var hit = function(w) {
  w.count += 1;
}

var tick = function(w) {
  w.prevCount = w.count;
}

exports.init = init;
exports.hit = hit;
exports.rate = rate;
exports.count = count;
exports.tick = tick;
