var airports = L.layerGroup();
const icon = L.icon;
var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
var grayscale = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', attribution: mbAttr}),
    streets = L.tileLayer(mbUrl, {id: 'mapbox/streets-v11', attribution: mbAttr});
var additional_attrib = 'created by '
    + '<a href="http://www.cityplanner.it" target ="_blank">'
    + 'CityPlanner'
    + '</a><br>';

var basemap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoicGpob29rZXIiLCJhIjoiUllwRXNldyJ9.-wSBKOCm_XUxGiM1yWLxPQ',
    {
        attribution: additional_attrib
            + 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, '
            + '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
            + '<br>Imagery © <a href="https://mapbox.com">Mapbox</a>',
        // USE YOUR MAPBOX TOKEN !!!
        id: 'pjhooker.lad5pfap'
    });

var map = L.map('Map', {
    center: [53, -6.2603],
    zoom: 6,
    layers: [streets, airports]
});
const airportIcon = L.icon({
    iconUrl: '/images/airportIcon.png',
    iconSize: [15, 15], // size of the icon
    iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
});
for (let x in airportsData) {
    L.marker([airportsData[x].latitude, airportsData[x].longitude], {icon: airportIcon}).addTo(airports)
        .bindPopup(
            '<button class="nameButton" value="' + airportsData[x].name + '" onclick="openNav(this.value)">' + airportsData[x].name + '</button><br>' +
            '<label>City:</label>' + " " + airportsData[x].city + ' <br> ' +
            '<label>Country:</label>' + " " + airportsData[x].country + ' <br> ' +
            '<label>Latitude:</label>' + " " + airportsData[x].latitude + ' <br> ' +
            '<label>Longitude:</label>' + " " + airportsData[x].longitude + ' <br> ' +
            '<label>altitude:</label>' + " " + airportsData[x].altitude + "m" + '<br>')
}
var baseLayers = {
    "Basic": streets,
    "Grayscale": grayscale,
    "Satellite": basemap,
};
var overlays = {
    "Airports": airports
};
L.control.layers(baseLayers, overlays).addTo(map);