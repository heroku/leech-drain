#!/usr/bin/nodejs
var COMPILED = !0, goog = goog || {};
goog.global = this;
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.evalWorksForGlobals_ = null;
goog.provide = function(a) {
  if(!COMPILED) {
    if(goog.getObjectByName(a) && !goog.implicitNamespaces_[a]) {
      throw Error('Namespace "' + a + '" already declared.');
    }
    for(var b = a;b = b.substring(0, b.lastIndexOf("."));) {
      goog.implicitNamespaces_[b] = !0
    }
  }
  goog.exportPath_(a)
};
goog.setTestOnly = function(a) {
  if(COMPILED && !goog.DEBUG) {
    throw a = a || "", Error("Importing test-only code into non-debug environment" + a ? ": " + a : ".");
  }
};
if(!COMPILED) {
  goog.implicitNamespaces_ = {}
}
goog.exportPath_ = function(a, b, c) {
  a = a.split(".");
  c = c || goog.global;
  !(a[0] in c) && c.execScript && c.execScript("var " + a[0]);
  for(var d;a.length && (d = a.shift());) {
    !a.length && goog.isDef(b) ? c[d] = b : c = c[d] ? c[d] : c[d] = {}
  }
};
goog.getObjectByName = function(a, b) {
  for(var c = a.split("."), d = b || goog.global, e;e = c.shift();) {
    if(goog.isDefAndNotNull(d[e])) {
      d = d[e]
    }else {
      return null
    }
  }
  return d
};
goog.globalize = function(a, b) {
  var c = b || goog.global, d;
  for(d in a) {
    c[d] = a[d]
  }
};
goog.addDependency = function(a, b, c) {
  if(!COMPILED) {
    for(var d, a = a.replace(/\\/g, "/"), e = goog.dependencies_, f = 0;d = b[f];f++) {
      e.nameToPath[d] = a, a in e.pathToNames || (e.pathToNames[a] = {}), e.pathToNames[a][d] = !0
    }
    for(d = 0;b = c[d];d++) {
      a in e.requires || (e.requires[a] = {}), e.requires[a][b] = !0
    }
  }
};
goog.require = function(a) {
  if(!COMPILED && !goog.getObjectByName(a)) {
    var b = goog.getPathFromDeps_(a);
    if(b) {
      goog.included_[b] = !0, goog.writeScripts_()
    }else {
      throw a = "goog.require could not find: " + a, goog.global.console && goog.global.console.error(a), Error(a);
    }
  }
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.identityFunction = function(a) {
  return a
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
  a.getInstance = function() {
    return a.instance_ || (a.instance_ = new a)
  }
};
if(!COMPILED) {
  goog.included_ = {}, goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}}, goog.inHtmlDocument_ = function() {
    var a = goog.global.document;
    return typeof a != "undefined" && "write" in a
  }, goog.findBasePath_ = function() {
    if(goog.global.CLOSURE_BASE_PATH) {
      goog.basePath = goog.global.CLOSURE_BASE_PATH
    }else {
      if(goog.inHtmlDocument_()) {
        for(var a = goog.global.document.getElementsByTagName("script"), b = a.length - 1;b >= 0;--b) {
          var c = a[b].src, d = c.lastIndexOf("?"), d = d == -1 ? c.length : d;
          if(c.substr(d - 7, 7) == "base.js") {
            goog.basePath = c.substr(0, d - 7);
            break
          }
        }
      }
    }
  }, goog.importScript_ = function(a) {
    var b = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    !goog.dependencies_.written[a] && b(a) && (goog.dependencies_.written[a] = !0)
  }, goog.writeScriptTag_ = function(a) {
    return goog.inHtmlDocument_() ? (goog.global.document.write('<script type="text/javascript" src="' + a + '"><\/script>'), !0) : !1
  }, goog.writeScripts_ = function() {
    function a(e) {
      if(!(e in d.written)) {
        if(!(e in d.visited) && (d.visited[e] = !0, e in d.requires)) {
          for(var g in d.requires[e]) {
            if(g in d.nameToPath) {
              a(d.nameToPath[g])
            }else {
              if(!goog.getObjectByName(g)) {
                throw Error("Undefined nameToPath for " + g);
              }
            }
          }
        }
        e in c || (c[e] = !0, b.push(e))
      }
    }
    var b = [], c = {}, d = goog.dependencies_, e;
    for(e in goog.included_) {
      d.written[e] || a(e)
    }
    for(e = 0;e < b.length;e++) {
      if(b[e]) {
        goog.importScript_(goog.basePath + b[e])
      }else {
        throw Error("Undefined script input");
      }
    }
  }, goog.getPathFromDeps_ = function(a) {
    return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null
  }, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js")
}
goog.typeOf = function(a) {
  var b = typeof a;
  if(b == "object") {
    if(a) {
      if(a instanceof Array) {
        return"array"
      }else {
        if(a instanceof Object) {
          return b
        }
      }
      var c = Object.prototype.toString.call(a);
      if(c == "[object Window]") {
        return"object"
      }
      if(c == "[object Array]" || typeof a.length == "number" && typeof a.splice != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("splice")) {
        return"array"
      }
      if(c == "[object Function]" || typeof a.call != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if(b == "function" && typeof a.call == "undefined") {
      return"object"
    }
  }
  return b
};
goog.propertyIsEnumerableCustom_ = function(a, b) {
  if(b in a) {
    for(var c in a) {
      if(c == b && Object.prototype.hasOwnProperty.call(a, b)) {
        return!0
      }
    }
  }
  return!1
};
goog.propertyIsEnumerable_ = function(a, b) {
  return a instanceof Object ? Object.prototype.propertyIsEnumerable.call(a, b) : goog.propertyIsEnumerableCustom_(a, b)
};
goog.isDef = function(a) {
  return a !== void 0
};
goog.isNull = function(a) {
  return a === null
};
goog.isDefAndNotNull = function(a) {
  return a != null
};
goog.isArray = function(a) {
  return goog.typeOf(a) == "array"
};
goog.isArrayLike = function(a) {
  var b = goog.typeOf(a);
  return b == "array" || b == "object" && typeof a.length == "number"
};
goog.isDateLike = function(a) {
  return goog.isObject(a) && typeof a.getFullYear == "function"
};
goog.isString = function(a) {
  return typeof a == "string"
};
goog.isBoolean = function(a) {
  return typeof a == "boolean"
};
goog.isNumber = function(a) {
  return typeof a == "number"
};
goog.isFunction = function(a) {
  return goog.typeOf(a) == "function"
};
goog.isObject = function(a) {
  a = goog.typeOf(a);
  return a == "object" || a == "array" || a == "function"
};
goog.getUid = function(a) {
  return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.removeUid = function(a) {
  "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete a[goog.UID_PROPERTY_]
  }catch(b) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + Math.floor(Math.random() * 2147483648).toString(36);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
  var b = goog.typeOf(a);
  if(b == "object" || b == "array") {
    if(a.clone) {
      return a.clone()
    }
    var b = b == "array" ? [] : {}, c;
    for(c in a) {
      b[c] = goog.cloneObject(a[c])
    }
    return b
  }
  return a
};
goog.bindNative_ = function(a, b, c) {
  return a.call.apply(a.bind, arguments)
};
goog.bindJs_ = function(a, b, c) {
  var d = b || goog.global;
  if(arguments.length > 2) {
    var e = Array.prototype.slice.call(arguments, 2);
    return function() {
      var b = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(b, e);
      return a.apply(d, b)
    }
  }else {
    return function() {
      return a.apply(d, arguments)
    }
  }
};
goog.bind = function(a, b, c) {
  goog.bind = Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? goog.bindNative_ : goog.bindJs_;
  return goog.bind.apply(null, arguments)
};
goog.partial = function(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = Array.prototype.slice.call(arguments);
    b.unshift.apply(b, c);
    return a.apply(this, b)
  }
};
goog.mixin = function(a, b) {
  for(var c in b) {
    a[c] = b[c]
  }
};
goog.now = Date.now || function() {
  return+new Date
};
goog.globalEval = function(a) {
  if(goog.global.execScript) {
    goog.global.execScript(a, "JavaScript")
  }else {
    if(goog.global.eval) {
      if(goog.evalWorksForGlobals_ == null) {
        goog.global.eval("var _et_ = 1;"), typeof goog.global._et_ != "undefined" ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1
      }
      if(goog.evalWorksForGlobals_) {
        goog.global.eval(a)
      }else {
        var b = goog.global.document, c = b.createElement("script");
        c.type = "text/javascript";
        c.defer = !1;
        c.appendChild(b.createTextNode(a));
        b.body.appendChild(c);
        b.body.removeChild(c)
      }
    }else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.getCssName = function(a, b) {
  var c = function(a) {
    return goog.cssNameMapping_[a] || a
  }, d;
  d = goog.cssNameMapping_ ? goog.cssNameMappingStyle_ == "BY_WHOLE" ? c : function(a) {
    for(var a = a.split("-"), b = [], d = 0;d < a.length;d++) {
      b.push(c(a[d]))
    }
    return b.join("-")
  } : function(a) {
    return a
  };
  return b ? a + "-" + d(b) : d(a)
};
goog.setCssNameMapping = function(a, b) {
  goog.cssNameMapping_ = a;
  goog.cssNameMappingStyle_ = b
};
goog.getMsg = function(a, b) {
  var c = b || {}, d;
  for(d in c) {
    var e = ("" + c[d]).replace(/\$/g, "$$$$"), a = a.replace(RegExp("\\{\\$" + d + "\\}", "gi"), e)
  }
  return a
};
goog.exportSymbol = function(a, b, c) {
  goog.exportPath_(a, b, c)
};
goog.exportProperty = function(a, b, c) {
  a[b] = c
};
goog.inherits = function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.superClass_ = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a
};
goog.base = function(a, b, c) {
  var d = arguments.callee.caller;
  if(d.superClass_) {
    return d.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1))
  }
  for(var e = Array.prototype.slice.call(arguments, 2), f = !1, g = a.constructor;g;g = g.superClass_ && g.superClass_.constructor) {
    if(g.prototype[b] === d) {
      f = !0
    }else {
      if(f) {
        return g.prototype[b].apply(a, e)
      }
    }
  }
  if(a[b] === d) {
    return a.constructor.prototype[b].apply(a, e)
  }else {
    throw Error("goog.base called from a method of one name to a method of a different name");
  }
};
goog.scope = function(a) {
  a.call(goog.global)
};
goog.string = {};
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(a, b) {
  return a.lastIndexOf(b, 0) == 0
};
goog.string.endsWith = function(a, b) {
  var c = a.length - b.length;
  return c >= 0 && a.indexOf(b, c) == c
};
goog.string.caseInsensitiveStartsWith = function(a, b) {
  return goog.string.caseInsensitiveCompare(b, a.substr(0, b.length)) == 0
};
goog.string.caseInsensitiveEndsWith = function(a, b) {
  return goog.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length)) == 0
};
goog.string.subs = function(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = String(arguments[c]).replace(/\$/g, "$$$$"), a = a.replace(/\%s/, d)
  }
  return a
};
goog.string.collapseWhitespace = function(a) {
  return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function(a) {
  return/^[\s\xa0]*$/.test(a)
};
goog.string.isEmptySafe = function(a) {
  return goog.string.isEmpty(goog.string.makeSafe(a))
};
goog.string.isBreakingWhitespace = function(a) {
  return!/[^\t\n\r ]/.test(a)
};
goog.string.isAlpha = function(a) {
  return!/[^a-zA-Z]/.test(a)
};
goog.string.isNumeric = function(a) {
  return!/[^0-9]/.test(a)
};
goog.string.isAlphaNumeric = function(a) {
  return!/[^a-zA-Z0-9]/.test(a)
};
goog.string.isSpace = function(a) {
  return a == " "
};
goog.string.isUnicodeChar = function(a) {
  return a.length == 1 && a >= " " && a <= "~" || a >= "\u0080" && a <= "\ufffd"
};
goog.string.stripNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function(a) {
  return a.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function(a) {
  return a.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.trim = function(a) {
  return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function(a) {
  return a.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function(a) {
  return a.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function(a, b) {
  var c = String(a).toLowerCase(), d = String(b).toLowerCase();
  return c < d ? -1 : c == d ? 0 : 1
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(a, b) {
  if(a == b) {
    return 0
  }
  if(!a) {
    return-1
  }
  if(!b) {
    return 1
  }
  for(var c = a.toLowerCase().match(goog.string.numerateCompareRegExp_), d = b.toLowerCase().match(goog.string.numerateCompareRegExp_), e = Math.min(c.length, d.length), f = 0;f < e;f++) {
    var g = c[f], h = d[f];
    if(g != h) {
      c = parseInt(g, 10);
      return!isNaN(c) && (d = parseInt(h, 10), !isNaN(d) && c - d) ? c - d : g < h ? -1 : 1
    }
  }
  return c.length != d.length ? c.length - d.length : a < b ? -1 : 1
};
goog.string.encodeUriRegExp_ = /^[a-zA-Z0-9\-_.!~*'()]*$/;
goog.string.urlEncode = function(a) {
  a = String(a);
  return!goog.string.encodeUriRegExp_.test(a) ? encodeURIComponent(a) : a
};
goog.string.urlDecode = function(a) {
  return decodeURIComponent(a.replace(/\+/g, " "))
};
goog.string.newLineToBr = function(a, b) {
  return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>")
};
goog.string.htmlEscape = function(a, b) {
  if(b) {
    return a.replace(goog.string.amperRe_, "&amp;").replace(goog.string.ltRe_, "&lt;").replace(goog.string.gtRe_, "&gt;").replace(goog.string.quotRe_, "&quot;")
  }else {
    if(!goog.string.allRe_.test(a)) {
      return a
    }
    a.indexOf("&") != -1 && (a = a.replace(goog.string.amperRe_, "&amp;"));
    a.indexOf("<") != -1 && (a = a.replace(goog.string.ltRe_, "&lt;"));
    a.indexOf(">") != -1 && (a = a.replace(goog.string.gtRe_, "&gt;"));
    a.indexOf('"') != -1 && (a = a.replace(goog.string.quotRe_, "&quot;"));
    return a
  }
};
goog.string.amperRe_ = /&/g;
goog.string.ltRe_ = /</g;
goog.string.gtRe_ = />/g;
goog.string.quotRe_ = /\"/g;
goog.string.allRe_ = /[&<>\"]/;
goog.string.unescapeEntities = function(a) {
  return goog.string.contains(a, "&") ? "document" in goog.global && !goog.string.contains(a, "<") ? goog.string.unescapeEntitiesUsingDom_(a) : goog.string.unescapePureXmlEntities_(a) : a
};
goog.string.unescapeEntitiesUsingDom_ = function(a) {
  var b = goog.global.document.createElement("div");
  b.innerHTML = "<pre>x" + a + "</pre>";
  if(b.firstChild[goog.string.NORMALIZE_FN_]) {
    b.firstChild[goog.string.NORMALIZE_FN_]()
  }
  a = b.firstChild.firstChild.nodeValue.slice(1);
  b.innerHTML = "";
  return goog.string.canonicalizeNewlines(a)
};
goog.string.unescapePureXmlEntities_ = function(a) {
  return a.replace(/&([^;]+);/g, function(a, c) {
    switch(c) {
      case "amp":
        return"&";
      case "lt":
        return"<";
      case "gt":
        return">";
      case "quot":
        return'"';
      default:
        if(c.charAt(0) == "#") {
          var d = Number("0" + c.substr(1));
          if(!isNaN(d)) {
            return String.fromCharCode(d)
          }
        }
        return a
    }
  })
};
goog.string.NORMALIZE_FN_ = "normalize";
goog.string.whitespaceEscape = function(a, b) {
  return goog.string.newLineToBr(a.replace(/  /g, " &#160;"), b)
};
goog.string.stripQuotes = function(a, b) {
  for(var c = b.length, d = 0;d < c;d++) {
    var e = c == 1 ? b : b.charAt(d);
    if(a.charAt(0) == e && a.charAt(a.length - 1) == e) {
      return a.substring(1, a.length - 1)
    }
  }
  return a
};
goog.string.truncate = function(a, b, c) {
  c && (a = goog.string.unescapeEntities(a));
  a.length > b && (a = a.substring(0, b - 3) + "...");
  c && (a = goog.string.htmlEscape(a));
  return a
};
goog.string.truncateMiddle = function(a, b, c, d) {
  c && (a = goog.string.unescapeEntities(a));
  if(d) {
    d > b && (d = b);
    var e = a.length - d, a = a.substring(0, b - d) + "..." + a.substring(e)
  }else {
    a.length > b && (d = Math.floor(b / 2), e = a.length - d, d += b % 2, a = a.substring(0, d) + "..." + a.substring(e))
  }
  c && (a = goog.string.htmlEscape(a));
  return a
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\u000b":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(a) {
  a = String(a);
  if(a.quote) {
    return a.quote()
  }else {
    for(var b = ['"'], c = 0;c < a.length;c++) {
      var d = a.charAt(c), e = d.charCodeAt(0);
      b[c + 1] = goog.string.specialEscapeChars_[d] || (e > 31 && e < 127 ? d : goog.string.escapeChar(d))
    }
    b.push('"');
    return b.join("")
  }
};
goog.string.escapeString = function(a) {
  for(var b = [], c = 0;c < a.length;c++) {
    b[c] = goog.string.escapeChar(a.charAt(c))
  }
  return b.join("")
};
goog.string.escapeChar = function(a) {
  if(a in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[a]
  }
  if(a in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[a] = goog.string.specialEscapeChars_[a]
  }
  var b = a, c = a.charCodeAt(0);
  if(c > 31 && c < 127) {
    b = a
  }else {
    if(c < 256) {
      if(b = "\\x", c < 16 || c > 256) {
        b += "0"
      }
    }else {
      b = "\\u", c < 4096 && (b += "0")
    }
    b += c.toString(16).toUpperCase()
  }
  return goog.string.jsEscapeCache_[a] = b
};
goog.string.toMap = function(a) {
  for(var b = {}, c = 0;c < a.length;c++) {
    b[a.charAt(c)] = !0
  }
  return b
};
goog.string.contains = function(a, b) {
  return a.indexOf(b) != -1
};
goog.string.removeAt = function(a, b, c) {
  var d = a;
  b >= 0 && b < a.length && c > 0 && (d = a.substr(0, b) + a.substr(b + c, a.length - b - c));
  return d
};
goog.string.remove = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "");
  return a.replace(c, "")
};
goog.string.removeAll = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "g");
  return a.replace(c, "")
};
goog.string.regExpEscape = function(a) {
  return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function(a, b) {
  return Array(b + 1).join(a)
};
goog.string.padNumber = function(a, b, c) {
  a = goog.isDef(c) ? a.toFixed(c) : String(a);
  c = a.indexOf(".");
  if(c == -1) {
    c = a.length
  }
  return goog.string.repeat("0", Math.max(0, b - c)) + a
};
goog.string.makeSafe = function(a) {
  return a == null ? "" : String(a)
};
goog.string.buildString = function(a) {
  return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function() {
  return Math.floor(Math.random() * 2147483648).toString(36) + Math.abs(Math.floor(Math.random() * 2147483648) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function(a, b) {
  for(var c = 0, d = goog.string.trim(String(a)).split("."), e = goog.string.trim(String(b)).split("."), f = Math.max(d.length, e.length), g = 0;c == 0 && g < f;g++) {
    var h = d[g] || "", i = e[g] || "", j = RegExp("(\\d*)(\\D*)", "g"), k = RegExp("(\\d*)(\\D*)", "g");
    do {
      var l = j.exec(h) || ["", "", ""], m = k.exec(i) || ["", "", ""];
      if(l[0].length == 0 && m[0].length == 0) {
        break
      }
      var c = l[1].length == 0 ? 0 : parseInt(l[1], 10), o = m[1].length == 0 ? 0 : parseInt(m[1], 10), c = goog.string.compareElements_(c, o) || goog.string.compareElements_(l[2].length == 0, m[2].length == 0) || goog.string.compareElements_(l[2], m[2])
    }while(c == 0)
  }
  return c
};
goog.string.compareElements_ = function(a, b) {
  if(a < b) {
    return-1
  }else {
    if(a > b) {
      return 1
    }
  }
  return 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(a) {
  for(var b = 0, c = 0;c < a.length;++c) {
    b = 31 * b + a.charCodeAt(c), b %= goog.string.HASHCODE_MAX_
  }
  return b
};
goog.string.uniqueStringCounter_ = Math.random() * 2147483648 | 0;
goog.string.createUniqueString = function() {
  return"goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function(a) {
  var b = Number(a);
  return b == 0 && goog.string.isEmpty(a) ? NaN : b
};
goog.string.toCamelCaseCache_ = {};
goog.string.toCamelCase = function(a) {
  return goog.string.toCamelCaseCache_[a] || (goog.string.toCamelCaseCache_[a] = String(a).replace(/\-([a-z])/g, function(a, c) {
    return c.toUpperCase()
  }))
};
goog.string.toSelectorCaseCache_ = {};
goog.string.toSelectorCase = function(a) {
  return goog.string.toSelectorCaseCache_[a] || (goog.string.toSelectorCaseCache_[a] = String(a).replace(/([A-Z])/g, "-$1").toLowerCase())
};
goog.userAgent = {};
goog.userAgent.jscript = {};
goog.userAgent.jscript.ASSUME_NO_JSCRIPT = !1;
goog.userAgent.jscript.init_ = function() {
  goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_ = "ScriptEngine" in goog.global && goog.global.ScriptEngine() == "JScript";
  goog.userAgent.jscript.DETECTED_VERSION_ = goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_ ? goog.global.ScriptEngineMajorVersion() + "." + goog.global.ScriptEngineMinorVersion() + "." + goog.global.ScriptEngineBuildVersion() : "0"
};
goog.userAgent.jscript.ASSUME_NO_JSCRIPT || goog.userAgent.jscript.init_();
goog.userAgent.jscript.HAS_JSCRIPT = goog.userAgent.jscript.ASSUME_NO_JSCRIPT ? !1 : goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_;
goog.userAgent.jscript.VERSION = goog.userAgent.jscript.ASSUME_NO_JSCRIPT ? "0" : goog.userAgent.jscript.DETECTED_VERSION_;
goog.userAgent.jscript.isVersion = function(a) {
  return goog.string.compareVersions(goog.userAgent.jscript.VERSION, a) >= 0
};
goog.string.StringBuffer = function(a, b) {
  this.buffer_ = goog.userAgent.jscript.HAS_JSCRIPT ? [] : "";
  a != null && this.append.apply(this, arguments)
};
goog.string.StringBuffer.prototype.set = function(a) {
  this.clear();
  this.append(a)
};
goog.userAgent.jscript.HAS_JSCRIPT ? (goog.string.StringBuffer.prototype.bufferLength_ = 0, goog.string.StringBuffer.prototype.append = function(a, b, c) {
  b == null ? this.buffer_[this.bufferLength_++] = a : (this.buffer_.push.apply(this.buffer_, arguments), this.bufferLength_ = this.buffer_.length);
  return this
}) : goog.string.StringBuffer.prototype.append = function(a, b, c) {
  this.buffer_ += a;
  if(b != null) {
    for(var d = 1;d < arguments.length;d++) {
      this.buffer_ += arguments[d]
    }
  }
  return this
};
goog.string.StringBuffer.prototype.clear = function() {
  goog.userAgent.jscript.HAS_JSCRIPT ? this.bufferLength_ = this.buffer_.length = 0 : this.buffer_ = ""
};
goog.string.StringBuffer.prototype.getLength = function() {
  return this.toString().length
};
goog.string.StringBuffer.prototype.toString = function() {
  if(goog.userAgent.jscript.HAS_JSCRIPT) {
    var a = this.buffer_.join("");
    this.clear();
    a && this.append(a);
    return a
  }else {
    return this.buffer_
  }
};
goog.debug = {};
goog.debug.Error = function(a) {
  this.stack = Error().stack || "";
  if(a) {
    this.message = String(a)
  }
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(a, b) {
  b.unshift(a);
  goog.debug.Error.call(this, goog.string.subs.apply(null, b));
  b.shift();
  this.messagePattern = a
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.doAssertFailure_ = function(a, b, c, d) {
  var e = "Assertion failed";
  if(c) {
    e += ": " + c;
    var f = d
  }else {
    a && (e += ": " + a, f = b)
  }
  throw new goog.asserts.AssertionError("" + e, f || []);
};
goog.asserts.assert = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !a && goog.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.fail = function(a, b) {
  if(goog.asserts.ENABLE_ASSERTS) {
    throw new goog.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
  }
};
goog.asserts.assertNumber = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isNumber(a) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertString = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isString(a) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertFunction = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isFunction(a) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertObject = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isObject(a) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertArray = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isArray(a) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertBoolean = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(a) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertInstanceof = function(a, b, c, d) {
  goog.asserts.ENABLE_ASSERTS && !(a instanceof b) && goog.asserts.doAssertFailure_("instanceof check failed.", null, c, Array.prototype.slice.call(arguments, 3))
};
goog.array = {};
goog.NATIVE_ARRAY_PROTOTYPES = !0;
goog.array.peek = function(a) {
  return a[a.length - 1]
};
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.indexOf ? function(a, b, c) {
  goog.asserts.assert(a.length != null);
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call(a, b, c)
} : function(a, b, c) {
  c = c == null ? 0 : c < 0 ? Math.max(0, a.length + c) : c;
  if(goog.isString(a)) {
    return!goog.isString(b) || b.length != 1 ? -1 : a.indexOf(b, c)
  }
  for(;c < a.length;c++) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.lastIndexOf ? function(a, b, c) {
  goog.asserts.assert(a.length != null);
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(a, b, c == null ? a.length - 1 : c)
} : function(a, b, c) {
  c = c == null ? a.length - 1 : c;
  c < 0 && (c = Math.max(0, a.length + c));
  if(goog.isString(a)) {
    return!goog.isString(b) || b.length != 1 ? -1 : a.lastIndexOf(b, c)
  }
  for(;c >= 0;c--) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.forEach ? function(a, b, c) {
  goog.asserts.assert(a.length != null);
  goog.array.ARRAY_PROTOTYPE_.forEach.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    f in e && b.call(c, e[f], f, a)
  }
};
goog.array.forEachRight = function(a, b, c) {
  var d = a.length, e = goog.isString(a) ? a.split("") : a;
  for(d -= 1;d >= 0;--d) {
    d in e && b.call(c, e[d], d, a)
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.filter ? function(a, b, c) {
  goog.asserts.assert(a.length != null);
  return goog.array.ARRAY_PROTOTYPE_.filter.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = [], f = 0, g = goog.isString(a) ? a.split("") : a, h = 0;h < d;h++) {
    if(h in g) {
      var i = g[h];
      b.call(c, i, h, a) && (e[f++] = i)
    }
  }
  return e
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.map ? function(a, b, c) {
  goog.asserts.assert(a.length != null);
  return goog.array.ARRAY_PROTOTYPE_.map.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = Array(d), f = goog.isString(a) ? a.split("") : a, g = 0;g < d;g++) {
    g in f && (e[g] = b.call(c, f[g], g, a))
  }
  return e
};
goog.array.reduce = function(a, b, c, d) {
  if(a.reduce) {
    return d ? a.reduce(goog.bind(b, d), c) : a.reduce(b, c)
  }
  var e = c;
  goog.array.forEach(a, function(c, g) {
    e = b.call(d, e, c, g, a)
  });
  return e
};
goog.array.reduceRight = function(a, b, c, d) {
  if(a.reduceRight) {
    return d ? a.reduceRight(goog.bind(b, d), c) : a.reduceRight(b, c)
  }
  var e = c;
  goog.array.forEachRight(a, function(c, g) {
    e = b.call(d, e, c, g, a)
  });
  return e
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.some ? function(a, b, c) {
  goog.asserts.assert(a.length != null);
  return goog.array.ARRAY_PROTOTYPE_.some.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return!0
    }
  }
  return!1
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.every ? function(a, b, c) {
  goog.asserts.assert(a.length != null);
  return goog.array.ARRAY_PROTOTYPE_.every.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && !b.call(c, e[f], f, a)) {
      return!1
    }
  }
  return!0
};
goog.array.find = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return b < 0 ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndex = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return f
    }
  }
  return-1
};
goog.array.findRight = function(a, b, c) {
  b = goog.array.findIndexRight(a, b, c);
  return b < 0 ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndexRight = function(a, b, c) {
  var d = a.length, e = goog.isString(a) ? a.split("") : a;
  for(d -= 1;d >= 0;d--) {
    if(d in e && b.call(c, e[d], d, a)) {
      return d
    }
  }
  return-1
};
goog.array.contains = function(a, b) {
  return goog.array.indexOf(a, b) >= 0
};
goog.array.isEmpty = function(a) {
  return a.length == 0
};
goog.array.clear = function(a) {
  if(!goog.isArray(a)) {
    for(var b = a.length - 1;b >= 0;b--) {
      delete a[b]
    }
  }
  a.length = 0
};
goog.array.insert = function(a, b) {
  goog.array.contains(a, b) || a.push(b)
};
goog.array.insertAt = function(a, b, c) {
  goog.array.splice(a, c, 0, b)
};
goog.array.insertArrayAt = function(a, b, c) {
  goog.partial(goog.array.splice, a, c, 0).apply(null, b)
};
goog.array.insertBefore = function(a, b, c) {
  var d;
  arguments.length == 2 || (d = goog.array.indexOf(a, c)) < 0 ? a.push(b) : goog.array.insertAt(a, b, d)
};
goog.array.remove = function(a, b) {
  var c = goog.array.indexOf(a, b), d;
  (d = c >= 0) && goog.array.removeAt(a, c);
  return d
};
goog.array.removeAt = function(a, b) {
  goog.asserts.assert(a.length != null);
  return goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1).length == 1
};
goog.array.removeIf = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return b >= 0 ? (goog.array.removeAt(a, b), !0) : !1
};
goog.array.concat = function(a) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.clone = function(a) {
  if(goog.isArray(a)) {
    return goog.array.concat(a)
  }else {
    for(var b = [], c = 0, d = a.length;c < d;c++) {
      b[c] = a[c]
    }
    return b
  }
};
goog.array.toArray = function(a) {
  return goog.isArray(a) ? goog.array.concat(a) : goog.array.clone(a)
};
goog.array.extend = function(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = arguments[c], e;
    if(goog.isArray(d) || (e = goog.isArrayLike(d)) && d.hasOwnProperty("callee")) {
      a.push.apply(a, d)
    }else {
      if(e) {
        for(var f = a.length, g = d.length, h = 0;h < g;h++) {
          a[f + h] = d[h]
        }
      }else {
        a.push(d)
      }
    }
  }
};
goog.array.splice = function(a, b, c, d) {
  goog.asserts.assert(a.length != null);
  return goog.array.ARRAY_PROTOTYPE_.splice.apply(a, goog.array.slice(arguments, 1))
};
goog.array.slice = function(a, b, c) {
  goog.asserts.assert(a.length != null);
  return arguments.length <= 2 ? goog.array.ARRAY_PROTOTYPE_.slice.call(a, b) : goog.array.ARRAY_PROTOTYPE_.slice.call(a, b, c)
};
goog.array.removeDuplicates = function(a, b) {
  for(var c = b || a, d = {}, e = 0, f = 0;f < a.length;) {
    var g = a[f++], h = goog.isObject(g) ? "o" + goog.getUid(g) : (typeof g).charAt(0) + g;
    Object.prototype.hasOwnProperty.call(d, h) || (d[h] = !0, c[e++] = g)
  }
  c.length = e
};
goog.array.binarySearch = function(a, b, c) {
  return goog.array.binarySearch_(a, c || goog.array.defaultCompare, !1, b)
};
goog.array.binarySelect = function(a, b, c) {
  return goog.array.binarySearch_(a, b, !0, void 0, c)
};
goog.array.binarySearch_ = function(a, b, c, d, e) {
  for(var f = 0, g = a.length, h;f < g;) {
    var i = f + g >> 1, j;
    j = c ? b.call(e, a[i], i, a) : b(d, a[i]);
    j > 0 ? f = i + 1 : (g = i, h = !j)
  }
  return h ? f : ~f
};
goog.array.sort = function(a, b) {
  goog.asserts.assert(a.length != null);
  goog.array.ARRAY_PROTOTYPE_.sort.call(a, b || goog.array.defaultCompare)
};
goog.array.stableSort = function(a, b) {
  for(var c = 0;c < a.length;c++) {
    a[c] = {index:c, value:a[c]}
  }
  var d = b || goog.array.defaultCompare;
  goog.array.sort(a, function(a, b) {
    return d(a.value, b.value) || a.index - b.index
  });
  for(c = 0;c < a.length;c++) {
    a[c] = a[c].value
  }
};
goog.array.sortObjectsByKey = function(a, b, c) {
  var d = c || goog.array.defaultCompare;
  goog.array.sort(a, function(a, c) {
    return d(a[b], c[b])
  })
};
goog.array.isSorted = function(a, b, c) {
  for(var b = b || goog.array.defaultCompare, d = 1;d < a.length;d++) {
    var e = b(a[d - 1], a[d]);
    if(e > 0 || e == 0 && c) {
      return!1
    }
  }
  return!0
};
goog.array.equals = function(a, b, c) {
  if(!goog.isArrayLike(a) || !goog.isArrayLike(b) || a.length != b.length) {
    return!1
  }
  for(var d = a.length, c = c || goog.array.defaultCompareEquality, e = 0;e < d;e++) {
    if(!c(a[e], b[e])) {
      return!1
    }
  }
  return!0
};
goog.array.compare = function(a, b, c) {
  return goog.array.equals(a, b, c)
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b
};
goog.array.binaryInsert = function(a, b, c) {
  c = goog.array.binarySearch(a, b, c);
  return c < 0 ? (goog.array.insertAt(a, b, -(c + 1)), !0) : !1
};
goog.array.binaryRemove = function(a, b, c) {
  b = goog.array.binarySearch(a, b, c);
  return b >= 0 ? goog.array.removeAt(a, b) : !1
};
goog.array.bucket = function(a, b) {
  for(var c = {}, d = 0;d < a.length;d++) {
    var e = a[d], f = b(e, d, a);
    goog.isDef(f) && (c[f] || (c[f] = [])).push(e)
  }
  return c
};
goog.array.repeat = function(a, b) {
  for(var c = [], d = 0;d < b;d++) {
    c[d] = a
  }
  return c
};
goog.array.flatten = function(a) {
  for(var b = [], c = 0;c < arguments.length;c++) {
    var d = arguments[c];
    goog.isArray(d) ? b.push.apply(b, goog.array.flatten.apply(null, d)) : b.push(d)
  }
  return b
};
goog.array.rotate = function(a, b) {
  goog.asserts.assert(a.length != null);
  a.length && (b %= a.length, b > 0 ? goog.array.ARRAY_PROTOTYPE_.unshift.apply(a, a.splice(-b, b)) : b < 0 && goog.array.ARRAY_PROTOTYPE_.push.apply(a, a.splice(0, -b)));
  return a
};
goog.array.zip = function(a) {
  if(!arguments.length) {
    return[]
  }
  for(var b = [], c = 0;;c++) {
    for(var d = [], e = 0;e < arguments.length;e++) {
      var f = arguments[e];
      if(c >= f.length) {
        return b
      }
      d.push(f[c])
    }
    b.push(d)
  }
};
goog.array.shuffle = function(a, b) {
  for(var c = b || Math.random, d = a.length - 1;d > 0;d--) {
    var e = Math.floor(c() * (d + 1)), f = a[d];
    a[d] = a[e];
    a[e] = f
  }
};
goog.object = {};
goog.object.forEach = function(a, b, c) {
  for(var d in a) {
    b.call(c, a[d], d, a)
  }
};
goog.object.filter = function(a, b, c) {
  var d = {}, e;
  for(e in a) {
    b.call(c, a[e], e, a) && (d[e] = a[e])
  }
  return d
};
goog.object.map = function(a, b, c) {
  var d = {}, e;
  for(e in a) {
    d[e] = b.call(c, a[e], e, a)
  }
  return d
};
goog.object.some = function(a, b, c) {
  for(var d in a) {
    if(b.call(c, a[d], d, a)) {
      return!0
    }
  }
  return!1
};
goog.object.every = function(a, b, c) {
  for(var d in a) {
    if(!b.call(c, a[d], d, a)) {
      return!1
    }
  }
  return!0
};
goog.object.getCount = function(a) {
  var b = 0, c;
  for(c in a) {
    b++
  }
  return b
};
goog.object.getAnyKey = function(a) {
  for(var b in a) {
    return b
  }
};
goog.object.getAnyValue = function(a) {
  for(var b in a) {
    return a[b]
  }
};
goog.object.contains = function(a, b) {
  return goog.object.containsValue(a, b)
};
goog.object.getValues = function(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = a[d]
  }
  return b
};
goog.object.getKeys = function(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = d
  }
  return b
};
goog.object.getValueByKeys = function(a, b) {
  for(var c = goog.isArrayLike(b), d = c ? b : arguments, c = c ? 0 : 1;c < d.length;c++) {
    if(a = a[d[c]], !goog.isDef(a)) {
      break
    }
  }
  return a
};
goog.object.containsKey = function(a, b) {
  return b in a
};
goog.object.containsValue = function(a, b) {
  for(var c in a) {
    if(a[c] == b) {
      return!0
    }
  }
  return!1
};
goog.object.findKey = function(a, b, c) {
  for(var d in a) {
    if(b.call(c, a[d], d, a)) {
      return d
    }
  }
};
goog.object.findValue = function(a, b, c) {
  return(b = goog.object.findKey(a, b, c)) && a[b]
};
goog.object.isEmpty = function(a) {
  for(var b in a) {
    return!1
  }
  return!0
};
goog.object.clear = function(a) {
  for(var b in a) {
    delete a[b]
  }
};
goog.object.remove = function(a, b) {
  var c;
  (c = b in a) && delete a[b];
  return c
};
goog.object.add = function(a, b, c) {
  if(b in a) {
    throw Error('The object already contains the key "' + b + '"');
  }
  goog.object.set(a, b, c)
};
goog.object.get = function(a, b, c) {
  return b in a ? a[b] : c
};
goog.object.set = function(a, b, c) {
  a[b] = c
};
goog.object.setIfUndefined = function(a, b, c) {
  return b in a ? a[b] : a[b] = c
};
goog.object.clone = function(a) {
  var b = {}, c;
  for(c in a) {
    b[c] = a[c]
  }
  return b
};
goog.object.unsafeClone = function(a) {
  var b = goog.typeOf(a);
  if(b == "object" || b == "array") {
    if(a.clone) {
      return a.clone()
    }
    var b = b == "array" ? [] : {}, c;
    for(c in a) {
      b[c] = goog.object.unsafeClone(a[c])
    }
    return b
  }
  return a
};
goog.object.transpose = function(a) {
  var b = {}, c;
  for(c in a) {
    b[a[c]] = c
  }
  return b
};
goog.object.PROTOTYPE_FIELDS_ = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
goog.object.extend = function(a, b) {
  for(var c, d, e = 1;e < arguments.length;e++) {
    d = arguments[e];
    for(c in d) {
      a[c] = d[c]
    }
    for(var f = 0;f < goog.object.PROTOTYPE_FIELDS_.length;f++) {
      c = goog.object.PROTOTYPE_FIELDS_[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
  }
};
goog.object.create = function(a) {
  var b = arguments.length;
  if(b == 1 && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0])
  }
  if(b % 2) {
    throw Error("Uneven number of arguments");
  }
  for(var c = {}, d = 0;d < b;d += 2) {
    c[arguments[d]] = arguments[d + 1]
  }
  return c
};
goog.object.createSet = function(a) {
  var b = arguments.length;
  if(b == 1 && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0])
  }
  for(var c = {}, d = 0;d < b;d++) {
    c[arguments[d]] = !0
  }
  return c
};
var cljs = {core:{}};
cljs.core.truth_ = function(a) {
  return a != null && a !== !1
};
cljs.core.type_satisfies_ = function(a, b) {
  var c = a[goog.typeOf.call(null, b)];
  return cljs.core.truth_(c) ? c : (c = a._, cljs.core.truth_(c) ? c : !1)
};
cljs.core._STAR_main_cli_fn_STAR_ = null;
cljs.core.missing_protocol = function(a, b) {
  return Error.call(null, "No protocol method " + a + " defined for type " + goog.typeOf.call(null, b) + ": " + b)
};
cljs.core.aclone = function(a) {
  return Array.prototype.slice.call(a)
};
cljs.core.array = function(a) {
  return Array.prototype.slice.call(arguments)
};
cljs.core.aget = function(a, b) {
  return a[b]
};
cljs.core.aset = function(a, b, c) {
  return a[b] = c
};
cljs.core.alength = function(a) {
  return a.length
};
cljs.core.ICounted = {};
cljs.core._count = function _count(b) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$ICounted$_count : b) ? b.cljs$core$ICounted$_count(b) : function() {
    var c = _count[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = _count._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "ICounted.-count", b);
      }
    }
  }().call(null, b)
};
cljs.core.IEmptyableCollection = {};
cljs.core._empty = function _empty(b) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$IEmptyableCollection$_empty : b) ? b.cljs$core$IEmptyableCollection$_empty(b) : function() {
    var c = _empty[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = _empty._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "IEmptyableCollection.-empty", b);
      }
    }
  }().call(null, b)
};
cljs.core.ICollection = {};
cljs.core._conj = function _conj(b, c) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$ICollection$_conj : b) ? b.cljs$core$ICollection$_conj(b, c) : function() {
    var c = _conj[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = _conj._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "ICollection.-conj", b);
      }
    }
  }().call(null, b, c)
};
cljs.core.IIndexed = {};
cljs.core._nth = function() {
  var a = null, b = function(b, c) {
    return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$IIndexed$_nth : b) ? b.cljs$core$IIndexed$_nth(b, c) : function() {
      var c = a[goog.typeOf.call(null, b)];
      if(cljs.core.truth_(c)) {
        return c
      }else {
        if(c = a._, cljs.core.truth_(c)) {
          return c
        }else {
          throw cljs.core.missing_protocol.call(null, "IIndexed.-nth", b);
        }
      }
    }().call(null, b, c)
  }, c = function(b, c, f) {
    return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$IIndexed$_nth : b) ? b.cljs$core$IIndexed$_nth(b, c, f) : function() {
      var c = a[goog.typeOf.call(null, b)];
      if(cljs.core.truth_(c)) {
        return c
      }else {
        if(c = a._, cljs.core.truth_(c)) {
          return c
        }else {
          throw cljs.core.missing_protocol.call(null, "IIndexed.-nth", b);
        }
      }
    }().call(null, b, c, f)
  };
  return a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.ISeq = {};
