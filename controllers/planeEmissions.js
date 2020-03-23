const {Client} = require('pg');
const airport = require('./../public/javascripts/api/airportQuery');
const dist = require('./../public/javascripts/calculations/greatCircleDistance');
// const plane = require('../public/javascripts/getSinglePlane'); //Calls plane icao
const plane = require('../public/javascripts/getSinglePlane'); //Calls plane icao

const model = new Client({
    user: "postgres",
    password: "jamo1818",
    host: "localhost",
    port: 5433,
    database: "aircraftModel"
});
model.connect();
var infoCorrect = true;


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
    callsign: "",
    orignCountry: "",
    lat: 0,
    long: 0,
    airport: {
        origin: "",
        destination: ""
    },
    iata: "",
    manufacture: "",
    model: "",
    owner: "",
    modelIcao: "",
    fuelUsed: 0,
    fuelToUse: 0
};

let distance = {
    originToDestination: 0,
    planeToOrigin: 0,
    planeToDestination: 0
};

// for (let i=0; i<20; i++) {
var bool = false;

if (bool === true) {
(function myLoop(indexPlane) {
    setTimeout(function () { //setting a wait, as to not overrun function
        plane().then(result => {  //receives a JSON file of planes
            console.log("Iteration " + indexPlane);
            thisPlane.icao = result.states[indexPlane][0]; //Assigning ICAO code to variable
            thisPlane.callsign = result.states[indexPlane][1]; //Assigning callsign  to variable
            thisPlane.originCountry = result.states[indexPlane][2]; //Assigning origin country  to variable
            thisPlane.long = result.states[indexPlane][5]; //Assigning longitude to variable
            thisPlane.lat = result.states[indexPlane][6]; //Assigning latitude to variable

            if (checkPlaneInformation(thisPlane.icao, thisPlane.long, thisPlane.lat)) {  //check if plane information is valid
                airport(thisPlane.icao).then(resultAirports => { //send ICAO to API to return origin and destination airport
                    if (resultAirports.arrival == null || resultAirports.destination == null) {
                        console.log("The airports returned null");
                        console.log("Origin: " + resultAirports.arrival);
                        console.log("Destination: " + resultAirports.destination)
                    } else {
                        thisPlane.airport.origin = resultAirports.arrival;
                        thisPlane.airport.destination = resultAirports.destination;
                        console.log("Origin: " + thisPlane.airport.origin);
                        console.log("Destination: " + thisPlane.airport.destination);
                        originAirportLocation(thisPlane.airport.origin);
                        destinationAirportLocation(thisPlane.airport.destination);
                        aircraftDatabase(thisPlane.icao);
                    }
                })
            } else {
                console.log("Plane info incorrect");
            }
        }).catch(err => {
            console.log(err);
        });

        if (--indexPlane) myLoop(indexPlane);      //  decrement i and call myLoop again if i > 0
    }, 3000)
})(100);

}


function checkAirportInformation(airports) {
    if (airports == null) {
        console.log("There is a null " + airports);
        infoCorrect = false;
        return false;
    } else {
        console.log("Information is correct");
        return true;
    }
}

function checkPlaneInformation(planeICAO, long, lat) { //check if plane from API is valid
    if (planeICAO == null || long == null || lat == null) { //if any of plane information is null
        console.log("This Plane info is incorrect");
        return false //send false back
    } else { //plane information is correct
        return true //send true back
    }
}

async function originAirportLocation(airportCode) {
    if (checkAirportInformation(airportCode)) {
        model.query("SELECT * from Public.\"airportDatabase\" where icaocode = $1", [airportCode])
            .then(results => setOrigin(results))
            .catch(e => console.log(e))
    }

}

//GET destination airport information from DB
async function destinationAirportLocation(airportCode) {
    if (checkAirportInformation(airportCode)) {
        model.query("SELECT * from Public.\"airportDatabase\" where icaocode = $1", [airportCode])
            .then(results => setDest(results))
            .catch(e => console.log(e))
    }

}

