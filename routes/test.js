var express = require('express');
var router = express.Router();
const {Client} = require('pg');
var airport = require('./../public/javascripts/api/airportQuery');
var dist = require('./../public/javascripts/calculations/greatCircleDistance');
var plane = require('../public/javascripts/getSinglePlane'); //Calls plane icao


const model = new Client({
    user: "postgres",
    password: "jamo1818",
    host: "localhost",
    port: 5433,
    database: "aircraftModel"
});
const dest = new Client({
    user: "postgres",
    password: "jamo1818",
    host: "localhost",
    port: 5433,
    database: "aircraftModel"
});

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

plane().then(result => {
    console.log("Returning plane");
    thisPlane.icao = result.icao;
    thisPlane.lat = result.lat;
    thisPlane.long = result.long;
    airport(result.icao).then(result => {
        thisPlane.airport.origin = result.arrival;
        thisPlane.airport.destination = result.destination;
        checkAirportInformation(thisPlane.airport.origin);
        checkAirportInformation(thisPlane.airport.destination);
        console.log("Test: " + thisPlane.airport.origin);
        console.log("Test: " + thisPlane.airport.destination);
        originAirportLocation(thisPlane.airport.origin);
        destinationAirportLocation(thisPlane.airport.destination);


    }).catch(err => {
        console.log(err);
    });
}).catch(err => {
    console.log(err);
});

// const originAirport = "ESSA";
// const destinationAirport = "EDDF";
function checkAirportInformation(airports) {
    if (airports == null) {
        console.log("There is a null " + airports);
    } else {
        console.log("Information is correct");
    }
}


function originAirportLocation(airportCode) {
    model.connect()
        .then(() => console.log("Connected successfuly"))
        .then(() => model.query("SELECT * from Public.\"airportDatabase\" where icaocode = $1", [airportCode]))
        .then(results => setOrigin(results))
        .catch(e => console.log(e))
        .finally(() => model.end())
}

//GET destination airport information from DB
function destinationAirportLocation(airportCode) {
    dest.connect()
        .then(() => console.log("Connected successfuly"))
        .then(() => dest.query("SELECT * from Public.\"airportDatabase\" where icaocode = $1", [airportCode]))
        .then(results => setDest(results))
        .catch(e => console.log(e))
        .finally(() => dest.end())
}

//Collect origin airport long/lat
function setOrigin(originAirportData) {
    console.log("Origin");
    // console.log(originAirportData.rows);
    console.log("Name: " + originAirportData.rows[0].name);
    console.log("Latitude: " + originAirportData.rows[0].latitude + "\nLongitude: " + originAirportData.rows[0].longitude);
    originAirportCoordinates.name = originAirportData.rows[0].name;
    originAirportCoordinates.lat = parseFloat(originAirportData.rows[0].latitude);
    originAirportCoordinates.long = parseFloat(originAirportData.rows[0].longitude);

}

//Collect destination airport long/lat
function setDest(destinationAirportData) {
    console.log("Destination");
    console.log("Name: " + destinationAirportData.rows[0].name);
    console.log("Latitude: " + destinationAirportData.rows[0].latitude + "\nLongitude: " + destinationAirportData.rows[0].longitude);
    destinationAirportCoordinates.name = destinationAirportData.rows[0].name;
    destinationAirportCoordinates.lat = parseFloat(destinationAirportData.rows[0].latitude);
    destinationAirportCoordinates.long = parseFloat(destinationAirportData.rows[0].longitude);
}


// thisPlane.airport.origin = result.airportOrigin;
// thisPlane.airport.origin = result.airportDest;


router.get('/', function (req, res, next) {
    console.log("PLANE: ");
    console.log(thisPlane);
    distance.originToDestination = dist(originAirportCoordinates.lat, originAirportCoordinates.long, destinationAirportCoordinates.lat, destinationAirportCoordinates.long);
    distance.planeToOrigin = dist(thisPlane.lat, thisPlane.long, originAirportCoordinates.lat, originAirportCoordinates.long);
    distance.planeToDestination = dist(thisPlane.lat, thisPlane.long, destinationAirportCoordinates.lat, destinationAirportCoordinates.long);
    res.render('test', {
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

/* GET data page. */
router.get('/data', function (req, res, next) {
    res.render('test', {
        title: 'Data'
    });
});


module.exports = router;