cljs.core._first = function _first(b) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$ISeq$_first : b) ? b.cljs$core$ISeq$_first(b) : function() {
    var c = _first[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = _first._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "ISeq.-first", b);
      }
    }
  }().call(null, b)
};
cljs.core._rest = function _rest(b) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$ISeq$_rest : b) ? b.cljs$core$ISeq$_rest(b) : function() {
    var c = _rest[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = _rest._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "ISeq.-rest", b);
      }
    }
  }().call(null, b)
};
cljs.core.ILookup = {};
cljs.core._lookup = function() {
  var a = null, b = function(b, c) {
    return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$ILookup$_lookup : b) ? b.cljs$core$ILookup$_lookup(b, c) : function() {
      var c = a[goog.typeOf.call(null, b)];
      if(cljs.core.truth_(c)) {
        return c
      }else {
        if(c = a._, cljs.core.truth_(c)) {
          return c
        }else {
          throw cljs.core.missing_protocol.call(null, "ILookup.-lookup", b);
        }
      }
    }().call(null, b, c)
  }, c = function(b, c, f) {
    return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$ILookup$_lookup : b) ? b.cljs$core$ILookup$_lookup(b, c, f) : function() {
      var c = a[goog.typeOf.call(null, b)];
      if(cljs.core.truth_(c)) {
        return c
      }else {
        if(c = a._, cljs.core.truth_(c)) {
          return c
        }else {
          throw cljs.core.missing_protocol.call(null, "ILookup.-lookup", b);
        }
      }
    }().call(null, b, c, f)
  };
  return a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.IAssociative = {};
cljs.core._contains_key_QMARK_ = function _contains_key_QMARK_(b, c) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$IAssociative$_contains_key_QMARK_ : b) ? b.cljs$core$IAssociative$_contains_key_QMARK_(b, c) : function() {
    var c = _contains_key_QMARK_[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = _contains_key_QMARK_._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "IAssociative.-contains-key?", b);
      }
    }
  }().call(null, b, c)
};
cljs.core._assoc = function _assoc(b, c, d) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$IAssociative$_assoc : b) ? b.cljs$core$IAssociative$_assoc(b, c, d) : function() {
    var c = _assoc[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = _assoc._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "IAssociative.-assoc", b);
      }
    }
  }().call(null, b, c, d)
};
cljs.core.IMap = {};
cljs.core._dissoc = function _dissoc(b, c) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$IMap$_dissoc : b) ? b.cljs$core$IMap$_dissoc(b, c) : function() {
    var c = _dissoc[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = _dissoc._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "IMap.-dissoc", b);
      }
    }
  }().call(null, b, c)
};
cljs.core.ISet = {};
cljs.core._disjoin = function _disjoin(b, c) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$ISet$_disjoin : b) ? b.cljs$core$ISet$_disjoin(b, c) : function() {
    var c = _disjoin[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = _disjoin._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "ISet.-disjoin", b);
      }
    }
  }().call(null, b, c)
};
cljs.core.IStack = {};
cljs.core._peek = function _peek(b) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$IStack$_peek : b) ? b.cljs$core$IStack$_peek(b) : function() {
    var c = _peek[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = _peek._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "IStack.-peek", b);
      }
    }
  }().call(null, b)
};
cljs.core._pop = function _pop(b) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$IStack$_pop : b) ? b.cljs$core$IStack$_pop(b) : function() {
    var c = _pop[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = _pop._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "IStack.-pop", b);
      }
    }
  }().call(null, b)
};
cljs.core.IVector = {};
cljs.core._assoc_n = function _assoc_n(b, c, d) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$IVector$_assoc_n : b) ? b.cljs$core$IVector$_assoc_n(b, c, d) : function() {
    var c = _assoc_n[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = _assoc_n._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "IVector.-assoc-n", b);
      }
    }
  }().call(null, b, c, d)
};
cljs.core.IDeref = {};
cljs.core._deref = function _deref(b) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$IDeref$_deref : b) ? b.cljs$core$IDeref$_deref(b) : function() {
    var c = _deref[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = _deref._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "IDeref.-deref", b);
      }
    }
  }().call(null, b)
};
cljs.core.IDerefWithTimeout = {};
cljs.core._deref_with_timeout = function _deref_with_timeout(b, c, d) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$IDerefWithTimeout$_deref_with_timeout : b) ? b.cljs$core$IDerefWithTimeout$_deref_with_timeout(b, c, d) : function() {
    var c = _deref_with_timeout[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = _deref_with_timeout._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "IDerefWithTimeout.-deref-with-timeout", b);
      }
    }
  }().call(null, b, c, d)
};
cljs.core.IMeta = {};
cljs.core._meta = function _meta(b) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$IMeta$_meta : b) ? b.cljs$core$IMeta$_meta(b) : function() {
    var c = _meta[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = _meta._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "IMeta.-meta", b);
      }
    }
  }().call(null, b)
};
cljs.core.IWithMeta = {};
cljs.core._with_meta = function _with_meta(b, c) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$IWithMeta$_with_meta : b) ? b.cljs$core$IWithMeta$_with_meta(b, c) : function() {
    var c = _with_meta[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = _with_meta._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "IWithMeta.-with-meta", b);
      }
    }
  }().call(null, b, c)
};
cljs.core.IReduce = {};
cljs.core._reduce = function() {
  var a = null, b = function(b, c) {
    return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$IReduce$_reduce : b) ? b.cljs$core$IReduce$_reduce(b, c) : function() {
      var c = a[goog.typeOf.call(null, b)];
      if(cljs.core.truth_(c)) {
        return c
      }else {
        if(c = a._, cljs.core.truth_(c)) {
          return c
        }else {
          throw cljs.core.missing_protocol.call(null, "IReduce.-reduce", b);
        }
      }
    }().call(null, b, c)
  }, c = function(b, c, f) {
    return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$IReduce$_reduce : b) ? b.cljs$core$IReduce$_reduce(b, c, f) : function() {
      var c = a[goog.typeOf.call(null, b)];
      if(cljs.core.truth_(c)) {
        return c
      }else {
        if(c = a._, cljs.core.truth_(c)) {
          return c
        }else {
          throw cljs.core.missing_protocol.call(null, "IReduce.-reduce", b);
        }
      }
    }().call(null, b, c, f)
  };
  return a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.IEquiv = {};
