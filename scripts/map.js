var geocoder;
var map;
var heatmap;
var markers = [];
var city_location = [];
var url_city = "citieslatlng.csv";

function init() {
  // 初期位置
  var latlng = new google.maps.LatLng(43.063968,141.347899);
  var opts = {
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: latlng
  };
  map = new google.maps.Map(document.getElementById("map"), opts);
}

// load latitude and longitude of all cities in Japan
function loadCities() {
  // header definition
  var field_label = {
      datatype: "csv",
      datafields: [
      	  { name: 'id', type: 'text' },
      	  { name: 'city', type: 'text' },
      	  { name: 'lat', type: 'float' },
      	  { name: 'lng', type: 'float' }
      ], url: "csv/" + url_city,
      async: false // Asyncronous Reading
  };
  	  
  // CSV load
  var dataAdapter_fld = new $.jqx.dataAdapter(field_label, {
    autoBind: true,
    beforeLoadComplete: function (records) {
      for (var i = 0; i < records.length; i++) {
      	var record = records[i];
        var obj = { 
          id: records[i].id,
          city: records[i].city,
          location: new google.maps.LatLng(records[i].lat, records[i].lng)
        };
        city_location.push( obj );
      }
    }
  });

}

// 中心位置を変更する
function changeCenter( city ) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode( { 'address': city}, function(results, status) {
  if (status == google.maps.GeocoderStatus.OK) {
//    clearMarker();
    map.setCenter(results[0].geometry.location);
//    var marker = new google.maps.Marker({
//      map: map,
//      position: results[0].geometry.location
//    });
//    markers.push(marker);
  } else {
      }
  });
}

function clearMarker() {
  markers.forEach( function( marker, idx ) {
  	  marker.setMap(null);
  });
}

function heatmapLayer( target ) {
  var heats = [];
  clearMarker();
  if( heatmap ) {
  	  heatmap.setMap(null);
  	  delete heatmap;
  }
  
  // rows form grid
  var rows = $('#jqxgrid').jqxGrid('getrows');
  for( var idx in rows ) {
    var city = rows[idx].city;
    var weight = rows[idx][target] / 2;
    for( var i in city_location ) {
      if( city_location[i].city == city ) {
        heats.push({
          location: city_location[i].location,
          weight: weight
        });
        // marker
        var marker = new google.maps.Marker({
          cursor: idx,
          title: city,
          visible: false,
          map: map,
          position: city_location[i].location
          });
        markers.push(marker);

        break; 
      }
    }
  
  }

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: heats,
    radius: 40
  });
  heatmap.setMap(map);
}

