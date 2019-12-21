const express = require('express');
const router = express.Router();
const {Client} = require('pg');
const airport = require('./../public/javascripts/api/airportQuery');
const dist = require('./../public/javascripts/calculations/greatCircleDistance');
// const plane = require('../public/javascripts/getSinglePlane'); //Calls plane icao
const plane = require('../public/javascripts/getPlanes');


const model = new Client({
    user: "postgres",
    password: "jamo1818",
    host: "localhost",
    port: 5433,
    database: "aircraftModel"
});
model.connect();


let originAirportCoordinates = {
    name: "",
    lat: 0,
    long: 0
};
let destinationAirportCoordinates = {
    name: "",
    lat: 0,
    long: 0
};
let thisPlane = {
    icao: "",
    lat: 0,
    long: 0,
    airport: {
        origin: "",
        destination: ""
    }
};

let distance = {
    originToDestination: 0,
    planeToOrigin: 0,
    planeToDestination: 0
};

// plane().then(result => {
//     // for(x in result){
//     //     for(var x=0; x <=1; x++){
//     // for (var x=0; x<1;x++) {
//     var x = 0;
//     thisPlane.icao = result[x][0];//.icao;
//     thisPlane.lat = result[x][5];//.lat;
//     thisPlane.long = result[x][6];//.long;
//     if (checkPlaneinformation(thisPlane.icao, thisPlane.long, thisPlane.lat)) {
//         airport(thisPlane.icao).then(resultAirport => {
//             if (resultAirport.arrival == null || resultAirport.destination == null) {
//                 console.log("The airports returned null");
//                 console.log("Origin: " + resultAirport.arrival);
//                 console.log("Destination: " + resultAirport.destination)
//             } else {
//                 thisPlane.airport.origin = resultAirport.arrival;
//                 thisPlane.airport.destination = resultAirport.destination;
//                 console.log("Origin: " + thisPlane.airport.origin);
//                 console.log("Destination: " + thisPlane.airport.destination);
//                 originAirportLocation(thisPlane.airport.origin);
//                 destinationAirportLocation(thisPlane.airport.destination);
//             }
//         })
//     }
// }).catch(err => {
//     console.log(err);
// });

// const originAirport = "ESSA";
// const destinationAirport = "EDDF";
function checkAirportInformation(airports) {
    if (airports == null) {
        // console.log("There is a null " + airports);
    } else {
        // console.log("Information is correct");
    }
}

function checkPlaneinformation(plane, long, lat) {
    if (plane == null || long == null || lat == null) {
        console.log("This Plane info is incorrect");
        return false
    } else {
        return true
    }
}


function originAirportLocation(airportCode) {
    model.query("SELECT * from Public.\"airportDatabase\" where icaocode = $1", [airportCode])
        .then(results => setOrigin(results))
        .catch(e => console.log(e))

}

//GET destination airport information from DB
function destinationAirportLocation(airportCode) {
    model.query("SELECT * from Public.\"airportDatabase\" where icaocode = $1", [airportCode])
        .then(results => setDest(results))
        .catch(e => console.log(e))
}

//Collect origin airport long/lat
function setOrigin(originAirportData) {
    // console.log("Origin");
    // // console.log(originAirportData.rows);
    // console.log("Name: " + originAirportData.rows[0].name);
    // console.log("Latitude: " + originAirportData.rows[0].latitude + "\nLongitude: " + originAirportData.rows[0].longitude);
    originAirportCoordinates.name = originAirportData.rows[0].name;
    originAirportCoordinates.lat = parseFloat(originAirportData.rows[0].latitude);
    originAirportCoordinates.long = parseFloat(originAirportData.rows[0].longitude);

}

//Collect destination airport long/lat
function setDest(destinationAirportData) {
    // console.log("Destination");
    console.log("TEST: " + destinationAirportData.rows[0]);
    // console.log("Latitude: " + destinationAirportData.rows[0].latitude + "\nLongitude: " + destinationAirportData.rows[0].longitude);
    destinationAirportCoordinates.name = destinationAirportData.rows[0].name;
    destinationAirportCoordinates.lat = parseFloat(destinationAirportData.rows[0].latitude);
    destinationAirportCoordinates.long = parseFloat(destinationAirportData.rows[0].longitude);
}

router.get('/', function (req, res, next) {
    console.log("PLANE: ");
    console.log(thisPlane);
    distance.originToDestination = dist(originAirportCoordinates.lat, originAirportCoordinates.long, destinationAirportCoordinates.lat, destinationAirportCoordinates.long);
    distance.planeToOrigin = dist(thisPlane.lat, thisPlane.long, originAirportCoordinates.lat, originAirportCoordinates.long);
    distance.planeToDestination = dist(thisPlane.lat, thisPlane.long, destinationAirportCoordinates.lat, destinationAirportCoordinates.long);
    res.render('distance', {
        planeIcao: thisPlane.icao,
        planeLat: thisPlane.lat,
        planeLong: thisPlane.long,
        originAirportName: originAirportCoordinates.name,
        originAirportLat: originAirportCoordinates.lat,
        originAirportLong: originAirportCoordinates.long,
        destinationAirportName: destinationAirportCoordinates.name,
        destinationAirportLat: destinationAirportCoordinates.lat,
        destinationAirportLong: destinationAirportCoordinates.long,
        distanceOriginToDestination: distance.originToDestination,
        distancePlaneToDestination: distance.planeToDestination,
        distancePlaneToOrigin: distance.planeToOrigin
    });
});



module.exports = router;