cljs.core._equiv = function _equiv(b, c) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$IEquiv$_equiv : b) ? b.cljs$core$IEquiv$_equiv(b, c) : function() {
    var c = _equiv[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = _equiv._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "IEquiv.-equiv", b);
      }
    }
  }().call(null, b, c)
};
cljs.core.IHash = {};
cljs.core._hash = function _hash(b) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$IHash$_hash : b) ? b.cljs$core$IHash$_hash(b) : function() {
    var c = _hash[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = _hash._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "IHash.-hash", b);
      }
    }
  }().call(null, b)
};
cljs.core.ISeqable = {};
cljs.core._seq = function _seq(b) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$ISeqable$_seq : b) ? b.cljs$core$ISeqable$_seq(b) : function() {
    var c = _seq[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = _seq._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "ISeqable.-seq", b);
      }
    }
  }().call(null, b)
};
cljs.core.ISequential = {};
cljs.core.IPrintable = {};
cljs.core._pr_seq = function _pr_seq(b, c) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$IPrintable$_pr_seq : b) ? b.cljs$core$IPrintable$_pr_seq(b, c) : function() {
    var c = _pr_seq[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = _pr_seq._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "IPrintable.-pr-seq", b);
      }
    }
  }().call(null, b, c)
};
cljs.core.IPending = {};
cljs.core._realized_QMARK_ = function _realized_QMARK_(b) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$IPending$_realized_QMARK_ : b) ? b.cljs$core$IPending$_realized_QMARK_(b) : function() {
    var c = _realized_QMARK_[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = _realized_QMARK_._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "IPending.-realized?", b);
      }
    }
  }().call(null, b)
};
cljs.core.identical_QMARK_ = function(a, b) {
  return a === b
};
cljs.core._EQ_ = function(a, b) {
  return cljs.core._equiv.call(null, a, b)
};
cljs.core.nil_QMARK_ = function(a) {
  return cljs.core.identical_QMARK_.call(null, a, null)
};
cljs.core.ISet["null"] = !0;
cljs.core._disjoin["null"] = function() {
  return null
};
cljs.core.IEquiv["null"] = !0;
cljs.core._equiv["null"] = function(a, b) {
  return cljs.core.nil_QMARK_.call(null, b)
};
cljs.core.ICollection["null"] = !0;
cljs.core._conj["null"] = function(a, b) {
  return cljs.core.list.call(null, b)
};
cljs.core.ISeq["null"] = !0;
cljs.core._first["null"] = function() {
  return null
};
cljs.core._rest["null"] = function() {
  return cljs.core.list.call(null)
};
cljs.core.IStack["null"] = !0;
cljs.core._peek["null"] = function() {
  return null
};
cljs.core._pop["null"] = function() {
  return null
};
cljs.core.IWithMeta["null"] = !0;
cljs.core._with_meta["null"] = function() {
  return null
};
cljs.core.IMap["null"] = !0;
cljs.core._dissoc["null"] = function() {
  return null
};
cljs.core.IEmptyableCollection["null"] = !0;
cljs.core._empty["null"] = function() {
  return null
};
cljs.core.IIndexed["null"] = !0;
cljs.core._nth["null"] = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return null;
      case 3:
        return d
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.IMeta["null"] = !0;
cljs.core._meta["null"] = function() {
  return null
};
cljs.core.IReduce["null"] = !0;
cljs.core._reduce["null"] = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return c.call(null);
      case 3:
        return d
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.IHash["null"] = !0;
cljs.core._hash["null"] = function() {
  return 0
};
cljs.core.ICounted["null"] = !0;
cljs.core._count["null"] = function() {
  return 0
};
cljs.core.IAssociative["null"] = !0;
cljs.core._assoc["null"] = function(a, b, c) {
  return cljs.core.hash_map.call(null, b, c)
};
cljs.core.ILookup["null"] = !0;
cljs.core._lookup["null"] = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return null;
      case 3:
        return d
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
Date.prototype.cljs$core$IEquiv$ = !0;
Date.prototype.cljs$core$IEquiv$_equiv = function(a, b) {
  return cljs.core.identical_QMARK_.call(null, a.toString, b.toString)
};
cljs.core.IHash.number = !0;
cljs.core._hash.number = function(a) {
  return a
};
cljs.core.IEquiv.number = !0;
cljs.core._equiv.number = function(a, b) {
  return cljs.core.identical_QMARK_.call(null, a, b)
};
cljs.core.IHash["function"] = !0;
cljs.core._hash["function"] = function(a) {
  return goog.getUid.call(null, a)
};
cljs.core.inc = function(a) {
  return a + 1
};
cljs.core.lt_ = function(a, b) {
  return a < b
};
cljs.core.ci_reduce = function() {
  var a = null;
  return function(a, c, d, e) {
    switch(arguments.length) {
      case 2:
        var f;
        a: {
          if(cljs.core.truth_(cljs.core._EQ_.call(null, 0, cljs.core._count.call(null, a)))) {
            f = c.call(null)
          }else {
            for(var g = cljs.core._nth.call(null, a, 0), h = 1;;) {
              if(cljs.core.truth_(cljs.core.lt_.call(null, h, cljs.core._count.call(null, a)))) {
                g = c.call(null, g, cljs.core._nth.call(null, a, h)), h = cljs.core.inc.call(null, h)
              }else {
                f = g;
                break a
              }
            }
          }
        }
        return f;
      case 3:
        a: {
          f = d;
          for(h = 0;;) {
            if(cljs.core.truth_(cljs.core.lt_.call(null, h, cljs.core._count.call(null, a)))) {
              f = c.call(null, f, cljs.core._nth.call(null, a, h)), h = cljs.core.inc.call(null, h)
            }else {
              g = f;
              break a
            }
          }
        }
        return g;
      case 4:
        a: {
          f = d;
          for(g = e;;) {
            if(cljs.core.truth_(cljs.core.lt_.call(null, g, cljs.core._count.call(null, a)))) {
              f = c.call(null, f, cljs.core._nth.call(null, a, g)), g = cljs.core.inc.call(null, g)
            }else {
              h = f;
              break a
            }
          }
        }
        return h
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.IndexedSeq = function(a, b) {
  this.a = a;
  this.i = b
};
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core.ci_reduce.call(null, a, c, this.a[this.i], cljs.core.inc.call(null, this.i));
      case 3:
        return cljs.core.ci_reduce.call(null, a, c, d, this.i)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.IndexedSeq.prototype.cljs$core$IEquiv$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$IEquiv$_equiv = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.IndexedSeq.prototype.cljs$core$ISequential$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$ICounted$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$ICounted$_count = function() {
  return this.a.length
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_first = function() {
  return this.a[this.i]
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_rest = function() {
  return cljs.core.truth_(cljs.core.lt_.call(null, cljs.core.inc.call(null, this.i), this.a.length)) ? new cljs.core.IndexedSeq(this.a, cljs.core.inc.call(null, this.i)) : cljs.core.list.call(null)
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeqable$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$ISeqable$_seq = function(a) {
  return a
};
cljs.core.prim_seq = function(a, b) {
  return cljs.core.truth_(cljs.core._EQ_.call(null, 0, a.length)) ? null : new cljs.core.IndexedSeq(a, b)
};
cljs.core.array_seq = function(a, b) {
  return cljs.core.prim_seq.call(null, a, b)
};
cljs.core.IReduce.array = !0;
cljs.core._reduce.array = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core.ci_reduce.call(null, a, c);
      case 3:
        return cljs.core.ci_reduce.call(null, a, c, d)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.ILookup.array = !0;
cljs.core._lookup.array = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return a[c];
      case 3:
        return cljs.core._nth.call(null, a, c, d)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.IIndexed.array = !0;
cljs.core._nth.array = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core.truth_(cljs.core.lt_.call(null, c, a.length)) ? a[c] : null;
      case 3:
        return cljs.core.truth_(cljs.core.lt_.call(null, c, a.length)) ? a[c] : d
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.ICounted.array = !0;
cljs.core._count.array = function(a) {
  return a.length
};
cljs.core.ISeqable.array = !0;
cljs.core._seq.array = function(a) {
  return cljs.core.array_seq.call(null, a, 0)
};
cljs.core.seq = function(a) {
  return cljs.core.truth_(a) ? cljs.core._seq.call(null, a) : null
};
cljs.core.first = function(a) {
  a = cljs.core.seq.call(null, a);
  return cljs.core.truth_(a) ? cljs.core._first.call(null, a) : null
};
cljs.core.rest = function(a) {
  return cljs.core._rest.call(null, cljs.core.seq.call(null, a))
};
cljs.core.next = function(a) {
  return cljs.core.truth_(a) ? cljs.core.seq.call(null, cljs.core.rest.call(null, a)) : null
};
cljs.core.second = function(a) {
  return cljs.core.first.call(null, cljs.core.next.call(null, a))
};
cljs.core.ffirst = function(a) {
  return cljs.core.first.call(null, cljs.core.first.call(null, a))
};
cljs.core.nfirst = function(a) {
  return cljs.core.next.call(null, cljs.core.first.call(null, a))
};
cljs.core.fnext = function(a) {
  return cljs.core.first.call(null, cljs.core.next.call(null, a))
};
cljs.core.nnext = function(a) {
  return cljs.core.next.call(null, cljs.core.next.call(null, a))
};
cljs.core.last = function(a) {
  for(;;) {
    if(cljs.core.truth_(cljs.core.next.call(null, a))) {
      a = cljs.core.next.call(null, a)
    }else {
      return cljs.core.first.call(null, a)
    }
  }
};
cljs.core.ICounted._ = !0;
cljs.core._count._ = function(a) {
  for(var a = cljs.core.seq.call(null, a), b = 0;;) {
    if(cljs.core.truth_(a)) {
      a = cljs.core.next.call(null, a), b = cljs.core.inc.call(null, b)
    }else {
      return b
    }
  }
};
cljs.core.IEquiv._ = !0;
cljs.core._equiv._ = function(a, b) {
  return cljs.core.identical_QMARK_.call(null, a, b)
};
cljs.core.not = function(a) {
  return cljs.core.truth_(a) ? !1 : !0
};
cljs.core.conj = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      for(;;) {
        if(cljs.core.truth_(d)) {
          b = a.call(null, b, c), c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d)
        }else {
          return a.call(null, b, c)
        }
      }
    }, d = function(a, d, g) {
      var h = null;
      goog.isDef(g) && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a), g = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
      return b.call(this, d, g, a)
    };
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 2:
        return cljs.core._conj.call(null, a, d);
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.empty = function(a) {
  return cljs.core._empty.call(null, a)
};
cljs.core.count = function(a) {
  return cljs.core._count.call(null, a)
};
cljs.core.nth = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core._nth.call(null, a, c);
      case 3:
        return cljs.core._nth.call(null, a, c, d)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.get = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, a, c);
      case 3:
        return cljs.core._lookup.call(null, a, c, d)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.assoc = function() {
  var a = null, b = function() {
    var b = function(b, c, d, h) {
      for(;;) {
        if(b = a.call(null, b, c, d), cljs.core.truth_(h)) {
          c = cljs.core.first.call(null, h), d = cljs.core.second.call(null, h), h = cljs.core.nnext.call(null, h)
        }else {
          return b
        }
      }
    }, d = function(a, d, g, h) {
      var i = null;
      goog.isDef(h) && (i = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return b.call(this, a, d, g, i)
    };
    d.cljs$lang$maxFixedArity = 3;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a), g = cljs.core.first(cljs.core.next(a)), h = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
      return b.call(this, d, g, h, a)
    };
    return d
  }(), a = function(a, d, e, f) {
    switch(arguments.length) {
      case 3:
        return cljs.core._assoc.call(null, a, d, e);
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.dissoc = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      for(;;) {
        if(b = a.call(null, b, c), cljs.core.truth_(d)) {
          c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d)
        }else {
          return b
        }
      }
    }, d = function(a, d, g) {
      var h = null;
      goog.isDef(g) && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a), g = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
      return b.call(this, d, g, a)
    };
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return cljs.core._dissoc.call(null, a, d);
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.with_meta = function(a, b) {
  return cljs.core._with_meta.call(null, a, b)
};
cljs.core.meta = function(a) {
  return cljs.core.truth_(cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IMeta$ : a) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.IMeta, a)) ? cljs.core._meta.call(null, a) : null
};
cljs.core.peek = function(a) {
  return cljs.core._peek.call(null, a)
};
cljs.core.pop = function(a) {
  return cljs.core._pop.call(null, a)
};
cljs.core.disj = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      for(;;) {
        if(b = a.call(null, b, c), cljs.core.truth_(d)) {
          c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d)
        }else {
          return b
        }
      }
    }, d = function(a, d, g) {
      var h = null;
      goog.isDef(g) && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a), g = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
      return b.call(this, d, g, a)
    };
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return cljs.core._disjoin.call(null, a, d);
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.hash = function(a) {
  return cljs.core._hash.call(null, a)
};
cljs.core.empty_QMARK_ = function(a) {
  return cljs.core.not.call(null, cljs.core.seq.call(null, a))
};
cljs.core.coll_QMARK_ = function(a) {
  return cljs.core.truth_(cljs.core.nil_QMARK_.call(null, a)) ? !1 : cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$ICollection$ : a) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.ICollection, a)
};
cljs.core.set_QMARK_ = function(a) {
  return cljs.core.truth_(cljs.core.nil_QMARK_.call(null, a)) ? !1 : cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$ISet$ : a) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.ISet, a)
};
cljs.core.associative_QMARK_ = function(a) {
  return cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IAssociative$ : a) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.IAssociative, a)
};
cljs.core.sequential_QMARK_ = function(a) {
  return cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$ISequential$ : a) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.ISequential, a)
};
cljs.core.counted_QMARK_ = function(a) {
  return cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$ICounted$ : a) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.ICounted, a)
};
cljs.core.map_QMARK_ = function(a) {
  return cljs.core.truth_(cljs.core.nil_QMARK_.call(null, a)) ? !1 : cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IMap$ : a) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.IMap, a)
};
cljs.core.vector_QMARK_ = function(a) {
  return cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$IVector$ : a) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.IVector, a)
};
cljs.core.js_obj = function() {
  return{}
};
cljs.core.js_keys = function(a) {
  var b = cljs.core.array.call(null);
  goog.object.forEach.call(null, a, function(a, d) {
    return b.push(d)
  });
  return b
};
cljs.core.js_delete = function(a, b) {
  return delete a[b]
};
cljs.core.lookup_sentinel = cljs.core.js_obj.call(null);
cljs.core.false_QMARK_ = function(a) {
  return a === !1
};
cljs.core.true_QMARK_ = function(a) {
  return a === !0
};
cljs.core.undefined_QMARK_ = function(a) {
  return void 0 === a
};
cljs.core.instance_QMARK_ = function(a, b) {
  return b instanceof a
};
cljs.core.seq_QMARK_ = function(a) {
  return cljs.core.truth_(cljs.core.nil_QMARK_.call(null, a)) ? !1 : cljs.core.truth_(cljs.core.truth_(a) ? a.cljs$core$ISeq$ : a) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.ISeq, a)
};
cljs.core.boolean$ = function(a) {
  return cljs.core.truth_(a) ? !0 : !1
};
cljs.core.string_QMARK_ = function(a) {
  var b = goog.isString.call(null, a);
  return cljs.core.truth_(b) ? cljs.core.not.call(null, function() {
    var b = cljs.core._EQ_.call(null, a.charAt(0), "\ufdd0");
    return cljs.core.truth_(b) ? b : cljs.core._EQ_.call(null, a.charAt(0), "\ufdd1")
  }()) : b
};
cljs.core.keyword_QMARK_ = function(a) {
  var b = goog.isString.call(null, a);
  return cljs.core.truth_(b) ? cljs.core._EQ_.call(null, a.charAt(0), "\ufdd0") : b
};
cljs.core.symbol_QMARK_ = function(a) {
  var b = goog.isString.call(null, a);
  return cljs.core.truth_(b) ? cljs.core._EQ_.call(null, a.charAt(0), "\ufdd1") : b
};
cljs.core.number_QMARK_ = function(a) {
  return goog.isNumber.call(null, a)
};
cljs.core.fn_QMARK_ = function(a) {
  return goog.isFunction.call(null, a)
};
cljs.core.integer_QMARK_ = function(a) {
  var b = cljs.core.number_QMARK_.call(null, a);
  return cljs.core.truth_(b) ? a == a.toFixed() : b
};
cljs.core.contains_QMARK_ = function(a, b) {
  return cljs.core.truth_(cljs.core.identical_QMARK_.call(null, cljs.core._lookup.call(null, a, b, cljs.core.lookup_sentinel), cljs.core.lookup_sentinel)) ? !1 : !0
};
cljs.core.find = function(a, b) {
  return cljs.core.truth_(function() {
    if(cljs.core.truth_(a)) {
      var c = cljs.core.associative_QMARK_.call(null, a);
      return cljs.core.truth_(c) ? cljs.core.contains_QMARK_.call(null, a, b) : c
    }else {
      return a
    }
  }()) ? cljs.core.Vector.fromArray([b, cljs.core._lookup.call(null, a, b)]) : null
};
cljs.core.distinct_QMARK_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      if(cljs.core.truth_(cljs.core.not.call(null, cljs.core._EQ_.call(null, a, b)))) {
        a = cljs.core.set([b, a]);
        for(b = c;;) {
          var d = cljs.core.first.call(null, b), c = cljs.core.next.call(null, b);
          if(cljs.core.truth_(b)) {
            if(cljs.core.truth_(cljs.core.contains_QMARK_.call(null, a, d))) {
              return!1
            }else {
              a = cljs.core.conj.call(null, a, d), b = c
            }
          }else {
            return!0
          }
        }
      }else {
        return!1
      }
    }, b = function(b, d, g) {
      var h = null;
      goog.isDef(g) && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, d, h)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b), g = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return a.call(this, d, g, b)
    };
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return cljs.core.not.call(null, cljs.core._EQ_.call(null, a, d));
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.compare = function(a, b) {
  return goog.array.defaultCompare.call(null, a, b)
};
cljs.core.fn__GT_comparator = function(a) {
  return cljs.core.truth_(cljs.core._EQ_.call(null, a, cljs.core.compare)) ? cljs.core.compare : function(b, c) {
    var d = a.call(null, b, c);
    return cljs.core.truth_(cljs.core.number_QMARK_.call(null, d)) ? d : cljs.core.truth_(d) ? -1 : cljs.core.truth_(a.call(null, c, b)) ? 1 : 0
  }
};
cljs.core.sort = function() {
  var a = null;
  return a = function(b, c) {
    switch(arguments.length) {
      case 1:
        return a.call(null, cljs.core.compare, b);
      case 2:
        var d;
        cljs.core.truth_(cljs.core.seq.call(null, c)) ? (d = cljs.core.to_array.call(null, c), goog.array.stableSort.call(null, d, cljs.core.fn__GT_comparator.call(null, b)), d = cljs.core.seq.call(null, d)) : d = cljs.core.List.EMPTY;
        return d
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.sort_by = function() {
  var a = null, b = function(a, b, e) {
    return cljs.core.sort.call(null, function(e, g) {
      return cljs.core.fn__GT_comparator.call(null, b).call(null, a.call(null, e), a.call(null, g))
    }, e)
  };
  return a = function(c, d, e) {
    switch(arguments.length) {
      case 2:
        return a.call(null, c, cljs.core.compare, d);
      case 3:
        return b.call(this, c, d, e)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.reduce = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core._reduce.call(null, c, a);
      case 3:
        return cljs.core._reduce.call(null, d, a, c)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.seq_reduce = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        var e;
        e = cljs.core.seq.call(null, c);
        e = cljs.core.truth_(e) ? cljs.core.reduce.call(null, a, cljs.core.first.call(null, e), cljs.core.next.call(null, e)) : a.call(null);
        return e;
      case 3:
        a: {
          for(var f = c, g = cljs.core.seq.call(null, d);;) {
            if(cljs.core.truth_(g)) {
              f = a.call(null, f, cljs.core.first.call(null, g)), g = cljs.core.next.call(null, g)
            }else {
              e = f;
              break a
            }
          }
        }
        return e
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.IReduce._ = !0;
cljs.core._reduce._ = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core.seq_reduce.call(null, c, a);
      case 3:
        return cljs.core.seq_reduce.call(null, c, d, a)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core._PLUS_ = function() {
  var a = null, b = function() {
    var b = function(b, c, f) {
      var g = null;
      goog.isDef(f) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return cljs.core.reduce.call(null, a, a.call(null, b, c), g)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), f = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return cljs.core.reduce.call(null, a, a.call(null, c, f), b)
    };
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 0;
      case 1:
        return a;
      case 2:
        return a + d;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core._ = function() {
  var a = null, b = function() {
    var b = function(b, c, f) {
      var g = null;
      goog.isDef(f) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return cljs.core.reduce.call(null, a, a.call(null, b, c), g)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), f = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return cljs.core.reduce.call(null, a, a.call(null, c, f), b)
    };
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return-a;
      case 2:
        return a - d;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core._STAR_ = function() {
  var a = null, b = function() {
    var b = function(b, c, f) {
      var g = null;
      goog.isDef(f) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return cljs.core.reduce.call(null, a, a.call(null, b, c), g)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), f = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return cljs.core.reduce.call(null, a, a.call(null, c, f), b)
    };
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 1;
      case 1:
        return a;
      case 2:
        return a * d;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core._SLASH_ = function() {
  var a = null, b = function() {
    var b = function(b, c, f) {
      var g = null;
      goog.isDef(f) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return cljs.core.reduce.call(null, a, a.call(null, b, c), g)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), f = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return cljs.core.reduce.call(null, a, a.call(null, c, f), b)
    };
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return 1 / a;
      case 2:
        return a / d;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core._LT_ = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      for(;;) {
        if(cljs.core.truth_(a.call(null, b, c))) {
          if(cljs.core.truth_(cljs.core.next.call(null, d))) {
            b = c, c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d)
          }else {
            return a.call(null, c, cljs.core.first.call(null, d))
          }
        }else {
          return!1
        }
      }
    }, d = function(a, d, g) {
      var h = null;
      goog.isDef(g) && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a), g = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
      return b.call(this, d, g, a)
    };
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a < d;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core._LT__EQ_ = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      for(;;) {
        if(cljs.core.truth_(a.call(null, b, c))) {
          if(cljs.core.truth_(cljs.core.next.call(null, d))) {
            b = c, c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d)
          }else {
            return a.call(null, c, cljs.core.first.call(null, d))
          }
        }else {
          return!1
        }
      }
    }, d = function(a, d, g) {
      var h = null;
      goog.isDef(g) && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a), g = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
      return b.call(this, d, g, a)
    };
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a <= d;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core._GT_ = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      for(;;) {
        if(cljs.core.truth_(a.call(null, b, c))) {
          if(cljs.core.truth_(cljs.core.next.call(null, d))) {
            b = c, c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d)
          }else {
            return a.call(null, c, cljs.core.first.call(null, d))
          }
        }else {
          return!1
        }
      }
    }, d = function(a, d, g) {
      var h = null;
      goog.isDef(g) && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a), g = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
      return b.call(this, d, g, a)
    };
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a > d;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core._GT__EQ_ = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      for(;;) {
        if(cljs.core.truth_(a.call(null, b, c))) {
          if(cljs.core.truth_(cljs.core.next.call(null, d))) {
            b = c, c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d)
          }else {
            return a.call(null, c, cljs.core.first.call(null, d))
          }
        }else {
          return!1
        }
      }
    }, d = function(a, d, g) {
      var h = null;
      goog.isDef(g) && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a), g = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
      return b.call(this, d, g, a)
    };
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a >= d;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.dec = function(a) {
  return cljs.core._.call(null, a, 1)
};
cljs.core.max = function() {
  var a = null, b = function() {
    var b = function(b, c, f) {
      var g = null;
      goog.isDef(f) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return cljs.core.reduce.call(null, a, a.call(null, b, c), g)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), f = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return cljs.core.reduce.call(null, a, a.call(null, c, f), b)
    };
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return a > d ? a : d;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.min = function() {
  var a = null, b = function() {
    var b = function(b, c, f) {
      var g = null;
      goog.isDef(f) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return cljs.core.reduce.call(null, a, a.call(null, b, c), g)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), f = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
      return cljs.core.reduce.call(null, a, a.call(null, c, f), b)
    };
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return a < d ? a : d;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.fix = function(a) {
  return cljs.core.truth_(cljs.core._GT__EQ_.call(null, a, 0)) ? Math.floor.call(null, a) : Math.ceil.call(null, a)
};
cljs.core.mod = function(a, b) {
  return a % b
};
cljs.core.quot = function(a, b) {
  var c = cljs.core.mod.call(null, a, b);
  return cljs.core.fix.call(null, (a - c) / b)
};
cljs.core.rem = function(a, b) {
  var c = cljs.core.quot.call(null, a, b);
  return a - b * c
};
cljs.core.rand = function() {
  var a = null;
  return a = function(b) {
    switch(arguments.length) {
      case 0:
        return Math.random.call(null);
      case 1:
        return cljs.core._STAR_.call(null, b, a.call(null))
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.rand_int = function(a) {
  return cljs.core.fix.call(null, cljs.core.rand.call(null, a))
};
cljs.core.bit_xor = function(a, b) {
  return a ^ b
};
cljs.core.bit_and = function(a, b) {
  return a & b
};
cljs.core.bit_or = function(a, b) {
  return a | b
};
cljs.core.bit_and_not = function(a, b) {
  return a & ~b
};
cljs.core.bit_clear = function(a, b) {
  return a & ~(1 << b)
};
cljs.core.bit_flip = function(a, b) {
  return a ^ 1 << b
};
cljs.core.bit_not = function(a) {
  return~a
};
cljs.core.bit_set = function(a, b) {
  return a | 1 << b
};
cljs.core.bit_test = function(a, b) {
  return(a & 1 << b) != 0
};
cljs.core.bit_shift_left = function(a, b) {
  return a << b
};
cljs.core.bit_shift_right = function(a, b) {
  return a >> b
};
cljs.core._EQ__EQ_ = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      for(;;) {
        if(cljs.core.truth_(a.call(null, b, c))) {
          if(cljs.core.truth_(cljs.core.next.call(null, d))) {
            b = c, c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d)
          }else {
            return a.call(null, c, cljs.core.first.call(null, d))
          }
        }else {
          return!1
        }
      }
    }, d = function(a, d, g) {
      var h = null;
      goog.isDef(g) && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a), g = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
      return b.call(this, d, g, a)
    };
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return cljs.core._equiv.call(null, a, d);
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.pos_QMARK_ = function(a) {
  return cljs.core._LT_.call(null, 0, a)
};
cljs.core.zero_QMARK_ = function(a) {
  return cljs.core._EQ__EQ_.call(null, 0, a)
};
cljs.core.neg_QMARK_ = function(a) {
  return a < 0
};
cljs.core.nthnext = function(a, b) {
  for(var c = b, d = cljs.core.seq.call(null, a);;) {
    if(cljs.core.truth_(function() {
      var a = d;
      return cljs.core.truth_(a) ? cljs.core.pos_QMARK_.call(null, c) : a
    }())) {
      var e = cljs.core.dec.call(null, c), f = cljs.core.next.call(null, d), c = e, d = f
    }else {
      return d
    }
  }
};
cljs.core.IIndexed._ = !0;
cljs.core._nth._ = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        var e;
        e = cljs.core.nthnext.call(null, a, c);
        if(cljs.core.truth_(e)) {
          e = cljs.core.first.call(null, e)
        }else {
          throw"Index out of bounds";
        }
        return e;
      case 3:
        return e = cljs.core.nthnext.call(null, a, c), e = cljs.core.truth_(e) ? cljs.core.first.call(null, e) : d, e
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.str = function() {
  var a = null, b = function() {
    var b = function(b, c) {
      return function(b, c) {
        for(;;) {
          if(cljs.core.truth_(c)) {
            var d = b.append(a.call(null, cljs.core.first.call(null, c))), e = cljs.core.next.call(null, c), b = d, c = e
          }else {
            return a.call(null, b)
          }
        }
      }.call(null, new goog.string.StringBuffer(a.call(null, b)), c)
    }, d = function(a, d) {
      var g = null;
      goog.isDef(d) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return b.call(this, a, g)
    };
    d.cljs$lang$maxFixedArity = 1;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a), a = cljs.core.rest(a);
      return b.call(this, d, a)
    };
    return d
  }(), a = function(a, d) {
    switch(arguments.length) {
      case 0:
        return"";
      case 1:
        return cljs.core.truth_(cljs.core.nil_QMARK_.call(null, a)) ? "" : a.toString();
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.subs = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return a.substring(c);
      case 3:
        return a.substring(c, d)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.symbol = function() {
  var a = null;
  return a = function(b, c) {
    switch(arguments.length) {
      case 1:
        return cljs.core.truth_(cljs.core.symbol_QMARK_.call(null, b)) ? b : cljs.core.truth_(cljs.core.keyword_QMARK_.call(null, b)) ? cljs.core.str.call(null, "\ufdd1", "'", cljs.core.subs.call(null, b, 2)) : cljs.core.truth_("\ufdd0'else") ? cljs.core.str.call(null, "\ufdd1", "'", b) : null;
      case 2:
        return a.call(null, cljs.core.str.call(null, b, "/", c))
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.keyword = function() {
  var a = null;
  return a = function(b, c) {
    switch(arguments.length) {
      case 1:
        return cljs.core.truth_(cljs.core.keyword_QMARK_.call(null, b)) ? b : cljs.core.truth_(cljs.core.symbol_QMARK_.call(null, b)) ? cljs.core.str.call(null, "\ufdd0", "'", cljs.core.subs.call(null, b, 2)) : cljs.core.truth_("\ufdd0'else") ? cljs.core.str.call(null, "\ufdd0", "'", b) : null;
      case 2:
        return a.call(null, cljs.core.str.call(null, b, "/", c))
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.equiv_sequential = function(a, b) {
  return cljs.core.boolean$.call(null, cljs.core.truth_(cljs.core.sequential_QMARK_.call(null, b)) ? function() {
    for(var c = cljs.core.seq.call(null, a), d = cljs.core.seq.call(null, b);;) {
      if(cljs.core.truth_(cljs.core.nil_QMARK_.call(null, c))) {
        return cljs.core.nil_QMARK_.call(null, d)
      }else {
        if(cljs.core.truth_(cljs.core.nil_QMARK_.call(null, d))) {
          return!1
        }else {
          if(cljs.core.truth_(cljs.core._EQ_.call(null, cljs.core.first.call(null, c), cljs.core.first.call(null, d)))) {
            c = cljs.core.next.call(null, c), d = cljs.core.next.call(null, d)
          }else {
            return cljs.core.truth_("\ufdd0'else") ? !1 : null
          }
        }
      }
    }
  }() : null)
};
cljs.core.hash_combine = function(a, b) {
  return cljs.core.bit_xor.call(null, a, cljs.core._PLUS_.call(null, b, 2654435769, cljs.core.bit_shift_left.call(null, a, 6), cljs.core.bit_shift_right.call(null, a, 2)))
};
cljs.core.hash_coll = function(a) {
  return cljs.core.reduce.call(null, function(a, c) {
    return cljs.core.hash_combine.call(null, a, cljs.core.hash.call(null, c))
  }, cljs.core.hash.call(null, cljs.core.first.call(null, a)), cljs.core.next.call(null, a))
};
cljs.core.List = function(a, b, c, d) {
  this.meta = a;
  this.first = b;
  this.rest = c;
  this.count = d
};
cljs.core.List.prototype.cljs$core$IEquiv$ = !0;
cljs.core.List.prototype.cljs$core$IEquiv$_equiv = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.List.prototype.cljs$core$ICollection$ = !0;
cljs.core.List.prototype.cljs$core$ICollection$_conj = function(a, b) {
  return new cljs.core.List(this.meta, b, a, cljs.core.inc.call(null, this.count))
};
cljs.core.List.prototype.cljs$core$ISeq$ = !0;
cljs.core.List.prototype.cljs$core$ISeq$_first = function() {
  return this.first
};
cljs.core.List.prototype.cljs$core$ISeq$_rest = function() {
  return this.rest
};
cljs.core.List.prototype.cljs$core$ISeqable$ = !0;
cljs.core.List.prototype.cljs$core$ISeqable$_seq = function(a) {
  return a
};
cljs.core.List.prototype.cljs$core$IStack$ = !0;
cljs.core.List.prototype.cljs$core$IStack$_peek = function() {
  return this.first
};
cljs.core.List.prototype.cljs$core$IStack$_pop = function(a) {
  return cljs.core._rest.call(null, a)
};
cljs.core.List.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.List.prototype.cljs$core$IWithMeta$_with_meta = function(a, b) {
  return new cljs.core.List(b, this.first, this.rest, this.count)
};
cljs.core.List.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.List.prototype.cljs$core$IEmptyableCollection$_empty = function() {
  return cljs.core.List.EMPTY
};
cljs.core.List.prototype.cljs$core$IMeta$ = !0;
cljs.core.List.prototype.cljs$core$IMeta$_meta = function() {
  return this.meta
};
cljs.core.List.prototype.cljs$core$IHash$ = !0;
cljs.core.List.prototype.cljs$core$IHash$_hash = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.List.prototype.cljs$core$ICounted$ = !0;
cljs.core.List.prototype.cljs$core$ICounted$_count = function() {
  return this.count
};
cljs.core.List.prototype.cljs$core$ISequential$ = !0;
cljs.core.EmptyList = function(a) {
  this.meta = a
};
cljs.core.EmptyList.prototype.cljs$core$IEquiv$ = !0;
cljs.core.EmptyList.prototype.cljs$core$IEquiv$_equiv = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.EmptyList.prototype.cljs$core$ICollection$ = !0;
cljs.core.EmptyList.prototype.cljs$core$ICollection$_conj = function(a, b) {
  return new cljs.core.List(this.meta, b, null, 1)
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$ = !0;
cljs.core.EmptyList.prototype.cljs$core$ISeq$_first = function() {
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$_rest = function() {
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ISeqable$ = !0;
cljs.core.EmptyList.prototype.cljs$core$ISeqable$_seq = function() {
  return null
};
cljs.core.EmptyList.prototype.cljs$core$IStack$ = !0;
cljs.core.EmptyList.prototype.cljs$core$IStack$_peek = function() {
  return null
};
cljs.core.EmptyList.prototype.cljs$core$IStack$_pop = function() {
  return null
};
cljs.core.EmptyList.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.EmptyList.prototype.cljs$core$IWithMeta$_with_meta = function(a, b) {
  return new cljs.core.EmptyList(b)
};
cljs.core.EmptyList.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.EmptyList.prototype.cljs$core$IEmptyableCollection$_empty = function(a) {
  return a
};
cljs.core.EmptyList.prototype.cljs$core$IMeta$ = !0;
cljs.core.EmptyList.prototype.cljs$core$IMeta$_meta = function() {
  return this.meta
};
cljs.core.EmptyList.prototype.cljs$core$IHash$ = !0;
cljs.core.EmptyList.prototype.cljs$core$IHash$_hash = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.EmptyList.prototype.cljs$core$ICounted$ = !0;
cljs.core.EmptyList.prototype.cljs$core$ICounted$_count = function() {
  return 0
};
cljs.core.EmptyList.prototype.cljs$core$ISequential$ = !0;
cljs.core.List.EMPTY = new cljs.core.EmptyList(null);
cljs.core.reverse = function(a) {
  return cljs.core.reduce.call(null, cljs.core.conj, cljs.core.List.EMPTY, a)
};
cljs.core.list = function() {
  var a = function(a) {
    return cljs.core.reduce.call(null, cljs.core.conj, cljs.core.List.EMPTY, cljs.core.reverse.call(null, a))
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.Cons = function(a, b, c) {
  this.meta = a;
  this.first = b;
  this.rest = c
};
cljs.core.Cons.prototype.cljs$core$ISeqable$ = !0;
cljs.core.Cons.prototype.cljs$core$ISeqable$_seq = function(a) {
  return a
};
cljs.core.Cons.prototype.cljs$core$IHash$ = !0;
cljs.core.Cons.prototype.cljs$core$IHash$_hash = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.Cons.prototype.cljs$core$IEquiv$ = !0;
cljs.core.Cons.prototype.cljs$core$IEquiv$_equiv = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.Cons.prototype.cljs$core$ISequential$ = !0;
cljs.core.Cons.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.Cons.prototype.cljs$core$IEmptyableCollection$_empty = function() {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.Cons.prototype.cljs$core$ICollection$ = !0;
cljs.core.Cons.prototype.cljs$core$ICollection$_conj = function(a, b) {
  return new cljs.core.Cons(null, b, a)
};
cljs.core.Cons.prototype.cljs$core$ISeq$ = !0;
cljs.core.Cons.prototype.cljs$core$ISeq$_first = function() {
  return this.first
};
cljs.core.Cons.prototype.cljs$core$ISeq$_rest = function() {
  return cljs.core.truth_(cljs.core.nil_QMARK_.call(null, this.rest)) ? cljs.core.List.EMPTY : this.rest
};
cljs.core.Cons.prototype.cljs$core$IMeta$ = !0;
cljs.core.Cons.prototype.cljs$core$IMeta$_meta = function() {
  return this.meta
};
cljs.core.Cons.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.Cons.prototype.cljs$core$IWithMeta$_with_meta = function(a, b) {
  return new cljs.core.Cons(b, this.first, this.rest)
};
cljs.core.cons = function(a, b) {
  return new cljs.core.Cons(null, a, b)
};
cljs.core.IReduce.string = !0;
cljs.core._reduce.string = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core.ci_reduce.call(null, a, c);
      case 3:
        return cljs.core.ci_reduce.call(null, a, c, d)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.ILookup.string = !0;
cljs.core._lookup.string = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core._nth.call(null, a, c);
      case 3:
        return cljs.core._nth.call(null, a, c, d)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.IIndexed.string = !0;
cljs.core._nth.string = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core.truth_(cljs.core._LT_.call(null, c, cljs.core._count.call(null, a))) ? a.charAt(c) : null;
      case 3:
        return cljs.core.truth_(cljs.core._LT_.call(null, c, cljs.core._count.call(null, a))) ? a.charAt(c) : d
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.ICounted.string = !0;
cljs.core._count.string = function(a) {
  return a.length
};
cljs.core.ISeqable.string = !0;
cljs.core._seq.string = function(a) {
  return cljs.core.prim_seq.call(null, a, 0)
};
cljs.core.IHash.string = !0;
cljs.core._hash.string = function(a) {
  return goog.string.hashCode.call(null, a)
};
String.prototype.call = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core.get.call(null, c, this.toString());
      case 3:
        return cljs.core.get.call(null, c, this.toString(), d)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
String.prototype.apply = function(a, b) {
  return cljs.core.truth_(cljs.core._LT_.call(null, cljs.core.count.call(null, b), 2)) ? cljs.core.get.call(null, b[0], a) : cljs.core.get.call(null, b[0], a, b[1])
};
cljs.core.lazy_seq_value = function(a) {
  var b = a.x;
  return cljs.core.truth_(a.realized) ? b : (a.x = b.call(null), a.realized = !0, a.x)
};
cljs.core.LazySeq = function(a, b, c) {
  this.meta = a;
  this.realized = b;
  this.x = c
};
cljs.core.LazySeq.prototype.cljs$core$ISeqable$ = !0;
cljs.core.LazySeq.prototype.cljs$core$ISeqable$_seq = function(a) {
  return cljs.core.seq.call(null, cljs.core.lazy_seq_value.call(null, a))
};
cljs.core.LazySeq.prototype.cljs$core$IHash$ = !0;
cljs.core.LazySeq.prototype.cljs$core$IHash$_hash = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.LazySeq.prototype.cljs$core$IEquiv$ = !0;
cljs.core.LazySeq.prototype.cljs$core$IEquiv$_equiv = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.LazySeq.prototype.cljs$core$ISequential$ = !0;
cljs.core.LazySeq.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.LazySeq.prototype.cljs$core$IEmptyableCollection$_empty = function() {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.LazySeq.prototype.cljs$core$ICollection$ = !0;
cljs.core.LazySeq.prototype.cljs$core$ICollection$_conj = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$ = !0;
cljs.core.LazySeq.prototype.cljs$core$ISeq$_first = function(a) {
  return cljs.core.first.call(null, cljs.core.lazy_seq_value.call(null, a))
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$_rest = function(a) {
  return cljs.core.rest.call(null, cljs.core.lazy_seq_value.call(null, a))
};
cljs.core.LazySeq.prototype.cljs$core$IMeta$ = !0;
cljs.core.LazySeq.prototype.cljs$core$IMeta$_meta = function() {
  return this.meta
};
cljs.core.LazySeq.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.LazySeq.prototype.cljs$core$IWithMeta$_with_meta = function(a, b) {
  return new cljs.core.LazySeq(b, this.realized, this.x)
};
cljs.core.to_array = function(a) {
  for(var b = cljs.core.array.call(null);;) {
    if(cljs.core.truth_(cljs.core.seq.call(null, a))) {
      b.push(cljs.core.first.call(null, a)), a = cljs.core.next.call(null, a)
    }else {
      return b
    }
  }
};
cljs.core.bounded_count = function(a, b) {
  for(var c = a, d = b, e = 0;;) {
    if(cljs.core.truth_(function() {
      var a = cljs.core.pos_QMARK_.call(null, d);
      return cljs.core.truth_(a) ? cljs.core.seq.call(null, c) : a
    }())) {
      var f = cljs.core.next.call(null, c), g = cljs.core.dec.call(null, d), e = cljs.core.inc.call(null, e), c = f, d = g
    }else {
      return e
    }
  }
};
cljs.core.spread = function spread(b) {
  return cljs.core.truth_(cljs.core.nil_QMARK_.call(null, b)) ? null : cljs.core.truth_(cljs.core.nil_QMARK_.call(null, cljs.core.next.call(null, b))) ? cljs.core.seq.call(null, cljs.core.first.call(null, b)) : cljs.core.truth_("\ufdd0'else") ? cljs.core.cons.call(null, cljs.core.first.call(null, b), spread.call(null, cljs.core.next.call(null, b))) : null
};
cljs.core.concat = function() {
  var a = null, b = function() {
    return new cljs.core.LazySeq(null, !1, function() {
      return null
    })
  }, c = function(a) {
    return new cljs.core.LazySeq(null, !1, function() {
      return a
    })
  }, d = function(b, c) {
    return new cljs.core.LazySeq(null, !1, function() {
      var d = cljs.core.seq.call(null, b);
      return cljs.core.truth_(d) ? cljs.core.cons.call(null, cljs.core.first.call(null, d), a.call(null, cljs.core.rest.call(null, d), c)) : c
    })
  }, e = function() {
    var b = function(b, c, d) {
      return function l(a, b) {
        return new cljs.core.LazySeq(null, !1, function() {
          var c = cljs.core.seq.call(null, a);
          return cljs.core.truth_(c) ? cljs.core.cons.call(null, cljs.core.first.call(null, c), l.call(null, cljs.core.rest.call(null, c), b)) : cljs.core.truth_(b) ? l.call(null, cljs.core.first.call(null, b), cljs.core.next.call(null, b)) : null
        })
      }.call(null, a.call(null, b, c), d)
    }, c = function(a, c, d) {
      var e = null;
      goog.isDef(d) && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, e)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
      return b.call(this, c, d, a)
    };
    return c
  }(), a = function(a, g, h) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a);
      case 2:
        return d.call(this, a, g);
      default:
        return e.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  return a
}();
cljs.core.list_STAR_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c, d, i) {
      return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, cljs.core.cons.call(null, d, cljs.core.spread.call(null, i)))))
    }, b = function(b, d, g, h, i) {
      var j = null;
      goog.isDef(i) && (j = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
      return a.call(this, b, d, g, h, j)
    };
    b.cljs$lang$maxFixedArity = 4;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b), g = cljs.core.first(cljs.core.next(b)), h = cljs.core.first(cljs.core.next(cljs.core.next(b))), i = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(b)))), b = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(b))));
      return a.call(this, d, g, h, i, b)
    };
    return b
  }(), a = function(a, d, e, f, g) {
    switch(arguments.length) {
      case 1:
        return cljs.core.seq.call(null, a);
      case 2:
        return cljs.core.cons.call(null, a, d);
      case 3:
        return cljs.core.cons.call(null, a, cljs.core.cons.call(null, d, e));
      case 4:
        return cljs.core.cons.call(null, a, cljs.core.cons.call(null, d, cljs.core.cons.call(null, e, f)));
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.apply = function() {
  var a = null, b = function() {
    var a = function(a, b, c, d, i, j) {
      b = cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, cljs.core.cons.call(null, d, cljs.core.cons.call(null, i, cljs.core.spread.call(null, j)))));
      c = a.cljs$lang$maxFixedArity;
      return cljs.core.truth_(a.cljs$lang$applyTo) ? cljs.core.truth_(cljs.core._LT__EQ_.call(null, cljs.core.bounded_count.call(null, b, c), c)) ? a.apply(a, cljs.core.to_array.call(null, b)) : a.cljs$lang$applyTo(b) : a.apply(a, cljs.core.to_array.call(null, b))
    }, b = function(b, d, g, h, i, j) {
      var k = null;
      goog.isDef(j) && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0));
      return a.call(this, b, d, g, h, i, k)
    };
    b.cljs$lang$maxFixedArity = 5;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b), g = cljs.core.first(cljs.core.next(b)), h = cljs.core.first(cljs.core.next(cljs.core.next(b))), i = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(b)))), j = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(b))))), b = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(b)))));
      return a.call(this, d, g, h, i, j, b)
    };
    return b
  }(), a = function(a, d, e, f, g, h) {
    switch(arguments.length) {
      case 2:
        var i = a, j = d, k = i.cljs$lang$maxFixedArity;
        return cljs.core.truth_(i.cljs$lang$applyTo) ? cljs.core.truth_(cljs.core._LT__EQ_.call(null, cljs.core.bounded_count.call(null, j, cljs.core.inc.call(null, k)), k)) ? i.apply(i, cljs.core.to_array.call(null, j)) : i.cljs$lang$applyTo(j) : i.apply(i, cljs.core.to_array.call(null, j));
      case 3:
        return i = a, j = cljs.core.list_STAR_.call(null, d, e), k = i.cljs$lang$maxFixedArity, cljs.core.truth_(i.cljs$lang$applyTo) ? cljs.core.truth_(cljs.core._LT__EQ_.call(null, cljs.core.bounded_count.call(null, j, k), k)) ? i.apply(i, cljs.core.to_array.call(null, j)) : i.cljs$lang$applyTo(j) : i.apply(i, cljs.core.to_array.call(null, j));
      case 4:
        return i = a, j = cljs.core.list_STAR_.call(null, d, e, f), k = i.cljs$lang$maxFixedArity, cljs.core.truth_(i.cljs$lang$applyTo) ? cljs.core.truth_(cljs.core._LT__EQ_.call(null, cljs.core.bounded_count.call(null, j, k), k)) ? i.apply(i, cljs.core.to_array.call(null, j)) : i.cljs$lang$applyTo(j) : i.apply(i, cljs.core.to_array.call(null, j));
      case 5:
        return i = a, j = cljs.core.list_STAR_.call(null, d, e, f, g), k = i.cljs$lang$maxFixedArity, cljs.core.truth_(i.cljs$lang$applyTo) ? cljs.core.truth_(cljs.core._LT__EQ_.call(null, cljs.core.bounded_count.call(null, j, k), k)) ? i.apply(i, cljs.core.to_array.call(null, j)) : i.cljs$lang$applyTo(j) : i.apply(i, cljs.core.to_array.call(null, j));
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 5;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.vary_meta = function() {
  var a = function(a, b, e) {
    return cljs.core.with_meta.call(null, a, cljs.core.apply.call(null, b, cljs.core.meta.call(null, a), e))
  }, b = function(b, d, e) {
    var f = null;
    goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return a.call(this, b, d, f)
  };
  b.cljs$lang$maxFixedArity = 2;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b), e = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
    return a.call(this, d, e, b)
  };
  return b
}();
cljs.core.not_EQ_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      var g = null;
      goog.isDef(c) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return cljs.core.not.call(null, cljs.core.apply.call(null, cljs.core._EQ_, a, b, g))
    };
    a.cljs$lang$maxFixedArity = 2;
    a.cljs$lang$applyTo = function(a) {
      var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
      return cljs.core.not.call(null, cljs.core.apply.call(null, cljs.core._EQ_, b, c, a))
    };
    return a
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!1;
      case 2:
        return cljs.core.not.call(null, cljs.core._EQ_.call(null, a, d));
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.not_empty = function(a) {
  return cljs.core.truth_(cljs.core.seq.call(null, a)) ? a : null
};
cljs.core.every_QMARK_ = function(a, b) {
  for(;;) {
    if(cljs.core.truth_(cljs.core.nil_QMARK_.call(null, cljs.core.seq.call(null, b)))) {
      return!0
    }else {
      if(cljs.core.truth_(a.call(null, cljs.core.first.call(null, b)))) {
        var c = a, d = cljs.core.next.call(null, b), a = c, b = d
      }else {
        return cljs.core.truth_("\ufdd0'else") ? !1 : null
      }
    }
  }
};
cljs.core.not_every_QMARK_ = function(a, b) {
  return cljs.core.not.call(null, cljs.core.every_QMARK_.call(null, a, b))
};
cljs.core.some = function(a, b) {
  for(;;) {
    if(cljs.core.truth_(cljs.core.seq.call(null, b))) {
      var c = a.call(null, cljs.core.first.call(null, b));
      if(cljs.core.truth_(c)) {
        return c
      }else {
        var c = a, d = cljs.core.next.call(null, b), a = c, b = d
      }
    }else {
      return null
    }
  }
};
cljs.core.not_any_QMARK_ = function(a, b) {
  return cljs.core.not.call(null, cljs.core.some.call(null, a, b))
};
cljs.core.even_QMARK_ = function(a) {
  if(cljs.core.truth_(cljs.core.integer_QMARK_.call(null, a))) {
    return cljs.core.zero_QMARK_.call(null, cljs.core.bit_and.call(null, a, 1))
  }else {
    throw cljs.core.str.call(null, "Argument must be an integer: ", a);
  }
};
cljs.core.odd_QMARK_ = function(a) {
  return cljs.core.not.call(null, cljs.core.even_QMARK_.call(null, a))
};
cljs.core.identity = function(a) {
  return a
};
cljs.core.complement = function(a) {
  return function() {
    var b = null, c = function() {
      var b = function(b, c, d) {
        var h = null;
        goog.isDef(d) && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
        return cljs.core.not.call(null, cljs.core.apply.call(null, a, b, c, h))
      };
      b.cljs$lang$maxFixedArity = 2;
      b.cljs$lang$applyTo = function(b) {
        var c = cljs.core.first(b), d = cljs.core.first(cljs.core.next(b)), b = cljs.core.rest(cljs.core.next(b));
        return cljs.core.not.call(null, cljs.core.apply.call(null, a, c, d, b))
      };
      return b
    }(), b = function(b, e, f) {
      switch(arguments.length) {
        case 0:
          return cljs.core.not.call(null, a.call(null));
        case 1:
          return cljs.core.not.call(null, a.call(null, b));
        case 2:
          return cljs.core.not.call(null, a.call(null, b, e));
        default:
          return c.apply(this, arguments)
      }
      throw"Invalid arity: " + arguments.length;
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = c.cljs$lang$applyTo;
    return b
  }()
};
cljs.core.constantly = function(a) {
  return function() {
    var b = function(b) {
      goog.isDef(b) && cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
      return a
    };
    b.cljs$lang$maxFixedArity = 0;
    b.cljs$lang$applyTo = function(b) {
      cljs.core.seq(b);
      return a
    };
    return b
  }()
};
cljs.core.comp = function() {
  var a = null, b = function(a, b) {
    return function() {
      var c = null, d = function() {
        var c = function(c, d, g, h) {
          var i = null;
          goog.isDef(h) && (i = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return a.call(null, cljs.core.apply.call(null, b, c, d, g, i))
        };
        c.cljs$lang$maxFixedArity = 3;
        c.cljs$lang$applyTo = function(c) {
          var d = cljs.core.first(c), g = cljs.core.first(cljs.core.next(c)), h = cljs.core.first(cljs.core.next(cljs.core.next(c))), c = cljs.core.rest(cljs.core.next(cljs.core.next(c)));
          return a.call(null, cljs.core.apply.call(null, b, d, g, h, c))
        };
        return c
      }(), c = function(c, g, k, l) {
        switch(arguments.length) {
          case 0:
            return a.call(null, b.call(null));
          case 1:
            return a.call(null, b.call(null, c));
          case 2:
            return a.call(null, b.call(null, c, g));
          case 3:
            return a.call(null, b.call(null, c, g, k));
          default:
            return d.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = d.cljs$lang$applyTo;
      return c
    }()
  }, c = function(a, b, c) {
    return function() {
      var d = null, i = function() {
        var d = function(d, h, i, j) {
          var n = null;
          goog.isDef(j) && (n = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return a.call(null, b.call(null, cljs.core.apply.call(null, c, d, h, i, n)))
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(d) {
          var h = cljs.core.first(d), i = cljs.core.first(cljs.core.next(d)), j = cljs.core.first(cljs.core.next(cljs.core.next(d))), d = cljs.core.rest(cljs.core.next(cljs.core.next(d)));
          return a.call(null, b.call(null, cljs.core.apply.call(null, c, h, i, j, d)))
        };
        return d
      }(), d = function(d, h, l, m) {
        switch(arguments.length) {
          case 0:
            return a.call(null, b.call(null, c.call(null)));
          case 1:
            return a.call(null, b.call(null, c.call(null, d)));
          case 2:
            return a.call(null, b.call(null, c.call(null, d, h)));
          case 3:
            return a.call(null, b.call(null, c.call(null, d, h, l)));
          default:
            return i.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = i.cljs$lang$applyTo;
      return d
    }()
  }, d = function() {
    var a = function(a, b, c, d) {
      var e = cljs.core.reverse.call(null, cljs.core.list_STAR_.call(null, a, b, c, d));
      return function() {
        var a = function(a) {
          for(var a = cljs.core.apply.call(null, cljs.core.first.call(null, e), a), b = cljs.core.next.call(null, e);;) {
            if(cljs.core.truth_(b)) {
              a = cljs.core.first.call(null, b).call(null, a), b = cljs.core.next.call(null, b)
            }else {
              return a
            }
          }
        }, b = function(b) {
          var c = null;
          goog.isDef(b) && (c = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
          return a.call(this, c)
        };
        b.cljs$lang$maxFixedArity = 0;
        b.cljs$lang$applyTo = function(b) {
          b = cljs.core.seq(b);
          return a.call(this, b)
        };
        return b
      }()
    }, b = function(b, c, d, f) {
      var k = null;
      goog.isDef(f) && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, d, k)
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), d = cljs.core.first(cljs.core.next(b)), f = cljs.core.first(cljs.core.next(cljs.core.next(b))), b = cljs.core.rest(cljs.core.next(cljs.core.next(b)));
      return a.call(this, c, d, f, b)
    };
    return b
  }(), a = function(a, f, g, h) {
    switch(arguments.length) {
      case 0:
        return cljs.core.identity;
      case 1:
        return a;
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      default:
        return d.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  return a
}();
cljs.core.partial = function() {
  var a = null, b = function(a, b) {
    return function() {
      var c = function(c) {
        var d = null;
        goog.isDef(c) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
        return cljs.core.apply.call(null, a, b, d)
      };
      c.cljs$lang$maxFixedArity = 0;
      c.cljs$lang$applyTo = function(c) {
        c = cljs.core.seq(c);
        return cljs.core.apply.call(null, a, b, c)
      };
      return c
    }()
  }, c = function(a, b, c) {
    return function() {
      var d = function(d) {
        var e = null;
        goog.isDef(d) && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
        return cljs.core.apply.call(null, a, b, c, e)
      };
      d.cljs$lang$maxFixedArity = 0;
      d.cljs$lang$applyTo = function(d) {
        d = cljs.core.seq(d);
        return cljs.core.apply.call(null, a, b, c, d)
      };
      return d
    }()
  }, d = function(a, b, c, d) {
    return function() {
      var e = function(e) {
        var j = null;
        goog.isDef(e) && (j = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
        return cljs.core.apply.call(null, a, b, c, d, j)
      };
      e.cljs$lang$maxFixedArity = 0;
      e.cljs$lang$applyTo = function(e) {
        e = cljs.core.seq(e);
        return cljs.core.apply.call(null, a, b, c, d, e)
      };
      return e
    }()
  }, e = function() {
    var a = function(a, b, c, d, e) {
      return function() {
        var f = function(f) {
          return cljs.core.apply.call(null, a, b, c, d, cljs.core.concat.call(null, e, f))
        }, g = function(a) {
          var b = null;
          goog.isDef(a) && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
          return f.call(this, b)
        };
        g.cljs$lang$maxFixedArity = 0;
        g.cljs$lang$applyTo = function(a) {
          a = cljs.core.seq(a);
          return f.call(this, a)
        };
        return g
      }()
    }, b = function(b, c, d, e, g) {
      var m = null;
      goog.isDef(g) && (m = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
      return a.call(this, b, c, d, e, m)
    };
    b.cljs$lang$maxFixedArity = 4;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), d = cljs.core.first(cljs.core.next(b)), e = cljs.core.first(cljs.core.next(cljs.core.next(b))), g = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(b)))), b = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(b))));
      return a.call(this, c, d, e, g, b)
    };
    return b
  }(), a = function(a, g, h, i, j) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, g);
      case 3:
        return c.call(this, a, g, h);
      case 4:
        return d.call(this, a, g, h, i);
      default:
        return e.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  return a
}();
cljs.core.fnil = function() {
  var a = null, b = function(a, b) {
    return function() {
      var c = null, d = function() {
        var c = function(c, d, g, h) {
          return cljs.core.apply.call(null, a, cljs.core.truth_(cljs.core.nil_QMARK_.call(null, c)) ? b : c, d, g, h)
        }, d = function(a, b, d, e) {
          var f = null;
          goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f)
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return c.call(this, b, d, e, a)
        };
        return d
      }(), c = function(c, g, k, l) {
        switch(arguments.length) {
          case 1:
            return a.call(null, cljs.core.truth_(cljs.core.nil_QMARK_.call(null, c)) ? b : c);
          case 2:
            return a.call(null, cljs.core.truth_(cljs.core.nil_QMARK_.call(null, c)) ? b : c, g);
          case 3:
            return a.call(null, cljs.core.truth_(cljs.core.nil_QMARK_.call(null, c)) ? b : c, g, k);
          default:
            return d.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = d.cljs$lang$applyTo;
      return c
    }()
  }, c = function(a, b, c) {
    return function() {
      var d = null, i = function() {
        var d = function(d, h, i, j) {
          return cljs.core.apply.call(null, a, cljs.core.truth_(cljs.core.nil_QMARK_.call(null, d)) ? b : d, cljs.core.truth_(cljs.core.nil_QMARK_.call(null, h)) ? c : h, i, j)
        }, h = function(a, b, c, e) {
          var f = null;
          goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f)
        };
        h.cljs$lang$maxFixedArity = 3;
        h.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return d.call(this, b, c, e, a)
        };
        return h
      }(), d = function(d, h, l, m) {
        switch(arguments.length) {
          case 2:
            return a.call(null, cljs.core.truth_(cljs.core.nil_QMARK_.call(null, d)) ? b : d, cljs.core.truth_(cljs.core.nil_QMARK_.call(null, h)) ? c : h);
          case 3:
            return a.call(null, cljs.core.truth_(cljs.core.nil_QMARK_.call(null, d)) ? b : d, cljs.core.truth_(cljs.core.nil_QMARK_.call(null, h)) ? c : h, l);
          default:
            return i.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = i.cljs$lang$applyTo;
      return d
    }()
  }, d = function(a, b, c, d) {
    return function() {
      var i = null, j = function() {
        var i = function(i, j, k, l) {
          return cljs.core.apply.call(null, a, cljs.core.truth_(cljs.core.nil_QMARK_.call(null, i)) ? b : i, cljs.core.truth_(cljs.core.nil_QMARK_.call(null, j)) ? c : j, cljs.core.truth_(cljs.core.nil_QMARK_.call(null, k)) ? d : k, l)
        }, j = function(a, b, c, d) {
          var e = null;
          goog.isDef(d) && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return i.call(this, a, b, c, e)
        };
        j.cljs$lang$maxFixedArity = 3;
        j.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return i.call(this, b, c, d, a)
        };
        return j
      }(), i = function(i, l, m, o) {
        switch(arguments.length) {
          case 2:
            return a.call(null, cljs.core.truth_(cljs.core.nil_QMARK_.call(null, i)) ? b : i, cljs.core.truth_(cljs.core.nil_QMARK_.call(null, l)) ? c : l);
          case 3:
            return a.call(null, cljs.core.truth_(cljs.core.nil_QMARK_.call(null, i)) ? b : i, cljs.core.truth_(cljs.core.nil_QMARK_.call(null, l)) ? c : l, cljs.core.truth_(cljs.core.nil_QMARK_.call(null, m)) ? d : m);
          default:
            return j.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      i.cljs$lang$maxFixedArity = 3;
      i.cljs$lang$applyTo = j.cljs$lang$applyTo;
      return i
    }()
  };
  return function(a, f, g, h) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      case 4:
        return d.call(this, a, f, g, h)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.map_indexed = function(a, b) {
  return function d(b, f) {
    return new cljs.core.LazySeq(null, !1, function() {
      var g = cljs.core.seq.call(null, f);
      return cljs.core.truth_(g) ? cljs.core.cons.call(null, a.call(null, b, cljs.core.first.call(null, g)), d.call(null, cljs.core.inc.call(null, b), cljs.core.rest.call(null, g))) : null
    })
  }.call(null, 0, b)
};
cljs.core.keep = function keep(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    var d = cljs.core.seq.call(null, c);
    if(cljs.core.truth_(d)) {
      var e = b.call(null, cljs.core.first.call(null, d));
      return cljs.core.truth_(cljs.core.nil_QMARK_.call(null, e)) ? keep.call(null, b, cljs.core.rest.call(null, d)) : cljs.core.cons.call(null, e, keep.call(null, b, cljs.core.rest.call(null, d)))
    }else {
      return null
    }
  })
};
cljs.core.keep_indexed = function(a, b) {
  return function d(b, f) {
    return new cljs.core.LazySeq(null, !1, function() {
      var g = cljs.core.seq.call(null, f);
      if(cljs.core.truth_(g)) {
        var h = a.call(null, b, cljs.core.first.call(null, g));
        return cljs.core.truth_(cljs.core.nil_QMARK_.call(null, h)) ? d.call(null, cljs.core.inc.call(null, b), cljs.core.rest.call(null, g)) : cljs.core.cons.call(null, h, d.call(null, cljs.core.inc.call(null, b), cljs.core.rest.call(null, g)))
      }else {
        return null
      }
    })
  }.call(null, 0, b)
};
cljs.core.every_pred = function() {
  var a = null, b = function(a) {
    return function() {
      var b = null, c = function(b, c) {
        return cljs.core.boolean$.call(null, function() {
          var d = a.call(null, b);
          return cljs.core.truth_(d) ? a.call(null, c) : d
        }())
      }, d = function(b, c, d) {
        return cljs.core.boolean$.call(null, function() {
          var e = a.call(null, b);
          return cljs.core.truth_(e) ? (e = a.call(null, c), cljs.core.truth_(e) ? a.call(null, d) : e) : e
        }())
      }, e = function() {
        var c = function(c, d, e, h) {
          return cljs.core.boolean$.call(null, function() {
            var i = b.call(null, c, d, e);
            return cljs.core.truth_(i) ? cljs.core.every_QMARK_.call(null, a, h) : i
          }())
        }, d = function(a, b, d, e) {
          var f = null;
          goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f)
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return c.call(this, b, d, e, a)
        };
        return d
      }(), b = function(b, g, m, o) {
        switch(arguments.length) {
          case 0:
            return!0;
          case 1:
            return cljs.core.boolean$.call(null, a.call(null, b));
          case 2:
            return c.call(this, b, g);
          case 3:
            return d.call(this, b, g, m);
          default:
            return e.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      b.cljs$lang$maxFixedArity = 3;
      b.cljs$lang$applyTo = e.cljs$lang$applyTo;
      return b
    }()
  }, c = function(a, b) {
    return function() {
      var c = null, d = function(c) {
        return cljs.core.boolean$.call(null, function() {
          var d = a.call(null, c);
          return cljs.core.truth_(d) ? b.call(null, c) : d
        }())
      }, e = function(c, d) {
        return cljs.core.boolean$.call(null, function() {
          var e = a.call(null, c);
          return cljs.core.truth_(e) ? (e = a.call(null, d), cljs.core.truth_(e) ? (e = b.call(null, c), cljs.core.truth_(e) ? b.call(null, d) : e) : e) : e
        }())
      }, k = function(c, d, e) {
        return cljs.core.boolean$.call(null, function() {
          var h = a.call(null, c);
          return cljs.core.truth_(h) ? (h = a.call(null, d), cljs.core.truth_(h) ? (h = a.call(null, e), cljs.core.truth_(h) ? (h = b.call(null, c), cljs.core.truth_(h) ? (h = b.call(null, d), cljs.core.truth_(h) ? b.call(null, e) : h) : h) : h) : h) : h
        }())
      }, l = function() {
        var d = function(d, e, i, j) {
          return cljs.core.boolean$.call(null, function() {
            var m = c.call(null, d, e, i);
            return cljs.core.truth_(m) ? cljs.core.every_QMARK_.call(null, function(c) {
              var d = a.call(null, c);
              return cljs.core.truth_(d) ? b.call(null, c) : d
            }, j) : m
          }())
        }, e = function(a, b, c, e) {
          var f = null;
          goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f)
        };
        e.cljs$lang$maxFixedArity = 3;
        e.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return d.call(this, b, c, e, a)
        };
        return e
      }(), c = function(a, b, c, f) {
        switch(arguments.length) {
          case 0:
            return!0;
          case 1:
            return d.call(this, a);
          case 2:
            return e.call(this, a, b);
          case 3:
            return k.call(this, a, b, c);
          default:
            return l.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = l.cljs$lang$applyTo;
      return c
    }()
  }, d = function(a, b, c) {
    return function() {
      var d = null, e = function(d) {
        return cljs.core.boolean$.call(null, function() {
          var e = a.call(null, d);
          return cljs.core.truth_(e) ? (e = b.call(null, d), cljs.core.truth_(e) ? c.call(null, d) : e) : e
        }())
      }, k = function(d, e) {
        return cljs.core.boolean$.call(null, function() {
          var i = a.call(null, d);
          return cljs.core.truth_(i) ? (i = b.call(null, d), cljs.core.truth_(i) ? (i = c.call(null, d), cljs.core.truth_(i) ? (i = a.call(null, e), cljs.core.truth_(i) ? (i = b.call(null, e), cljs.core.truth_(i) ? c.call(null, e) : i) : i) : i) : i) : i
        }())
      }, l = function(d, e, i) {
        return cljs.core.boolean$.call(null, function() {
          var j = a.call(null, d);
          return cljs.core.truth_(j) ? (j = b.call(null, d), cljs.core.truth_(j) ? (j = c.call(null, d), cljs.core.truth_(j) ? (j = a.call(null, e), cljs.core.truth_(j) ? (j = b.call(null, e), cljs.core.truth_(j) ? (j = c.call(null, e), cljs.core.truth_(j) ? (j = a.call(null, i), cljs.core.truth_(j) ? (j = b.call(null, i), cljs.core.truth_(j) ? c.call(null, i) : j) : j) : j) : j) : j) : j) : j) : j
        }())
      }, m = function() {
        var e = function(e, j, m, k) {
          return cljs.core.boolean$.call(null, function() {
            var l = d.call(null, e, j, m);
            return cljs.core.truth_(l) ? cljs.core.every_QMARK_.call(null, function(d) {
              var e = a.call(null, d);
              return cljs.core.truth_(e) ? (e = b.call(null, d), cljs.core.truth_(e) ? c.call(null, d) : e) : e
            }, k) : l
          }())
        }, j = function(a, b, c, d) {
          var f = null;
          goog.isDef(d) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return e.call(this, a, b, c, f)
        };
        j.cljs$lang$maxFixedArity = 3;
        j.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return e.call(this, b, c, d, a)
        };
        return j
      }(), d = function(a, b, c, d) {
        switch(arguments.length) {
          case 0:
            return!0;
          case 1:
            return e.call(this, a);
          case 2:
            return k.call(this, a, b);
          case 3:
            return l.call(this, a, b, c);
          default:
            return m.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = m.cljs$lang$applyTo;
      return d
    }()
  }, e = function() {
    var a = function(a, b, c, d) {
      var e = cljs.core.list_STAR_.call(null, a, b, c, d);
      return function() {
        var a = null, b = function(a) {
          return cljs.core.every_QMARK_.call(null, function(b) {
            return b.call(null, a)
          }, e)
        }, c = function(a, b) {
          return cljs.core.every_QMARK_.call(null, function(c) {
            var d = c.call(null, a);
            return cljs.core.truth_(d) ? c.call(null, b) : d
          }, e)
        }, d = function(a, b, c) {
          return cljs.core.every_QMARK_.call(null, function(d) {
            var e = d.call(null, a);
            return cljs.core.truth_(e) ? (e = d.call(null, b), cljs.core.truth_(e) ? d.call(null, c) : e) : e
          }, e)
        }, f = function() {
          var b = function(b, c, d, f) {
            return cljs.core.boolean$.call(null, function() {
              var g = a.call(null, b, c, d);
              return cljs.core.truth_(g) ? cljs.core.every_QMARK_.call(null, function(a) {
                return cljs.core.every_QMARK_.call(null, a, f)
              }, e) : g
            }())
          }, c = function(a, c, d, e) {
            var f = null;
            goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
            return b.call(this, a, c, d, f)
          };
          c.cljs$lang$maxFixedArity = 3;
          c.cljs$lang$applyTo = function(a) {
            var c = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
            return b.call(this, c, d, e, a)
          };
          return c
        }(), a = function(a, e, g, h) {
          switch(arguments.length) {
            case 0:
              return!0;
            case 1:
              return b.call(this, a);
            case 2:
              return c.call(this, a, e);
            case 3:
              return d.call(this, a, e, g);
            default:
              return f.apply(this, arguments)
          }
          throw"Invalid arity: " + arguments.length;
        };
        a.cljs$lang$maxFixedArity = 3;
        a.cljs$lang$applyTo = f.cljs$lang$applyTo;
        return a
      }()
    }, b = function(b, c, d, e) {
      var g = null;
      goog.isDef(e) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, d, g)
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), d = cljs.core.first(cljs.core.next(b)), e = cljs.core.first(cljs.core.next(cljs.core.next(b))), b = cljs.core.rest(cljs.core.next(cljs.core.next(b)));
      return a.call(this, c, d, e, b)
    };
    return b
  }(), a = function(a, g, h, i) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, g);
      case 3:
        return d.call(this, a, g, h);
      default:
        return e.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  return a
}();
cljs.core.some_fn = function() {
  var a = null, b = function(a) {
    return function() {
      var b = null, c = function() {
        var c = function(c, d, e, h) {
          c = b.call(null, c, d, e);
          return cljs.core.truth_(c) ? c : cljs.core.some.call(null, a, h)
        }, d = function(a, b, d, e) {
          var f = null;
          goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f)
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return c.call(this, b, d, e, a)
        };
        return d
      }(), b = function(b, d, e, g) {
        switch(arguments.length) {
          case 0:
            return null;
          case 1:
            return a.call(null, b);
          case 2:
            var m = d, o = a.call(null, b);
            return cljs.core.truth_(o) ? o : a.call(null, m);
          case 3:
            var o = d, m = e, n = a.call(null, b);
            cljs.core.truth_(n) ? m = n : (o = a.call(null, o), m = cljs.core.truth_(o) ? o : a.call(null, m));
            return m;
          default:
            return c.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      b.cljs$lang$maxFixedArity = 3;
      b.cljs$lang$applyTo = c.cljs$lang$applyTo;
      return b
    }()
  }, c = function(a, b) {
    return function() {
      var c = null, d = function(c, d, e) {
        var h = a.call(null, c);
        return cljs.core.truth_(h) ? h : (h = a.call(null, d), cljs.core.truth_(h) ? h : (h = a.call(null, e), cljs.core.truth_(h) ? h : (c = b.call(null, c), cljs.core.truth_(c) ? c : (d = b.call(null, d), cljs.core.truth_(d) ? d : b.call(null, e)))))
      }, e = function() {
        var d = function(d, e, i, j) {
          d = c.call(null, d, e, i);
          return cljs.core.truth_(d) ? d : cljs.core.some.call(null, function(c) {
            var d = a.call(null, c);
            return cljs.core.truth_(d) ? d : b.call(null, c)
          }, j)
        }, e = function(a, b, c, e) {
          var f = null;
          goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f)
        };
        e.cljs$lang$maxFixedArity = 3;
        e.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return d.call(this, b, c, e, a)
        };
        return e
      }(), c = function(c, h, m, o) {
        switch(arguments.length) {
          case 0:
            return null;
          case 1:
            var n = c, q = a.call(null, n);
            return cljs.core.truth_(q) ? q : b.call(null, n);
          case 2:
            var q = c, n = h, p = a.call(null, q);
            cljs.core.truth_(p) ? n = p : (p = a.call(null, n), cljs.core.truth_(p) ? n = p : (q = b.call(null, q), n = cljs.core.truth_(q) ? q : b.call(null, n)));
            return n;
          case 3:
            return d.call(this, c, h, m);
          default:
            return e.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = e.cljs$lang$applyTo;
      return c
    }()
  }, d = function(a, b, c) {
    return function() {
      var d = null, e = function(d, e) {
        var i = a.call(null, d);
        return cljs.core.truth_(i) ? i : (i = b.call(null, d), cljs.core.truth_(i) ? i : (i = c.call(null, d), cljs.core.truth_(i) ? i : (i = a.call(null, e), cljs.core.truth_(i) ? i : (i = b.call(null, e), cljs.core.truth_(i) ? i : c.call(null, e)))))
      }, k = function(d, e, i) {
        var j = a.call(null, d);
        return cljs.core.truth_(j) ? j : (j = b.call(null, d), cljs.core.truth_(j) ? j : (d = c.call(null, d), cljs.core.truth_(d) ? d : (d = a.call(null, e), cljs.core.truth_(d) ? d : (d = b.call(null, e), cljs.core.truth_(d) ? d : (e = c.call(null, e), cljs.core.truth_(e) ? e : (e = a.call(null, i), cljs.core.truth_(e) ? e : (e = b.call(null, i), cljs.core.truth_(e) ? e : c.call(null, i))))))))
      }, l = function() {
        var e = function(e, j, l, k) {
          e = d.call(null, e, j, l);
          return cljs.core.truth_(e) ? e : cljs.core.some.call(null, function(d) {
            var e = a.call(null, d);
            return cljs.core.truth_(e) ? e : (e = b.call(null, d), cljs.core.truth_(e) ? e : c.call(null, d))
          }, k)
        }, j = function(a, b, c, d) {
          var f = null;
          goog.isDef(d) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return e.call(this, a, b, c, f)
        };
        j.cljs$lang$maxFixedArity = 3;
        j.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return e.call(this, b, c, d, a)
        };
        return j
      }(), d = function(d, i, n, q) {
        switch(arguments.length) {
          case 0:
            return null;
          case 1:
            var p;
            p = d;
            var r = a.call(null, p);
            cljs.core.truth_(r) ? p = r : (r = b.call(null, p), p = cljs.core.truth_(r) ? r : c.call(null, p));
            return p;
          case 2:
            return e.call(this, d, i);
          case 3:
            return k.call(this, d, i, n);
          default:
            return l.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = l.cljs$lang$applyTo;
      return d
    }()
  }, e = function() {
    var a = function(a, b, c, d) {
      var e = cljs.core.list_STAR_.call(null, a, b, c, d);
      return function() {
        var a = null, b = function(a) {
          return cljs.core.some.call(null, function(b) {
            return b.call(null, a)
          }, e)
        }, c = function(a, b) {
          return cljs.core.some.call(null, function(c) {
            var d = c.call(null, a);
            return cljs.core.truth_(d) ? d : c.call(null, b)
          }, e)
        }, d = function(a, b, c) {
          return cljs.core.some.call(null, function(d) {
            var e = d.call(null, a);
            return cljs.core.truth_(e) ? e : (e = d.call(null, b), cljs.core.truth_(e) ? e : d.call(null, c))
          }, e)
        }, f = function() {
          var b = function(b, c, d, f) {
            b = a.call(null, b, c, d);
            return cljs.core.truth_(b) ? b : cljs.core.some.call(null, function(a) {
              return cljs.core.some.call(null, a, f)
            }, e)
          }, c = function(a, c, d, e) {
            var f = null;
            goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
            return b.call(this, a, c, d, f)
          };
          c.cljs$lang$maxFixedArity = 3;
          c.cljs$lang$applyTo = function(a) {
            var c = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
            return b.call(this, c, d, e, a)
          };
          return c
        }(), a = function(a, e, g, h) {
          switch(arguments.length) {
            case 0:
              return null;
            case 1:
              return b.call(this, a);
            case 2:
              return c.call(this, a, e);
            case 3:
              return d.call(this, a, e, g);
            default:
              return f.apply(this, arguments)
          }
          throw"Invalid arity: " + arguments.length;
        };
        a.cljs$lang$maxFixedArity = 3;
        a.cljs$lang$applyTo = f.cljs$lang$applyTo;
        return a
      }()
    }, b = function(b, c, d, e) {
      var g = null;
      goog.isDef(e) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, d, g)
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), d = cljs.core.first(cljs.core.next(b)), e = cljs.core.first(cljs.core.next(cljs.core.next(b))), b = cljs.core.rest(cljs.core.next(cljs.core.next(b)));
      return a.call(this, c, d, e, b)
    };
    return b
  }(), a = function(a, g, h, i) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, g);
      case 3:
        return d.call(this, a, g, h);
      default:
        return e.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  return a
}();
cljs.core.map = function() {
  var a = null, b = function(b, c) {
    return new cljs.core.LazySeq(null, !1, function() {
      var d = cljs.core.seq.call(null, c);
      return cljs.core.truth_(d) ? cljs.core.cons.call(null, b.call(null, cljs.core.first.call(null, d)), a.call(null, b, cljs.core.rest.call(null, d))) : null
    })
  }, c = function(b, c, d) {
    return new cljs.core.LazySeq(null, !1, function() {
      var e = cljs.core.seq.call(null, c), j = cljs.core.seq.call(null, d);
      return cljs.core.truth_(cljs.core.truth_(e) ? j : e) ? cljs.core.cons.call(null, b.call(null, cljs.core.first.call(null, e), cljs.core.first.call(null, j)), a.call(null, b, cljs.core.rest.call(null, e), cljs.core.rest.call(null, j))) : null
    })
  }, d = function(b, c, d, e) {
    return new cljs.core.LazySeq(null, !1, function() {
      var j = cljs.core.seq.call(null, c), k = cljs.core.seq.call(null, d), l = cljs.core.seq.call(null, e);
      return cljs.core.truth_(cljs.core.truth_(j) ? cljs.core.truth_(k) ? l : k : j) ? cljs.core.cons.call(null, b.call(null, cljs.core.first.call(null, j), cljs.core.first.call(null, k), cljs.core.first.call(null, l)), a.call(null, b, cljs.core.rest.call(null, j), cljs.core.rest.call(null, k), cljs.core.rest.call(null, l))) : null
    })
  }, e = function() {
    var b = function(b, c, d, e, f) {
      return a.call(null, function(a) {
        return cljs.core.apply.call(null, b, a)
      }, function o(b) {
        return new cljs.core.LazySeq(null, !1, function() {
          var c = a.call(null, cljs.core.seq, b);
          return cljs.core.truth_(cljs.core.every_QMARK_.call(null, cljs.core.identity, c)) ? cljs.core.cons.call(null, a.call(null, cljs.core.first, c), o.call(null, a.call(null, cljs.core.rest, c))) : null
        })
      }.call(null, cljs.core.conj.call(null, f, e, d, c)))
    }, c = function(a, c, d, e, g) {
      var m = null;
      goog.isDef(g) && (m = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
      return b.call(this, a, c, d, e, m)
    };
    c.cljs$lang$maxFixedArity = 4;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a))), g = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(a)))), a = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(a))));
      return b.call(this, c, d, e, g, a)
    };
    return c
  }(), a = function(a, g, h, i, j) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, g);
      case 3:
        return c.call(this, a, g, h);
      case 4:
        return d.call(this, a, g, h, i);
      default:
        return e.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  return a
}();
cljs.core.take = function take(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    if(cljs.core.truth_(cljs.core.pos_QMARK_.call(null, b))) {
      var d = cljs.core.seq.call(null, c);
      return cljs.core.truth_(d) ? cljs.core.cons.call(null, cljs.core.first.call(null, d), take.call(null, cljs.core.dec.call(null, b), cljs.core.rest.call(null, d))) : null
    }else {
      return null
    }
  })
};
cljs.core.drop = function(a, b) {
  var c = function(a, b) {
    for(;;) {
      var c = cljs.core.seq.call(null, b);
      if(cljs.core.truth_(function() {
        var b = cljs.core.pos_QMARK_.call(null, a);
        return cljs.core.truth_(b) ? c : b
      }())) {
        var g = cljs.core.dec.call(null, a), h = cljs.core.rest.call(null, c), a = g, b = h
      }else {
        return c
      }
    }
  };
  return new cljs.core.LazySeq(null, !1, function() {
    return c.call(null, a, b)
  })
};
cljs.core.drop_last = function() {
  var a = null, b = function(a, b) {
    return cljs.core.map.call(null, function(a) {
      return a
    }, b, cljs.core.drop.call(null, a, b))
  };
  return a = function(c, d) {
    switch(arguments.length) {
      case 1:
        return a.call(null, 1, c);
      case 2:
        return b.call(this, c, d)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.take_last = function(a, b) {
  for(var c = cljs.core.seq.call(null, b), d = cljs.core.seq.call(null, cljs.core.drop.call(null, a, b));;) {
    if(cljs.core.truth_(d)) {
      c = cljs.core.next.call(null, c), d = cljs.core.next.call(null, d)
    }else {
      return c
    }
  }
};
cljs.core.drop_while = function(a, b) {
  var c = function(a, b) {
    for(;;) {
      var c = cljs.core.seq.call(null, b);
      if(cljs.core.truth_(function() {
        var b = c;
        return cljs.core.truth_(b) ? a.call(null, cljs.core.first.call(null, c)) : b
      }())) {
        var g = a, h = cljs.core.rest.call(null, c), a = g, b = h
      }else {
        return c
      }
    }
  };
  return new cljs.core.LazySeq(null, !1, function() {
    return c.call(null, a, b)
  })
};
cljs.core.cycle = function cycle(b) {
  return new cljs.core.LazySeq(null, !1, function() {
    var c = cljs.core.seq.call(null, b);
    return cljs.core.truth_(c) ? cljs.core.concat.call(null, c, cycle.call(null, c)) : null
  })
};
cljs.core.split_at = function(a, b) {
  return cljs.core.Vector.fromArray([cljs.core.take.call(null, a, b), cljs.core.drop.call(null, a, b)])
};
cljs.core.repeat = function() {
  var a = null, b = function(b) {
    return new cljs.core.LazySeq(null, !1, function() {
      return cljs.core.cons.call(null, b, a.call(null, b))
    })
  };
  return a = function(c, d) {
    switch(arguments.length) {
      case 1:
        return b.call(this, c);
      case 2:
        return cljs.core.take.call(null, c, a.call(null, d))
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.replicate = function(a, b) {
  return cljs.core.take.call(null, a, cljs.core.repeat.call(null, b))
};
cljs.core.repeatedly = function() {
  var a = null, b = function(b) {
    return new cljs.core.LazySeq(null, !1, function() {
      return cljs.core.cons.call(null, b.call(null), a.call(null, b))
    })
  };
  return a = function(c, d) {
    switch(arguments.length) {
      case 1:
        return b.call(this, c);
      case 2:
        return cljs.core.take.call(null, c, a.call(null, d))
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.iterate = function iterate(b, c) {
  return cljs.core.cons.call(null, c, new cljs.core.LazySeq(null, !1, function() {
    return iterate.call(null, b, b.call(null, c))
  }))
};
cljs.core.interleave = function() {
  var a = null, b = function(b, c) {
    return new cljs.core.LazySeq(null, !1, function() {
      var f = cljs.core.seq.call(null, b), g = cljs.core.seq.call(null, c);
      return cljs.core.truth_(cljs.core.truth_(f) ? g : f) ? cljs.core.cons.call(null, cljs.core.first.call(null, f), cljs.core.cons.call(null, cljs.core.first.call(null, g), a.call(null, cljs.core.rest.call(null, f), cljs.core.rest.call(null, g)))) : null
    })
  }, c = function() {
    var b = function(b, c, d) {
      return new cljs.core.LazySeq(null, !1, function() {
        var e = cljs.core.map.call(null, cljs.core.seq, cljs.core.conj.call(null, d, c, b));
        return cljs.core.truth_(cljs.core.every_QMARK_.call(null, cljs.core.identity, e)) ? cljs.core.concat.call(null, cljs.core.map.call(null, cljs.core.first, e), cljs.core.apply.call(null, a, cljs.core.map.call(null, cljs.core.rest, e))) : null
      })
    }, c = function(a, c, e) {
      var i = null;
      goog.isDef(e) && (i = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, i)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a), e = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
      return b.call(this, c, e, a)
    };
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      default:
        return c.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  return a
}();
cljs.core.interpose = function(a, b) {
  return cljs.core.drop.call(null, 1, cljs.core.interleave.call(null, cljs.core.repeat.call(null, a), b))
};
cljs.core.flatten1 = function(a) {
  return function c(a, e) {
    return new cljs.core.LazySeq(null, !1, function() {
      var f = cljs.core.seq.call(null, a);
      return cljs.core.truth_(f) ? cljs.core.cons.call(null, cljs.core.first.call(null, f), c.call(null, cljs.core.rest.call(null, f), e)) : cljs.core.truth_(cljs.core.seq.call(null, e)) ? c.call(null, cljs.core.first.call(null, e), cljs.core.rest.call(null, e)) : null
    })
  }.call(null, null, a)
};
cljs.core.mapcat = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      var g = null;
      goog.isDef(c) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return cljs.core.flatten1.call(null, cljs.core.apply.call(null, cljs.core.map, a, b, g))
    };
    a.cljs$lang$maxFixedArity = 2;
    a.cljs$lang$applyTo = function(a) {
      var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
      return cljs.core.flatten1.call(null, cljs.core.apply.call(null, cljs.core.map, b, c, a))
    };
    return a
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 2:
        return cljs.core.flatten1.call(null, cljs.core.map.call(null, a, d));
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.filter = function filter(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    var d = cljs.core.seq.call(null, c);
    if(cljs.core.truth_(d)) {
      var e = cljs.core.first.call(null, d), d = cljs.core.rest.call(null, d);
      return cljs.core.truth_(b.call(null, e)) ? cljs.core.cons.call(null, e, filter.call(null, b, d)) : filter.call(null, b, d)
    }else {
      return null
    }
  })
};
cljs.core.remove = function(a, b) {
  return cljs.core.filter.call(null, cljs.core.complement.call(null, a), b)
};
cljs.core.tree_seq = function(a, b, c) {
  return function e(c) {
    return new cljs.core.LazySeq(null, !1, function() {
      return cljs.core.cons.call(null, c, cljs.core.truth_(a.call(null, c)) ? cljs.core.mapcat.call(null, e, b.call(null, c)) : null)
    })
  }.call(null, c)
};
cljs.core.flatten = function(a) {
  return cljs.core.filter.call(null, function(a) {
    return cljs.core.not.call(null, cljs.core.sequential_QMARK_.call(null, a))
  }, cljs.core.rest.call(null, cljs.core.tree_seq.call(null, cljs.core.sequential_QMARK_, cljs.core.seq, a)))
};
cljs.core.into = function(a, b) {
  return cljs.core.reduce.call(null, cljs.core._conj, a, b)
};
cljs.core.partition = function() {
  var a = null, b = function(b, c, f) {
    return new cljs.core.LazySeq(null, !1, function() {
      var g = cljs.core.seq.call(null, f);
      if(cljs.core.truth_(g)) {
        var h = cljs.core.take.call(null, b, g);
        return cljs.core.truth_(cljs.core._EQ_.call(null, b, cljs.core.count.call(null, h))) ? cljs.core.cons.call(null, h, a.call(null, b, c, cljs.core.drop.call(null, c, g))) : null
      }else {
        return null
      }
    })
  }, c = function(b, c, f, g) {
    return new cljs.core.LazySeq(null, !1, function() {
      var h = cljs.core.seq.call(null, g);
      if(cljs.core.truth_(h)) {
        var i = cljs.core.take.call(null, b, h);
        return cljs.core.truth_(cljs.core._EQ_.call(null, b, cljs.core.count.call(null, i))) ? cljs.core.cons.call(null, i, a.call(null, b, c, f, cljs.core.drop.call(null, c, h))) : cljs.core.list.call(null, cljs.core.take.call(null, b, cljs.core.concat.call(null, i, f)))
      }else {
        return null
      }
    })
  };
  return a = function(d, e, f, g) {
    switch(arguments.length) {
      case 2:
        return a.call(null, d, d, e);
      case 3:
        return b.call(this, d, e, f);
      case 4:
        return c.call(this, d, e, f, g)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.get_in = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core.reduce.call(null, cljs.core.get, a, c);
      case 3:
        var e;
        a: {
          for(var f = cljs.core.lookup_sentinel, g = a, h = cljs.core.seq.call(null, c);;) {
            if(cljs.core.truth_(h)) {
              if(g = cljs.core.get.call(null, g, cljs.core.first.call(null, h), f), cljs.core.truth_(cljs.core.identical_QMARK_.call(null, f, g))) {
                e = d;
                break a
              }else {
                h = cljs.core.next.call(null, h)
              }
            }else {
              e = g;
              break a
            }
          }
        }
        return e
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.assoc_in = function assoc_in(b, c, d) {
  var e = cljs.core.nth.call(null, c, 0, null), c = cljs.core.nthnext.call(null, c, 1);
  return cljs.core.truth_(c) ? cljs.core.assoc.call(null, b, e, assoc_in.call(null, cljs.core.get.call(null, b, e), c, d)) : cljs.core.assoc.call(null, b, e, d)
};
cljs.core.update_in = function() {
  var a = function(a, d, e, f) {
    var g = cljs.core.nth.call(null, d, 0, null), d = cljs.core.nthnext.call(null, d, 1);
    return cljs.core.truth_(d) ? cljs.core.assoc.call(null, a, g, cljs.core.apply.call(null, b, cljs.core.get.call(null, a, g), d, e, f)) : cljs.core.assoc.call(null, a, g, cljs.core.apply.call(null, e, cljs.core.get.call(null, a, g), f))
  }, b = function(b, d, e, f) {
    var g = null;
    goog.isDef(f) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
    return a.call(this, b, d, e, g)
  };
  b.cljs$lang$maxFixedArity = 3;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b), e = cljs.core.first(cljs.core.next(b)), f = cljs.core.first(cljs.core.next(cljs.core.next(b))), b = cljs.core.rest(cljs.core.next(cljs.core.next(b)));
    return a.call(this, d, e, f, b)
  };
  return b
}();
cljs.core.Vector = function(a, b) {
  this.meta = a;
  this.array = b
};
cljs.core.Vector.prototype.cljs$core$IEquiv$ = !0;
cljs.core.Vector.prototype.cljs$core$IEquiv$_equiv = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.Vector.prototype.cljs$core$ICollection$ = !0;
cljs.core.Vector.prototype.cljs$core$ICollection$_conj = function(a, b) {
  var c = cljs.core.aclone.call(null, this.array);
  c.push(b);
  return new cljs.core.Vector(this.meta, c)
};
cljs.core.Vector.prototype.cljs$core$ISeqable$ = !0;
cljs.core.Vector.prototype.cljs$core$ISeqable$_seq = function() {
  var a = this;
  return cljs.core.truth_(cljs.core._GT_.call(null, a.array.length, 0)) ? function c(d) {
    return new cljs.core.LazySeq(null, !1, function() {
      return cljs.core.truth_(cljs.core._LT_.call(null, d, a.array.length)) ? cljs.core.cons.call(null, a.array[d], c.call(null, cljs.core.inc.call(null, d))) : null
    })
  }.call(null, 0) : null
};
cljs.core.Vector.prototype.cljs$core$IVector$ = !0;
cljs.core.Vector.prototype.cljs$core$IVector$_assoc_n = function(a, b, c) {
  return cljs.core._assoc.call(null, a, b, c)
};
cljs.core.Vector.prototype.cljs$core$IStack$ = !0;
cljs.core.Vector.prototype.cljs$core$IStack$_peek = function() {
  var a = this.array.length;
  return cljs.core.truth_(cljs.core._GT_.call(null, a, 0)) ? this.array[cljs.core.dec.call(null, a)] : null
};
cljs.core.Vector.prototype.cljs$core$IStack$_pop = function() {
  if(cljs.core.truth_(cljs.core._GT_.call(null, this.array.length, 0))) {
    var a = cljs.core.aclone.call(null, this.array);
    a.pop();
    return new cljs.core.Vector(this.meta, a)
  }else {
    throw"Can't pop empty vector";
  }
};
cljs.core.Vector.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.Vector.prototype.cljs$core$IWithMeta$_with_meta = function(a, b) {
  return new cljs.core.Vector(b, this.array)
};
cljs.core.Vector.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.Vector.prototype.cljs$core$IEmptyableCollection$_empty = function() {
  return cljs.core.with_meta.call(null, cljs.core.Vector.EMPTY, this.meta)
};
cljs.core.Vector.prototype.cljs$core$IIndexed$ = !0;
cljs.core.Vector.prototype.cljs$core$IIndexed$_nth = function() {
  var a = null, b = function(a, b) {
    var c = this;
    return cljs.core.truth_(function() {
      var a = cljs.core._LT__EQ_.call(null, 0, b);
      return cljs.core.truth_(a) ? cljs.core._LT_.call(null, b, c.array.length) : a
    }()) ? c.array[b] : null
  }, c = function(a, b, c) {
    var g = this;
    return cljs.core.truth_(function() {
      var a = cljs.core._LT__EQ_.call(null, 0, b);
      return cljs.core.truth_(a) ? cljs.core._LT_.call(null, b, g.array.length) : a
    }()) ? g.array[b] : c
  };
  return function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.Vector.prototype.cljs$core$IMeta$ = !0;
cljs.core.Vector.prototype.cljs$core$IMeta$_meta = function() {
  return this.meta
};
cljs.core.Vector.prototype.cljs$core$IReduce$ = !0;
cljs.core.Vector.prototype.cljs$core$IReduce$_reduce = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core.ci_reduce.call(null, this.array, c);
      case 3:
        return cljs.core.ci_reduce.call(null, this.array, c, d)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.Vector.prototype.cljs$core$IHash$ = !0;
cljs.core.Vector.prototype.cljs$core$IHash$_hash = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.Vector.prototype.cljs$core$ICounted$ = !0;
cljs.core.Vector.prototype.cljs$core$ICounted$_count = function() {
  return this.array.length
};
cljs.core.Vector.prototype.cljs$core$ISequential$ = !0;
cljs.core.Vector.prototype.cljs$core$IAssociative$ = !0;
cljs.core.Vector.prototype.cljs$core$IAssociative$_assoc = function(a, b, c) {
  a = cljs.core.aclone.call(null, this.array);
  a[b] = c;
  return new cljs.core.Vector(this.meta, a)
};
cljs.core.Vector.prototype.cljs$core$ILookup$ = !0;
cljs.core.Vector.prototype.cljs$core$ILookup$_lookup = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core._nth.call(null, a, c, null);
      case 3:
        return cljs.core._nth.call(null, a, c, d)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.Vector.EMPTY = new cljs.core.Vector(null, cljs.core.array.call(null));
cljs.core.Vector.fromArray = function(a) {
  return new cljs.core.Vector(null, a)
};
cljs.core.Vector.prototype.call = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, this, c);
      case 3:
        return cljs.core._lookup.call(null, this, c, d)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.vec = function(a) {
  return cljs.core.reduce.call(null, cljs.core.conj, cljs.core.Vector.EMPTY, a)
};
cljs.core.vector = function() {
  var a = function(a) {
    var c = null;
    goog.isDef(a) && (c = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return cljs.core.vec.call(null, c)
  };
  a.cljs$lang$maxFixedArity = 0;
  a.cljs$lang$applyTo = function(a) {
    a = cljs.core.seq(a);
    return cljs.core.vec.call(null, a)
  };
  return a
}();
cljs.core.NeverEquiv = function() {
};
cljs.core.NeverEquiv.prototype.cljs$core$IEquiv$ = !0;
cljs.core.NeverEquiv.prototype.cljs$core$IEquiv$_equiv = function() {
  return!1
};
cljs.core.never_equiv = new cljs.core.NeverEquiv;
cljs.core.equiv_map = function(a, b) {
  return cljs.core.boolean$.call(null, cljs.core.truth_(cljs.core.map_QMARK_.call(null, b)) ? cljs.core.truth_(cljs.core._EQ_.call(null, cljs.core.count.call(null, a), cljs.core.count.call(null, b))) ? cljs.core.every_QMARK_.call(null, cljs.core.identity, cljs.core.map.call(null, function(a) {
    return cljs.core._EQ_.call(null, cljs.core.get.call(null, b, cljs.core.first.call(null, a), cljs.core.never_equiv), cljs.core.second.call(null, a))
  }, a)) : null : null)
};
cljs.core.scan_array = function(a, b, c) {
  for(var d = c.length, e = 0;;) {
    if(cljs.core.truth_(cljs.core._LT_.call(null, e, d))) {
      if(cljs.core.truth_(cljs.core._EQ_.call(null, b, c[e]))) {
        return e
      }else {
        e = cljs.core._PLUS_.call(null, e, a)
      }
    }else {
      return null
    }
  }
};
cljs.core.obj_map_contains_key_QMARK_ = function() {
  var a = null, b = function(a, b, e, f) {
    return cljs.core.truth_(function() {
      var e = goog.isString.call(null, a);
      return cljs.core.truth_(e) ? b.hasOwnProperty(a) : e
    }()) ? e : f
  };
  return a = function(c, d, e, f) {
    switch(arguments.length) {
      case 2:
        return a.call(null, c, d, !0, !1);
      case 4:
        return b.call(this, c, d, e, f)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.ObjMap = function(a, b, c) {
  this.meta = a;
  this.keys = b;
  this.strobj = c
};
cljs.core.ObjMap.prototype.cljs$core$IEquiv$ = !0;
cljs.core.ObjMap.prototype.cljs$core$IEquiv$_equiv = function(a, b) {
  return cljs.core.equiv_map.call(null, a, b)
};
cljs.core.ObjMap.prototype.cljs$core$ICollection$ = !0;
cljs.core.ObjMap.prototype.cljs$core$ICollection$_conj = function(a, b) {
  return cljs.core.truth_(cljs.core.vector_QMARK_.call(null, b)) ? cljs.core._assoc.call(null, a, cljs.core._nth.call(null, b, 0), cljs.core._nth.call(null, b, 1)) : cljs.core.reduce.call(null, cljs.core._conj, a, b)
};
cljs.core.ObjMap.prototype.cljs$core$ISeqable$ = !0;
cljs.core.ObjMap.prototype.cljs$core$ISeqable$_seq = function() {
  var a = this;
  return cljs.core.truth_(cljs.core.pos_QMARK_.call(null, a.keys.length)) ? cljs.core.map.call(null, function(b) {
    return cljs.core.vector.call(null, b, a.strobj[b])
  }, a.keys) : null
};
cljs.core.ObjMap.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.ObjMap.prototype.cljs$core$IWithMeta$_with_meta = function(a, b) {
  return new cljs.core.ObjMap(b, this.keys, this.strobj)
};
cljs.core.ObjMap.prototype.cljs$core$IMap$ = !0;
cljs.core.ObjMap.prototype.cljs$core$IMap$_dissoc = function(a, b) {
  var c = this;
  if(cljs.core.truth_(function() {
    var a = goog.isString.call(null, b);
    return cljs.core.truth_(a) ? c.strobj.hasOwnProperty(b) : a
  }())) {
    var d = cljs.core.aclone.call(null, c.keys), e = goog.object.clone.call(null, c.strobj);
    d.splice(cljs.core.scan_array.call(null, 1, b, d), 1);
    cljs.core.js_delete.call(null, e, b);
    return new cljs.core.ObjMap(c.meta, d, e)
  }else {
    return a
  }
};
cljs.core.ObjMap.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.ObjMap.prototype.cljs$core$IEmptyableCollection$_empty = function() {
  return cljs.core.with_meta.call(null, cljs.core.ObjMap.EMPTY, this.meta)
};
cljs.core.ObjMap.prototype.cljs$core$IMeta$ = !0;
cljs.core.ObjMap.prototype.cljs$core$IMeta$_meta = function() {
  return this.meta
};
cljs.core.ObjMap.prototype.cljs$core$IHash$ = !0;
cljs.core.ObjMap.prototype.cljs$core$IHash$_hash = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.ObjMap.prototype.cljs$core$ICounted$ = !0;
cljs.core.ObjMap.prototype.cljs$core$ICounted$_count = function() {
  return this.keys.length
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$ = !0;
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_assoc = function(a, b, c) {
  if(cljs.core.truth_(goog.isString.call(null, b))) {
    var a = goog.object.clone.call(null, this.strobj), d = a.hasOwnProperty(b);
    a[b] = c;
    return cljs.core.truth_(d) ? new cljs.core.ObjMap(this.meta, this.keys, a) : (c = cljs.core.aclone.call(null, this.keys), c.push(b), new cljs.core.ObjMap(this.meta, c, a))
  }else {
    return cljs.core.with_meta.call(null, cljs.core.into.call(null, cljs.core.hash_map.call(null, b, c), cljs.core.seq.call(null, a)), this.meta)
  }
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_ = function(a, b) {
  return cljs.core.obj_map_contains_key_QMARK_.call(null, b, this.strobj)
};
cljs.core.ObjMap.prototype.cljs$core$ILookup$ = !0;
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, a, c, null);
      case 3:
        return cljs.core.obj_map_contains_key_QMARK_.call(null, c, this.strobj, this.strobj[c], d)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.ObjMap.EMPTY = new cljs.core.ObjMap(null, cljs.core.array.call(null), cljs.core.js_obj.call(null));
cljs.core.ObjMap.fromObject = function(a, b) {
  return new cljs.core.ObjMap(null, a, b)
};
cljs.core.ObjMap.prototype.call = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, this, c);
      case 3:
        return cljs.core._lookup.call(null, this, c, d)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.HashMap = function(a, b, c) {
  this.meta = a;
  this.count = b;
  this.hashobj = c
};
cljs.core.HashMap.prototype.cljs$core$IEquiv$ = !0;
cljs.core.HashMap.prototype.cljs$core$IEquiv$_equiv = function(a, b) {
  return cljs.core.equiv_map.call(null, a, b)
};
cljs.core.HashMap.prototype.cljs$core$ICollection$ = !0;
cljs.core.HashMap.prototype.cljs$core$ICollection$_conj = function(a, b) {
  return cljs.core.truth_(cljs.core.vector_QMARK_.call(null, b)) ? cljs.core._assoc.call(null, a, cljs.core._nth.call(null, b, 0), cljs.core._nth.call(null, b, 1)) : cljs.core.reduce.call(null, cljs.core._conj, a, b)
};
cljs.core.HashMap.prototype.cljs$core$ISeqable$ = !0;
cljs.core.HashMap.prototype.cljs$core$ISeqable$_seq = function() {
  var a = this;
  if(cljs.core.truth_(cljs.core.pos_QMARK_.call(null, a.count))) {
    var b = cljs.core.js_keys.call(null, a.hashobj);
    return cljs.core.mapcat.call(null, function(b) {
      return cljs.core.map.call(null, cljs.core.vec, cljs.core.partition.call(null, 2, a.hashobj[b]))
    }, b)
  }else {
    return null
  }
};
cljs.core.HashMap.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.HashMap.prototype.cljs$core$IWithMeta$_with_meta = function(a, b) {
  return new cljs.core.HashMap(b, this.count, this.hashobj)
};
cljs.core.HashMap.prototype.cljs$core$IMap$ = !0;
cljs.core.HashMap.prototype.cljs$core$IMap$_dissoc = function(a, b) {
  var c = cljs.core.hash.call(null, b), d = this.hashobj[c], e = cljs.core.truth_(d) ? cljs.core.scan_array.call(null, 2, b, d) : null;
  if(cljs.core.truth_(cljs.core.not.call(null, e))) {
    return a
  }else {
    var f = goog.object.clone.call(null, this.hashobj);
    cljs.core.truth_(cljs.core._GT_.call(null, 3, d.length)) ? cljs.core.js_delete.call(null, f, c) : (d = cljs.core.aclone.call(null, d), d.splice(e, 2), f[c] = d);
    return new cljs.core.HashMap(this.meta, cljs.core.dec.call(null, this.count), f)
  }
};
cljs.core.HashMap.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.HashMap.prototype.cljs$core$IEmptyableCollection$_empty = function() {
  return cljs.core.with_meta.call(null, cljs.core.HashMap.EMPTY, this.meta)
};
cljs.core.HashMap.prototype.cljs$core$IMeta$ = !0;
cljs.core.HashMap.prototype.cljs$core$IMeta$_meta = function() {
  return this.meta
};
cljs.core.HashMap.prototype.cljs$core$IHash$ = !0;
cljs.core.HashMap.prototype.cljs$core$IHash$_hash = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.HashMap.prototype.cljs$core$ICounted$ = !0;
cljs.core.HashMap.prototype.cljs$core$ICounted$_count = function() {
  return this.count
};
cljs.core.HashMap.prototype.cljs$core$IAssociative$ = !0;
cljs.core.HashMap.prototype.cljs$core$IAssociative$_assoc = function(a, b, c) {
  var a = cljs.core.hash.call(null, b), d = this.hashobj[a];
  if(cljs.core.truth_(d)) {
    var d = cljs.core.aclone.call(null, d), e = goog.object.clone.call(null, this.hashobj);
    e[a] = d;
    a = cljs.core.scan_array.call(null, 2, b, d);
    return cljs.core.truth_(a) ? (d[cljs.core.inc.call(null, a)] = c, new cljs.core.HashMap(this.meta, this.count, e)) : (d.push(b, c), new cljs.core.HashMap(this.meta, cljs.core.inc.call(null, this.count), e))
  }else {
    return d = goog.object.clone.call(null, this.hashobj), d[a] = cljs.core.array.call(null, b, c), new cljs.core.HashMap(this.meta, cljs.core.inc.call(null, this.count), d)
  }
};
cljs.core.HashMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_ = function(a, b) {
  var c = this.hashobj[cljs.core.hash.call(null, b)], c = cljs.core.truth_(c) ? cljs.core.scan_array.call(null, 2, b, c) : null;
  return cljs.core.truth_(c) ? !0 : !1
};
cljs.core.HashMap.prototype.cljs$core$ILookup$ = !0;
cljs.core.HashMap.prototype.cljs$core$ILookup$_lookup = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, a, c, null);
      case 3:
        var e = this.hashobj[cljs.core.hash.call(null, c)], f = cljs.core.truth_(e) ? cljs.core.scan_array.call(null, 2, c, e) : null;
        return cljs.core.truth_(f) ? e[cljs.core.inc.call(null, f)] : d
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.HashMap.EMPTY = new cljs.core.HashMap(null, 0, cljs.core.js_obj.call(null));
cljs.core.HashMap.fromArrays = function(a, b) {
  for(var c = a.length, d = 0, e = cljs.core.HashMap.EMPTY;;) {
    if(cljs.core.truth_(cljs.core._LT_.call(null, d, c))) {
      var f = cljs.core.inc.call(null, d), e = cljs.core.assoc.call(null, e, a[d], b[d]), d = f
    }else {
      return e
    }
  }
};
cljs.core.HashMap.prototype.call = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, this, c);
      case 3:
        return cljs.core._lookup.call(null, this, c, d)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.hash_map = function() {
  var a = function(a) {
    for(var a = cljs.core.seq.call(null, a), b = cljs.core.HashMap.EMPTY;;) {
      if(cljs.core.truth_(a)) {
        var e = cljs.core.nnext.call(null, a), b = cljs.core.assoc.call(null, b, cljs.core.first.call(null, a), cljs.core.second.call(null, a)), a = e
      }else {
        return b
      }
    }
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.keys = function(a) {
  return cljs.core.seq.call(null, cljs.core.map.call(null, cljs.core.first, a))
};
cljs.core.vals = function(a) {
  return cljs.core.seq.call(null, cljs.core.map.call(null, cljs.core.second, a))
};
cljs.core.merge = function() {
  var a = function(a) {
    return cljs.core.truth_(cljs.core.some.call(null, cljs.core.identity, a)) ? cljs.core.reduce.call(null, function(a, b) {
      return cljs.core.conj.call(null, cljs.core.truth_(a) ? a : cljs.core.ObjMap.fromObject([], {}), b)
    }, a) : null
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.merge_with = function() {
  var a = function(a, b) {
    if(cljs.core.truth_(cljs.core.some.call(null, cljs.core.identity, b))) {
      var e = function(b, d) {
        var e = cljs.core.first.call(null, d), i = cljs.core.second.call(null, d);
        return cljs.core.truth_(cljs.core.contains_QMARK_.call(null, b, e)) ? cljs.core.assoc.call(null, b, e, a.call(null, cljs.core.get.call(null, b, e), i)) : cljs.core.assoc.call(null, b, e, i)
      };
      return cljs.core.reduce.call(null, function(a, b) {
        return cljs.core.reduce.call(null, e, cljs.core.truth_(a) ? a : cljs.core.ObjMap.fromObject([], {}), cljs.core.seq.call(null, b))
      }, b)
    }else {
      return null
    }
  }, b = function(b, d) {
    var e = null;
    goog.isDef(d) && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b), b = cljs.core.rest(b);
    return a.call(this, d, b)
  };
  return b
}();
cljs.core.select_keys = function(a, b) {
  for(var c = cljs.core.ObjMap.fromObject([], {}), d = cljs.core.seq.call(null, b);;) {
    if(cljs.core.truth_(d)) {
      var e = cljs.core.first.call(null, d), f = cljs.core.get.call(null, a, e), c = cljs.core.truth_(f) ? cljs.core.assoc.call(null, c, e, f) : c, d = cljs.core.next.call(null, d)
    }else {
      return c
    }
  }
};
cljs.core.Set = function(a, b) {
  this.meta = a;
  this.hash_map = b
};
cljs.core.Set.prototype.cljs$core$ISet$ = !0;
cljs.core.Set.prototype.cljs$core$ISet$_disjoin = function(a, b) {
  return new cljs.core.Set(this.meta, cljs.core.dissoc.call(null, this.hash_map, b))
};
cljs.core.Set.prototype.cljs$core$IEquiv$ = !0;
cljs.core.Set.prototype.cljs$core$IEquiv$_equiv = function(a, b) {
  var c = cljs.core.set_QMARK_.call(null, b);
  return cljs.core.truth_(c) ? (c = cljs.core._EQ_.call(null, cljs.core.count.call(null, a), cljs.core.count.call(null, b)), cljs.core.truth_(c) ? cljs.core.every_QMARK_.call(null, function(b) {
    return cljs.core.contains_QMARK_.call(null, a, b)
  }, b) : c) : c
};
cljs.core.Set.prototype.cljs$core$ICollection$ = !0;
cljs.core.Set.prototype.cljs$core$ICollection$_conj = function(a, b) {
  return new cljs.core.Set(this.meta, cljs.core.assoc.call(null, this.hash_map, b, null))
};
cljs.core.Set.prototype.cljs$core$ISeqable$ = !0;
cljs.core.Set.prototype.cljs$core$ISeqable$_seq = function() {
  return cljs.core.keys.call(null, this.hash_map)
};
cljs.core.Set.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.Set.prototype.cljs$core$IWithMeta$_with_meta = function(a, b) {
  return new cljs.core.Set(b, this.hash_map)
};
cljs.core.Set.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.Set.prototype.cljs$core$IEmptyableCollection$_empty = function() {
  return cljs.core.with_meta.call(null, cljs.core.Set.EMPTY, this.meta)
};
cljs.core.Set.prototype.cljs$core$IMeta$ = !0;
cljs.core.Set.prototype.cljs$core$IMeta$_meta = function() {
  return this.meta
};
cljs.core.Set.prototype.cljs$core$IHash$ = !0;
cljs.core.Set.prototype.cljs$core$IHash$_hash = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.Set.prototype.cljs$core$ICounted$ = !0;
cljs.core.Set.prototype.cljs$core$ICounted$_count = function(a) {
  return cljs.core.count.call(null, cljs.core.seq.call(null, a))
};
cljs.core.Set.prototype.cljs$core$ILookup$ = !0;
cljs.core.Set.prototype.cljs$core$ILookup$_lookup = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, a, c, null);
      case 3:
        return cljs.core.truth_(cljs.core._contains_key_QMARK_.call(null, this.hash_map, c)) ? c : d
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.Set.EMPTY = new cljs.core.Set(null, cljs.core.hash_map.call(null));
cljs.core.Set.prototype.call = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, this, c);
      case 3:
        return cljs.core._lookup.call(null, this, c, d)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.set = function(a) {
  for(var a = cljs.core.seq.call(null, a), b = cljs.core.Set.EMPTY;;) {
    if(cljs.core.truth_(cljs.core.not.call(null, cljs.core.empty_QMARK_.call(null, a)))) {
      var c = cljs.core.rest.call(null, a), b = cljs.core.conj.call(null, b, cljs.core.first.call(null, a)), a = c
    }else {
      return b
    }
  }
};
cljs.core.replace = function(a, b) {
  if(cljs.core.truth_(cljs.core.vector_QMARK_.call(null, b))) {
    var c = cljs.core.count.call(null, b);
    return cljs.core.reduce.call(null, function(b, c) {
      var f = cljs.core.find.call(null, a, cljs.core.nth.call(null, b, c));
      return cljs.core.truth_(f) ? cljs.core.assoc.call(null, b, c, cljs.core.second.call(null, f)) : b
    }, b, cljs.core.take.call(null, c, cljs.core.iterate.call(null, cljs.core.inc, 0)))
  }else {
    return cljs.core.map.call(null, function(b) {
      var c = cljs.core.find.call(null, a, b);
      return cljs.core.truth_(c) ? cljs.core.second.call(null, c) : b
    }, b)
  }
};
cljs.core.distinct = function(a) {
  return function c(a, e) {
    return new cljs.core.LazySeq(null, !1, function() {
      return function(a, d) {
        for(;;) {
          var e = a, i = cljs.core.nth.call(null, e, 0, null), e = cljs.core.seq.call(null, e);
          if(cljs.core.truth_(e)) {
            if(cljs.core.truth_(cljs.core.contains_QMARK_.call(null, d, i))) {
              i = cljs.core.rest.call(null, e), e = d, a = i, d = e
            }else {
              return cljs.core.cons.call(null, i, c.call(null, cljs.core.rest.call(null, e), cljs.core.conj.call(null, d, i)))
            }
          }else {
            return null
          }
        }
      }.call(null, a, e)
    })
  }.call(null, a, cljs.core.set([]))
};
cljs.core.butlast = function(a) {
  for(var b = cljs.core.Vector.fromArray([]);;) {
    if(cljs.core.truth_(cljs.core.next.call(null, a))) {
      b = cljs.core.conj.call(null, b, cljs.core.first.call(null, a)), a = cljs.core.next.call(null, a)
    }else {
      return cljs.core.seq.call(null, b)
    }
  }
};
cljs.core.name = function(a) {
  if(cljs.core.truth_(cljs.core.string_QMARK_.call(null, a))) {
    return a
  }else {
    if(cljs.core.truth_(function() {
      var b = cljs.core.keyword_QMARK_.call(null, a);
      return cljs.core.truth_(b) ? b : cljs.core.symbol_QMARK_.call(null, a)
    }())) {
      var b = a.lastIndexOf("/");
      return cljs.core.truth_(cljs.core._LT_.call(null, b, 0)) ? cljs.core.subs.call(null, a, 2) : cljs.core.subs.call(null, a, cljs.core.inc.call(null, b))
    }else {
      return cljs.core.truth_("\ufdd0'else"), null
    }
  }
};
cljs.core.namespace = function(a) {
  if(cljs.core.truth_(function() {
    var b = cljs.core.keyword_QMARK_.call(null, a);
    return cljs.core.truth_(b) ? b : cljs.core.symbol_QMARK_.call(null, a)
  }())) {
    var b = a.lastIndexOf("/");
    return cljs.core.truth_(cljs.core._GT_.call(null, b, -1)) ? cljs.core.subs.call(null, a, 2, b) : null
  }else {
    return"\ufdd0'else"
  }
};
cljs.core.zipmap = function(a, b) {
  for(var c = cljs.core.ObjMap.fromObject([], {}), d = cljs.core.seq.call(null, a), e = cljs.core.seq.call(null, b);;) {
    if(cljs.core.truth_(function() {
      var a = d;
      return cljs.core.truth_(a) ? e : a
    }())) {
      var c = cljs.core.assoc.call(null, c, cljs.core.first.call(null, d), cljs.core.first.call(null, e)), f = cljs.core.next.call(null, d), g = cljs.core.next.call(null, e), d = f, e = g
    }else {
      return c
    }
  }
};
cljs.core.max_key = function() {
  var a = null, b = function() {
    var b = function(b, c, d, h) {
      return cljs.core.reduce.call(null, function(c, d) {
        return a.call(null, b, c, d)
      }, a.call(null, b, c, d), h)
    }, d = function(a, d, g, h) {
      var i = null;
      goog.isDef(h) && (i = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return b.call(this, a, d, g, i)
    };
    d.cljs$lang$maxFixedArity = 3;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a), g = cljs.core.first(cljs.core.next(a)), h = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
      return b.call(this, d, g, h, a)
    };
    return d
  }(), a = function(a, d, e, f) {
    switch(arguments.length) {
      case 2:
        return d;
      case 3:
        return cljs.core.truth_(cljs.core._GT_.call(null, a.call(null, d), a.call(null, e))) ? d : e;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.min_key = function() {
  var a = null, b = function() {
    var b = function(b, c, d, h) {
      return cljs.core.reduce.call(null, function(c, d) {
        return a.call(null, b, c, d)
      }, a.call(null, b, c, d), h)
    }, d = function(a, d, g, h) {
      var i = null;
      goog.isDef(h) && (i = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return b.call(this, a, d, g, i)
    };
    d.cljs$lang$maxFixedArity = 3;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a), g = cljs.core.first(cljs.core.next(a)), h = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
      return b.call(this, d, g, h, a)
    };
    return d
  }(), a = function(a, d, e, f) {
    switch(arguments.length) {
      case 2:
        return d;
      case 3:
        return cljs.core.truth_(cljs.core._LT_.call(null, a.call(null, d), a.call(null, e))) ? d : e;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.partition_all = function() {
  var a = null, b = function(b, d, e) {
    return new cljs.core.LazySeq(null, !1, function() {
      var f = cljs.core.seq.call(null, e);
      return cljs.core.truth_(f) ? cljs.core.cons.call(null, cljs.core.take.call(null, b, f), a.call(null, b, d, cljs.core.drop.call(null, d, f))) : null
    })
  };
  return a = function(c, d, e) {
    switch(arguments.length) {
      case 2:
        return a.call(null, c, c, d);
      case 3:
        return b.call(this, c, d, e)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.take_while = function take_while(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    var d = cljs.core.seq.call(null, c);
    return cljs.core.truth_(d) ? cljs.core.truth_(b.call(null, cljs.core.first.call(null, d))) ? cljs.core.cons.call(null, cljs.core.first.call(null, d), take_while.call(null, b, cljs.core.rest.call(null, d))) : null : null
  })
};
cljs.core.Range = function(a, b, c, d) {
  this.meta = a;
  this.start = b;
  this.end = c;
  this.step = d
};
cljs.core.Range.prototype.cljs$core$IEquiv$ = !0;
cljs.core.Range.prototype.cljs$core$IEquiv$_equiv = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.Range.prototype.cljs$core$ICollection$ = !0;
cljs.core.Range.prototype.cljs$core$ICollection$_conj = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.Range.prototype.cljs$core$ISeq$ = !0;
cljs.core.Range.prototype.cljs$core$ISeq$_first = function() {
  return this.start
};
cljs.core.Range.prototype.cljs$core$ISeq$_rest = function(a) {
  return cljs.core.truth_(cljs.core.not.call(null, cljs.core.nil_QMARK_.call(null, cljs.core._seq.call(null, a)))) ? new cljs.core.Range(this.meta, cljs.core._PLUS_.call(null, this.start, this.step), this.end, this.step) : cljs.core.list.call(null)
};
cljs.core.Range.prototype.cljs$core$ISeqable$ = !0;
cljs.core.Range.prototype.cljs$core$ISeqable$_seq = function(a) {
  var b = cljs.core.truth_(cljs.core.pos_QMARK_.call(null, this.step)) ? cljs.core._LT_ : cljs.core._GT_;
  return cljs.core.truth_(b.call(null, this.start, this.end)) ? a : null
};
cljs.core.Range.prototype.cljs$core$IWithMeta$ = !0;
cljs.core.Range.prototype.cljs$core$IWithMeta$_with_meta = function(a, b) {
  return new cljs.core.Range(b, this.start, this.end, this.step)
};
cljs.core.Range.prototype.cljs$core$IEmptyableCollection$ = !0;
cljs.core.Range.prototype.cljs$core$IEmptyableCollection$_empty = function() {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.Range.prototype.cljs$core$IIndexed$ = !0;
cljs.core.Range.prototype.cljs$core$IIndexed$_nth = function() {
  var a = null, b = function(a, b) {
    var c = this;
    if(cljs.core.truth_(cljs.core._LT_.call(null, b, cljs.core._count.call(null, a)))) {
      return cljs.core._PLUS_.call(null, c.start, cljs.core._STAR_.call(null, b, c.step))
    }else {
      if(cljs.core.truth_(function() {
        var a = cljs.core._GT_.call(null, c.start, c.end);
        return cljs.core.truth_(a) ? cljs.core._EQ_.call(null, c.step, 0) : a
      }())) {
        return c.start
      }else {
        throw"Index out of bounds";
      }
    }
  }, c = function(a, b, c) {
    var g = this;
    return cljs.core.truth_(cljs.core._LT_.call(null, b, cljs.core._count.call(null, a))) ? cljs.core._PLUS_.call(null, g.start, cljs.core._STAR_.call(null, b, g.step)) : cljs.core.truth_(function() {
      var a = cljs.core._GT_.call(null, g.start, g.end);
      return cljs.core.truth_(a) ? cljs.core._EQ_.call(null, g.step, 0) : a
    }()) ? g.start : c
  };
  return function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.Range.prototype.cljs$core$IMeta$ = !0;
cljs.core.Range.prototype.cljs$core$IMeta$_meta = function() {
  return this.meta
};
cljs.core.Range.prototype.cljs$core$IReduce$ = !0;
cljs.core.Range.prototype.cljs$core$IReduce$_reduce = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core.ci_reduce.call(null, a, c);
      case 3:
        return cljs.core.ci_reduce.call(null, a, c, d)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.Range.prototype.cljs$core$IHash$ = !0;
cljs.core.Range.prototype.cljs$core$IHash$_hash = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.Range.prototype.cljs$core$ICounted$ = !0;
cljs.core.Range.prototype.cljs$core$ICounted$_count = function(a) {
  var b = this;
  return cljs.core.truth_(cljs.core.nil_QMARK_.call(null, cljs.core._seq.call(null, a))) ? 0 : cljs.core.truth_(function() {
    var a = cljs.core._EQ_.call(null, b.start, 0);
    return cljs.core.truth_(a) ? (a = cljs.core._LT_.call(null, b.start, b.end), cljs.core.truth_(a) ? cljs.core._EQ_.call(null, b.step, 1) : a) : a
  }()) ? cljs.core._.call(null, b.end, b.start) : cljs.core.truth_("\ufdd0'else") ? Math.ceil.call(null, cljs.core._SLASH_.call(null, cljs.core._.call(null, b.end, b.start), b.step)) : null
};
cljs.core.Range.prototype.cljs$core$ISequential$ = !0;
cljs.core.range = function() {
  var a = null;
  return a = function(b, c, d) {
    switch(arguments.length) {
      case 0:
        return a.call(null, 0, Number.MAX_VALUE, 1);
      case 1:
        return a.call(null, 0, b, 1);
      case 2:
        return a.call(null, b, c, 1);
      case 3:
        return new cljs.core.Range(null, b, c, d)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.take_nth = function take_nth(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    var d = cljs.core.seq.call(null, c);
    return cljs.core.truth_(d) ? cljs.core.cons.call(null, cljs.core.first.call(null, d), take_nth.call(null, b, cljs.core.drop.call(null, b, d))) : null
  })
};
cljs.core.split_with = function(a, b) {
  return cljs.core.Vector.fromArray([cljs.core.take_while.call(null, a, b), cljs.core.drop_while.call(null, a, b)])
};
cljs.core.partition_by = function partition_by(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    var d = cljs.core.seq.call(null, c);
    if(cljs.core.truth_(d)) {
      var e = cljs.core.first.call(null, d), f = b.call(null, e), e = cljs.core.cons.call(null, e, cljs.core.take_while.call(null, function(c) {
        return cljs.core._EQ_.call(null, f, b.call(null, c))
      }, cljs.core.next.call(null, d)));
      return cljs.core.cons.call(null, e, partition_by.call(null, b, cljs.core.seq.call(null, cljs.core.drop.call(null, cljs.core.count.call(null, e), d))))
    }else {
      return null
    }
  })
};
cljs.core.frequencies = function(a) {
  return cljs.core.reduce.call(null, function(a, c) {
    return cljs.core.assoc.call(null, a, c, cljs.core.inc.call(null, cljs.core.get.call(null, a, c, 0)))
  }, cljs.core.ObjMap.fromObject([], {}), a)
};
cljs.core.reductions = function() {
  var a = null, b = function(b, c) {
    return new cljs.core.LazySeq(null, !1, function() {
      var f = cljs.core.seq.call(null, c);
      return cljs.core.truth_(f) ? a.call(null, b, cljs.core.first.call(null, f), cljs.core.rest.call(null, f)) : cljs.core.list.call(null, b.call(null))
    })
  }, c = function(b, c, f) {
    return cljs.core.cons.call(null, c, new cljs.core.LazySeq(null, !1, function() {
      var g = cljs.core.seq.call(null, f);
      return cljs.core.truth_(g) ? a.call(null, b, b.call(null, c, cljs.core.first.call(null, g)), cljs.core.rest.call(null, g)) : null
    }))
  };
  return a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.juxt = function() {
  var a = null, b = function(a) {
    return function() {
      var b = null, c = function() {
        var b = function(b, c, d, e) {
          var g = null;
          goog.isDef(e) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return cljs.core.vector.call(null, cljs.core.apply.call(null, a, b, c, d, g))
        };
        b.cljs$lang$maxFixedArity = 3;
        b.cljs$lang$applyTo = function(b) {
          var c = cljs.core.first(b), d = cljs.core.first(cljs.core.next(b)), e = cljs.core.first(cljs.core.next(cljs.core.next(b))), b = cljs.core.rest(cljs.core.next(cljs.core.next(b)));
          return cljs.core.vector.call(null, cljs.core.apply.call(null, a, c, d, e, b))
        };
        return b
      }(), b = function(b, d, e, g) {
        switch(arguments.length) {
          case 0:
            return cljs.core.vector.call(null, a.call(null));
          case 1:
            return cljs.core.vector.call(null, a.call(null, b));
          case 2:
            return cljs.core.vector.call(null, a.call(null, b, d));
          case 3:
            return cljs.core.vector.call(null, a.call(null, b, d, e));
          default:
            return c.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      b.cljs$lang$maxFixedArity = 3;
      b.cljs$lang$applyTo = c.cljs$lang$applyTo;
      return b
    }()
  }, c = function(a, b) {
    return function() {
      var c = null, d = function() {
        var c = function(c, d, e, h) {
          return cljs.core.vector.call(null, cljs.core.apply.call(null, a, c, d, e, h), cljs.core.apply.call(null, b, c, d, e, h))
        }, d = function(a, b, d, e) {
          var f = null;
          goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f)
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return c.call(this, b, d, e, a)
        };
        return d
      }(), c = function(c, e, h, m) {
        switch(arguments.length) {
          case 0:
            return cljs.core.vector.call(null, a.call(null), b.call(null));
          case 1:
            return cljs.core.vector.call(null, a.call(null, c), b.call(null, c));
          case 2:
            return cljs.core.vector.call(null, a.call(null, c, e), b.call(null, c, e));
          case 3:
            return cljs.core.vector.call(null, a.call(null, c, e, h), b.call(null, c, e, h));
          default:
            return d.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = d.cljs$lang$applyTo;
      return c
    }()
  }, d = function(a, b, c) {
    return function() {
      var d = null, e = function() {
        var d = function(d, e, i, j) {
          return cljs.core.vector.call(null, cljs.core.apply.call(null, a, d, e, i, j), cljs.core.apply.call(null, b, d, e, i, j), cljs.core.apply.call(null, c, d, e, i, j))
        }, e = function(a, b, c, e) {
          var f = null;
          goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f)
        };
        e.cljs$lang$maxFixedArity = 3;
        e.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a))), a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
          return d.call(this, b, c, e, a)
        };
        return e
      }(), d = function(d, i, m, o) {
        switch(arguments.length) {
          case 0:
            return cljs.core.vector.call(null, a.call(null), b.call(null), c.call(null));
          case 1:
            return cljs.core.vector.call(null, a.call(null, d), b.call(null, d), c.call(null, d));
          case 2:
            return cljs.core.vector.call(null, a.call(null, d, i), b.call(null, d, i), c.call(null, d, i));
          case 3:
            return cljs.core.vector.call(null, a.call(null, d, i, m), b.call(null, d, i, m), c.call(null, d, i, m));
          default:
            return e.apply(this, arguments)
        }
        throw"Invalid arity: " + arguments.length;
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = e.cljs$lang$applyTo;
      return d
    }()
  }, e = function() {
    var a = function(a, b, c, d) {
      var e = cljs.core.list_STAR_.call(null, a, b, c, d);
      return function() {
        var a = null, b = function() {
          return cljs.core.reduce.call(null, function(a, b) {
            return cljs.core.conj.call(null, a, b.call(null))
          }, cljs.core.Vector.fromArray([]), e)
        }, c = function(a) {
          return cljs.core.reduce.call(null, function(b, c) {
            return cljs.core.conj.call(null, b, c.call(null, a))
          }, cljs.core.Vector.fromArray([]), e)
        }, d = function(a, b) {
          return cljs.core.reduce.call(null, function(c, d) {
            return cljs.core.conj.call(null, c, d.call(null, a, b))
          }, cljs.core.Vector.fromArray([]), e)
        }, f = function(a, b, c) {
          return cljs.core.reduce.call(null, function(d, e) {
            return cljs.core.conj.call(null, d, e.call(null, a, b, c))
          }, cljs.core.Vector.fromArray([]), e)
        }, g = function() {
          var a = function(a, b, c, d) {
            return cljs.core.reduce.call(null, function(e, f) {
              return cljs.core.conj.call(null, e, cljs.core.apply.call(null, f, a, b, c, d))
            }, cljs.core.Vector.fromArray([]), e)
          }, b = function(b, c, d, e) {
            var f = null;
            goog.isDef(e) && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
            return a.call(this, b, c, d, f)
          };
          b.cljs$lang$maxFixedArity = 3;
          b.cljs$lang$applyTo = function(b) {
            var c = cljs.core.first(b), d = cljs.core.first(cljs.core.next(b)), e = cljs.core.first(cljs.core.next(cljs.core.next(b))), b = cljs.core.rest(cljs.core.next(cljs.core.next(b)));
            return a.call(this, c, d, e, b)
          };
          return b
        }(), a = function(a, e, h, i) {
          switch(arguments.length) {
            case 0:
              return b.call(this);
            case 1:
              return c.call(this, a);
            case 2:
              return d.call(this, a, e);
            case 3:
              return f.call(this, a, e, h);
            default:
              return g.apply(this, arguments)
          }
          throw"Invalid arity: " + arguments.length;
        };
        a.cljs$lang$maxFixedArity = 3;
        a.cljs$lang$applyTo = g.cljs$lang$applyTo;
        return a
      }()
    }, b = function(b, c, d, e) {
      var g = null;
      goog.isDef(e) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, d, g)
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b), d = cljs.core.first(cljs.core.next(b)), e = cljs.core.first(cljs.core.next(cljs.core.next(b))), b = cljs.core.rest(cljs.core.next(cljs.core.next(b)));
      return a.call(this, c, d, e, b)
    };
    return b
  }(), a = function(a, g, h, i) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, g);
      case 3:
        return d.call(this, a, g, h);
      default:
        return e.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  return a
}();
cljs.core.dorun = function() {
  var a = null, b = function(a, b) {
    for(;;) {
      if(cljs.core.truth_(function() {
        var e = cljs.core.seq.call(null, b);
        return cljs.core.truth_(e) ? cljs.core.pos_QMARK_.call(null, a) : e
      }())) {
        var e = cljs.core.dec.call(null, a), f = cljs.core.next.call(null, b), a = e, b = f
      }else {
        return null
      }
    }
  };
  return function(a, d) {
    switch(arguments.length) {
      case 1:
        var e;
        a: {
          for(var f = a;;) {
            if(cljs.core.truth_(cljs.core.seq.call(null, f))) {
              f = cljs.core.next.call(null, f)
            }else {
              e = null;
              break a
            }
          }
        }
        return e;
      case 2:
        return b.call(this, a, d)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.doall = function() {
  var a = null;
  return function(a, c) {
    switch(arguments.length) {
      case 1:
        return cljs.core.dorun.call(null, a), a;
      case 2:
        return cljs.core.dorun.call(null, a, c), c
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.re_matches = function(a, b) {
  var c = a.exec(b);
  return cljs.core.truth_(cljs.core._EQ_.call(null, cljs.core.first.call(null, c), b)) ? cljs.core.truth_(cljs.core._EQ_.call(null, cljs.core.count.call(null, c), 1)) ? cljs.core.first.call(null, c) : cljs.core.vec.call(null, c) : null
};
cljs.core.re_find = function(a, b) {
  var c = a.exec(b);
  return cljs.core.truth_(cljs.core.nil_QMARK_.call(null, c)) ? null : cljs.core.truth_(cljs.core._EQ_.call(null, cljs.core.count.call(null, c), 1)) ? cljs.core.first.call(null, c) : cljs.core.vec.call(null, c)
};
cljs.core.re_seq = function re_seq(b, c) {
  var d = cljs.core.re_find.call(null, b, c), e = c.search(b), f = cljs.core.truth_(cljs.core.coll_QMARK_.call(null, d)) ? cljs.core.first.call(null, d) : d, g = cljs.core.subs.call(null, c, cljs.core._PLUS_.call(null, e, cljs.core.count.call(null, f)));
  return cljs.core.truth_(d) ? new cljs.core.LazySeq(null, !1, function() {
    return cljs.core.cons.call(null, d, re_seq.call(null, b, g))
  }) : null
};
cljs.core.re_pattern = function(a) {
  return RegExp(a)
};
cljs.core.pr_sequential = function(a, b, c, d, e, f) {
  return cljs.core.concat.call(null, cljs.core.Vector.fromArray([b]), cljs.core.flatten1.call(null, cljs.core.interpose.call(null, cljs.core.Vector.fromArray([c]), cljs.core.map.call(null, function(b) {
    return a.call(null, b, e)
  }, f))), cljs.core.Vector.fromArray([d]))
};
cljs.core.string_print = function(a) {
  print.call(null, a);
  return null
};
cljs.core.flush = function() {
  return null
};
cljs.core.pr_seq = function pr_seq(b, c) {
  return cljs.core.truth_(cljs.core.nil_QMARK_.call(null, b)) ? cljs.core.list.call(null, "nil") : cljs.core.truth_(cljs.core.undefined_QMARK_.call(null, b)) ? cljs.core.list.call(null, "#<undefined>") : cljs.core.truth_("\ufdd0'else") ? cljs.core.concat.call(null, cljs.core.truth_(function() {
    var d = cljs.core.get.call(null, c, "\ufdd0'meta");
    return cljs.core.truth_(d) ? (d = cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$IMeta$ : b) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.IMeta, b), cljs.core.truth_(d) ? cljs.core.meta.call(null, b) : d) : d
  }()) ? cljs.core.concat.call(null, cljs.core.Vector.fromArray(["^"]), pr_seq.call(null, cljs.core.meta.call(null, b), c), cljs.core.Vector.fromArray([" "])) : null, cljs.core.truth_(cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$IPrintable$ : b) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.IPrintable, b)) ? cljs.core._pr_seq.call(null, b, c) : cljs.core.list.call(null, "#<", cljs.core.str.call(null, b), ">")) : null
};
cljs.core.pr_str_with_opts = function(a, b) {
  for(var c = cljs.core.first.call(null, a), d = new goog.string.StringBuffer, e = cljs.core.seq.call(null, a);;) {
    if(cljs.core.truth_(e)) {
      var f = cljs.core.first.call(null, e);
      cljs.core.truth_(cljs.core.identical_QMARK_.call(null, f, c)) || d.append(" ");
      for(f = cljs.core.seq.call(null, cljs.core.pr_seq.call(null, f, b));;) {
        if(cljs.core.truth_(f)) {
          var g = cljs.core.first.call(null, f);
          d.append(g);
          f = cljs.core.next.call(null, f)
        }else {
          break
        }
      }
      e = cljs.core.next.call(null, e)
    }else {
      break
    }
  }
  return cljs.core.str.call(null, d)
};
cljs.core.pr_with_opts = function(a, b) {
  for(var c = cljs.core.first.call(null, a), d = cljs.core.seq.call(null, a);;) {
    if(cljs.core.truth_(d)) {
      var e = cljs.core.first.call(null, d);
      cljs.core.truth_(cljs.core.identical_QMARK_.call(null, e, c)) || cljs.core.string_print.call(null, " ");
      for(e = cljs.core.seq.call(null, cljs.core.pr_seq.call(null, e, b));;) {
        if(cljs.core.truth_(e)) {
          var f = cljs.core.first.call(null, e);
          cljs.core.string_print.call(null, f);
          e = cljs.core.next.call(null, e)
        }else {
          break
        }
      }
      d = cljs.core.next.call(null, d)
    }else {
      return null
    }
  }
};
cljs.core.newline = function(a) {
  cljs.core.string_print.call(null, "\n");
  return cljs.core.truth_(cljs.core.get.call(null, a, "\ufdd0'flush-on-newline")) ? cljs.core.flush.call(null) : null
};
cljs.core._STAR_flush_on_newline_STAR_ = !0;
cljs.core._STAR_print_readably_STAR_ = !0;
cljs.core._STAR_print_meta_STAR_ = !1;
cljs.core._STAR_print_dup_STAR_ = !1;
cljs.core.pr_opts = function() {
  return cljs.core.ObjMap.fromObject(["\ufdd0'flush-on-newline", "\ufdd0'readably", "\ufdd0'meta", "\ufdd0'dup"], {"\ufdd0'flush-on-newline":cljs.core._STAR_flush_on_newline_STAR_, "\ufdd0'readably":cljs.core._STAR_print_readably_STAR_, "\ufdd0'meta":cljs.core._STAR_print_meta_STAR_, "\ufdd0'dup":cljs.core._STAR_print_dup_STAR_})
};
cljs.core.pr_str = function() {
  var a = function(a) {
    return cljs.core.pr_str_with_opts.call(null, a, cljs.core.pr_opts.call(null))
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.pr = function() {
  var a = function(a) {
    return cljs.core.pr_with_opts.call(null, a, cljs.core.pr_opts.call(null))
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.print = function() {
  var a = function(a) {
    return cljs.core.pr_with_opts.call(null, a, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), "\ufdd0'readably", !1))
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.println = function() {
  var a = function(a) {
    cljs.core.pr_with_opts.call(null, a, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), "\ufdd0'readably", !1));
    return cljs.core.newline.call(null, cljs.core.pr_opts.call(null))
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.prn = function() {
  var a = function(a) {
    cljs.core.pr_with_opts.call(null, a, cljs.core.pr_opts.call(null));
    return cljs.core.newline.call(null, cljs.core.pr_opts.call(null))
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.HashMap.prototype.cljs$core$IPrintable$ = !0;
cljs.core.HashMap.prototype.cljs$core$IPrintable$_pr_seq = function(a, b) {
  return cljs.core.pr_sequential.call(null, function(a) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", b, a)
  }, "{", ", ", "}", b, a)
};
cljs.core.IPrintable.number = !0;
cljs.core._pr_seq.number = function(a) {
  return cljs.core.list.call(null, cljs.core.str.call(null, a))
};
cljs.core.IndexedSeq.prototype.cljs$core$IPrintable$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$IPrintable$_pr_seq = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", b, a)
};
cljs.core.LazySeq.prototype.cljs$core$IPrintable$ = !0;
cljs.core.LazySeq.prototype.cljs$core$IPrintable$_pr_seq = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", b, a)
};
cljs.core.IPrintable["boolean"] = !0;
cljs.core._pr_seq["boolean"] = function(a) {
  return cljs.core.list.call(null, cljs.core.str.call(null, a))
};
cljs.core.Set.prototype.cljs$core$IPrintable$ = !0;
cljs.core.Set.prototype.cljs$core$IPrintable$_pr_seq = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "#{", " ", "}", b, a)
};
cljs.core.IPrintable.string = !0;
cljs.core._pr_seq.string = function(a, b) {
  return cljs.core.truth_(cljs.core.keyword_QMARK_.call(null, a)) ? cljs.core.list.call(null, cljs.core.str.call(null, ":", function() {
    var b = cljs.core.namespace.call(null, a);
    return cljs.core.truth_(b) ? cljs.core.str.call(null, b, "/") : null
  }(), cljs.core.name.call(null, a))) : cljs.core.truth_(cljs.core.symbol_QMARK_.call(null, a)) ? cljs.core.list.call(null, cljs.core.str.call(null, function() {
    var b = cljs.core.namespace.call(null, a);
    return cljs.core.truth_(b) ? cljs.core.str.call(null, b, "/") : null
  }(), cljs.core.name.call(null, a))) : cljs.core.truth_("\ufdd0'else") ? cljs.core.list.call(null, cljs.core.truth_("\ufdd0'readably".call(null, b)) ? goog.string.quote.call(null, a) : a) : null
};
cljs.core.Vector.prototype.cljs$core$IPrintable$ = !0;
cljs.core.Vector.prototype.cljs$core$IPrintable$_pr_seq = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "[", " ", "]", b, a)
};
cljs.core.List.prototype.cljs$core$IPrintable$ = !0;
cljs.core.List.prototype.cljs$core$IPrintable$_pr_seq = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", b, a)
};
cljs.core.IPrintable.array = !0;
cljs.core._pr_seq.array = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "#<Array [", ", ", "]>", b, a)
};
cljs.core.EmptyList.prototype.cljs$core$IPrintable$ = !0;
cljs.core.EmptyList.prototype.cljs$core$IPrintable$_pr_seq = function() {
  return cljs.core.list.call(null, "()")
};
cljs.core.Cons.prototype.cljs$core$IPrintable$ = !0;
cljs.core.Cons.prototype.cljs$core$IPrintable$_pr_seq = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", b, a)
};
cljs.core.Range.prototype.cljs$core$IPrintable$ = !0;
cljs.core.Range.prototype.cljs$core$IPrintable$_pr_seq = function(a, b) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", b, a)
};
cljs.core.ObjMap.prototype.cljs$core$IPrintable$ = !0;
cljs.core.ObjMap.prototype.cljs$core$IPrintable$_pr_seq = function(a, b) {
  return cljs.core.pr_sequential.call(null, function(a) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", b, a)
  }, "{", ", ", "}", b, a)
};
cljs.core.Atom = function(a, b, c) {
  this.state = a;
  this.meta = b;
  this.validator = c
};
cljs.core.Atom.prototype.cljs$core$IPrintable$ = !0;
cljs.core.Atom.prototype.cljs$core$IPrintable$_pr_seq = function(a, b) {
  return cljs.core.concat.call(null, cljs.core.Vector.fromArray(["#<Atom: "]), cljs.core._pr_seq.call(null, this.state, b), ">")
};
cljs.core.Atom.prototype.cljs$core$IMeta$ = !0;
cljs.core.Atom.prototype.cljs$core$IMeta$_meta = function() {
  return this.meta
};
cljs.core.Atom.prototype.cljs$core$IDeref$ = !0;
cljs.core.Atom.prototype.cljs$core$IDeref$_deref = function() {
  return this.state
};
cljs.core.Atom.prototype.cljs$core$IEquiv$ = !0;
cljs.core.Atom.prototype.cljs$core$IEquiv$_equiv = function(a, b) {
  return cljs.core.identical_QMARK_.call(null, a, b)
};
cljs.core.atom = function() {
  var a = null, b = function() {
    var a = function(a, b) {
      var c = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, b)) ? cljs.core.apply.call(null, cljs.core.hash_map, b) : b, d = cljs.core.get.call(null, c, "\ufdd0'validator"), c = cljs.core.get.call(null, c, "\ufdd0'meta");
      return new cljs.core.Atom(a, c, d)
    }, b = function(b, d) {
      var g = null;
      goog.isDef(d) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return a.call(this, b, g)
    };
    b.cljs$lang$maxFixedArity = 1;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b), b = cljs.core.rest(b);
      return a.call(this, d, b)
    };
    return b
  }(), a = function(a, d) {
    switch(arguments.length) {
      case 1:
        return new cljs.core.Atom(a, null, null);
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.reset_BANG_ = function(a, b) {
  var c = a.validator;
  if(cljs.core.truth_(c) && !cljs.core.truth_(c.call(null, b))) {
    throw"Validator rejected reference state";
  }
  return a.state = b
};
cljs.core.swap_BANG_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c, g, h, i) {
      var j = null;
      goog.isDef(i) && (j = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0));
      return cljs.core.reset_BANG_.call(null, a, cljs.core.apply.call(null, b, a.state, c, g, h, j))
    };
    a.cljs$lang$maxFixedArity = 5;
    a.cljs$lang$applyTo = function(a) {
      var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), g = cljs.core.first(cljs.core.next(cljs.core.next(a))), h = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(a)))), i = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(a))))), a = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(a)))));
      return cljs.core.reset_BANG_.call(null, b, cljs.core.apply.call(null, c, b.state, g, h, i, a))
    };
    return a
  }(), a = function(a, d, e, f, g, h) {
    switch(arguments.length) {
      case 2:
        return cljs.core.reset_BANG_.call(null, a, d.call(null, a.state));
      case 3:
        return cljs.core.reset_BANG_.call(null, a, d.call(null, a.state, e));
      case 4:
        return cljs.core.reset_BANG_.call(null, a, d.call(null, a.state, e, f));
      case 5:
        return cljs.core.reset_BANG_.call(null, a, d.call(null, a.state, e, f, g));
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 5;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.compare_and_set_BANG_ = function(a, b, c) {
  return cljs.core.truth_(cljs.core._EQ_.call(null, a.state, b)) ? (cljs.core.reset_BANG_.call(null, a, c), !0) : !1
};
cljs.core.deref = function(a) {
  return cljs.core._deref.call(null, a)
};
cljs.core.set_validator_BANG_ = function(a, b) {
  return a.validator = b
};
cljs.core.get_validator = function(a) {
  return a.validator
};
cljs.core.alter_meta_BANG_ = function() {
  var a = function(a, c, d) {
    var e = null;
    goog.isDef(d) && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return a.meta = cljs.core.apply.call(null, c, a.meta, e)
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = function(a) {
    var c = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a)), a = cljs.core.rest(cljs.core.next(a));
    return c.meta = cljs.core.apply.call(null, d, c.meta, a)
  };
  return a
}();
cljs.core.reset_meta_BANG_ = function(a, b) {
  return a.meta = b
};
cljs.core.gensym_counter = null;
cljs.core.gensym = function() {
  var a = null;
  return a = function(b) {
    switch(arguments.length) {
      case 0:
        return a.call(null, "G__");
      case 1:
        if(cljs.core.truth_(cljs.core.nil_QMARK_.call(null, cljs.core.gensym_counter))) {
          cljs.core.gensym_counter = cljs.core.atom.call(null, 0)
        }
        return cljs.core.symbol.call(null, cljs.core.str.call(null, b, cljs.core.swap_BANG_.call(null, cljs.core.gensym_counter, cljs.core.inc)))
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.fixture1 = 1;
cljs.core.fixture2 = 2;
cljs.core.Delay = function(a, b) {
  this.f = a;
  this.state = b
};
cljs.core.Delay.prototype.cljs$core$IPending$ = !0;
cljs.core.Delay.prototype.cljs$core$IPending$_realized_QMARK_ = function() {
  return cljs.core.not.call(null, cljs.core.nil_QMARK_.call(null, cljs.core.deref.call(null, this.state)))
};
cljs.core.Delay.prototype.cljs$core$IDeref$ = !0;
cljs.core.Delay.prototype.cljs$core$IDeref$_deref = function() {
  cljs.core.truth_(cljs.core.deref.call(null, this.state)) || cljs.core.swap_BANG_.call(null, this.state, this.f);
  return cljs.core.deref.call(null, this.state)
};
cljs.core.delay = function() {
  var a = function(a) {
    return new cljs.core.Delay(function() {
      return cljs.core.apply.call(null, cljs.core.identity, a)
    }, cljs.core.atom.call(null, null))
  }, b = function(b) {
    var d = null;
    goog.isDef(b) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a.call(this, b)
  };
  return b
}();
cljs.core.delay_QMARK_ = function(a) {
  return cljs.core.instance_QMARK_.call(null, cljs.core.Delay, a)
};
cljs.core.force = function(a) {
  return cljs.core.truth_(cljs.core.delay_QMARK_.call(null, a)) ? cljs.core.deref.call(null, a) : a
};
cljs.core.realized_QMARK_ = function(a) {
  return cljs.core._realized_QMARK_.call(null, a)
};
cljs.core.js__GT_clj = function() {
  var a = function(a, b) {
    var e = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, b)) ? cljs.core.apply.call(null, cljs.core.hash_map, b) : b, e = cljs.core.get.call(null, e, "\ufdd0'keywordize-keys"), f = cljs.core.truth_(e) ? cljs.core.keyword : cljs.core.str;
    return function h(a) {
      return cljs.core.truth_(cljs.core.seq_QMARK_.call(null, a)) ? cljs.core.doall.call(null, cljs.core.map.call(null, h, a)) : cljs.core.truth_(cljs.core.coll_QMARK_.call(null, a)) ? cljs.core.into.call(null, cljs.core.empty.call(null, a), cljs.core.map.call(null, h, a)) : cljs.core.truth_(goog.isArray.call(null, a)) ? cljs.core.vec.call(null, cljs.core.map.call(null, h, a)) : cljs.core.truth_(goog.isObject.call(null, a)) ? cljs.core.into.call(null, cljs.core.ObjMap.fromObject([], {}), function() {
        return function k(b) {
          return new cljs.core.LazySeq(null, !1, function() {
            for(;;) {
              if(cljs.core.truth_(cljs.core.seq.call(null, b))) {
                var c = cljs.core.first.call(null, b);
                return cljs.core.cons.call(null, cljs.core.Vector.fromArray([f.call(null, c), h.call(null, a[c])]), k.call(null, cljs.core.rest.call(null, b)))
              }else {
                return null
              }
            }
          })
        }.call(null, cljs.core.js_keys.call(null, a))
      }()) : cljs.core.truth_("\ufdd0'else") ? a : null
    }.call(null, a)
  }, b = function(b, d) {
    var e = null;
    goog.isDef(d) && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b), b = cljs.core.rest(b);
    return a.call(this, d, b)
  };
  return b
}();
cljs.core.memoize = function(a) {
  var b = cljs.core.atom.call(null, cljs.core.ObjMap.fromObject([], {}));
  return function() {
    var c = function(c) {
      var d = cljs.core.get.call(null, cljs.core.deref.call(null, b), c);
      cljs.core.truth_(d) || (d = cljs.core.apply.call(null, a, c), cljs.core.swap_BANG_.call(null, b, cljs.core.assoc, c, d));
      return d
    }, d = function(a) {
      var b = null;
      goog.isDef(a) && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
      return c.call(this, b)
    };
    d.cljs$lang$maxFixedArity = 0;
    d.cljs$lang$applyTo = function(a) {
      a = cljs.core.seq(a);
      return c.call(this, a)
    };
    return d
  }()
};
cljs.core.trampoline = function() {
  var a = null, b = function() {
    var b = function(b, c) {
      return a.call(null, function() {
        return cljs.core.apply.call(null, b, c)
      })
    }, d = function(a, d) {
      var g = null;
      goog.isDef(d) && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return b.call(this, a, g)
    };
    d.cljs$lang$maxFixedArity = 1;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a), a = cljs.core.rest(a);
      return b.call(this, d, a)
    };
    return d
  }(), a = function(a, d) {
    switch(arguments.length) {
      case 1:
        var e;
        a: {
          for(var f = a;;) {
            if(f = f.call(null), !cljs.core.truth_(cljs.core.fn_QMARK_.call(null, f))) {
              e = f;
              break a
            }
          }
        }
        return e;
      default:
        return b.apply(this, arguments)
    }
    throw"Invalid arity: " + arguments.length;
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  return a
}();
cljs.core.rand = function() {
  var a = null;
  return a = function(b) {
    switch(arguments.length) {
      case 0:
        return a.call(null, 1);
      case 1:
        return Math.random() * b
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.rand_int = function(a) {
  return Math.floor(Math.random() * a)
};
cljs.core.rand_nth = function(a) {
  return cljs.core.nth.call(null, a, cljs.core.rand_int.call(null, cljs.core.count.call(null, a)))
};
cljs.core.group_by = function(a, b) {
  return cljs.core.reduce.call(null, function(b, d) {
    var e = a.call(null, d);
    return cljs.core.assoc.call(null, b, e, cljs.core.conj.call(null, cljs.core.get.call(null, b, e, cljs.core.Vector.fromArray([])), d))
  }, cljs.core.ObjMap.fromObject([], {}), b)
};
cljs.core.make_hierarchy = function() {
  return cljs.core.ObjMap.fromObject(["\ufdd0'parents", "\ufdd0'descendants", "\ufdd0'ancestors"], {"\ufdd0'parents":cljs.core.ObjMap.fromObject([], {}), "\ufdd0'descendants":cljs.core.ObjMap.fromObject([], {}), "\ufdd0'ancestors":cljs.core.ObjMap.fromObject([], {})})
};
cljs.core.global_hierarchy = cljs.core.atom.call(null, cljs.core.make_hierarchy.call(null));
cljs.core.isa_QMARK_ = function() {
  var a = null, b = function(b, d, e) {
    var f = cljs.core._EQ_.call(null, d, e);
    if(cljs.core.truth_(f)) {
      return f
    }else {
      if(f = cljs.core.contains_QMARK_.call(null, "\ufdd0'ancestors".call(null, b).call(null, d), e), cljs.core.truth_(f)) {
        return f
      }else {
        if(f = cljs.core.vector_QMARK_.call(null, e), cljs.core.truth_(f)) {
          if(f = cljs.core.vector_QMARK_.call(null, d), cljs.core.truth_(f)) {
            if(f = cljs.core._EQ_.call(null, cljs.core.count.call(null, e), cljs.core.count.call(null, d)), cljs.core.truth_(f)) {
              for(var g = !0, h = 0;;) {
                if(cljs.core.truth_(function() {
                  var a = cljs.core.not.call(null, g);
                  return cljs.core.truth_(a) ? a : cljs.core._EQ_.call(null, h, cljs.core.count.call(null, e))
                }())) {
                  return g
                }else {
                  var f = a.call(null, b, d.call(null, h), e.call(null, h)), i = cljs.core.inc.call(null, h), g = f, h = i
                }
              }
            }else {
              return f
            }
          }else {
            return f
          }
        }else {
          return f
        }
      }
    }
  };
  return a = function(c, d, e) {
    switch(arguments.length) {
      case 2:
        return a.call(null, cljs.core.deref.call(null, cljs.core.global_hierarchy), c, d);
      case 3:
        return b.call(this, c, d, e)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.parents = function() {
  var a = null;
  return a = function(b, c) {
    switch(arguments.length) {
      case 1:
        return a.call(null, cljs.core.deref.call(null, cljs.core.global_hierarchy), b);
      case 2:
        return cljs.core.not_empty.call(null, cljs.core.get.call(null, "\ufdd0'parents".call(null, b), c))
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.ancestors = function() {
  var a = null;
  return a = function(b, c) {
    switch(arguments.length) {
      case 1:
        return a.call(null, cljs.core.deref.call(null, cljs.core.global_hierarchy), b);
      case 2:
        return cljs.core.not_empty.call(null, cljs.core.get.call(null, "\ufdd0'ancestors".call(null, b), c))
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.descendants = function() {
  var a = null;
  return a = function(b, c) {
    switch(arguments.length) {
      case 1:
        return a.call(null, cljs.core.deref.call(null, cljs.core.global_hierarchy), b);
      case 2:
        return cljs.core.not_empty.call(null, cljs.core.get.call(null, "\ufdd0'descendants".call(null, b), c))
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.derive = function() {
  var a = null, b = function(a, b, e) {
    if(!cljs.core.truth_(cljs.core.not_EQ_.call(null, b, e))) {
      throw cljs.core.str.call(null, "Assert failed: ", cljs.core.pr_str.call(null, cljs.core.list("\ufdd1'not=", "\ufdd1'tag", "\ufdd1'parent")));
    }
    var f = "\ufdd0'parents".call(null, a), g = "\ufdd0'descendants".call(null, a), h = "\ufdd0'ancestors".call(null, a), i = function(a, b, c, d, e) {
      return cljs.core.reduce.call(null, function(a, b) {
        return cljs.core.assoc.call(null, a, b, cljs.core.reduce.call(null, cljs.core.conj, cljs.core.get.call(null, e, b, cljs.core.set([])), cljs.core.cons.call(null, d, e.call(null, d))))
      }, a, cljs.core.cons.call(null, b, c.call(null, b)))
    };
    if(cljs.core.truth_(cljs.core.contains_QMARK_.call(null, f.call(null, b), e))) {
      b = null
    }else {
      if(cljs.core.truth_(cljs.core.contains_QMARK_.call(null, h.call(null, b), e))) {
        throw cljs.core.str.call(null, b, "already has", e, "as ancestor");
      }
      if(cljs.core.truth_(cljs.core.contains_QMARK_.call(null, h.call(null, e), b))) {
        throw cljs.core.str.call(null, "Cyclic derivation:", e, "has", b, "as ancestor");
      }
      b = cljs.core.ObjMap.fromObject(["\ufdd0'parents", "\ufdd0'ancestors", "\ufdd0'descendants"], {"\ufdd0'parents":cljs.core.assoc.call(null, "\ufdd0'parents".call(null, a), b, cljs.core.conj.call(null, cljs.core.get.call(null, f, b, cljs.core.set([])), e)), "\ufdd0'ancestors":i.call(null, "\ufdd0'ancestors".call(null, a), b, g, e, h), "\ufdd0'descendants":i.call(null, "\ufdd0'descendants".call(null, a), e, h, b, g)})
    }
    return cljs.core.truth_(b) ? b : a
  };
  return a = function(c, d, e) {
    switch(arguments.length) {
      case 2:
        if(!cljs.core.truth_(cljs.core.namespace.call(null, d))) {
          throw cljs.core.str.call(null, "Assert failed: ", cljs.core.pr_str.call(null, cljs.core.list("\ufdd1'namespace", "\ufdd1'parent")));
        }
        cljs.core.swap_BANG_.call(null, cljs.core.global_hierarchy, a, c, d);
        return null;
      case 3:
        return b.call(this, c, d, e)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.underive = function() {
  var a = null, b = function(a, b, e) {
    var f = "\ufdd0'parents".call(null, a), g = cljs.core.truth_(f.call(null, b)) ? cljs.core.disj.call(null, f.call(null, b), e) : cljs.core.set([]), g = cljs.core.truth_(cljs.core.not_empty.call(null, g)) ? cljs.core.assoc.call(null, f, b, g) : cljs.core.dissoc.call(null, f, b), g = cljs.core.flatten.call(null, cljs.core.map.call(null, function(a) {
      return cljs.core.cons.call(null, cljs.core.first.call(null, a), cljs.core.interpose.call(null, cljs.core.first.call(null, a), cljs.core.second.call(null, a)))
    }, cljs.core.seq.call(null, g)));
    return cljs.core.truth_(cljs.core.contains_QMARK_.call(null, f.call(null, b), e)) ? cljs.core.reduce.call(null, function(a, b) {
      return cljs.core.apply.call(null, cljs.core.derive, a, b)
    }, cljs.core.make_hierarchy.call(null), cljs.core.partition.call(null, 2, g)) : a
  };
  return a = function(c, d, e) {
    switch(arguments.length) {
      case 2:
        return cljs.core.swap_BANG_.call(null, cljs.core.global_hierarchy, a, c, d), null;
      case 3:
        return b.call(this, c, d, e)
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
cljs.core.reset_cache = function(a, b, c, d) {
  cljs.core.swap_BANG_.call(null, a, function() {
    return cljs.core.deref.call(null, b)
  });
  return cljs.core.swap_BANG_.call(null, c, function() {
    return cljs.core.deref.call(null, d)
  })
};
cljs.core.prefers_STAR_ = function prefers_STAR_(b, c, d) {
  var e = cljs.core.deref.call(null, d).call(null, b), e = cljs.core.truth_(cljs.core.truth_(e) ? e.call(null, c) : e) ? !0 : null;
  return cljs.core.truth_(e) ? e : (e = function() {
    for(var e = cljs.core.parents.call(null, c);;) {
      if(cljs.core.truth_(cljs.core.pos_QMARK_.call(null, cljs.core.count.call(null, e)))) {
        cljs.core.truth_(prefers_STAR_.call(null, b, cljs.core.first.call(null, e), d)), e = cljs.core.rest.call(null, e)
      }else {
        return null
      }
    }
  }(), cljs.core.truth_(e) ? e : (e = function() {
    for(var e = cljs.core.parents.call(null, b);;) {
      if(cljs.core.truth_(cljs.core.pos_QMARK_.call(null, cljs.core.count.call(null, e)))) {
        cljs.core.truth_(prefers_STAR_.call(null, cljs.core.first.call(null, e), c, d)), e = cljs.core.rest.call(null, e)
      }else {
        return null
      }
    }
  }(), cljs.core.truth_(e) ? e : !1))
};
cljs.core.dominates = function(a, b, c) {
  c = cljs.core.prefers_STAR_.call(null, a, b, c);
  return cljs.core.truth_(c) ? c : cljs.core.isa_QMARK_.call(null, a, b)
};
cljs.core.find_and_cache_best_method = function find_and_cache_best_method(b, c, d, e, f, g, h) {
  var i = cljs.core.reduce.call(null, function(d, e) {
    var g = cljs.core.nth.call(null, e, 0, null);
    cljs.core.nth.call(null, e, 1, null);
    if(cljs.core.truth_(cljs.core.isa_QMARK_.call(null, c, g))) {
      var h = cljs.core.truth_(function() {
        var b = cljs.core.nil_QMARK_.call(null, d);
        return cljs.core.truth_(b) ? b : cljs.core.dominates.call(null, g, cljs.core.first.call(null, d), f)
      }()) ? e : d;
      if(!cljs.core.truth_(cljs.core.dominates.call(null, cljs.core.first.call(null, h), g, f))) {
        throw cljs.core.str.call(null, "Multiple methods in multimethod '", b, "' match dispatch value: ", c, " -> ", g, " and ", cljs.core.first.call(null, h), ", and neither is preferred");
      }
      return h
    }else {
      return null
    }
  }, null, cljs.core.deref.call(null, e));
  return cljs.core.truth_(i) ? cljs.core.truth_(cljs.core._EQ_.call(null, cljs.core.deref.call(null, h), cljs.core.deref.call(null, d))) ? (cljs.core.swap_BANG_.call(null, g, cljs.core.assoc, c, cljs.core.second.call(null, i)), cljs.core.second.call(null, i)) : (cljs.core.reset_cache.call(null, g, e, h, d), find_and_cache_best_method.call(null, b, c, d, e, f, g, h)) : null
};
cljs.core.IMultiFn = {};
cljs.core._reset = function _reset(b) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$IMultiFn$_reset : b) ? b.cljs$core$IMultiFn$_reset(b) : function() {
    var c = _reset[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = _reset._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "IMultiFn.-reset", b);
      }
    }
  }().call(null, b)
};
cljs.core._add_method = function _add_method(b, c, d) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$IMultiFn$_add_method : b) ? b.cljs$core$IMultiFn$_add_method(b, c, d) : function() {
    var c = _add_method[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = _add_method._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "IMultiFn.-add-method", b);
      }
    }
  }().call(null, b, c, d)
};
cljs.core._remove_method = function _remove_method(b, c) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$IMultiFn$_remove_method : b) ? b.cljs$core$IMultiFn$_remove_method(b, c) : function() {
    var c = _remove_method[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = _remove_method._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "IMultiFn.-remove-method", b);
      }
    }
  }().call(null, b, c)
};
cljs.core._prefer_method = function _prefer_method(b, c, d) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$IMultiFn$_prefer_method : b) ? b.cljs$core$IMultiFn$_prefer_method(b, c, d) : function() {
    var c = _prefer_method[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = _prefer_method._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefer-method", b);
      }
    }
  }().call(null, b, c, d)
};
cljs.core._get_method = function _get_method(b, c) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$IMultiFn$_get_method : b) ? b.cljs$core$IMultiFn$_get_method(b, c) : function() {
    var c = _get_method[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = _get_method._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "IMultiFn.-get-method", b);
      }
    }
  }().call(null, b, c)
};
cljs.core._methods = function _methods(b) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$IMultiFn$_methods : b) ? b.cljs$core$IMultiFn$_methods(b) : function() {
    var c = _methods[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = _methods._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "IMultiFn.-methods", b);
      }
    }
  }().call(null, b)
};
cljs.core._prefers = function _prefers(b) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$IMultiFn$_prefers : b) ? b.cljs$core$IMultiFn$_prefers(b) : function() {
    var c = _prefers[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = _prefers._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefers", b);
      }
    }
  }().call(null, b)
};
cljs.core._invoke = function _invoke(b, c) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$core$IMultiFn$_invoke : b) ? b.cljs$core$IMultiFn$_invoke(b, c) : function() {
    var c = _invoke[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = _invoke._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "IMultiFn.-invoke", b);
      }
    }
  }().call(null, b, c)
};
cljs.core.do_invoke = function(a, b, c) {
  b = cljs.core.apply.call(null, b, c);
  a = cljs.core._get_method.call(null, a, b);
  if(!cljs.core.truth_(a)) {
    throw cljs.core.str.call(null, "No method in multimethod '", cljs.core.name, "' for dispatch value: ", b);
  }
  return cljs.core.apply.call(null, a, c)
};
cljs.core.MultiFn = function(a, b, c, d, e, f, g, h) {
  this.name = a;
  this.dispatch_fn = b;
  this.default_dispatch_val = c;
  this.hierarchy = d;
  this.method_table = e;
  this.prefer_table = f;
  this.method_cache = g;
  this.cached_hierarchy = h
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$ = !0;
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_reset = function(a) {
  cljs.core.swap_BANG_.call(null, this.method_table, function() {
    return cljs.core.ObjMap.fromObject([], {})
  });
  cljs.core.swap_BANG_.call(null, this.method_cache, function() {
    return cljs.core.ObjMap.fromObject([], {})
  });
  cljs.core.swap_BANG_.call(null, this.prefer_table, function() {
    return cljs.core.ObjMap.fromObject([], {})
  });
  cljs.core.swap_BANG_.call(null, this.cached_hierarchy, function() {
    return null
  });
  return a
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_add_method = function(a, b, c) {
  cljs.core.swap_BANG_.call(null, this.method_table, cljs.core.assoc, b, c);
  cljs.core.reset_cache.call(null, this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy);
  return a
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_remove_method = function(a, b) {
  cljs.core.swap_BANG_.call(null, this.method_table, cljs.core.dissoc, b);
  cljs.core.reset_cache.call(null, this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy);
  return a
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_get_method = function(a, b) {
  cljs.core.truth_(cljs.core._EQ_.call(null, cljs.core.deref.call(null, this.cached_hierarchy), cljs.core.deref.call(null, this.hierarchy))) || cljs.core.reset_cache.call(null, this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy);
  var c = cljs.core.deref.call(null, this.method_cache).call(null, b);
  return cljs.core.truth_(c) ? c : (c = cljs.core.find_and_cache_best_method.call(null, this.name, b, this.hierarchy, this.method_table, this.prefer_table, this.method_cache, this.cached_hierarchy), cljs.core.truth_(c) ? c : cljs.core.deref.call(null, this.method_table).call(null, this.default_dispatch_val))
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefer_method = function(a, b, c) {
  if(cljs.core.truth_(cljs.core.prefers_STAR_.call(null, b, c, this.prefer_table))) {
    throw cljs.core.str.call(null, "Preference conflict in multimethod '", this.name, "': ", c, " is already preferred to ", b);
  }
  cljs.core.swap_BANG_.call(null, this.prefer_table, function(a) {
    return cljs.core.assoc.call(null, a, b, cljs.core.conj.call(null, cljs.core.get.call(null, a, b, cljs.core.set([])), c))
  });
  return cljs.core.reset_cache.call(null, this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_methods = function() {
  return cljs.core.deref.call(null, this.method_table)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefers = function() {
  return cljs.core.deref.call(null, this.prefer_table)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_invoke = function(a, b) {
  return cljs.core.do_invoke.call(null, a, this.dispatch_fn, b)
};
cljs.core.MultiFn.prototype.call = function() {
  var a = function(a, c) {
    var d = null;
    goog.isDef(c) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return cljs.core._invoke.call(null, this, d)
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = function(a) {
    cljs.core.first(a);
    a = cljs.core.rest(a);
    return cljs.core._invoke.call(null, this, a)
  };
  return a
}();
cljs.core.remove_all_methods = function(a) {
  return cljs.core._reset.call(null, a)
};
cljs.core.remove_method = function(a, b) {
  return cljs.core._remove_method.call(null, a, b)
};
cljs.core.prefer_method = function(a, b, c) {
  return cljs.core._prefer_method.call(null, a, b, c)
};
cljs.core.methods$ = function(a) {
  return cljs.core._methods.call(null, a)
};
cljs.core.get_method = function(a, b) {
  return cljs.core._get_method.call(null, a, b)
};
cljs.core.prefers = function(a) {
  return cljs.core._prefers.call(null, a)
};
var clojure = {string:{}};
clojure.string.seq_reverse = function(a) {
  return cljs.core.reduce.call(null, cljs.core.conj, cljs.core.List.EMPTY, a)
};
clojure.string.reverse = function(a) {
  if(cljs.core.truth_(cljs.core._EQ_.call(null, a.length, 0))) {
    return""
  }else {
    for(var b = new goog.string.StringBuffer, a = clojure.string.seq_reverse.call(null, cljs.core.seq.call(null, a.split("")));;) {
      if(cljs.core.truth_(a)) {
        b.append(cljs.core.first.call(null, a)), a = cljs.core.next.call(null, a)
      }else {
        break
      }
    }
    return b.toString()
  }
};
clojure.string.replace = function(a, b, c) {
  if(cljs.core.truth_(cljs.core.string_QMARK_.call(null, b))) {
    return a.replace(RegExp(goog.string.regExpEscape.call(null, b), "g"), c)
  }else {
    if(cljs.core.truth_(b.hasOwnProperty("source"))) {
      return a.replace(RegExp(b.source, "g"), c)
    }else {
      if(cljs.core.truth_("\ufdd0'else")) {
        throw cljs.core.str.call(null, "Invalid match arg: ", b);
      }else {
        return null
      }
    }
  }
};
clojure.string.replace_first = function(a, b, c) {
  return a.replace(b, c)
};
clojure.string.join = function() {
  var a = null;
  return function(a, c) {
    switch(arguments.length) {
      case 1:
        return cljs.core.apply.call(null, cljs.core.str, a);
      case 2:
        return cljs.core.apply.call(null, cljs.core.str, cljs.core.interpose.call(null, a, c))
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
clojure.string.upper_case = function(a) {
  return a.toUpperCase()
};
clojure.string.lower_case = function(a) {
  return a.toLowerCase()
};
clojure.string.capitalize = function(a) {
  return cljs.core.truth_(cljs.core._LT_.call(null, cljs.core.count.call(null, a), 2)) ? clojure.string.upper_case.call(null, a) : cljs.core.str.call(null, clojure.string.upper_case.call(null, cljs.core.subs.call(null, a, 0, 1)), clojure.string.lower_case.call(null, cljs.core.subs.call(null, a, 1)))
};
clojure.string.split = function() {
  var a = null;
  return function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core.vec.call(null, cljs.core.str.call(null, a).split(c));
      case 3:
        var e;
        a: {
          if(cljs.core.truth_(cljs.core._LT_.call(null, d, 1))) {
            e = cljs.core.vec.call(null, cljs.core.str.call(null, a).split(c))
          }else {
            for(var f = a, g = d, h = cljs.core.Vector.fromArray([]);;) {
              if(cljs.core.truth_(cljs.core._EQ_.call(null, g, 1))) {
                e = cljs.core.conj.call(null, h, f);
                break a
              }else {
                var i = cljs.core.re_find.call(null, c, f);
                if(cljs.core.truth_(i)) {
                  var j = i, i = f.indexOf(j), j = f.substring(cljs.core._PLUS_.call(null, i, cljs.core.count.call(null, j))), g = cljs.core.dec.call(null, g), h = cljs.core.conj.call(null, h, f.substring(0, i)), f = j
                }else {
                  e = cljs.core.conj.call(null, h, f);
                  break a
                }
              }
            }
          }
        }
        return e
    }
    throw"Invalid arity: " + arguments.length;
  }
}();
clojure.string.split_lines = function(a) {
  return clojure.string.split.call(null, a, /\n|\r\n/)
};
clojure.string.trim = function(a) {
  return goog.string.trim.call(null, a)
};
clojure.string.triml = function(a) {
  return goog.string.trimLeft.call(null, a)
};
clojure.string.trimr = function(a) {
  return goog.string.trimRight.call(null, a)
};
clojure.string.trim_newline = function(a) {
  for(var b = a.length;;) {
    if(cljs.core.truth_(cljs.core.zero_QMARK_.call(null, b))) {
      return""
    }else {
      var c = cljs.core.get.call(null, a, cljs.core.dec.call(null, b));
      if(cljs.core.truth_(function() {
        var a = cljs.core._EQ_.call(null, c, "\n");
        return cljs.core.truth_(a) ? a : cljs.core._EQ_.call(null, c, "\r")
      }())) {
        b = cljs.core.dec.call(null, b)
      }else {
        return a.substring(0, b)
      }
    }
  }
};
clojure.string.blank_QMARK_ = function(a) {
  var b = cljs.core.str.call(null, a);
  return cljs.core.truth_(function() {
    var a = cljs.core.not.call(null, b);
    return cljs.core.truth_(a) ? a : (a = cljs.core._EQ_.call(null, "", b), cljs.core.truth_(a) ? a : cljs.core.re_matches.call(null, /\s+/, b))
  }()) ? !0 : !1
};
clojure.string.escape = function(a, b) {
  for(var c = new goog.string.StringBuffer, d = a.length, e = 0;;) {
    if(cljs.core.truth_(cljs.core._EQ_.call(null, d, e))) {
      return c.toString()
    }else {
      var f = a.charAt(e), g = cljs.core.get.call(null, b, f);
      cljs.core.truth_(g) ? c.append(cljs.core.str.call(null, g)) : c.append(f);
      e = cljs.core.inc.call(null, e)
    }
  }
};
cljs.nodejs = {};
cljs.nodejs.require = require;
cljs.nodejs.process = process;
cljs.core.string_print = cljs.nodejs.require.call(null, "sys").print;
cljs.reader = {};
cljs.reader.PushbackReader = {};
cljs.reader.read_char = function read_char(b) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$reader$PushbackReader$read_char : b) ? b.cljs$reader$PushbackReader$read_char(b) : function() {
    var c = read_char[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = read_char._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "PushbackReader.read-char", b);
      }
    }
  }().call(null, b)
};
cljs.reader.unread = function unread(b, c) {
  return cljs.core.truth_(cljs.core.truth_(b) ? b.cljs$reader$PushbackReader$unread : b) ? b.cljs$reader$PushbackReader$unread(b, c) : function() {
    var c = unread[goog.typeOf.call(null, b)];
    if(cljs.core.truth_(c)) {
      return c
    }else {
      if(c = unread._, cljs.core.truth_(c)) {
        return c
      }else {
        throw cljs.core.missing_protocol.call(null, "PushbackReader.unread", b);
      }
    }
  }().call(null, b, c)
};
cljs.reader.StringPushbackReader = function(a, b, c) {
  this.s = a;
  this.index_atom = b;
  this.buffer_atom = c
};
cljs.reader.StringPushbackReader.prototype.cljs$reader$PushbackReader$ = !0;
cljs.reader.StringPushbackReader.prototype.cljs$reader$PushbackReader$read_char = function() {
  if(cljs.core.truth_(cljs.core.empty_QMARK_.call(null, cljs.core.deref.call(null, this.buffer_atom)))) {
    var a = cljs.core.deref.call(null, this.index_atom);
    cljs.core.swap_BANG_.call(null, this.index_atom, cljs.core.inc);
    return cljs.core.nth.call(null, this.s, a)
  }else {
    return a = cljs.core.deref.call(null, this.buffer_atom), cljs.core.swap_BANG_.call(null, this.buffer_atom, cljs.core.rest), cljs.core.first.call(null, a)
  }
};
cljs.reader.StringPushbackReader.prototype.cljs$reader$PushbackReader$unread = function(a, b) {
  return cljs.core.swap_BANG_.call(null, this.buffer_atom, function(a) {
    return cljs.core.cons.call(null, b, a)
  })
};
cljs.reader.push_back_reader = function(a) {
  return new cljs.reader.StringPushbackReader(a, cljs.core.atom.call(null, 0), cljs.core.atom.call(null, null))
};
cljs.reader.whitespace_QMARK_ = function(a) {
  var b = goog.string.isBreakingWhitespace.call(null, a);
  return cljs.core.truth_(b) ? b : cljs.core._EQ_.call(null, ",", a)
};
cljs.reader.numeric_QMARK_ = function(a) {
  return goog.string.isNumeric.call(null, a)
};
cljs.reader.comment_prefix_QMARK_ = function(a) {
  return cljs.core._EQ_.call(null, ";", a)
};
cljs.reader.number_literal_QMARK_ = function(a, b) {
  var c = cljs.reader.numeric_QMARK_.call(null, b);
  return cljs.core.truth_(c) ? c : (c = function() {
    var a = cljs.core._EQ_.call(null, "+", b);
    return cljs.core.truth_(a) ? a : cljs.core._EQ_.call(null, "-", b)
  }(), cljs.core.truth_(c) ? cljs.reader.numeric_QMARK_.call(null, function() {
    var b = cljs.reader.read_char.call(null, a);
    cljs.reader.unread.call(null, a, b);
    return b
  }()) : c)
};
cljs.reader.reader_error = function() {
  var a = function(a, c) {
    var d = null;
    goog.isDef(c) && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    throw cljs.core.apply.call(null, cljs.core.str, d);
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = function(a) {
    cljs.core.first(a);
    a = cljs.core.rest(a);
    throw cljs.core.apply.call(null, cljs.core.str, a);
  };
  return a
}();
cljs.reader.macro_terminating_QMARK_ = function(a) {
  var b = cljs.core.not_EQ_.call(null, a, "#");
  return cljs.core.truth_(b) ? (b = cljs.core.not_EQ_.call(null, a, "'"), cljs.core.truth_(b) ? cljs.core.contains_QMARK_.call(null, cljs.reader.macros, a) : b) : b
};
cljs.reader.read_token = function(a, b) {
  for(var c = new goog.string.StringBuffer(b), d = cljs.reader.read_char.call(null, a);;) {
    if(cljs.core.truth_(function() {
      var a = cljs.core.nil_QMARK_.call(null, d);
      return cljs.core.truth_(a) ? a : (a = cljs.reader.whitespace_QMARK_.call(null, d), cljs.core.truth_(a) ? a : cljs.reader.macro_terminating_QMARK_.call(null, d))
    }())) {
      return cljs.reader.unread.call(null, a, d), c.toString()
    }else {
      c.append(d);
      var e = cljs.reader.read_char.call(null, a), d = e
    }
  }
};
cljs.reader.skip_line = function(a) {
  for(;;) {
    var b = cljs.reader.read_char.call(null, a);
    if(cljs.core.truth_(function() {
      var a = cljs.core._EQ_.call(null, b, "n");
      return cljs.core.truth_(a) ? a : (a = cljs.core._EQ_.call(null, b, "r"), cljs.core.truth_(a) ? a : cljs.core.nil_QMARK_.call(null, b))
    }())) {
      return a
    }
  }
};
cljs.reader.int_pattern = cljs.core.re_pattern.call(null, "([-+]?)(?:(0)|([1-9][0-9]*)|0[xX]([0-9A-Fa-f]+)|0([0-7]+)|([1-9][0-9]?)[rR]([0-9A-Za-z]+)|0[0-9]+)(N)?");
cljs.reader.ratio_pattern = cljs.core.re_pattern.call(null, "([-+]?[0-9]+)/([0-9]+)");
cljs.reader.float_pattern = cljs.core.re_pattern.call(null, "([-+]?[0-9]+(\\.[0-9]*)?([eE][-+]?[0-9]+)?)(M)?");
cljs.reader.match_int = function(a) {
  var b = cljs.core.re_find.call(null, cljs.reader.int_pattern, a);
  if(cljs.core.truth_(cljs.core.nth.call(null, b, 2))) {
    return 0
  }else {
    var a = cljs.core.truth_(cljs.core._EQ_.call(null, "-", cljs.core.nth.call(null, b, 1))) ? -1 : 1, c = cljs.core.truth_(cljs.core.nth.call(null, b, 3)) ? cljs.core.Vector.fromArray([cljs.core.nth.call(null, b, 3), 10]) : cljs.core.truth_(cljs.core.nth.call(null, b, 4)) ? cljs.core.Vector.fromArray([cljs.core.nth.call(null, b, 4), 16]) : cljs.core.truth_(cljs.core.nth.call(null, b, 5)) ? cljs.core.Vector.fromArray([cljs.core.nth.call(null, b, 5), 8]) : cljs.core.truth_(cljs.core.nth.call(null, 
    b, 7)) ? cljs.core.Vector.fromArray([cljs.core.nth.call(null, b, 7), parseInt.call(null, cljs.core.nth.call(null, b, 7))]) : cljs.core.truth_("\ufdd0'default") ? cljs.core.Vector.fromArray([null, null]) : null, b = cljs.core.nth.call(null, c, 0, null), c = cljs.core.nth.call(null, c, 1, null);
    return cljs.core.truth_(cljs.core.nil_QMARK_.call(null, b)) ? null : cljs.core._STAR_.call(null, a, parseInt.call(null, b, c))
  }
};
cljs.reader.match_ratio = function(a) {
  var b = cljs.core.re_find.call(null, cljs.reader.ratio_pattern, a), a = cljs.core.nth.call(null, b, 1), b = cljs.core.nth.call(null, b, 2);
  return cljs.core._SLASH_.call(null, parseInt.call(null, a), parseInt.call(null, b))
};
cljs.reader.match_float = function(a) {
  return parseFloat.call(null, a)
};
cljs.reader.match_number = function(a) {
  return cljs.core.truth_(cljs.core.re_matches.call(null, cljs.reader.int_pattern, a)) ? cljs.reader.match_int.call(null, a) : cljs.core.truth_(cljs.core.re_matches.call(null, cljs.reader.ratio_pattern, a)) ? cljs.reader.match_ratio.call(null, a) : cljs.core.truth_(cljs.core.re_matches.call(null, cljs.reader.float_pattern, a)) ? cljs.reader.match_float.call(null, a) : null
};
cljs.reader.escape_char_map = cljs.core.HashMap.fromArrays('t,r,n,\\,",b,f'.split(","), '\t,\r,\n,\\,",\u0008,\u000c'.split(","));
cljs.reader.read_unicode_char = function(a) {
  return cljs.reader.reader_error.call(null, a, "Unicode characters not supported by reader (yet)")
};
cljs.reader.escape_char = function(a, b) {
  var c = cljs.reader.read_char.call(null, b), d = cljs.core.get.call(null, cljs.reader.escape_char_map, c);
  return cljs.core.truth_(d) ? d : cljs.core.truth_(function() {
    var a = cljs.core._EQ_.call(null, "u", c);
    return cljs.core.truth_(a) ? a : cljs.reader.numeric_QMARK_.call(null, c)
  }()) ? cljs.reader.read_unicode_char.call(null, b, c) : cljs.reader.reader_error.call(null, b, "Unsupported escape charater: \\", c)
};
cljs.reader.read_past = function(a, b) {
  for(var c = cljs.reader.read_char.call(null, b);;) {
    if(cljs.core.truth_(a.call(null, c))) {
      c = cljs.reader.read_char.call(null, b)
    }else {
      return c
    }
  }
};
cljs.reader.read_delimited_list = function(a, b, c) {
  for(var d = cljs.core.Vector.fromArray([]);;) {
    var e = cljs.reader.read_past.call(null, cljs.reader.whitespace_QMARK_, b);
    cljs.core.truth_(e) || cljs.reader.reader_error.call(null, b, "EOF");
    if(cljs.core.truth_(cljs.core._EQ_.call(null, a, e))) {
      return d
    }else {
      var f = cljs.core.get.call(null, cljs.reader.macros, e);
      cljs.core.truth_(f) ? e = f.call(null, b, e) : (cljs.reader.unread.call(null, b, e), e = cljs.reader.read.call(null, b, !0, null, c));
      d = cljs.core.truth_(cljs.core._EQ_.call(null, e, b)) ? d : cljs.core.conj.call(null, d, e)
    }
  }
};
cljs.reader.not_implemented = function(a, b) {
  return cljs.reader.reader_error.call(null, a, "Reader for ", b, " not implemented yet")
};
cljs.reader.read_dispatch = function(a, b) {
  var c = cljs.reader.read_char.call(null, a), d = cljs.core.get.call(null, cljs.reader.dispatch_macros, c);
  return cljs.core.truth_(d) ? d.call(null, a, b) : cljs.reader.reader_error.call(null, a, "No dispatch macro for ", c)
};
cljs.reader.read_unmatched_delimiter = function(a, b) {
  return cljs.reader.reader_error.call(null, a, "Unmached delimiter ", b)
};
cljs.reader.read_list = function(a) {
  return cljs.core.apply.call(null, cljs.core.list, cljs.reader.read_delimited_list.call(null, ")", a, !0))
};
cljs.reader.read_comment = cljs.reader.skip_line;
cljs.reader.read_vector = function(a) {
  return cljs.reader.read_delimited_list.call(null, "]", a, !0)
};
cljs.reader.read_map = function(a) {
  var b = cljs.reader.read_delimited_list.call(null, "}", a, !0);
  cljs.core.truth_(cljs.core.odd_QMARK_.call(null, cljs.core.count.call(null, b))) && cljs.reader.reader_error.call(null, a, "Map literal must contain an even number of forms");
  return cljs.core.apply.call(null, cljs.core.hash_map, b)
};
cljs.reader.read_number = function(a, b) {
  for(var c = new goog.string.StringBuffer(b), d = cljs.reader.read_char.call(null, a);;) {
    if(cljs.core.truth_(function() {
      var a = cljs.core.nil_QMARK_.call(null, d);
      return cljs.core.truth_(a) ? a : (a = cljs.reader.whitespace_QMARK_.call(null, d), cljs.core.truth_(a) ? a : cljs.core.contains_QMARK_.call(null, cljs.reader.macros, d))
    }())) {
      cljs.reader.unread.call(null, a, d);
      var e = c.toString(), c = cljs.reader.match_number.call(null, e);
      return cljs.core.truth_(c) ? c : cljs.reader.reader_error.call(null, a, "Invalid number format [", e, "]")
    }else {
      c.append(d), d = e = cljs.reader.read_char.call(null, a)
    }
  }
};
cljs.reader.read_string = function(a) {
  for(var b = new goog.string.StringBuffer, c = cljs.reader.read_char.call(null, a);;) {
    if(cljs.core.truth_(cljs.core.nil_QMARK_.call(null, c))) {
      return cljs.reader.reader_error.call(null, a, "EOF while reading string")
    }else {
      if(cljs.core.truth_(cljs.core._EQ_.call(null, "\\", c))) {
        b.append(cljs.reader.escape_char.call(null, b, a)), c = cljs.reader.read_char.call(null, a)
      }else {
        if(cljs.core.truth_(cljs.core._EQ_.call(null, '"', c))) {
          return b.toString()
        }else {
          if(cljs.core.truth_("\ufdd0'default")) {
            b.append(c), c = cljs.reader.read_char.call(null, a)
          }else {
            return null
          }
        }
      }
    }
  }
};
cljs.reader.special_symbols = cljs.core.ObjMap.fromObject(["nil", "true", "false"], {nil:null, "true":!0, "false":!1});
cljs.reader.read_symbol = function(a, b) {
  var c = cljs.reader.read_token.call(null, a, b);
  return cljs.core.truth_(goog.string.contains.call(null, c, "/")) ? cljs.core.symbol.call(null, cljs.core.subs.call(null, c, 0, c.indexOf("/")), cljs.core.subs.call(null, cljs.core.inc.call(null, c.indexOf("/")), c.length)) : cljs.core.get.call(null, cljs.reader.special_symbols, c, cljs.core.symbol.call(null, c))
};
cljs.reader.read_keyword = function(a) {
  a = cljs.reader.read_token.call(null, a, cljs.reader.read_char.call(null, a));
  return cljs.core.truth_(goog.string.contains.call(null, a, "/")) ? cljs.core.keyword.call(null, cljs.core.subs.call(null, a, 0, a.indexOf("/")), cljs.core.subs.call(null, a, cljs.core.inc.call(null, a.indexOf("/")), a.length)) : cljs.core.keyword.call(null, a)
};
cljs.reader.desugar_meta = function(a) {
  return cljs.core.truth_(cljs.core.symbol_QMARK_.call(null, a)) ? cljs.core.ObjMap.fromObject(["\ufdd0'tag"], {"\ufdd0'tag":a}) : cljs.core.truth_(cljs.core.string_QMARK_.call(null, a)) ? cljs.core.ObjMap.fromObject(["\ufdd0'tag"], {"\ufdd0'tag":a}) : cljs.core.truth_(cljs.core.keyword_QMARK_.call(null, a)) ? cljs.core.HashMap.fromArrays([a], [!0]) : cljs.core.truth_("\ufdd0'else") ? a : null
};
cljs.reader.wrapping_reader = function(a) {
  return function(b) {
    return cljs.core.list.call(null, a, cljs.reader.read.call(null, b, !0, null, !0))
  }
};
cljs.reader.throwing_reader = function(a) {
  return function(b) {
    return cljs.reader.reader_error.call(null, b, a)
  }
};
cljs.reader.read_meta = function(a) {
  var b = cljs.reader.desugar_meta.call(null, cljs.reader.read.call(null, a, !0, null, !0));
  cljs.core.truth_(cljs.core.map_QMARK_.call(null, b)) || cljs.reader.reader_error.call(null, a, "Metadata must be Symbol,Keyword,String or Map");
  var c = cljs.reader.read.call(null, a, !0, null, !0);
  return cljs.core.truth_(cljs.core.truth_(cljs.core.truth_(c) ? c.cljs$core$IWithMeta$ : c) ? !0 : cljs.core.type_satisfies_.call(null, cljs.core.IWithMeta, c)) ? cljs.core.with_meta.call(null, c, cljs.core.merge.call(null, cljs.core.meta.call(null, c), b)) : cljs.reader.reader_error.call(null, a, "Metadata can only be applied to IWithMetas")
};
cljs.reader.read_set = function(a) {
  return cljs.core.set.call(null, cljs.reader.read_delimited_list.call(null, "}", a, !0))
};
cljs.reader.read_regex = function(a, b) {
  return cljs.core.re_pattern.call(null, cljs.reader.read_string.call(null, a, b))
};
cljs.reader.read_discard = function(a) {
  cljs.reader.read.call(null, a, !0, null, !0);
  return a
};
cljs.reader.macros = cljs.core.HashMap.fromArrays("@,`,\",#,%,',(,),:,;,[,{,\\,],},^,~".split(","), [cljs.reader.wrapping_reader.call(null, "\ufdd1'deref"), cljs.reader.not_implemented, cljs.reader.read_string, cljs.reader.read_dispatch, cljs.reader.not_implemented, cljs.reader.wrapping_reader.call(null, "\ufdd1'quote"), cljs.reader.read_list, cljs.reader.read_unmatched_delimiter, cljs.reader.read_keyword, cljs.reader.not_implemented, cljs.reader.read_vector, cljs.reader.read_map, cljs.reader.read_char, 
cljs.reader.read_unmatched_delimiter, cljs.reader.read_unmatched_delimiter, cljs.reader.read_meta, cljs.reader.not_implemented]);
cljs.reader.dispatch_macros = cljs.core.ObjMap.fromObject(["{", "<", '"', "!", "_"], {"{":cljs.reader.read_set, "<":cljs.reader.throwing_reader.call(null, "Unreadable form"), '"':cljs.reader.read_regex, "!":cljs.reader.read_comment, _:cljs.reader.read_discard});
cljs.reader.read = function(a, b, c) {
  for(;;) {
    var d = cljs.reader.read_char.call(null, a);
    if(cljs.core.truth_(cljs.core.nil_QMARK_.call(null, d))) {
      return cljs.core.truth_(b) ? cljs.reader.reader_error.call(null, a, "EOF") : c
    }else {
      if(!cljs.core.truth_(cljs.reader.whitespace_QMARK_.call(null, d))) {
        if(cljs.core.truth_(cljs.reader.comment_prefix_QMARK_.call(null, d))) {
          a = cljs.reader.read_comment.call(null, a, d)
        }else {
          if(cljs.core.truth_("\ufdd0'else")) {
            if(d = cljs.core.truth_(cljs.reader.macros.call(null, d)) ? cljs.reader.macros.call(null, d).call(null, a, d) : cljs.core.truth_(cljs.reader.number_literal_QMARK_.call(null, a, d)) ? cljs.reader.read_number.call(null, a, d) : cljs.core.truth_("\ufdd0'else") ? cljs.reader.read_symbol.call(null, a, d) : null, !cljs.core.truth_(cljs.core._EQ_.call(null, d, a))) {
              return d
            }
          }else {
            return null
          }
        }
      }
    }
  }
};
cljs.reader.read_string = function(a) {
  a = cljs.reader.push_back_reader.call(null, a);
  return cljs.reader.read.call(null, a, !0, null, !1)
};
var leech = {util:{}};
leech.util.url = cljs.nodejs.require.call(null, "url");
leech.util.log = function(a) {
  return cljs.core.prn.call(null, cljs.core.merge.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'app"], {"\ufdd0'app":"leech"}), a))
};
leech.util.millis = function() {
  return(new Date).getTime()
};
leech.util.update = function(a, b, c) {
  return cljs.core.assoc.call(null, a, b, c.call(null, cljs.core.get.call(null, a, b)))
};
leech.util.re_match_QMARK_ = function(a, b) {
  return a.test(b)
};
leech.util.clj__GT_js = function clj__GT_js(b) {
  return cljs.core.truth_(cljs.core.string_QMARK_.call(null, b)) ? b : cljs.core.truth_(cljs.core.keyword_QMARK_.call(null, b)) ? cljs.core.name.call(null, b) : cljs.core.truth_(cljs.core.map_QMARK_.call(null, b)) ? cljs.core.reduce.call(null, function(b, d) {
    var e = cljs.core.nth.call(null, d, 0, null), f = cljs.core.nth.call(null, d, 1, null);
    return cljs.core.assoc.call(null, b, clj__GT_js.call(null, e), clj__GT_js.call(null, f))
  }, cljs.core.ObjMap.fromObject([], {}), b).strobj : cljs.core.truth_(cljs.core.coll_QMARK_.call(null, b)) ? cljs.core.apply.call(null, cljs.core.array, cljs.core.map.call(null, clj__GT_js, b)) : cljs.core.truth_("\ufdd0'else") ? b : null
};
leech.util.json_generate = function(a) {
  return cljs.core.str.call(null, JSON.stringify.call(null, leech.util.clj__GT_js.call(null, a)), "\n")
};
leech.util.json_parse = function(a) {
  return cljs.core.js__GT_clj.call(null, JSON.parse.call(null, a))
};
leech.util.url_parse = function(a) {
  a = cljs.core.js__GT_clj.call(null, leech.util.url.parse(a));
  return cljs.core.ObjMap.fromObject(["\ufdd0'protocol", "\ufdd0'host", "\ufdd0'port", "\ufdd0'path", "\ufdd0'auth"], {"\ufdd0'protocol":cljs.core.get.call(null, a, "protocol").substr(0, cljs.core.dec.call(null, cljs.core.get.call(null, a, "protocol").length)), "\ufdd0'host":cljs.core.get.call(null, a, "hostname"), "\ufdd0'port":parseInt.call(null, cljs.core.get.call(null, a, "port")), "\ufdd0'path":cljs.core.get.call(null, a, "pathname"), "\ufdd0'auth":cljs.core.get.call(null, a, "auth")})
};
leech.util.set_timeout = function(a, b) {
  return setTimeout.call(null, b, a)
};
leech.util.clear_timeout = function() {
  return cancelTimeout.call(null, cljs.core.delay)
};
leech.util.set_interval = function(a, b, c) {
  var d = cljs.core.atom.call(null, null), a = leech.util.set_timeout.call(null, a, function() {
    c.call(null);
    var a = setInterval.call(null, c, b);
    return cljs.core.swap_BANG_.call(null, d, cljs.core.constantly.call(null, a))
  });
  return cljs.core.Vector.fromArray([a, d])
};
leech.util.clear_interval = function(a) {
  var b = cljs.core.nth.call(null, a, 0, null), a = cljs.core.nth.call(null, a, 1, null);
  clearTimeout.call(null, b);
  b = cljs.core.deref.call(null, a);
  return cljs.core.truth_(b) ? clearInterval.call(null, b) : null
};
leech.util.next_tick = function(a) {
  return cljs.nodejs.process.nextTick(a)
};
leech.util.trap = function(a, b) {
  return cljs.nodejs.process.on(cljs.core.str.call(null, "SIG", a), b)
};
leech.util.exit = function(a) {
  return cljs.nodejs.process.exit(a)
};
leech.util.argv = function() {
  return cljs.core.vec.call(null, cljs.core.js__GT_clj.call(null, cljs.nodejs.process.argv))
};
leech.util.main = function(a, b) {
  var c = function() {
    var a = cljs.core.get.call(null, cljs.core.js__GT_clj.call(null, cljs.nodejs.process.argv), 2);
    if(cljs.core.truth_(a)) {
      return a
    }else {
      throw"no main name given";
    }
  }();
  return cljs.core.truth_(cljs.core._EQ_.call(null, c, a)) ? cljs.core._STAR_main_cli_fn_STAR_ = function() {
    var a = function(a) {
      goog.isDef(a) && cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
      return b.call(null)
    };
    a.cljs$lang$maxFixedArity = 0;
    a.cljs$lang$applyTo = function(a) {
      cljs.core.seq(a);
      return b.call(null)
    };
    return a
  }() : null
};
leech.conf = {};
leech.conf.env = function(a) {
  return cljs.core.get.call(null, cljs.core.js__GT_clj.call(null, cljs.nodejs.process.env), a)
};
leech.conf.env_BANG_ = function(a) {
  var b = leech.conf.env.call(null, a);
  if(cljs.core.truth_(b)) {
    return b
  }else {
    throw cljs.core.str.call(null, "missing key ", a);
  }
};
leech.conf.port = function() {
  return parseInt.call(null, leech.conf.env_BANG_.call(null, "PORT"))
};
leech.conf.aorta_urls = function() {
  return clojure.string.split.call(null, leech.conf.env_BANG_.call(null, "AORTA_URLS"), /,/)
};
leech.conf.redis_url = function() {
  return leech.conf.env_BANG_.call(null, "REDIS_URL")
};
leech.web = {};
leech.web.redis = cljs.nodejs.require.call(null, "redis-url");
leech.web.http = cljs.nodejs.require.call(null, "http");
leech.web.write_res = function(a, b, c, d) {
  a = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, a)) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a;
  a = cljs.core.get.call(null, a, "\ufdd0'res");
  a.writeHead(b, leech.util.clj__GT_js.call(null, c));
  a.write(d);
  return a.end()
};
leech.web.handle_not_found = function(a) {
  var b = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, a)) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a, a = cljs.core.get.call(null, b, "\ufdd0'res"), b = cljs.core.get.call(null, b, "\ufdd0'conn-id");
  leech.web.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at", "\ufdd0'conn-id"], {"\ufdd0'fn":"handle-not-found", "\ufdd0'at":"start", "\ufdd0'conn-id":b}));
  leech.web.write_res.call(null, a, 404, cljs.core.ObjMap.fromObject(["Content-Type"], {"Content-Type":"application/clj"}), cljs.core.pr_str.call(null, cljs.core.ObjMap.fromObject(["error"], {error:"not found"})));
  return leech.web.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at", "\ufdd0'conn-id"], {"\ufdd0'fn":"handle-not-found", "\ufdd0'at":"finish", "\ufdd0'conn-id":b}))
};
leech.web.handle_not_authorized = function(a) {
  var b = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, a)) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a, a = cljs.core.get.call(null, b, "\ufdd0'res"), b = cljs.core.get.call(null, b, "\ufdd0'conn-id");
  leech.web.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at", "\ufdd0'conn-id"], {"\ufdd0'fn":"handle-not-authorized", "\ufdd0'at":"start", "\ufdd0'conn-id":b}));
  leech.web.write_res.call(null, a, 403, cljs.core.ObjMap.fromObject(["Content-Type"], {"Content-Type":"application/clj"}), cljs.core.pr_str.call(null, cljs.core.ObjMap.fromObject(["error"], {error:"not authorized"})));
  return leech.web.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at", "\ufdd0'conn-id"], {"\ufdd0'fn":"handle-not-authorized", "\ufdd0'at":"finish", "\ufdd0'conn-id":b}))
};
leech.web.handle_index = function(a) {
  a = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, a)) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a;
  cljs.core.get.call(null, a, "\ufdd0'res");
  cljs.core.get.call(null, a, "\ufdd0'conn-id");
  return null
};
leech.web.handle_search = function(a, b, c) {
  var b = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, b)) ? cljs.core.apply.call(null, cljs.core.hash_map, b) : b, d = cljs.core.get.call(null, b, "\ufdd0'res"), e = cljs.core.get.call(null, b, "\ufdd0'conn-id"), b = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, c)) ? cljs.core.apply.call(null, cljs.core.hash_map, c) : c, c = cljs.core.get.call(null, b, "\ufdd0'events-key"), f = cljs.core.get.call(null, b, "\ufdd0'search-id"), b = cljs.core.pr_str.call(null, cljs.core.assoc.call(null, b, 
  "\ufdd0'target", "\ufdd0'list"));
  leech.web.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at", "\ufdd0'conn-id", "\ufdd0'search-id"], {"\ufdd0'fn":"handle-search", "\ufdd0'at":"start", "\ufdd0'conn-id":e, "\ufdd0'search-id":f}));
  return a.multi().zadd(leech.web.searches, leech.util.millis.call(null), b).lrange(c, 0, 1E5).ltrim(c, 1E5, -1).exec(function(a, b) {
    cljs.core.nth.call(null, b, 0, null);
    var c = cljs.core.nth.call(null, b, 1, null);
    cljs.core.nth.call(null, b, 2, null);
    leech.web.log.call(null, cljs.core.ObjMap.fromObject("\ufdd0'fn,\ufdd0'at,\ufdd0'conn-id,\ufdd0'search-id,\ufdd0'err,\ufdd0'events-count".split(","), {"\ufdd0'fn":"handle-search", "\ufdd0'at":"execed", "\ufdd0'conn-id":e, "\ufdd0'search-id":f, "\ufdd0'err":a, "\ufdd0'events-count":cljs.core.count.call(null, c)}));
    c = cljs.core.map.call(null, reader.read_string, c);
    leech.web.write_res.call(null, d, 200, cljs.core.ObjMap.fromObject(["Content-Type"], {"Content-Type":"application/clj"}), cljs.core.pr_str.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'events"], {"\ufdd0'events":c})));
    return leech.web.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at", "\ufdd0'conn-id", "\ufdd0'search-id"], {"\ufdd0'fn":"handle-search", "\ufdd0'at":"written", "\ufdd0'conn-id":e, "\ufdd0'search-id":f}))
  }).log(cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at", "\ufdd0'conn-id", "\ufdd0'search-id"], {"\ufdd0'fn":"handle-search", "\ufdd0'at":"finish", "\ufdd0'conn-id":e, "\ufdd0'search-id":f}))
};
leech.web.parse_req = function(a) {
  return cljs.core.ObjMap.fromObject(["\ufdd0'method", "\ufdd0'path"], {"\ufdd0'method":a.method, "\ufdd0'path":leech.web.url.parse(a.url).pathname})
};
leech.web.handle = function(a, b) {
  var c = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, b)) ? cljs.core.apply.call(null, cljs.core.hash_map, b) : b;
  cljs.core.get.call(null, c, "\ufdd0'res");
  var d = cljs.core.get.call(null, c, "\ufdd0'req"), c = cljs.core.get.call(null, c, "\ufdd0'conn-id"), d = leech.web.parse_req.call(null, d), e = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, d)) ? cljs.core.apply.call(null, cljs.core.hash_map, d) : d, d = cljs.core.get.call(null, e, "\ufdd0'path"), f = cljs.core.get.call(null, e, "\ufdd0'method");
  leech.web.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at", "\ufdd0'conn-id", "\ufdd0'method", "\ufdd0'path"], {"\ufdd0'fn":"handle", "\ufdd0'at":"start", "\ufdd0'conn-id":c, "\ufdd0'method":f, "\ufdd0'path":d}));
  e = cljs.core._EQ_;
  d = cljs.core.Vector.fromArray([f, d]);
  cljs.core.truth_(e.call(null, cljs.core.Vector.fromArray(["get", "/"]), d)) ? cljs.core.truth_(leech.web.authorized_QMARK_.call(null, leech.web.conn)) ? leech.web.handle_index.call(null, leech.web.conn) : leech.web.handle_not_authorized.call(null, leech.web.conn) : cljs.core.truth_(e.call(null, cljs.core.Vector.fromArray(["post", "/searches"]), d)) ? cljs.core.truth_(leech.web.auth_QMARK_.call(null)) ? leech.web.handle_search.call(null, a, leech.web.conn, leech.web.search_data) : leech.web.handle_not_authorized.call(null, 
  leech.web.conn) : leech.web.handle_not_found.call(null, leech.web.conn);
  return leech.web.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at", "\ufdd0'conn-id"], {"\ufdd0'fn":"handle", "\ufdd0'at":"finish", "\ufdd0'conn-id":c}))
};
leech.web.listen = function(a, b, c) {
  leech.web.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at", "\ufdd0'port"], {"\ufdd0'fn":"listen", "\ufdd0'at":"start", "\ufdd0'port":b}));
  var d = leech.web.http.createServer(a);
  d.on("clientError", function(a) {
    return leech.web.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at", "\ufdd0'name", "\ufdd0'message"], {"\ufdd0'fn":"listen", "\ufdd0'at":"error", "\ufdd0'name":a.name, "\ufdd0'message":a.message}))
  });
  d.listen(b, "0.0.0.0", function() {
    return c.call(null, d)
  });
  return leech.web.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"listen", "\ufdd0'at":"finish"}))
};
leech.web.close = function() {
  leech.web.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"close", "\ufdd0'at":"start"}));
  return leech.web.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"close", "\ufdd0'at":"finish"}))
};
leech.web.start = function() {
  var a = leech.conf.port.call(null);
  leech.web.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at", "\ufdd0'port"], {"\ufdd0'fn":"start", "\ufdd0'at":"start", "\ufdd0'port":a}));
  var b = leech.web.redis.createClient(leech.conf.redis_url.call(null));
  b.on("ready", function() {
    leech.web.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"start", "\ufdd0'at":"connected"}));
    return leech.web.listen.call(null, cljs.core.partial.call(null, leech.web.handle, b), a, function(a) {
      leech.web.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"start", "\ufdd0'at":"listening"}));
      for(var b = cljs.core.seq.call(null, cljs.core.Vector.fromArray(["TERM", "INT"]));;) {
        if(cljs.core.truth_(b)) {
          var e = cljs.core.first.call(null, b);
          leech.util.trap.call(null, e, function() {
            return function() {
              leech.web.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at", "\ufdd0'signal"], {"\ufdd0'fn":"start", "\ufdd0'at":"catch", "\ufdd0'signal":e}));
              leech.web.close.call(null, a);
              leech.web.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at", "\ufdd0'status"], {"\ufdd0'fn":"start", "\ufdd0'at":"exit", "\ufdd0'status":0}));
              return leech.util.exit.call(null, 0)
            }
          }(b));
          leech.web.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at", "\ufdd0'signal"], {"\ufdd0'fn":"start", "\ufdd0'at":"trapping", "\ufdd0'signal":e}));
          b = cljs.core.next.call(null, b)
        }else {
          return null
        }
      }
    })
  });
  return leech.web.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"start", "\ufdd0'at":"finish"}))
};
leech.util.main.call(null, "web", leech.web.start);
leech.split = {};
leech.split.init = function() {
  return cljs.core.atom.call(null, "")
};
leech.split.add = function(a, b, c) {
  for(var b = cljs.core.str.call(null, cljs.core.deref.call(null, a), b), b = clojure.string.split.call(null, b, /\n/), d = cljs.core.seq.call(null, cljs.core.butlast.call(null, b));;) {
    if(cljs.core.truth_(d)) {
      var e = cljs.core.first.call(null, d);
      c.call(null, e);
      d = cljs.core.next.call(null, d)
    }else {
      break
    }
  }
  return cljs.core.swap_BANG_.call(null, a, cljs.core.constantly.call(null, cljs.core.last.call(null, b)))
};
leech.io = {};
leech.io.net = cljs.nodejs.require.call(null, "net");
leech.io.log = function(a) {
  return leech.util.log.call(null, cljs.core.merge.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'ns"], {"\ufdd0'ns":"io"}), a))
};
leech.io.bleed = function bleed(b, c) {
  var d = leech.util.url_parse.call(null, b), e = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, d)) ? cljs.core.apply.call(null, cljs.core.hash_map, d) : d, d = cljs.core.get.call(null, e, "\ufdd0'auth"), f = cljs.core.get.call(null, e, "\ufdd0'port"), g = cljs.core.get.call(null, e, "\ufdd0'host");
  leech.io.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'event", "\ufdd0'host"], {"\ufdd0'fn":"bleed", "\ufdd0'event":"start", "\ufdd0'host":g}));
  var e = leech.io.net.createConnection(f, g), h = leech.split.init.call(null);
  e.on("connect", function() {
    return leech.io.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'event", "\ufdd0'host"], {"\ufdd0'fn":"bleed", "\ufdd0'event":"connect", "\ufdd0'host":g}))
  });
  e.on("data", function(b) {
    return leech.split.add.call(null, h, b, function(b) {
      return c.call(null, b)
    })
  });
  e.on("end", function() {
    return leech.io.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'event"], {"\ufdd0'fn":"bleed", "\ufdd0'event":"end"}))
  });
  e.on("error", function(b) {
    return leech.io.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'event", "\ufdd0'name", "\ufdd0'message"], {"\ufdd0'fn":"bleed", "\ufdd0'event":"error", "\ufdd0'name":b.name, "\ufdd0'message":b.message}))
  });
  e.on("close", function(d) {
    leech.io.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'event", "\ufdd0'had-error"], {"\ufdd0'fn":"bleed", "\ufdd0'event":"close", "\ufdd0'had-error":d}));
    return leech.util.set_timeout.call(null, 100, function() {
      return bleed.call(null, b, c)
    })
  });
  e.setEncoding("UTF-8");
  e.write(cljs.core.str.call(null, d, "\n"));
  return e.flush
};
leech.io.start_bleeders = function(a, b) {
  return leech.io.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'event"], {"\ufdd0'fn":"start-bleeders", "\ufdd0'event":"start"}), function() {
    for(var c = cljs.core.seq.call(null, a);;) {
      if(cljs.core.truth_(c)) {
        var d = cljs.core.first.call(null, c), e = leech.util.url_parse.call(null, d), e = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, e)) ? cljs.core.apply.call(null, cljs.core.hash_map, e) : e, f = cljs.core.get.call(null, e, "\ufdd0'host");
        leech.io.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'event", "\ufdd0'host"], {"\ufdd0'fn":"start-bleeder", "\ufdd0'event":"bleed", "\ufdd0'host":f}));
        leech.io.bleed.call(null, d, function() {
          return function(a) {
            return b.call(null, f, a)
          }
        }(c));
        c = cljs.core.next.call(null, c)
      }else {
        return null
      }
    }
  }())
};
leech.watch = {};
leech.watch.init = function() {
  return cljs.core.Vector.fromArray([cljs.core.atom.call(null, 0), cljs.core.atom.call(null, 0)])
};
leech.watch.hit = function(a) {
  var b = cljs.core.nth.call(null, a, 0, null);
  cljs.core.nth.call(null, a, 1, null);
  return cljs.core.swap_BANG_.call(null, b, cljs.core.inc)
};
leech.watch.rate = function(a) {
  var b = cljs.core.nth.call(null, a, 0, null), a = cljs.core.nth.call(null, a, 1, null), b = cljs.core.deref.call(null, b), a = cljs.core.deref.call(null, a);
  return cljs.core._.call(null, b, a)
};
leech.watch.tick = function(a) {
  var b = cljs.core.nth.call(null, a, 0, null), a = cljs.core.nth.call(null, a, 1, null), b = cljs.core.deref.call(null, b), c = cljs.core.deref.call(null, a);
  cljs.core.swap_BANG_.call(null, a, cljs.core.constantly.call(null, b));
  return cljs.core.Vector.fromArray([b, cljs.core._.call(null, b, c)])
};
leech.parse = {};
leech.parse.isodate = cljs.nodejs.require.call(null, "isodate");
leech.parse.long_re = /^-?[0-9]{1,18}$/;
leech.parse.double_re = /^-?[0-9]+\.[0-9]+$/;
leech.parse.parse_long = function(a) {
  return cljs.core.truth_(a) ? parseInt.call(null, a) : null
};
leech.parse.parse_double = function(a) {
  return cljs.core.truth_(a) ? parseFloat.call(null, a) : null
};
leech.parse.coerce_val = function(a) {
  return cljs.core.truth_(leech.util.re_match_QMARK_.call(null, leech.parse.long_re, a)) ? leech.parse.parse_long.call(null, a) : cljs.core.truth_(leech.util.re_match_QMARK_.call(null, leech.parse.double_re, a)) ? leech.parse.parse_double.call(null, a) : cljs.core.truth_(cljs.core._EQ_.call(null, "", a)) ? null : cljs.core.truth_("\ufdd0'else") ? a : null
};
leech.parse.attrs_re = /( *)([a-zA-Z0-9_]+)(=?)([a-zA-Z0-9\.:\/_,-]*)/;
leech.parse.parse_message_attrs_STAR_ = function(a) {
  for(var b = cljs.core.js_obj.call(null);;) {
    var c = leech.parse.attrs_re.exec(a);
    if(cljs.core.truth_(c)) {
      var d = c[0], e = c[4];
      b[c[2]] = cljs.core.truth_(cljs.core._EQ_.call(null, "", c[3])) ? !0 : leech.parse.coerce_val.call(null, e);
      a = a.substring(d.length, a.length)
    }else {
      break
    }
  }
  return b
};
leech.parse.parse_message_attrs = function(a) {
  a = leech.parse.parse_message_attrs_STAR_.call(null, a);
  return new cljs.core.ObjMap(null, cljs.core.js_keys.call(null, a), a)
};
leech.parse.parse_timestamp = function(a) {
  return leech.parse.isodate.call(null, a).getTime()
};
leech.parse.standard_re = /^(\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d[\-\+]\d\d:00) ([0-9\.]+) ([a-z0-7]+)\.([a-z]+) ([a-z\-\_]+)(\[(\d+)\])? - ([a-z4-6-]+)?\.(\d+)@([a-z.]+\.com) - (.*)$/;
leech.parse.parse_standard_line = function(a) {
  var b = cljs.core.re_matches.call(null, leech.parse.standard_re, a);
  if(cljs.core.truth_(b)) {
    var c = leech.parse.parse_message_attrs_STAR_.call(null, cljs.core.get.call(null, b, 11));
    c.event_type = "standard";
    c.timestamp_src = leech.parse.parse_timestamp.call(null, cljs.core.get.call(null, b, 1));
    c.host = cljs.core.get.call(null, b, 2);
    c.facility = cljs.core.get.call(null, b, 3);
    c.level = cljs.core.get.call(null, b, 4);
    c.component = cljs.core.get.call(null, b, 5);
    c.pid = leech.parse.parse_long.call(null, cljs.core.get.call(null, b, 7));
    c.slot = cljs.core.get.call(null, b, 8);
    c.ion_id = leech.parse.parse_long.call(null, cljs.core.get.call(null, b, 9));
    c.cloud = cljs.core.get.call(null, b, 10);
    c.line = a;
    return new cljs.core.ObjMap(null, cljs.core.js_keys.call(null, c), c)
  }else {
    return null
  }
};
leech.parse.raw_re = /^(\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d[\-\+]\d\d:00) ([0-9\.]+) ([a-z0-7]+)\.([a-z]+) (.*)$/;
leech.parse.parse_raw_line = function(a) {
  var b = cljs.core.re_matches.call(null, leech.parse.raw_re, a);
  return cljs.core.truth_(b) ? cljs.core.ObjMap.fromObject("event_type,timestamp_src,host,facility,level,message,line".split(","), {event_type:"raw", timestamp_src:leech.parse.parse_timestamp.call(null, cljs.core.get.call(null, b, 1)), host:cljs.core.get.call(null, b, 2), facility:cljs.core.get.call(null, b, 3), level:cljs.core.get.call(null, b, 4), message:cljs.core.get.call(null, b, 5), line:a}) : null
};
leech.parse.nginx_access_re = /^(\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d-\d\d:00) ([0-9\.]+) ([a-z0-7]+)\.([a-z]+) nginx - ([a-z4-6-]+)?\.(\d+)@([a-z.]+\.com) - ([0-9\.]+) - - \[\d\d\/[a-zA-z]{3}\/\d\d\d\d:\d\d:\d\d:\d\d -\d\d00\] \"([a-zA-Z]+) (\S+) HTTP\/(...)\" (\d+) (\d+) \"([^\"]+)\" \"([^\"]+)\" (\S+)$/;
leech.parse.parse_nginx_access_line = function(a) {
  var b = cljs.core.re_matches.call(null, leech.parse.nginx_access_re, a);
  return cljs.core.truth_(b) ? cljs.core.ObjMap.fromObject("http_version,facility,level,host,http_user_agent,http_status,ion_id,http_bytes,line,cloud,http_referrer,http_method,http_url,http_domain,timestamp_src,component,slot,event_type,http_host".split(","), {http_version:cljs.core.get.call(null, b, 11), facility:cljs.core.get.call(null, b, 3), level:cljs.core.get.call(null, b, 4), host:cljs.core.get.call(null, b, 2), http_user_agent:cljs.core.get.call(null, b, 15), http_status:leech.parse.parse_long.call(null, 
  cljs.core.get.call(null, b, 12)), ion_id:leech.parse.parse_long.call(null, cljs.core.get.call(null, b, 6)), http_bytes:leech.parse.parse_long.call(null, cljs.core.get.call(null, b, 13)), line:a, cloud:cljs.core.get.call(null, b, 7), http_referrer:cljs.core.get.call(null, b, 14), http_method:cljs.core.get.call(null, b, 9), http_url:cljs.core.get.call(null, b, 10), http_domain:cljs.core.get.call(null, b, 16), timestamp_src:leech.parse.parse_timestamp.call(null, cljs.core.get.call(null, b, 1)), component:"nginx", 
  slot:cljs.core.get.call(null, b, 5), event_type:"nginx_access", http_host:cljs.core.get.call(null, b, 8)}) : null
};
leech.parse.nginx_error_re = /^(\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d-\d\d:00) ([0-9\.]+) ([a-z0-7]+)\.([a-z]+) nginx - ([a-z4-6]+)?\.(\d+)@([a-z.]+\.com) - .* \[error\] (.*)$/;
leech.parse.parse_nginx_error_line = function(a) {
  var b = cljs.core.re_matches.call(null, leech.parse.nginx_error_re, a);
  return cljs.core.truth_(b) ? cljs.core.ObjMap.fromObject("facility,level,message,host,ion_id,line,cloud,timestamp_src,component,slot,event_type".split(","), {facility:cljs.core.get.call(null, b, 3), level:cljs.core.get.call(null, b, 4), message:cljs.core.get.call(null, b, 8), host:cljs.core.get.call(null, b, 2), ion_id:leech.parse.parse_long.call(null, cljs.core.get.call(null, b, 6)), line:a, cloud:cljs.core.get.call(null, b, 7), timestamp_src:leech.parse.parse_timestamp.call(null, cljs.core.get.call(null, 
  b, 1)), component:"nginx", slot:cljs.core.get.call(null, b, 5), event_type:"nginx_error"}) : null
};
leech.parse.varnish_access_re = /^(\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d[\-+]\d\d:00) ([0-9\.]+) ([a-z0-7]+)\.([a-z]+) varnish\[(\d+)\] - ([a-z4-6\-]+)?\.(\d+)@([a-z.]+\.com) - [0-9\.]+ - - .*\" (\d\d\d) .*$/;
leech.parse.parse_varnish_access_line = function(a) {
  var b = cljs.core.re_matches.call(null, leech.parse.varnish_access_re, a);
  return cljs.core.truth_(b) ? cljs.core.ObjMap.fromObject("facility,level,host,http_status,pid,ion_id,line,cloud,timestamp_src,component,slot,event_type".split(","), {facility:cljs.core.get.call(null, b, 3), level:cljs.core.get.call(null, b, 4), host:cljs.core.get.call(null, b, 2), http_status:leech.parse.parse_long.call(null, cljs.core.get.call(null, b, 9)), pid:leech.parse.parse_long.call(null, cljs.core.get.call(null, b, 5)), ion_id:leech.parse.parse_long.call(null, cljs.core.get.call(null, b, 
  7)), line:a, cloud:cljs.core.get.call(null, b, 8), timestamp_src:leech.parse.parse_timestamp.call(null, cljs.core.get.call(null, b, 1)), component:"varnish", slot:cljs.core.get.call(null, b, 6), event_type:"varnish_access"}) : null
};
leech.parse.log = function(a) {
  return leech.util.log.call(null, cljs.core.merge.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'ns"], {"\ufdd0'ns":"parse"}), a))
};
leech.parse.parse_line = function(a) {
  try {
    var b = leech.parse.parse_nginx_access_line.call(null, a);
    if(cljs.core.truth_(b)) {
      return b
    }else {
      var c = leech.parse.parse_nginx_error_line.call(null, a);
      if(cljs.core.truth_(c)) {
        return c
      }else {
        var d = leech.parse.parse_varnish_access_line.call(null, a);
        if(cljs.core.truth_(d)) {
          return d
        }else {
          var e = leech.parse.parse_standard_line.call(null, a);
          return cljs.core.truth_(e) ? e : leech.parse.parse_raw_line.call(null, a)
        }
      }
    }
  }catch(f) {
    throw leech.parse.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'event", "\ufdd0'line", "\ufdd0'name", "\ufdd0'message"], {"\ufdd0'fn":"parse-line", "\ufdd0'event":"error", "\ufdd0'line":a, "\ufdd0'name":f.name, "\ufdd0'message":f.message})), f;
  }
};
leech.receive = {};
leech.receive.redis = cljs.nodejs.require.call(null, "redis-url");
leech.receive.log = function(a) {
  return leech.util.log.call(null, cljs.core.merge.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'ns"], {"\ufdd0'ns":"receive"}), a))
};
leech.receive.max_match_rate = 50;
leech.receive.compile_pred = function(a) {
  a = leech.parse.parse_message_attrs.call(null, a);
  return cljs.core.reduce.call(null, function(a, c) {
    var d = cljs.core.nth.call(null, c, 0, null), e = cljs.core.nth.call(null, c, 1, null), f = cljs.core.truth_(function() {
      var a = cljs.core.not.call(null, cljs.core.string_QMARK_.call(null, e));
      return cljs.core.truth_(a) ? a : cljs.core._EQ_.call(null, 1, cljs.core.count.call(null, clojure.string.split.call(null, e, ",")))
    }()) ? function() {
      var a = leech.parse.coerce_val.call(null, e);
      return function(b) {
        return cljs.core._EQ_.call(null, cljs.core.get.call(null, b, d), a)
      }
    }() : function() {
      var a = cljs.core.set.call(null, cljs.core.map.call(null, leech.parse.coerce_val, clojure.string.split.call(null, e, ",")));
      return function(b) {
        return cljs.core.contains_QMARK_.call(null, a, cljs.core.get.call(null, b, d))
      }
    }();
    return function(c) {
      var d = a.call(null, c);
      return cljs.core.truth_(d) ? f.call(null, c) : d
    }
  }, cljs.core.constantly.call(null, !0), a)
};
leech.receive.start_traps = function() {
  leech.receive.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"start-traps", "\ufdd0'at":"start"}));
  for(var a = cljs.core.seq.call(null, cljs.core.Vector.fromArray(["TERM", "INT"]));;) {
    if(cljs.core.truth_(a)) {
      var b = cljs.core.first.call(null, a);
      leech.util.trap.call(null, b, function() {
        return function() {
          leech.receive.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at", "\ufdd0'signal"], {"\ufdd0'fn":"start-traps", "\ufdd0'at":"catch", "\ufdd0'signal":b}));
          leech.receive.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at", "\ufdd0'status"], {"\ufdd0'fn":"start-traps", "\ufdd0'at":"exit", "\ufdd0'status":0}));
          return leech.util.exit.call(null, 0)
        }
      }(a));
      leech.receive.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at", "\ufdd0'signal"], {"\ufdd0'fn":"start-traps", "\ufdd0'at":"trapping", "\ufdd0'signal":b}));
      a = cljs.core.next.call(null, a)
    }else {
      break
    }
  }
  return leech.receive.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"start-traps", "\ufdd0'at":"finish"}))
};
leech.receive.start_watches = function(a, b, c) {
  leech.receive.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"start-watches", "\ufdd0'at":"start"}));
  leech.util.set_interval.call(null, 0, 1E3, function() {
    leech.receive.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"start-watches", "\ufdd0'at":"tick"}));
    var d = leech.watch.tick.call(null, b), e = cljs.core.nth.call(null, d, 0, null), d = cljs.core.nth.call(null, d, 1, null), f = leech.watch.tick.call(null, c), g = cljs.core.nth.call(null, f, 0, null), f = cljs.core.nth.call(null, f, 1, null);
    leech.receive.log.call(null, cljs.core.ObjMap.fromObject("\ufdd0'fn,\ufdd0'at,\ufdd0'received-count,\ufdd0'receive-rate,\ufdd0'published-count,\ufdd0'publish-rate".split(","), {"\ufdd0'fn":"start-watches", "\ufdd0'at":"watch-global", "\ufdd0'received-count":e, "\ufdd0'receive-rate":d, "\ufdd0'published-count":g, "\ufdd0'publish-rate":f}));
    for(e = cljs.core.seq.call(null, cljs.core.deref.call(null, a));;) {
      if(cljs.core.truth_(e)) {
        d = cljs.core.first.call(null, e), d = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, d)) ? cljs.core.apply.call(null, cljs.core.hash_map, d) : d, g = cljs.core.get.call(null, d, "\ufdd0'match-watch"), d = cljs.core.get.call(null, d, "\ufdd0'id"), f = leech.watch.tick.call(null, g), g = cljs.core.nth.call(null, f, 0, null), f = cljs.core.nth.call(null, f, 1, null), leech.receive.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at", "\ufdd0'search-id", "\ufdd0'matched-count", 
        "\ufdd0'match-rate"], {"\ufdd0'fn":"start-watches", "\ufdd0'at":"watch-search", "\ufdd0'search-id":d, "\ufdd0'matched-count":g, "\ufdd0'match-rate":f})), e = cljs.core.next.call(null, e)
      }else {
        return null
      }
    }
  });
  return leech.receive.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'event"], {"\ufdd0'fn":"start-watches", "\ufdd0'event":"finish"}))
};
leech.receive.start_searches = function(a, b) {
  leech.receive.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"start-searches", "\ufdd0'at":"start"}));
  b.on("ready", function() {
    leech.receive.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"start-searches", "\ufdd0'at":"readying"}));
    leech.util.set_interval.call(null, 0, 100, function() {
      leech.receive.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"start-searches", "\ufdd0'at":"tick"}));
      return b.zrangebyscore("searches", cljs.core._.call(null, leech.util.millis.call(null), 5E3), cljs.core._PLUS_.call(null, leech.util.millis.call(null), 5E3), function(b, d) {
        var e = cljs.core.map.call(null, cljs.reader.read_string, d), f = cljs.core.not_EQ_.call(null, cljs.core.map.call(null, "\ufdd0'id", cljs.core.deref.call(null, a)), cljs.core.map.call(null, "\ufdd0'id", e));
        leech.receive.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'event", "\ufdd0'changed", "\ufdd0'searches-count"], {"\ufdd0'fn":"start-searches", "\ufdd0'event":"poll", "\ufdd0'changed":f, "\ufdd0'searches-count":cljs.core.count.call(null, e)}));
        return cljs.core.truth_(f) ? (e = cljs.core.map.call(null, function(a) {
          var b = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, a)) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a, a = cljs.core.get.call(null, b, "\ufdd0'events-key"), c = cljs.core.get.call(null, b, "\ufdd0'target"), d = cljs.core.get.call(null, b, "\ufdd0'query"), b = cljs.core.get.call(null, b, "\ufdd0'id"), e = leech.watch.init.call(null), f = leech.receive.compile_pred.call(null, d);
          return cljs.core.ObjMap.fromObject("\ufdd0'id,\ufdd0'query,\ufdd0'target,\ufdd0'events-key,\ufdd0'match-watch,\ufdd0'match-pred".split(","), {"\ufdd0'id":b, "\ufdd0'query":d, "\ufdd0'target":c, "\ufdd0'events-key":a, "\ufdd0'match-watch":e, "\ufdd0'match-pred":f})
        }, e), cljs.core.swap_BANG_.call(null, a, cljs.core.constantly.call(null, e))) : null
      })
    });
    return leech.receive.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"start-searches", "\ufdd0'at":"ready"}))
  });
  return leech.receive.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"start-searches", "\ufdd0'at":"finish"}))
};
leech.receive.start_receivers = function(a, b, c, d) {
  leech.receive.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"start-receivers", "\ufdd0'at":"start"}));
  leech.io.start_bleeders.call(null, leech.conf.aorta_urls.call(null), function(e, f) {
    leech.watch.hit.call(null, c);
    for(var g = leech.parse.parse_line.call(null, f), h = cljs.core.seq.call(null, cljs.core.deref.call(null, a));;) {
      if(cljs.core.truth_(h)) {
        var i = cljs.core.first.call(null, h), j = cljs.core.truth_(cljs.core.seq_QMARK_.call(null, i)) ? cljs.core.apply.call(null, cljs.core.hash_map, i) : i, i = cljs.core.get.call(null, j, "\ufdd0'target"), k = cljs.core.get.call(null, j, "\ufdd0'match-watch"), l = cljs.core.get.call(null, j, "\ufdd0'match-pred"), j = cljs.core.get.call(null, j, "\ufdd0'events-key");
        if(cljs.core.truth_(l.call(null, g)) && (leech.watch.hit.call(null, k), k = leech.watch.rate.call(null, k), cljs.core.truth_(cljs.core._LT_.call(null, k, leech.receive.max_match_rate)))) {
          leech.watch.hit.call(null, d);
          k = cljs.core.pr_str.call(null, g);
          if(cljs.core.truth_(cljs.core._EQ_.call(null, "\ufdd0'list", i))) {
            b.rpush(j, k)
          }else {
            throw new java.lang.IllegalArgumentException(cljs.core.str.call(null, "No matching clause: ", i));
          }
          b.publish(j, k)
        }
        h = cljs.core.next.call(null, h)
      }else {
        return null
      }
    }
  });
  return leech.receive.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"start-receivers", "\ufdd0'at":"finish"}))
};
leech.receive.start = function() {
  leech.receive.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"start", "\ufdd0'at":"start"}));
  var a = leech.watch.init.call(null), b = leech.watch.init.call(null), c = cljs.core.atom.call(null, null), d = leech.receive.redis.createClient(leech.conf.redis_url.call(null));
  leech.receive.start_traps.call(null);
  leech.receive.start_watches.call(null, c, a, b);
  leech.receive.start_searches.call(null, c, d);
  leech.receive.start_receivers.call(null, c, d, a, b);
  return leech.receive.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"start", "\ufdd0'at":"finish"}))
};
leech.util.main.call(null, "receive", leech.receive.start);
leech.tail = {};
leech.tail.redis = cljs.nodejs.require.call(null, "redis-url");
leech.tail.node_uuid = cljs.nodejs.require.call(null, "node-uuid");
leech.tail.color_codes = cljs.core.ObjMap.fromObject("\ufdd0'red,\ufdd0'green,\ufdd0'yellow,\ufdd0'blue,\ufdd0'magenta,\ufdd0'cyan,\ufdd0'default".split(","), {"\ufdd0'red":"\u001b[31m", "\ufdd0'green":"\u001b[32m", "\ufdd0'yellow":"\u001b[33m", "\ufdd0'blue":"\u001b[34m", "\ufdd0'magenta":"\u001b[35m", "\ufdd0'cyan":"\u001b[36m", "\ufdd0'default":"\u001b[39m"});
leech.tail.component_colors = cljs.core.ObjMap.fromObject("su,pgmonitor,apolo,heroku,hermes,codex,memcache,syslog-ng,logplex,psmgr,varnish,syslog,runtime,nginx,slapd,gitproxy,kernel,face,balrog,shen,core".split(","), {su:"\ufdd0'cyan", pgmonitor:"\ufdd0'red", apolo:"\ufdd0'blue", heroku:"\ufdd0'cyan", hermes:"\ufdd0'blue", codex:"\ufdd0'yellow", memcache:"\ufdd0'green", "syslog-ng":"\ufdd0'cyan", logplex:"\ufdd0'blue", psmgr:"\ufdd0'magenta", varnish:"\ufdd0'blue", syslog:"\ufdd0'cyan", runtime:"\ufdd0'magenta", 
nginx:"\ufdd0'blue", slapd:"\ufdd0'cyan", gitproxy:"\ufdd0'yellow", kernel:"\ufdd0'cyan", face:"\ufdd0'blue", balrog:"\ufdd0'green", shen:"\ufdd0'red", core:"\ufdd0'green"});
leech.tail.colored = function(a, b) {
  return cljs.core.str.call(null, leech.tail.color_codes.call(null, a), b, leech.tail.color_codes.call(null, "\ufdd0'default"))
};
leech.tail.log = function(a) {
  return leech.util.log.call(null, cljs.core.merge.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'ns"], {"\ufdd0'ns":"tail"}), a))
};
leech.tail.start_traps = function() {
  leech.tail.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"start-traps", "\ufdd0'at":"start"}));
  for(var a = cljs.core.seq.call(null, cljs.core.Vector.fromArray(["TERM", "INT"]));;) {
    if(cljs.core.truth_(a)) {
      var b = cljs.core.first.call(null, a);
      leech.util.trap.call(null, b, function() {
        return function() {
          leech.tail.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at", "\ufdd0'signal"], {"\ufdd0'fn":"start-traps", "\ufdd0'at":"catch", "\ufdd0'signal":b}));
          leech.tail.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at", "\ufdd0'status"], {"\ufdd0'fn":"start-traps", "\ufdd0'at":"exit", "\ufdd0'status":0}));
          return leech.util.exit.call(null, 0)
        }
      }(a));
      leech.tail.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at", "\ufdd0'signal"], {"\ufdd0'fn":"start-traps", "\ufdd0'at":"trapping", "\ufdd0'signal":b}));
      a = cljs.core.next.call(null, a)
    }else {
      break
    }
  }
  return leech.tail.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"start-traps", "\ufdd0'at":"finish"}))
};
leech.tail.start_search = function(a, b) {
  leech.tail.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"start-search", "\ufdd0'at":"start"}));
  a.on("ready", function() {
    leech.tail.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"start-search", "\ufdd0'at":"readying"}));
    leech.util.set_interval.call(null, 0, 1E3, function() {
      leech.tail.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"start-search", "\ufdd0'at":"tick"}));
      return a.zadd("searches", leech.util.millis.call(null), b, function() {
        return leech.tail.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"start-search", "\ufdd0'at":"post"}))
      })
    });
    return leech.tail.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at", "\ufdd0'search-id"], {"\ufdd0'fn":"start", "\ufdd0'at":"ready", "\ufdd0'search-id":leech.tail.search_id}))
  });
  return leech.tail.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"start-search", "\ufdd0'at":"finish"}))
};
leech.tail.start_stream = function(a, b) {
  leech.tail.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"start-stream", "\ufdd0'at":"start"}));
  a.on("ready", function() {
    leech.tail.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"start-stream", "\ufdd0'at":"readying"}));
    a.subscribe(b);
    a.on("subscribe", function() {
      return leech.tail.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'event"], {"\ufdd0'fn":"start-stream", "\ufdd0'event":"subscribed"}))
    });
    a.on("message", function(a, b) {
      var e = cljs.reader.read_string.call(null, b), f = cljs.core.get.call(null, leech.tail.component_colors, cljs.core.get.call(null, e, "component"), "\ufdd0'default");
      return cljs.core.println.call(null, leech.tail.colored.call(null, f, cljs.core.get.call(null, e, "line")))
    });
    return leech.tail.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"start-stream", "\ufdd0'at":"ready"}))
  });
  return leech.tail.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"start-stream", "\ufdd0'at":"start"}))
};
leech.tail.start = function() {
  leech.tail.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"start", "\ufdd0'at":"start"}));
  var a = leech.tail.node_uuid.call(null), b = clojure.string.join.call(null, " ", cljs.core.drop.call(null, 3, leech.util.argv.call(null))), c = cljs.core.str.call(null, "searches.", a, ".events"), a = cljs.core.ObjMap.fromObject(["\ufdd0'id", "\ufdd0'query", "\ufdd0'events-key", "\ufdd0'target"], {"\ufdd0'id":a, "\ufdd0'query":b, "\ufdd0'events-key":c, "\ufdd0'target":"\ufdd0'publish"});
  cljs.core.pr_str.call(null, a);
  leech.tail.redis.createClient(leech.conf.redis_url.call(null));
  leech.tail.redis.createClient(leech.conf.redis_url.call(null));
  leech.tail.start_traps.call(null);
  leech.tail.start_stream.call(null);
  return leech.tail.log.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'fn", "\ufdd0'at"], {"\ufdd0'fn":"start", "\ufdd0'at":"finish"}))
};
leech.util.main.call(null, "tail", leech.tail.start);
cljs.nodejscli = {};
cljs.core.apply.call(null, cljs.core._STAR_main_cli_fn_STAR_, cljs.core.drop.call(null, 2, cljs.nodejs.process.argv));

