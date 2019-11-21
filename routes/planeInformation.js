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
const code = new Client({
    user: "postgres",
    password: "jamo1818",
    host: "localhost",
    port: 5433,
    database: "aircraftModel"
});

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
    console.log((thisPlane.model).substr(0, 3));
    codeConvertion('A320');

}

function aircraftIata(aircraftData) {
    console.log("Name: " + aircraftData.rows[0].iata);
    thisPlane.iata = aircraftData.rows[0].iata;
    console.log(thisPlane);
}

function aircraftDatabase(airportCode) {
    model.connect()
        .then(() => console.log("Connected successfuly"))
        .then(() => model.query("SELECT * from Public.\"aircraftInformation\" where icao24 = $1", [airportCode]))
        .then(results => setAircraftInfo(results))
        .catch(e => console.log(e))
        .finally(() => model.end())
}

function codeConvertion(airportCode) {
    code.connect()
        .then(() => console.log("Connected successfuly"))
        .then(() => code.query("SELECT distinct *  FROM Public.\"aircraftCodeConvertion\" where icao=$1", [airportCode]))
        .then(results => aircraftIata(results))
        .catch(e => console.log(e))
        .finally(() => code.end())
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
