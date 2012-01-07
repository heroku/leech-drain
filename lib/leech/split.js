var init = function() {
  return {last: ""};
}

var apply = function(splitter, data, onLine) {
  data = (splitter.last + data);
  var lines = data.split("\n");
  splitter.last = lines[lines.length-1];
  for (var i=0; i < lines.length-1; i++) {
    var line = lines[i];
    if (line != "") {
      onLine(line);
    }
  }
}

exports.init = init;
exports.apply = apply;
