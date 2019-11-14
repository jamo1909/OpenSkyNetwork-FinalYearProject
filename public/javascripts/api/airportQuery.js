// export {getAirports};
// var planeIcao = '3c675a';
// const test_url = 'https://opensky-network.org/api/flights/aircraft?icao24=3c675a&begin=1517184000&end=1517270400';

const fetch = require("node-fetch");

function getCurrentTimeInUnix() {
    const unixTime = {
        now: 0,
        hourBehind: 0,
        twoHoursBehind: 0
    };
    let myDate = new Date();
    unixTime.now = myDate.getTime() / 1000.0;
    console.log("UnixTime.now: " + unixTime.now);
    myDate.setDate(myDate.getDay() - 1);
    unixTime.hourBehind = myDate.getTime() / 1000.0;
    console.log("UnixTime.hourBehind: " + unixTime.hourBehind);
    myDate.setDate(myDate.getDay() - 1);
    unixTime.twoHoursBehind = myDate.getTime() / 1000.0;
    console.log("UnixTime.twoHoursBehind: " + unixTime.twoHoursBehind);
    return unixTime;
}

//TODO: Fix here problem
module.exports = async function getAirports(planeIcao) {
    let airport = {
            arrival: "",
            destination: ""
        };
    var unixTime = getCurrentTimeInUnix();
    const airport_url = "https://opensky-network.org/api/flights/aircraft?icao24=" + planeIcao + "&begin=" + parseInt(unixTime.now) + "&end=" + parseInt(unixTime.twoHoursBehind) + "";
    const response = await fetch(airport_url);
    const data = await response.json();
    console.log(data[0]);
    console.log(data[0].estArrivalAirport);
    airport.arrival = data[0].estArrivalAirport;
    console.log(data[0].estDepartureAirport);
    airport.destination = data[0].estDepartureAirport;
    return airport;
};


// getAirports(planeIcao);