//Collect origin airport long/lat
function setOrigin(originAirportData) {
    console.log("Origin");
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


//Collect origin airport long/lat
function setAircraftInfo(aircraftData) {
    console.log("Name: " + aircraftData.rows[0].icao24);
    console.log("manufacture: " + aircraftData.rows[0].manufacture);
    console.log("model: " + aircraftData.rows[0].model);
    thisPlane.manufacture = aircraftData.rows[0].manufacture;
    thisPlane.model = aircraftData.rows[0].model;
    thisPlane.owner = aircraftData.rows[0].owner;
    thisPlane.modelIcao = aircraftData.rows[0].typecode;
    if (thisPlane.manufacture == "Airbus" || thisPlane.manufacture == "Airbus Industrie") {
        console.log((thisPlane.model).substr(0, 4));
        codeConvertion((thisPlane.model).substr(0, 4));
    } else {
        console.log(thisPlane.modelIcao);
        codeConvertion(thisPlane.modelIcao);
    }

}

function aircraftIata(aircraftData) {
    if (aircraftData.rowCount == 0) {
        console.log(thisPlane.modelIcao + " Not in Database");
        model.query("INSERT INTO Public.\"missingPlanes\"(planeName) values($1) ", [thisPlane.model])
        // "INSERT INTO Public.\"missingPlanes\" (planeName) SELECT  t1.planeName FROM Public.\"missingPlanes\" t1 WHERE NOT EXISTS(SELECT planeName FROM Public.\"missingPlanes\" t2 WHERE t1.planeName = t2.planeName)"
            .catch(e => console.log(e))
    } else {
        console.log("Name: " + aircraftData.rows[0].iata);
        thisPlane.iata = aircraftData.rows[0].iata;
        console.log(thisPlane);
        distance.originToDestination = dist(originAirportCoordinates.lat, originAirportCoordinates.long, destinationAirportCoordinates.lat, destinationAirportCoordinates.long);
        distance.planeToOrigin = dist(thisPlane.long, thisPlane.lat, originAirportCoordinates.lat, originAirportCoordinates.long);
        distance.planeToDestination = dist(thisPlane.long, thisPlane.lat, destinationAirportCoordinates.lat, destinationAirportCoordinates.long);
        fuelChartDatabase(thisPlane.iata, distance.originToDestination);
    }
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

function fuelChartAssign(fuelUsed, flightDistance) {
    // console.log(Object.entries(fuelUsed.rows[0])[0]);
    const [fuelDistance, fuel] = Object.entries(fuelUsed.rows[0])[0];
    console.log("fuel used: " + fuel);
    console.log("distance: " + fuelDistance + "nm");
    let total = fuel / fuelDistance; //* 1.852);
    console.log("fuel per nm: " + total.toFixed(2)); //kg/km
    thisPlane.fuelToUse = total.toFixed(2);
    thisPlane.fuelUsed = (total * flightDistance).toFixed(2);
    if (infoCorrect == true) {
        insertEmissions(thisPlane.icao, originAirportCoordinates.name, destinationAirportCoordinates.name, thisPlane.owner, thisPlane.manufacture, thisPlane.model, thisPlane.fuelToUse, thisPlane.fuelUsed, thisPlane.callsign, thisPlane.originCountry)
    }
}

function roundDistance(currentDistanceKm) {
    console.log("KM: " + currentDistanceKm);
    let currentDistanceNm = currentDistanceKm / 1.852;
    console.log("NM: " + currentDistanceNm);
    let roundedDistance = 0;
    let array = [125, 250, 500, 750, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500];
    for (let i = 0; i < array.length; i++) {
        if (array[i] >= currentDistanceNm && i > 0) {
            roundedDistance = array[i];
            console.log("Rounded Distance " + roundedDistance);
            break;
        } else if (125 > currentDistanceNm) {
            roundedDistance = 125;
        }
    }
    return roundedDistance; // in nm/kg
}

function fuelChartDatabase(code, flightDistance) {
    console.log("CODE: " + code);
    let RoundedDistance = roundDistance(flightDistance);
    model.query("SELECT \"" + RoundedDistance + "\" from Public.\"fuelChart\" where code = $1", [code])
        .then(function (results) {
            fuelChartAssign(results, RoundedDistance);
        })
        .catch(e => console.log(e))
}

function insertEmissions(icaoValue, originAirportValue, destinationAirportValue, ownerValue, manufactureValue, modelValue, fuelPerKmValue, fuelUsedValue, callsign, originCountry) {
    model.query("INSERT INTO Public.\"dataAnalysisTest\"(icao, callsign,originAirport, destinationAirport, airline, manufacture, model,origincountry, fuelPerKm, fuelUsed,emissions) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)", [icaoValue, callsign, originAirportValue, destinationAirportValue, ownerValue, manufactureValue, modelValue, originCountry, fuelPerKmValue, fuelUsedValue, null])
        .catch(e => console.log(e))
}


