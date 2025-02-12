var map = L.map('mapid').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);


// this will add a marker to the map
var marker = L.marker([51.5, -0.09]).addTo(map);

// this will add a circle to a map with the given parameters
var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);

// this will add a polygon to the map with the given parameters 
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map);

// attaches a popup to a layer and opens it up right away
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
// attaches popup to the circle
circle.bindPopup("I am a circle.");
// attaches popup to the polygon
polygon.bindPopup("I am a polygon.");

// this creates a standalone popup with the location and parameters given
var popup = L.popup()
    .setLatLng([51.513, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(map);

    // responds to the click event with lat and lon
    function onMapClick(e) {
        alert("You clicked the map at " + e.latlng);
    }
    
    map.on('click', onMapClick);

    var popup = L.popup();

    // adds the string to the popup
    function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

    map.on('click', onMapClick);