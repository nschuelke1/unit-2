// Create a function to attach popups to each mapped feature
function onEachFeature(feature, layer) {
    // Create HTML string with all properties
    var popupContent = "";
    if (feature.properties) {
        // Loop to add feature property names and values to HTML string
        for (var property in feature.properties){
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    }
}

// Define marker options for GeoJSON point features
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

// Function to retrieve the data and place it on the map
function getData(map){
    // Load the data
    fetch("data/StatePopChange.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            // Create a Leaflet GeoJSON layer and add it to the map
            L.geoJSON(json, {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                },
                onEachFeature: onEachFeature
            }).addTo(map);
        });
}

// Function to instantiate the Leaflet map
function createMap() {
    // Create the map and center it over the United States with zoom level 4
    var map = L.map('mapid').setView([37.0902, -95.7129], 4);

    // Add OSM base tilelayer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Load the StatePop data and add it to the map
    getData(map);
}

// Ensure `createMap` is called once DOM is fully loaded
document.addEventListener('DOMContentLoaded', createMap);
