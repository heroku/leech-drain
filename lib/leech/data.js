var map = function(a, f) {
  var res = new Array(a.length);
  for (var i=0; i<a.length; i++) {
    res[i] = f(a[i]);
  }
  return res;
}

var each = function(a, f) {
  for (var i=0; i<a.length; i++) {
    f(a[i]);
  }
}

var any = function(a, f) {
  for (var i=0; i<a.length; i++) {
    if (f(a[i])) { return true; }
  }
  return false;
}

var all = function(a, f) {
  for (var i=0; i<a.length; i++) {
    if (!f(a[i])) { return false; }
  }
  return true;
}

var isString = function(v) {
  return (typeof(v) == "string");
}

var areEqual = function(a1, a2) {
  if (a1.length != a2.length) {
    return false;
  } else {
    for (var i=0; i<a1.length; i++) {
      if (a1[i] != a2[i]) {
        return false;
      }
    }
    return true;
  }
}

exports.map = map;
exports.each = each;
exports.any = any;
exports.all = all;
exports.isString = isString;
exports.areEqual = areEqual;
