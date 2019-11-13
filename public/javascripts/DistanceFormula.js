// // const fetch = require("node-fetch");
// import {getAirports} from "./api/airportQuery";
// console.log(getAirports('3c675a'));
//const url = 'https://opensky-network.org/api/states/all?begin="+unixTime.hourBehind+"&end="+unixTime.twoHoursBehind';
// var test = require('./db/airportQuery');
function getCurrentTimeInUnix() {
    const unixTime = {
        now: 0,
        hourBehind: 0,
        twoHoursBehind: 0
    };
    let myDate = new Date();
    unixTime.now = myDate.getTime() / 1000.0;
    console.log("UnixTime.now: " + unixTime.now);
    myDate.setHours(myDate.getHours() - 1);
    unixTime.hourBehind = myDate.getTime() / 1000.0;
    console.log("UnixTime.hourBehind: " + unixTime.hourBehind);
    myDate.setHours(myDate.getHours() - 1);
    unixTime.twoHoursBehind = myDate.getTime() / 1000.0;
    console.log("UnixTime.twoHoursBehind: " + unixTime.twoHoursBehind);
    return unixTime;
}

function checkPlaneInformation() {
    if (plane.icao == null || plane.lat == null || plane.long == null) {
        alert("There is a null " + plane);
    } else {
        console.log("Information is correct");
    }
}

function checkAirportInformation(airports) {
    if (airports.arrival == null || airports.destination == null) {
        alert("There is a null " + airports);
        number++;
        getPlane();
    } else {
        console.log("Information is correct");
    }
}

async function getPlane() {
    let plane = {
        icao: 0,
        lat: 0,
        long: 0,
        airportOrigin: "ESSA",
        airportDest: "EDDF",
        distanceToOrigin: 0,
        distanceToDestination: 0
    };
    console.log("Searching plane");
    var unixTime = getCurrentTimeInUnix();
    const url = 'https://opensky-network.org/api/states/all?begin="+unixTime.hourBehind+"&end="+unixTime.twoHoursBehind';
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data.states[0]);
    plane.icao = data.states[0][0];
    plane.lat = data.states[0][5];
    plane.long = data.states[0][6];
    checkPlaneInformation();
    console.log("PLANE: ");
    console.log(plane);

    getAirports(plane.icao).then(result => {
        console.log("result");
        checkAirportInformation(result);
        console.log(result);
        plane.airportOrigin = result.arrival;
        plane.airportDest = result.destination;
        // console.log(plane);
    }).catch(err => {
        console.log(err);
    });
    // var test = originAirportLocation(plane.airportOrigin);
    // console.log(test);
    return plane;
}


// console.log("Start");
// var airportModule = require('./api/airportQuery');
// var airport = airportModule.getAirports(plane.icao);
// console.log("Airport: " + airport);

// console.log(plane.icao);
// var ports = getAirports(plane.icao);
// Promise.resolve(ports).then(function (result) {
//     console.log(result);
//     // plane.airportOrigin = result.arrival;
//     // plane.airportDest = result.destination;
//     if (plane.airportOrigin == null || plane.airportDest == null) {
//         alert("ERROR - airport not found");
//     } else {
//         originAirportLocation(plane.airportOrigin);
//         console.log(originAirportCoordinates.long);
//         console.log(originAirportCoordinates.long);
//
//     }
// });
