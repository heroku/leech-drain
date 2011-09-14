function leechGet(searchId, fun) {
  jQuery.ajax({
    url: "/searches/" + searchId " /events";
    type: "GET",
    dataType: "json",
    success: function(data, status, xhr) { fun(data); } });
}


function leechUpdate() {
  pulseGet(leechSearchId, function(events) {
    var results = $("#results");
    for (var ev in events) {
      results.append(ev);
    }
  });
}

function leechStart() {
  leechUpdate();
  setInterval(leechUpdate, 200);
}

$(document).ready(leechStart);
