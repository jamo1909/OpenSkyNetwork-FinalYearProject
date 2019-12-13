
/*
Links:
https://opensky-network.org/api/flights/all?begin=1517227200&end=1517230800
https://opensky-network.org/api/states/all
*/
const unixTime = {
    now: 0,
    hourBehind: 0,
    twoHoursBehind: 0
};

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
            if (state[2] == 'Ireland') {
                const lat = state[6],
                    lng = state[5],
                    icao24 = state[0],
                    velocity = state[9];

                if (markers[icao24]) {
                    markers[icao24].setLatLng([lat, lng]);
                } else {
                    markers[icao24] = L.marker([lat, lng], {icon: airportIcon});
                    markers[icao24].addTo(map)
                        .bindPopup('ICAO Code: ' + icao24 + ' <br>' +
                            'Lat: ' + lat + ' <br>' +
                            'Long: ' + lng + ' <br>' +
                            'velocity: ' + velocity + 'm/s');
                }
            }
        });
        setTimeout(() => plotStates(map, markers), 3000);

    });
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
    iconUrl: '/images/planeIconTest.png',
    iconSize: [15, 15], // size of the icon
    iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
});
const icon = L.icon;
var map = L.map(document.getElementById('Map')).setView([48.8583736, 2.2922926], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

L.marker([48.8583736, 2.2922926]).addTo(map);

const markers = {};
plotStates(map, markers);