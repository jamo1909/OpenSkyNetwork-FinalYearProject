var trip = L.layerGroup();
var token = "aa3ebd6aab71743de4b90ba32e545cee0865be78";
var plane = {
    name: document.getElementById("planeName").textContent,
    lat: document.getElementById("planeLong").textContent,
    long: document.getElementById("planeLat").textContent
};
var originAirport = {
    name: document.getElementById("originName").textContent,
    lat: document.getElementById("originLat").textContent,
    long: document.getElementById("originLong").textContent
};
var destinationAirport = {
    name: document.getElementById("destinationName").textContent,
    lat: document.getElementById("destinationLat").textContent,
    long: document.getElementById("destinationLong").textContent
};


var x;
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
    layers: [streets, trip]
});
const planeIcon = L.icon({
    iconUrl: '/images/planeIcon.png',
    iconSize: [25, 25], // size of the icon
    iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
});

const airportIcon = L.icon({
    iconUrl: '/images/airportIcon.png',
    iconSize: [25, 25], // size of the icon
    iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
});


L.marker([originAirport.lat, originAirport.long], {icon: airportIcon}).bindPopup(originAirport.name).addTo(trip);
L.marker([destinationAirport.lat, destinationAirport.long], {icon: airportIcon}).bindPopup(destinationAirport.name).addTo(trip);
L.marker([plane.long, plane.lat], {icon: planeIcon}).bindPopup(plane.name).addTo(trip);

var arrayOfMarkers = [[originAirport.lat, originAirport.long], [destinationAirport.lat, destinationAirport.long], [plane.long, plane.lat]];
var bounds = new L.LatLngBounds(arrayOfMarkers);
map.fitBounds(bounds);

var pointA = new L.LatLng(originAirport.lat, originAirport.long);
var pointB = new L.LatLng(plane.long, plane.lat);
var pointC = new L.LatLng(destinationAirport.lat, destinationAirport.long);
var pointList = [pointA, pointB, pointC];

var firstpolyline = new L.Polyline(pointList, {
    color: 'red',
    weight: 3,
    opacity: 0.5,
    smoothFactor: 1
});
firstpolyline.addTo(map);

var baseLayers = {
    "Streets": streets,
    "Grayscale": grayscale,
    "Satellite": basemap

};
var overlays = {
    "Trip": trip
};
L.control.layers(baseLayers, overlays).addTo(map);

