console.log('logic-1.js loaded');

var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

d3.json(url).then(response => {
    console.log(response);

    // Extract feature data
    var markers = response.features;

    createMap(markers);
});


function createMap(markers){
    var myMap = L.map("map-id", {
        center: [40, 0],
        zoom: 2.5
      });
      
      L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
      }).addTo(myMap);

    // Loop through markers to format and then add them to map
    markers.forEach(marker => {
        // Format the size of the marker to reflect magnitude
        var circleRadius = (marker.properties.mag * 30000);
        var circleDepth = marker.geometry.coordinates[2];
        var circleLocation = [marker.geometry.coordinates[1], marker.geometry.coordinates[0]];
        var popUpText = marker.properties.place;
        
        // Add circle marker to map
        L.circle(circleLocation, {
            fillOpacity: '80%',
            fillColor: chooseColor(circleDepth),
            radius: circleRadius,
            weight: 2,
            color: 'black'
        }).bindPopup("<h2>" + popUpText + "</h2><br><h3>Magnitude: " + circleRadius + "</h3>" +
            "<br><h3>Depth: " + circleDepth + "</h3>").addTo(myMap);

    });

    // Add a legend
    var legend = L.control({position: "bottomleft"});
    legend.onAdd = function(){
        var div = L.DomUtil.create("div", "info legend");
        var grades = [-10, 30, 50, 70, 90];
        var labels = [];
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
    
        return div;
    }
    legend.addTo(myMap);
      
}


function chooseColor(depth) {
    switch(true) {
        case (depth < 30): return '#00FFFF';
            break;
        case (depth < 50): return '#00BFFF';
            break;
        case (depth < 70): return '#0000FF';
            break;
        case (depth < 90): return '#191970';
            break;
        case (depth >= 90): return '#000080';
            break;
        default:
            return 'Not valid';
    }

}