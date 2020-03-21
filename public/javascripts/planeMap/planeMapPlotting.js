var airplanes = L.layerGroup();
var demo = L.layerGroup();

var bool = false;
const unixTime = {
    now: 0,
    hourBehind: 0,
    twoHoursBehind: 0
};
var offSiteX = -0.00001532;
var offSiteY = 0.00005708;

function fetchData() {
    getCurrentTimeInUnix();
    return fetch("https://opensky-network.org/api/states/all?begin=" + unixTime.hourBehind + "&end=" + unixTime.twoHoursBehind)
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            return res.states.filter((state) => {
                return (state[2])
                    && (state[5]) && (state[6]);
            });
        })
        .catch((err) => {
            if (err) throw err
        })
}

function plotStates(map, markers) {
    fetchData().then(function (states) {
        states.forEach((state) => {
            var airport = getAirports(state[0]);

                const lat = state[6],
                    lng = state[5],
                    icao24 = state[0],
                    velocity = state[9],
                    country = state[2];

                if (markers[icao24]) {
                    markers[icao24].setLatLng([lat, lng]);
                } else {
                    markers[icao24] = L.marker([lat, lng], {icon: airportIcon});
                    if (country == 'Ireland') {
                        markers[icao24].addTo(airplanes)
                            .bindPopup('<form action="/planeEmissions" method="post">' +
                                'ICAO Code: <input type="text" id="name" name="icaocode" value="' + icao24 + '" readonly><br>' +
                                'Lat: <input type="text" id="name" name="lat" value="' + lat + '" readonly><br>' +
                                'Long: <input type="text" id="name" name="long" value="' + lng + '" readonly><br>' +
                                'velocity: ' + velocity + 'm/s <br>' +
                                'Country: ' + country + ' <br> <br>' +
                                ' <button >Emissions</button></form>')
                    } else {
                        markers[icao24].addTo(demo)
                            .bindPopup('<form action="/planeEmissions" method="post">' +
                                'ICAO Code: <input type="text" id="name" name="icaocode" value="' + icao24 + '" readonly><br>' +
                                'Lat: <input type="text" id="name" name="lat" value="' + lat + '" readonly><br>' +
                                'Long: <input type="text" id="name" name="long" value="' + lng + '" readonly><br>' +
                                'velocity: ' + velocity + 'm/s <br>' +
                                ' <button >Emissions</button></form>')
                    }
                }

        });


        if (bool == false) {
            var baseLayers = {
                "Streets": streets,
                "Grayscale": grayscale,
                "Satellite": basemap,
            };

            var overlays = {
                "Airplanes": airplanes,
                "Demo All Planes": demo,
            };
            L.control.layers(baseLayers, overlays).addTo(map);
            bool = true;
            setTimeout(() => plotStates(map, markers), 3000);
        } else {
            setTimeout(() => plotStates(map, markers), 3000);
        }
    });

}

async function getAirports(planeIcao) {
    let airport = {
        arrival: "",
        destination: ""
    };
    var unixTime = getCurrentTimeInUnix();
    console.log(planeIcao);
    const airport_url = "https://opensky-network.org/api/flights/aircraft?icao24=" + planeIcao + "&begin=" + parseInt(unixTime.twoHoursBehind) + "&end=" + parseInt(unixTime.now);
    console.log(airport_url);
    const response = await fetch(airport_url);
    const data = await response.json();
    if (data[0].estArrivalAirport == null || data[0].estDepartureAirport == null) {
        airport.arrival = data[1].estArrivalAirport;
        airport.destination = data[1].estDepartureAirport;
    } else {
        console.log(data[0]);
        airport.arrival = data[0].estArrivalAirport;
        airport.destination = data[0].estDepartureAirport;
    }
    return airport;
}

function getCurrentTimeInUnix() {
    let myDate = new Date();
    unixTime.now = myDate.getTime() / 1000.0;
    // console.log("UnixTime.now: " + unixTime.now);
    myDate.setHours(myDate.getHours() - 1);
    unixTime.hourBehind = myDate.getTime() / 1000.0;
    // console.log("UnixTime.hourBehind: " + unixTime.hourBehind);
    myDate.setHours(myDate.getHours() - 2);
    unixTime.twoHoursBehind = myDate.getTime() / 1000.0;
    // console.log("UnixTime.twoHoursBehind: " + unixTime.twoHoursBehind);
}

const airportIcon = L.icon({
    iconUrl: '/images/planeIcon.png',
    iconSize: [15, 15], // size of the icon
    iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
    focus: false,
    iconRotation: 270
});
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
    layers: [streets, airplanes]
});
const markers = {};
plotStates(map, markers);