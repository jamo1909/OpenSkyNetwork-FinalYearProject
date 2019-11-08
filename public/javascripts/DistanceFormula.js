let plane = {
    icao: 0,
    lat: 0,
    long: 0,
    airport: "",
    distanceToOrigin: 0,
    distanceToDestination: 0
};
const unixTime = {
    now: 0,
    hourBehind: 0,
    twoHoursBehind: 0
};

//Get a recent plane
getPlane();

async function getPlane() {
    console.log("Searching plane");
    getCurrentTimeInUnix();
    const url = 'https://opensky-network.org/api/states/all?begin="+unixTime.hourBehind+"&end="+unixTime.twoHoursBehind';
    const response = await fetch(url);
    const data = await response.json();
    console.log(data.states[0]);
    plane.icao = data.states[0][0];
    plane.lat = data.states[0][5];
    plane.long = data.states[0][6];
    console.log(plane);
}

function getCurrentTimeInUnix() {
    let myDate = new Date();
    unixTime.now = myDate.getTime() / 1000.0;
    console.log("UnixTime.now: " + unixTime.now);
    myDate.setHours(myDate.getHours() - 1);
    unixTime.hourBehind = myDate.getTime() / 1000.0;
    console.log("UnixTime.hourBehind: " + unixTime.hourBehind);
    myDate.setHours(myDate.getHours() - 1);
    unixTime.twoHoursBehind = myDate.getTime() / 1000.0;
    console.log("UnixTime.twoHoursBehind: " + unixTime.twoHoursBehind);
}

console.log("Start");
const airportModule = require('./api/airportQuery');
var airport = airportModule.getAirports(plane.icao);
console.log("Airport: " + airport);