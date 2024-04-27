document.addEventListener("DOMContentLoaded", function() {
    var earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
  
    fetch(earthquakeData).then(response => response.json()).then(data => {
      var features = data.features;
      var mostRecentEarthquake = features[0];
      document.getElementById("last-earthquake-date").innerText = formatDate(mostRecentEarthquake.properties.time);
      document.getElementById("last-updated").innerText = formatDate(data.metadata.generated);
    });
  
    function formatDate(timeInMillis) {
      var date = new Date(timeInMillis);
      return date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + " at " + date.toLocaleTimeString("en-US");
    }
  });