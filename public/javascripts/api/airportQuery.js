// export {getAirports};
// var planeIcao = '3c675a';
// const test_url = 'https://opensky-network.org/api/flights/aircraft?icao24=3c675a&begin=1517184000&end=1517270400';

const fetch = require("node-fetch");

function getCurrentTimeInUnix() { //function to get UNIX time for API call
    const unixTime = {
        now: 0,
        hourBehind: 0,
        twoHoursBehind: 0
    }; //UNIX time variable
    let myDate = new Date();
    unixTime.now = myDate.getTime() / 1000.0;
    // console.log("UnixTime.now: " + unixTime.now);
    myDate.setDate(myDate.getHours() - 1);
    unixTime.hourBehind = myDate.getTime() / 1000.0;
    // console.log("UnixTime.hourBehind: " + unixTime.hourBehind);
    myDate.setDate(myDate.getDay() - 2);
    unixTime.twoHoursBehind = myDate.getTime() / 1000.0;
    // console.log("UnixTime.twoHoursBehind: " + unixTime.twoHoursBehind);
    return unixTime;
}

module.exports = async function getAirports(planeIcao) { //Get origin and destination airports for plane using ICAO
    let airport = {
            arrival: "",
            destination: ""
    }; //airport variable
    var unixTime = getCurrentTimeInUnix(); //Get current UNIX time
    console.log(planeIcao);
    const airport_url = "https://opensky-network.org/api/flights/aircraft?icao24=" + planeIcao + "&begin=" + parseInt(unixTime.twoHoursBehind) + "&end=" + parseInt(unixTime.now); //Airport API call to OpenSky Network
    console.log(airport_url);
    const response = await fetch(airport_url); //Make call to API
    const data = await response.json(); //variable to store API in JSON

    let index = -1;
    let dataSize = Object.keys(data).length; //Size of JSON file

    if (dataSize == 1) {
        airport.arrival = "EIDW";
        airport.destination = "EDDF";
    } else {
        do {
            var test = index + 1;
            index++;
            if ((test === dataSize) || data === null) { //average flight distance airlines.net 1113km
                airport.arrival = "EIDW";
                airport.destination = "EDDF";
            } else {
                airport.arrival = data[index].estArrivalAirport;
                airport.destination = data[index].estDepartureAirport;
            }
        } while ((data[index].estArrivalAirport == null) || (data[index].estDepartureAirport == null));
    }
    // if (data[0].estArrivalAirport == null || data[0].estDepartureAirport == null) {
    //     // const airport_url = "https://opensky-network.org/api/flights/aircraft?icao24=" + planeIcao + "&begin=" + parseInt(unixTime.twoHoursBehind) + "&end=" + parseInt(unixTime.hourBehind);
    //     // console.log(airport_url);
    //     // const response = await fetch(airport_url);
    //     // const data = await response.json();
    //     airport.arrival = data[1].estArrivalAirport;
    //     // console.log(data[0].estDepartureAirport);
    //     airport.destination = data[1].estDepartureAirport;
    // } else {
    //     console.log(data[0]);
    //     airport.arrival = data[0].estArrivalAirport;
    //     airport.destination = data[0].estDepartureAirport;
    // }

    return airport;
};

