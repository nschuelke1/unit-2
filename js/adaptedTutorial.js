// Define a GeoJSON feature
var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};

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
    fetch("data/MegaCities.geojson")
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
    // Create the map
    var map = L.map('mapid').setView([51.505, -0.09], 13);

    // Add OSM base tilelayer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add the GeoJSON feature to the map
    L.geoJSON(geojsonFeature).addTo(map);

    // Arrays of LineStrings with coordinates
    var myLines = [{
        "type": "LineString",
        "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
    }, {
        "type": "LineString",
        "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
    }];

    var myLayer = L.geoJSON().addTo(map);
    myLayer.addData(geojsonFeature);

    // Define a style for the LineStrings
    var myStyle = {
        "color": "#ff7800",
        "weight": 5,
        "opacity": 0.65
    };

    L.geoJSON(myLines, {
        style: myStyle
    }).addTo(map);

    // Define states as polygon features with styles based on political party
    var states = [{
        "type": "Feature",
        "properties": {"party": "Republican"},
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [-104.05, 48.99],
                [-97.22, 48.98],
                [-96.58, 45.94],
                [-104.03, 45.94],
                [-104.05, 48.99]
            ]]
        }
    }, {
        "type": "Feature",
        "properties": {"party": "Democrat"},
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [-109.05, 41.00],
                [-102.06, 40.99],
                [-102.03, 36.99],
                [-109.04, 36.99],
                [-109.05, 41.00]
            ]]
        }
    }];

    L.geoJSON(states, {
        style: function(feature) {
            switch (feature.properties.party) {
                case 'Republican': return {color: "#ff0000"};
                case 'Democrat':   return {color: "#0000ff"};
            }
        }
    }).addTo(map);

    // Add the `geojsonFeature` to the map with `pointToLayer` and `onEachFeature`
    L.geoJSON(geojsonFeature, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        onEachFeature: onEachFeature
    }).addTo(map);

    // Filter features from the map
    var someFeatures = [{
        "type": "Feature",
        "properties": {
            "name": "Coors Field",
            "show_on_map": true
        },
        "geometry": {
            "type": "Point",
            "coordinates": [-104.99404, 39.75621]
        }
    }, {
        "type": "Feature",
        "properties": {
            "name": "Busch Field",
            "show_on_map": false
        },
        "geometry": {
            "type": "Point",
            "coordinates": [-104.98404, 39.74621]
        }
    }];

    L.geoJSON(someFeatures, {
        filter: function(feature, layer) {
            return feature.properties.show_on_map;
        }
    }).addTo(map);

    // Load the MegaCities data and add it to the map
    getData(map);
}

// Ensure `createMap` is called once DOM is fully loaded
document.addEventListener('DOMContentLoaded', createMap);
