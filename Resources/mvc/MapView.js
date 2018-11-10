exports.createMapView = function (win) {
  // Map bounds
  var bounds = [[35.773958, -78.798776],
                [35.796304, -78.761682]];
  // Create the map
  var Map = require('ti.map');
  var mapView = Map.createView({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    mapType: Map.NORMAL_TYPE,
    region: {
      latitude: 35.784956,
      longitude: -78.781237,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02
    },
    showPointsOfInterest: true,
    showsTraffic: true,
    animate: true,
    regionFit: true,
    // userLocation: true,
    annotations: []
  });
  win.add(mapView);

  // Acquire first mapCenter coordinate
  var mapCenter = mapView.center;

  // Adding Listener for Lat and Long change to set map bounds.
  mapView.addEventListener('regionchanged', function(e){

      console.log("Latitude changed to " + e.latitude);
      console.log("Longitude changed to " + e.longitude);

  });
  // Add Global Event Listeners
  Ti.App.addEventListener('UpdateParkingLots', function (json) {
    // Updates the parking lots on the map
    console.log(JSON.stringify(json));
    if (json !== undefined && json.features) {
      console.log("Found features...");
      var polygonData = [];
      for (var i = 0; i < json.features.length; i++) {
        console.log("Feature " + i);
        var record = json.features[i];
        if (record.geometry && record.geometry.coordinates) {
          var coordinates = record.geometry.coordinates[0];
          var points = [];
          for (var j = 0; j < coordinates.length; j++) {
            console.log("Coordinate: " + j);
            var point = {
              latitude: coordinates[j][1],
              longitude: coordinates[j][0]
            };
            points.push(point);
          }
          var polygon = Map.createPolygon({
            points: points,
            strokeColor: '#000000',
            fillColor: '#0090BB',
            strokeWidth: 1
          });

          // @todo Store the record and access to the polygon

          if (Ti.UI.Android) {
            mapView.addPolygon(polygon);
          } else {
            polygonData.push(polygon);
          }
        }
      }
      if (!Ti.UI.Android) {
        mapView.addPolygons(polygonData);
      }
    }
  });

  return mapView;
};
