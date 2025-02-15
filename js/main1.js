// Declare map variable globally so all functions have access
var map;
var minValue;

// Define an array of years from 2013 to 2019
var years = [2013, 2014, 2015, 2016, 2017, 2018, 2019];

// Step 1: Create the map
function createMap() {
    // Create the map and center it over the United States with zoom level 4
    map = L.map('mapid').setView([37.0902, -95.7129], 4);

    // Add OSM base tilelayer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Call getData function for each year
    years.forEach(function(year) {
        getData(map, year.toString());
    });
}

// Calculate the minimum value of the data
function calculateMinValue(data, attribute) {
    // Create empty array to store all data values
    var allValues = [];
    
    // Loop through each feature
    for (var feature of data.features) {
        // Get the value for the specified year and parse it as a number
        var value = feature.properties[attribute];
        // Add value to array if it's a valid number
        if (!isNaN(value)) {
            allValues.push(value);
        }
    }
    
    // Get minimum value of our array
    var minValue = Math.min(...allValues);
    
    return minValue;
}

// Calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    // Constant factor adjusts symbol sizes evenly
    var minRadius = 10;  // Increase the base size of the markers
    // Flannery Appearance Compensation formula with a larger scaling factor
    var radius = 2 * Math.pow(attValue / minValue, 0.5715) * minRadius;
    
    return radius;
}

// Step 3: Add circle markers for point features to the map
function createPropSymbols(data, attribute) {
    // Calculate minimum data value for the specified year
    minValue = calculateMinValue(data, attribute);

    // Create marker options
    var geojsonMarkerOptions = {
        fillColor: "#ff7800",
        color: "#fff",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            // For each feature, determine its value for the selected attribute and parse it as a number
            var attValue = feature.properties[attribute];

            // Check if attValue is a valid number
            if (isNaN(attValue)) {
                attValue = 0; // Set to a default value if invalid
            }

            // Give each feature's circle marker a radius based on its attribute value
            geojsonMarkerOptions.radius = calcPropRadius(attValue);

            // Create circle markers
            return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        onEachFeature: onEachFeature
    }).addTo(map);
}

// Step 2: Import GeoJSON data
function getData(map, attribute) {
    // Load the data
    fetch("data/StatePopChange.geojson")
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            // Call function to create proportional symbols
            createPropSymbols(json, attribute);
        });
}

// Ensure createMap is called once DOM is fully loaded
document.addEventListener('DOMContentLoaded', createMap);

// Create a function to attach popups to each mapped feature
function onEachFeature(feature, layer) {
    // Create HTML string with all properties
    var popupContent = "";
    if (feature.properties) {
        // Loop to add feature property names and values to HTML string
        for (var property in feature.properties) {
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    }
}
