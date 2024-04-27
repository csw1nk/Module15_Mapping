document.addEventListener("DOMContentLoaded", function() {
    var map = L.map('map').setView([37.8, -96], 4); 
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
  
    var earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
  
    d3.json(earthquakeData).then(function(data) {
      function styleInfo(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: getColor(feature.geometry.coordinates[2]), 
          color: "#000000",
          radius: getRadius(feature.properties.mag),
          stroke: true,
          weight: 0.5
        };
      }
  
      function getColor(depth) {
        return depth > 90 ? "#ea2c2c" :
               depth > 70 ? "#ea822c" :
               depth > 50 ? "#ee9c00" :
               depth > 30 ? "#eecc00" :
               depth > 10 ? "#d4ee00" :
                            "#98ee00";
      }
  
      function getRadius(magnitude) {
        return magnitude === 0 ? 1 : magnitude * 4;
      }
  
      function formatDate(timeInMillis) {
        var date = new Date(timeInMillis);
        return date.toUTCString(); // Converts the date to a readable format in UTC
    }
    
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function(feature, layer) {
            var popupContent = "<h3>Magnitude: " + feature.properties.mag + "</h3>" +
                               "<h4>Location: " + feature.properties.place + "</h4>" +
                               "<ul><li>Depth: " + feature.geometry.coordinates[2] + " km</li>" +
                               "<li>Time: " + formatDate(feature.properties.time) + "</li></ul>" +
                               "<a href='" + feature.properties.url + "' target='_blank'>More info</a>";
    
            layer.bindPopup(popupContent);
        }
    }).addTo(map);
    
  
      var legend = L.control({position: 'bottomright'});
  
      legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            depths = [0, 10, 30, 50, 70, 90],
            labels = [];
  
        div.innerHTML += '<strong>Depth (km)</strong><br>';
        for (var i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depths[i] + 1) + '">&nbsp;&nbsp;</i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }
  
        return div;
      };
  
      legend.addTo(map);
    });
  });