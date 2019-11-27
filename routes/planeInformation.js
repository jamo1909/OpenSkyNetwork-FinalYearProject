const express = require('express');
const router = express.Router();
const {Client} = require('pg');
const plane = require('../public/javascripts/getSinglePlane'); //Calls plane icao
const modelDb = require('../public/javascripts/db/aircraftModelQuery');


const model = new Client({
    user: "postgres",
    password: "jamo1818",
    host: "localhost",
    port: 5433,
    database: "aircraftModel"
});
model.connect();

let thisPlane = {
    icao: "",
    iata: "",
    manufacture: "",
    model: "",
    owner: "",
    modelIcao: ""
};


plane().then(result => {
    console.log("Returning plane");
    thisPlane.icao = result.icao;
    aircraftDatabase(thisPlane.icao);
    //TODO: thisPlane.modelIcao
}).catch(err => {
    console.log(err);
});


//Collect origin airport long/lat
function setAircraftInfo(aircraftData) {
    console.log("Name: " + aircraftData.rows[0].icao24);
    thisPlane.manufacture = aircraftData.rows[0].manufacture;
    thisPlane.model = aircraftData.rows[0].model;
    thisPlane.owner = aircraftData.rows[0].owner;
    thisPlane.modelIcao = aircraftData.rows[0].typecode;
    console.log((thisPlane.model).substr(0, 4));
    //A320
    codeConvertion((thisPlane.model).substr(0, 4));

}

function aircraftIata(aircraftData) {
    console.log("Name: " + aircraftData.rows[0].iata);
    thisPlane.iata = aircraftData.rows[0].iata;
    console.log(thisPlane);
}

function aircraftDatabase(airportCode) {
    model.query("SELECT * from Public.\"aircraftInformation\" where icao24 = $1", [airportCode])
        .then(results => setAircraftInfo(results))
        .catch(e => console.log(e))
}

function codeConvertion(airportCode) {
    model.query("SELECT distinct *  FROM Public.\"aircraftCodeConvertion\" where icao=$1", [airportCode])
        .then(results => aircraftIata(results))
        .catch(e => console.log(e))
}

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('planeInformation', {
        planeIcao: thisPlane.icao,
        planeIata: thisPlane.iata,
        planeManufacture: thisPlane.manufacture,
        planeModel: thisPlane.model,
        planeOwner: thisPlane.owner,
        planeModelIcao: thisPlane.modelIcao
    });

});

module.exports = router;