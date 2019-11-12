var express = require('express');
// var distance = require('./../public/javascripts/test.js');
var distance = require('./../public/javascripts/DistanceFormula.js');
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

/* GET data page. */
router.get('/', function (req, res, next) {
    res.render('test', {
        title: 'Data'
    });
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
/* GET data page. */
router.get('/airportDB', function (req, res, next) {
    const originAirport = "ESSA";
    const destinationAirport = "EDDF";

    originAirportLocation(originAirport);
    destinationAirportLocation(destinationAirport);
    // var myModule = require('./../public/javascripts/api/airportQuery');

    // originAirportLocation(originAirport);


    //TODO: Get proper return function for promise
//GET origin airport information from DB
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
        // console.log(destinationAirportData.rows);
        console.log("Name: " + destinationAirportData.rows[0].name);
        console.log("Latitude: " + destinationAirportData.rows[0].latitude + "\nLongitude: " + destinationAirportData.rows[0].longitude);
        destinationAirportCoordinates.lat = parseFloat(destinationAirportData.rows[0].latitude);
        destinationAirportCoordinates.lat = parseFloat(destinationAirportData.rows[0].longitude);
    }

});


/* GET data page. */
router.get('/data', function (req, res, next) {
    res.render('test', {
        originName: originAirportCoordinates.name,
        originLat: originAirportCoordinates.lat,
        originLong: originAirportCoordinates.long,
        destName: destinationAirportCoordinates.name,
        destLat: destinationAirportCoordinates.lat,
        destLong: destinationAirportCoordinates.long
    });


});
module.exports = router;
