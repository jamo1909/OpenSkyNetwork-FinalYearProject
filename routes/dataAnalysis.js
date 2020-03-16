const express = require('express');
const router = express.Router();
const {Client} = require('pg');
const model = new Client({
    user: "postgres",
    password: "jamo1818",
    host: "localhost",
    port: 5433,
    database: "aircraftModel"
});
model.connect();

var totalFuelConsumption;
var avgFuelConsumption;
let airlineCount = 0;
let modelCount = 0;
var models;
var countryFuelUsed = 0;
var countryPlanesCount = 0;
var airlineFuelUsed;
var airlinePlanesCount = 0;
var modelFuelUsed;
var modelPanesCount;
var originAirportCount;
var destinationAirportCount;
var fuelOverTime;

//FUEL USAGE
//SELECT SUM(fuelused)FROM Public."dataAnalysisTest"
model.query("SELECT SUM(fuelused) From Public.\"dataAnalysisTest\" ")
    .then(function (fuel) {
        // console.log("Total Consumption: " + fuel)
        totalFuelConsumption = fuel.rows;
    }).catch(e => console.log(e));
//SELECT AVG(fuelperkm)FROM Public."dataAnalysisTest"
model.query("SELECT AVG(fuelperkm) From Public.\"dataAnalysisTest\" ")
    .then(function (avgFuel) {
        // console.log("Total Consumption: " + fuel)
        avgFuelConsumption = avgFuel.rows;
    }).catch(e => console.log(e));


//Airline
//select owner, count(owner) From Public."dataAnalysis" GROUP BY owner ORDER BY count(owner) DESC
model.query("SELECT count(airline), airline From Public.\"dataAnalysisTest\" GROUP BY airline ORDER BY count(airline) DESC ")
    .then(function (airline) {
        airlineCount = airline.rowCount;
    }).catch(e => console.log(e));

//select model, count(model) From Public."dataAnalysis" GROUP BY model ORDER BY count(model) DESC
model.query("SELECT count(model) AS y, model AS label From Public.\"dataAnalysisTest\" GROUP BY model ORDER BY count(model) DESC")
    .then(function (results) {
        // console.log(results.rowCount)
        modelCount = results.rowCount;
        // console.log(results.rows)
        models = results.rows;
    }).catch(e => console.log(e));

//SELECT SUM(fuelused) as y, origincountry as label FROM Public.”dataAnalysisTest” GROUP BY origincountry
model.query("SELECT SUM(fuelused) AS y, origincountry AS label From Public.\"dataAnalysisTest\" GROUP BY origincountry LIMIT 10")
    .then(function (countryFuel) {
        // console.log(countryFuel.rows)
        countryFuelUsed = countryFuel.rows;
    }).catch(e => console.log(e));


//SELECT count(*) AS y, origincountry AS label FROM Public."dataAnalysisTest" GROUP BY origincountry
model.query("SELECT count(*) AS y, origincountry AS label From Public.\"dataAnalysisTest\" GROUP BY origincountry LIMIT 10")
    .then(function (countryPlanes) {
        // console.log(countryPlanes.rows)
        countryPlanesCount = countryPlanes.rows;
    }).catch(e => console.log(e));

//SELECT SUM(fuelused) AS y, airline AS label FROM Public."dataAnalysisTest" GROUP BY airline
model.query("SELECT SUM(fuelused) AS y, airline AS label From Public.\"dataAnalysisTest\" GROUP BY airline LIMIT 10")
    .then(function (airlinePlanes) {
        // console.log(airlinePlanes.rows)
        airlineFuelUsed = airlinePlanes.rows;
    }).catch(e => console.log(e));

//COUNTRY
//SELECT count(*) AS y, airline AS label FROM Public."dataAnalysisTest" GROUP BY airline
model.query("SELECT count(*) AS y, airline AS label From Public.\"dataAnalysisTest\" GROUP BY airline LIMIT 10")
    .then(function (airlinePlanes) {
        // console.log(airlinePlanes.rows)
        airlinePlanesCount = airlinePlanes.rows;
    }).catch(e => console.log(e));
//SELECT SUM(fuelused) AS y, model AS label FROM Public."dataAnalysisTest" GROUP BY model
model.query("SELECT SUM(fuelused) AS y, model AS label From Public.\"dataAnalysisTest\" GROUP BY model LIMIT 10")
    .then(function (aircraftModels) {
        // console.log(aircraftModels.rows)
        modelFuelUsed = aircraftModels.rows;
    }).catch(e => console.log(e));


//GRAPHS
//SELECT count(*) AS y, model AS label FROM Public."dataAnalysisTest" GROUP BY model
model.query("SELECT count(*) AS y, model AS label From Public.\"dataAnalysisTest\" GROUP BY model LIMIT 10")
    .then(function (aircraftModels) {
        // console.log(aircraftModels.rows)
        modelPanesCount = aircraftModels.rows;
    }).catch(e => console.log(e));


//SELECT count(*), originairport FROM Public."dataAnalysisTest" GROUP BY originairport
model.query("SELECT count(*) as y, originairport as label From Public.\"dataAnalysisTest\" GROUP BY originairport")
    .then(function (originAirport) {
        // console.log(originAirport.rows)
        originAirportCount = originAirport.rows;
    }).catch(e => console.log(e));
//SELECT count(*), destinationairport FROM Public."dataAnalysisTest" GROUP BY destinationairport
model.query("SELECT count(*) as y, destinationairport as label From Public.\"dataAnalysisTest\" GROUP BY destinationairport")
    .then(function (destinationAirport) {
        // console.log(destinationAirport.rows)
        destinationAirportCount = destinationAirport.rows;
    }).catch(e => console.log(e));

//SELECT extract(epoch from timedate) as x, SUM(fuelused) as y FROM Public."dataAnalysisTest" GROUP BY x
model.query("SELECT extract(epoch from timedate) as x, SUM(fuelused) as y FROM Public.\"dataAnalysisTest\" GROUP BY x")
    .then(function (fuel) {
        console.log(fuel.rows);
        fuelOverTime = fuel.rows;
    }).catch(e => console.log(e));


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('dataAnalysis', {
        totalFuelConsumption: totalFuelConsumption,
        avgFuelConsumption: avgFuelConsumption,
        airlineCount: airlineCount,
        modelCount: modelCount,
        modelSql: models,
        countryFuelUsed: countryFuelUsed,
        countryPlanesCount: countryPlanesCount,
        airlineFuelUsed: airlineFuelUsed,
        airlinePlanesCount: airlinePlanesCount,
        modelFuelUsed: modelFuelUsed,
        modelPanesCount: modelPanesCount,
        originAirportCount: originAirportCount,
        destinationAirportCount: destinationAirportCount,
        fuelOverTime: fuelOverTime,
    });

});

module.exports = router;