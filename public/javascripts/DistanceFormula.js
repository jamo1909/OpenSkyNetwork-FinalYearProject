// // const fetch = require("node-fetch");
// import {getAirports} from "./api/airportQuery";
// console.log(getAirports('3c675a'));

const unixTime = {
    now: 0,
    hourBehind: 0,
    twoHoursBehind: 0
};
let plane = {
    icao: 0,
    lat: 0,
    long: 0,
    airportOrigin: "ESSA",
    airportDest: "EDDF",
    distanceToOrigin: 0,
    distanceToDestination: 0
};
getPlane();
//const url = 'https://opensky-network.org/api/states/all?begin="+unixTime.hourBehind+"&end="+unixTime.twoHoursBehind';

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

    console.log(plane.icao);
    var ports = getAirports(plane.icao);
    Promise.resolve(ports).then(function (result) {
        console.log(result);
        // plane.airportOrigin = result.arrival;
        // plane.airportDest = result.destination;
        if (plane.airportOrigin == null || plane.airportDest == null) {
            alert("ERROR - airport not found");
        } else {
            originAirportLocation(plane.airportOrigin);
            console.log(originAirportCoordinates.long);
            console.log(originAirportCoordinates.long);

        }
    });


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


// console.log("Start");
// var airportModule = require('./api/airportQuery');
// var airport = airportModule.getAirports(plane.icao);
// console.log("Airport: " + airport);
