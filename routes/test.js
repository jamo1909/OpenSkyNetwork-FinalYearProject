var express = require('express');
var router = express.Router();
const {Client} = require('pg');

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
    lat: 0,
    long: 0
};
let destinationAirportCoordinates = {
    lat: 0,
    long: 0
};


const originAirport = "ESSA";
const destinationAirport = "EDDF";

originAirportLocation(originAirport);
destinationAirportLocation(destinationAirport);


function originAirportLocation(airportCode) {
    model.connect()
        .then(() => console.log("Connected successfuly"))
        .then(() => model.query("SELECT * from Public.\"airportDatabase\" where icaocode = $1", [airportCode]))
        .then(results => setOrigin(results))
        .catch(e => console.log(e))
        .finally(() => model.end())
}

//Collect origin airport long/lat
function setOrigin(originAirportData) {
    console.log("Origin");
    // console.log(originAirportData.rows);
    console.log("Name: " + originAirportData.rows[0].name);
    console.log("Latitude: " + originAirportData.rows[0].latitude + "\nLongitude: " + originAirportData.rows[0].longitude);
    originAirportCoordinates.lat = parseFloat(originAirportData.rows[0].latitude);
    originAirportCoordinates.long = parseFloat(originAirportData.rows[0].longitude);

}

//Collect destination airport long/lat
function setDest(destinationAirportData) {
    console.log("Destination");
    // console.log(destinationAirportData.rows);
    console.log("Name: " + destinationAirportData.rows[0].name);
    console.log("Latitude: " + destinationAirportData.rows[0].latitude + "\nLongitude: " + destinationAirportData.rows[0].longitude);
    destinationAirportCoordinates.lat = parseFloat(destinationAirportData.rows[0].latitude);
    destinationAirportCoordinates.lat = parseFloat(destinationAirportData.rows[0].longitude);
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

// distance(originAirportCoordinates.lat,originAirportCoordinates.long, destinationAirportCoordinates.lat,destinationAirportCoordinates.long)

router.get('/', function (req, res, next) {
    res.render('test', {
        title: originAirportCoordinates.long
    });
});

/* GET data page. */
router.get('/data', function (req, res, next) {
    res.render('test', {
        title: 'Data'
    });
});


module.exports = router;
