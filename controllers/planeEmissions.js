const {Client} = require('pg');
const airport = require('./../public/javascripts/api/airportQuery');
const dist = require('./../public/javascripts/calculations/greatCircleDistance');
const plane = require('../public/javascripts/getSinglePlane'); //Calls plane icao
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
    },
    icao: "",
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
    }).then(
        function () {
            aircraftDatabase(thisPlane.icao);
        }
    )
}).catch(err => {
    console.log(err);
});


function checkAirportInformation(airports) {
    if (airports == null) {
        console.log("There is a null " + airports);
    } else {
        console.log("Information is correct");
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

function fuelChartAssign(fuelUsed, distance) {
    const [dist, fuel] = Object.entries(fuelUsed.rows[0])[0];
    console.log("fuel used: " + fuel);
    console.log("distance: " + dist + "nm");
    let total = fuel / (dist * 1.852);
    console.log("fuel per km: " + total.toFixed(2)); //kg/km
    thisPlane.fuelUsed = (total * distance).toFixed(2);
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

function fuelChartDatabase(code, distance) {
    console.log("CODE: " + code);
    let RoundedDistance = roundDistance(distance);
    model.query("SELECT \"" + RoundedDistance + "\" from Public.\"fuelChart\" where code = $1", [code])
        .then(results => fuelChartAssign(results, distance))
        .catch(e => console.log(e))
}


exports.getPlane = function (req, res, next) {
    console.log("PLANE: ");
    console.log(thisPlane);
    distance.originToDestination = dist(originAirportCoordinates.lat, originAirportCoordinates.long, destinationAirportCoordinates.lat, destinationAirportCoordinates.long);
    distance.planeToOrigin = dist(thisPlane.lat, thisPlane.long, originAirportCoordinates.lat, originAirportCoordinates.long);
    distance.planeToDestination = dist(thisPlane.lat, thisPlane.long, destinationAirportCoordinates.lat, destinationAirportCoordinates.long);
    fuelChartDatabase(thisPlane.iata, distance.originToDestination);
    res.render('planeEmissions', {
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
        distancePlaneToOrigin: distance.planeToOrigin,
        planeIata: thisPlane.iata,
        planeManufacture: thisPlane.manufacture,
        planeModel: thisPlane.model,
        planeOwner: thisPlane.owner,
        planeModelIcao: thisPlane.modelIcao,
        fuelUsed: thisPlane.fuelUsed,
        fuelToUse: thisPlane.fuelToUse
    });
};


