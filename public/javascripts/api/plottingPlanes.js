
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
    console.log("Hour Behind: " + unixTime.hourBehind + "\nTwoHoursBehind: " + unixTime.twoHoursBehind);
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
            const lat = state[6],
                lng = state[5],
                icao24 = state[0];

            if (markers[icao24]) {
                markers[icao24].setLatLng([lat, lng]);
            } else {
                markers[icao24] = L.marker([lat, lng]);
                markers[icao24].addTo(map);
            }
        });
        setTimeout(() => plotStates(map, markers), 3000);
    });
}


function getCurrentTimeInUnix() {
    let myDate = new Date();
    unixTime.now = myDate.getTime() / 1000.0;
    console.log("UnixTime.now: " + unixTime.now);
    myDate.setHours(myDate.getHours() - 1);
    unixTime.hourBehind = myDate.getTime() / 1000.0;
    console.log("UnixTime.hourBehind: " + unixTime.hourBehind);
    myDate.setHours(myDate.getHours() - 2);
    unixTime.twoHoursBehind = myDate.getTime() / 1000.0;
    console.log("UnixTime.twoHoursBehind: " + unixTime.twoHoursBehind);
}


const icon = L.icon;
var map = L.map(document.getElementById('Map')).setView([48.8583736, 2.2922926], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

L.marker([48.8583736, 2.2922926]).addTo(map);

const markers = {};
plotStates(map, markers);
