
var airplanes = L.layerGroup();
var bool = false;
const unixTime = {
    now: 0,
    hourBehind: 0,
    twoHoursBehind: 0
};
const airportIcon = L.icon({
    iconUrl: '/images/planeIconTest.png',
    iconSize: [15, 15], // size of the icon
    iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
});
const icon = L.icon;
var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

var grayscale = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', attribution: mbAttr}),
    streets = L.tileLayer(mbUrl, {id: 'mapbox/streets-v11', attribution: mbAttr});

var map = L.map('Map', {
    center: [53, -6.2603],
    zoom: 6,
    layers: [streets, airplanes]
});


const markers = {};
plotStates(map, markers);


function fetchData() {
    getCurrentTimeInUnix();
    // console.log("Hour Behind: " + unixTime.hourBehind + "\nTwoHoursBehind: " + unixTime.twoHoursBehind);
    return fetch("https://opensky-network.org/api/states/all?begin=" + unixTime.hourBehind + "&end=" + unixTime.twoHoursBehind)
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            return res.states.filter((state) => {
                return (state[2] === 'Ireland')
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
            if (state[2] == 'Ireland') {
                const lat = state[6],
                    lng = state[5],
                    icao24 = state[0],
                    velocity = state[9];
                if (markers[icao24]) {
                    markers[icao24].setLatLng([lat, lng]);
                } else {
                    markers[icao24] = L.marker([lat, lng], {icon: airportIcon});
                    markers[icao24].addTo(airplanes)
                        .bindPopup('ICAO Code: ' + icao24 + ' <br>' +
                            'Lat: ' + lat + ' <br>' +
                            'Long: ' + lng + ' <br>' +
                            'velocity: ' + velocity + 'm/s <br>' +
                            'Origin: ' + airport.arrival + '<br>' +
                            'Destination:' + airport.destination + ' <br> ' +
                            '<button onclick="Emissions()">Emissions</button>')
                }
            }
        });


        if (bool == false) {
            var baseLayers = {
                "Streets": streets,
                "Grayscale": grayscale
            };

            var overlays = {
                "Airplanes": airplanes
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
    if (data[0] == null) {
        const airport_url = "https://opensky-network.org/api/flights/aircraft?icao24=" + planeIcao + "&begin=" + parseInt(unixTime.twoHoursBehind) + "&end=" + parseInt(unixTime.hourBehind);
        console.log(airport_url);
        const response = await fetch(airport_url);
        const data = await response.json();
        airport.arrival = data[0].estArrivalAirport;
        // console.log(data[0].estDepartureAirport);
        airport.destination = data[0].estDepartureAirport;
    } else {
        console.log(data[0]);
        airport.arrival = data[0].estArrivalAirport;
        airport.destination = data[0].estDepartureAirport;
    }
    console.log("TEST: " + airport);
    return airport;
}

function getCurrentTimeInUnix() {
    let myDate = new Date();
    myDate.setDate(myDate.getDate() - 1);
    unixTime.now = myDate.getTime() / 1000.0;
    myDate.setHours(myDate.getHours() - 1);
    unixTime.hourBehind = myDate.getTime() / 1000.0;
    myDate.setHours(myDate.getHours() - 2);
    unixTime.twoHoursBehind = myDate.getTime() / 1000.0;
}
