const fetch = require("node-fetch");
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
    // console.log("UnixTime.now: " + unixTime.now);
    myDate.setHours(myDate.getHours() - 1);
    unixTime.hourBehind = myDate.getTime() / 1000.0;
    // console.log("UnixTime.hourBehind: " + unixTime.hourBehind);
    myDate.setHours(myDate.getHours() - 1);
    unixTime.twoHoursBehind = myDate.getTime() / 1000.0;
    // console.log("UnixTime.twoHoursBehind: " + unixTime.twoHoursBehind);
    return unixTime;
}

function checkPlaneInformation(plane) {
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

module.exports = async function getPlane() {
    var indexPlane = 1;
    let plane = {
        icao: 0,
        lat: 0,
        long: 0,
        airportOrigin: "",
        airportDest: "",
        distanceToOrigin: 0,
        distanceToDestination: 0
    };
    console.log("Searching plane");
    var unixTime = getCurrentTimeInUnix();
    const url = "https://opensky-network.org/api/states/all?begin=" + unixTime.hourBehind + "&end=" + unixTime.twoHoursBehind;
    const response = await fetch(url);
    const data = await response.json();
    console.log("https://opensky-network.org/api/states/all?begin=" + unixTime.hourBehind + "&end=" + unixTime.twoHoursBehind);
    // console.log(data);
    plane.icao = data.states[indexPlane][0];
    console.log(plane.icao);
    plane.long = data.states[indexPlane][5];
    plane.lat = data.states[indexPlane][6];
    checkPlaneInformation(plane);
    return plane;
};


