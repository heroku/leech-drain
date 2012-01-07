var intRe = /^-?[0-9]{1,18}$/;
var floatRe = /^-?[0-9]+\.[0-9]+$/;
var attrsRe = /( *)([a-zA-Z0-9_]+)(=?)([a-zA-Z0-9\.:\/_,-]*)/;

var coerceVal = function(v) {
  if (intRe.exec(v)) {
    return parseInt(v);
  } else if (floatRe.exec(v)) {
    return parseFloat(v);
  } else if (v == "") {
    return true;
  } else {
    return v;
  }
}

var inflateMessageAttrs = function(event) {
  var unparsedMsg = event.msg;
  if (unparsedMsg) {
    while (true) {
      var matches = attrsRe.exec(unparsedMsg);
      if (matches) {
        var match = matches[0];
        var space = matches[1];
        var key = matches[2];
        var eq = matches[3];
        var val = matches[4];
        event[key] = coerceVal(val);
        unparsedMsg = unparsedMsg.substring(match.length, unparsedMsg.length);
      } else {
        break;
      }
    }
  }
}

var parseMessageAttrs = function(msg) {
  var data = {"msg": msg};
  inflateMessageAttrs(data);
  delete data["msg"];
  return data;
}

var inflatePs = function(event) {
  event.ps = coerceVal(event.ps);
}

var inflateLine = function(event) {
  event.line = event.timestamp + " " + event.facility + "." + event.level + " " + event.source + "[" + event.ps + "]" + " - " + event.slot + "." + event.instance_id + "@" + event.cloud + " - " + event.msg;
}

var inflateEvent = function(event) {
  inflatePs(event);
  inflateMessageAttrs(event);
  inflateLine(event);
}

exports.coerceVal = coerceVal;
exports.parseMessageAttrs = parseMessageAttrs;
exports.inflateEvent = inflateEvent;
