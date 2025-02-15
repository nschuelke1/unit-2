// Declare map variable globally so all functions have access
var map;
var minValue;

// Step 1: Create the map
function createMap() {
    // Create the map and center it over the United States with zoom level 4
    map = L.map('mapid').setView([37.0902, -95.7129], 4);

    // Add OSM base tilelayer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Call getData function for the year 2013
    getData(map, "2013");
}

// Step 1: Create new sequence controls
function createSequenceControls() {
    // Create range input element (slider)
    var slider = "<input class='range-slider' type='range'></input>";
    document.querySelector("#panel").insertAdjacentHTML('beforeend', slider);

    // Set slider attributes
    var sliderElement = document.querySelector(".range-slider");
    sliderElement.max = 6;
    sliderElement.min = 0;
    sliderElement.value = 0;
    sliderElement.step = 1;

    // Add event listener to update the map based on slider input
    sliderElement.addEventListener('input', function() {
        var yearIndex = this.value;
        var year = 2013 + parseInt(yearIndex); // Calculate the corresponding year
        updateMap(map, year);
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
    var minRadius = 5;
    // Flannery Appearance Compensation formula
    var radius = 1.0083 * Math.pow(attValue / minValue, 0.5715) * minRadius;
    
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

// Step 4: Update the map based on the selected year
function updateMap(map, year) {
    var attribute = year.toString();

    // Load the data
    fetch("data/StatePopChange.geojson")
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            // Clear existing layers
            map.eachLayer(function(layer) {
                if (layer instanceof L.GeoJSON) {
                    map.removeLayer(layer);
                }
            });
            // Call function to create proportional symbols
            createPropSymbols(json, attribute);
        });
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
            // Call function to create sequence controls
            createSequenceControls();
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
