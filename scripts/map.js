var geocoder;
var map;
var markers = [];

    function init() {

      // Google Mapで利用する初期設定用の変数
      geocoder = new google.maps.Geocoder();
      var latlng = new google.maps.LatLng(39, 140);
      var opts = {
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: latlng
      };

      // getElementById("map")の"map"は、body内の<div id="map">より
      map = new google.maps.Map(document.getElementById("map"), opts);
    }

    // 中心位置を変更する
    function changeCenter( city ) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': city}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
      	clearMarker();
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
        markers.push(marker);
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
    }
    
function clearMarker() {
  markers.forEach( function( marker, idx ) {
  	  marker.setMap(null);
  });
}

function heatmapLayer( rows, label ) {
  var heats = [];
  for(var i = 0; i < rows.length; i++) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': rows[i].city}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
      	  var row = rows[i];
      	  heats.push({
      	    location: results[0].geometry.location,
      	    weight: rows[i][label]
      	  });
      }
    });
  }
  var heatmap = new google.maps.visualization.HeatmapLayer({
    radius: 25
  });
  heatmap.setData(heats);
  heatmap.setMap(map);
}