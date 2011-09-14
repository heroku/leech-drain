var leechQuery = "";
var leechSearchId = "";

function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
function uuid() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

function leechInflate(ev) {
  return "<p class=\"runtime\">" + ev.line + "</p>";
}

function leechApply(evs) {
  var results = $("#results");
  $.each(evs, function(i, ev) {
    console.log(JSON.stringify(ev));
    results.append(leechInflate(ev));
  });
}

function leechUpdate() {
  if (leechSearchId != "") {
    $.ajax({
      data: {"search-id": leechSearchId, "query": leechQuery},
      dataType: "json",
      type: "GET",
      url: "/search",
      success: function(data, status, xhr) {
        leechApply(data);
      }
    });
  }
}

function leechSubmit() {
  var leechQueryNew = $("#query input").val();
  if (leechQueryNew.match(/^\s*$/)) {
    leechQuery = leechQueryNew;
    leechSearchId = "";
    $("#results").empty();
  } else if (leechQueryNew != leechQuery) {
    leechQuery = leechQueryNew;
    leechSearchId = uuid();
    $("#results").empty();
    leechUpdate();
  }
  return false;
}

function leechStart() {
  $("#query form").ajaxForm({beforeSubmit: leechSubmit});
  leechUpdate();
  setInterval(leechUpdate, 300);
}

$(document).ready(leechStart);
