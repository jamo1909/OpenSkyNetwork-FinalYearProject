const express = require('express');
const router = express.Router();
const {Client} = require('pg');

//Importing javascript files
const plane = require('../public/javascripts/getPlanes'); //API call to receive a JSON file of planes
const airport = require('./../public/javascripts/api/airportQuery'); //API call for querying origin and destination airport
const dist = require('./../public/javascripts/calculations/greatCircleDistance'); //Calculation of the haversine function

const model = new Client({
    user: "postgres",
    password: "jamo1818",
    host: "localhost",
    port: 5433,
    database: "aircraftModel"
});//Details needed to connect to Database
model.connect();//Connection made to database

let originAirportCoordinates = {
    name: "",
    lat: 0,
    long: 0
};//Variable contains information for origin airport

let destinationAirportCoordinates = {
    name: "",
    lat: 0,
    long: 0
};//Variable contains information for destination airport

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
    engine: "",
    owner: "",
    modelIcao: "",
    fuelUsed: 0,
    fuelToUse: 0
};//Variable contains information for the current aircraft

let distance = {
    originToDestination: 0,
    planeToOrigin: 0,
    planeToDestination: 0
};//Variable for contain flight distances

//Once a plane is selected from the planeMap page, The ICAO code, Latitude and longitude are sent to this function.
router.post('/', function (req, res) {
    thisPlane.icao = req.body.icaocode; //Variable contain the aircraft's ICAO code
    thisPlane.lat = req.body.lat;//Variable contain the aircraft's current latitude
    thisPlane.long = req.body.long;//Variable contain the aircraft's longitude
    if (checkPlaneinformation(thisPlane.icao, thisPlane.long, thisPlane.lat)) { //if the aircraft information is valid
        airport(thisPlane.icao).then(resultAirport => { //Sends the aircraft ICAO to the airportQuery API call
            if (resultAirport.arrival == null || resultAirport.destination == null) { //if the return airports are null
                console.log("The airports returned null");//print to console
                console.log("Origin: " + resultAirport.arrival);//print to console
                console.log("Destination: " + resultAirport.destination);//print to console
            } else { //if the airports returned are valid
                thisPlane.airport.origin = resultAirport.arrival; // set origin airport
                thisPlane.airport.destination = resultAirport.destination;// set destination airport
                console.log("Origin: " + thisPlane.airport.origin); //print to console
                console.log("Destination: " + thisPlane.airport.destination);//print to console
                originAirportLocation(thisPlane.airport.origin); //Get origin airport information from database
                destinationAirportLocation(thisPlane.airport.destination); //Get destination airport information from database
                aircraftDatabase(thisPlane.icao); //Get aircraft information from database
            }
        })
    } else { //if the aircraft's information is not valid
        console.log("Plane info incorrect");
    }//else
    res.render('planeEmissions', {
        planeIcao: req.body.icaocode,
        planeLat: req.body.lat,
        planeLong: req.body.long,
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
        planeEngine: thisPlane.engine,
        planeOwner: thisPlane.owner,
        planeModelIcao: thisPlane.modelIcao,
        fuelUsed: thisPlane.fuelUsed,
        fuelToUse: thisPlane.fuelToUse,
    });//Send the results to planeEmissions.ejs

});


function checkAirportInformation(airports) { //checks that the airport information is valid
    if (airports == null) { //if the airport is null
        console.log("There is a null " + airports);//Print to console
        return false; //Send false back
    } else {//if the airport is valid
        console.log("Information is correct");//Print to console
        return true;//Send true back
    }
}

function checkPlaneinformation(planeICAO, long, lat) {//check if plane from API is valid
    if (planeICAO == null || long == null || lat == null) {//if any of plane information is null
        console.log("This Plane info is incorrect");//Print to console
        return false;//send false back
    } else { //plane information is correct
        return true;//send true back
    }
}

async function originAirportLocation(airportCode) {
    if (checkAirportInformation(airportCode)) {//check if the airportCode is valid
        model.query("SELECT * from Public.\"airportDatabase\" where icaocode = $1", [airportCode])//Get all airports from database with the same ICAO code
            .then(results => setOrigin(results)) //if the response is valid
            .catch(e => console.log(e)) //if there is an error print to console
    }
}

//GET destination airport information from DB
async function destinationAirportLocation(airportCode) {
    if (checkAirportInformation(airportCode)) {//check if the airportCode is valid
        model.query("SELECT * from Public.\"airportDatabase\" where icaocode = $1", [airportCode])//Get all airports from database with the same ICAO code
            .then(results => setDest(results))//if the response is valid
            .catch(e => console.log(e)) //if there is an error print to console
    }

}

//Collect origin airport long/lat
function setOrigin(originAirportData) {
    console.log("Origin");//print to console
    console.log("Name: " + originAirportData.rows[0].name);//print to console
    console.log("Latitude: " + originAirportData.rows[0].latitude + "\nLongitude: " + originAirportData.rows[0].longitude);//print to console
    originAirportCoordinates.name = originAirportData.rows[0].name; //assign origin airport name
    originAirportCoordinates.lat = parseFloat(originAirportData.rows[0].latitude);//assign origin airport latitude
    originAirportCoordinates.long = parseFloat(originAirportData.rows[0].longitude);//assign origin airport longitude

}

//Collect destination airport long/lat
function setDest(destinationAirportData) {
    console.log("Destination");//print to console
    console.log("Name: " + destinationAirportData.rows[0].name);//print to console
    console.log("Latitude: " + destinationAirportData.rows[0].latitude + "\nLongitude: " + destinationAirportData.rows[0].longitude);//print to console
    destinationAirportCoordinates.name = destinationAirportData.rows[0].name;//assign destination airport name
    destinationAirportCoordinates.lat = parseFloat(destinationAirportData.rows[0].latitude);//assign destination airport latitude
    destinationAirportCoordinates.long = parseFloat(destinationAirportData.rows[0].longitude);//assign destination airport longitude
}


//Collect origin airport long/lat
function setAircraftInfo(aircraftData) {
    console.log("Name: " + aircraftData.rows[0].icao24);//print to console
    console.log("manufacture: " + aircraftData.rows[0].manufacture);//print to console
    console.log("model: " + aircraftData.rows[0].model);//print to console
    console.log("Engine: " + aircraftData.rows[0].engine);//print to console
    thisPlane.manufacture = aircraftData.rows[0].manufacture;//print to console
    thisPlane.model = aircraftData.rows[0].model; //Assign aircraft model
    thisPlane.engine = aircraftData.rows[0].engine;//Assign aircraft engine
    thisPlane.owner = aircraftData.rows[0].owner;//Assign aircraft airline
    thisPlane.modelIcao = aircraftData.rows[0].typecode;//Assign aircraft model number
    if (thisPlane.manufacture == "Airbus" || thisPlane.manufacture == "Airbus Industrie") {
        console.log((thisPlane.model).substr(0, 4));
        codeConvertion((thisPlane.model).substr(0, 4));
    } else {
        console.log(thisPlane.modelIcao);
        codeConvertion(thisPlane.modelIcao);
    }

}

function aircraftIata(aircraftData) {
    if (aircraftData.rowCount == 0) { //If the aircraft is not in the database
        console.log(thisPlane.modelIcao + " Not in Database");//print to console
        model.query("INSERT INTO Public.\"missingPlanes\"(planeName) values($1) ", [thisPlane.model]) //Insert aircraft in the missingPlanes DB
            .catch(e => console.log(e)) //If there is an error
    } else { //If the aircraft is the the DB
        console.log("Name: " + aircraftData.rows[0].iata);//Print to console
        thisPlane.iata = aircraftData.rows[0].iata; //Assign the IATA code
        console.log(thisPlane);//print to console
        //Assigns the distance from the origin airport and destination airport that is returned from the distance function
        distance.originToDestination = dist(originAirportCoordinates.lat, originAirportCoordinates.long, destinationAirportCoordinates.lat, destinationAirportCoordinates.long);
        //Assigns the distance from the origin airport and the aircraft that is returned from the distance function
        distance.planeToOrigin = dist(thisPlane.long, thisPlane.lat, originAirportCoordinates.lat, originAirportCoordinates.long);
        //Assigns the distance from the destination airport and the aircraft that is returned from the distance function
        distance.planeToDestination = dist(thisPlane.long, thisPlane.lat, destinationAirportCoordinates.lat, destinationAirportCoordinates.long);
        fuelChartDatabase(thisPlane.iata, distance.originToDestination);//Send the aircraft IATA code and the journey distance to the fuel chart function
    }
}

function aircraftDatabase(airportCode) {
    model.query("SELECT * from Public.\"aircraftInformation\" where icao24 = $1", [airportCode])//Select all aircraft fromm DB where the Icao code is $1
        .then(results => setAircraftInfo(results))//If the response is valid
        .catch(e => console.log(e))//If there is a error in the response
}

function codeConvertion(airportCode) {
    model.query("SELECT distinct *  FROM Public.\"aircraftCodeConvertion\" where icao=$1", [airportCode])//Select all codes where the Icao code is $1
        .then(results => aircraftIata(results))//If the response is valid
        .catch(e => console.log(e))//If there is a error in the response
}

function fuelChartAssign(fuelUsed, flightDistance) {
    const [fuelDistance, fuel] = Object.entries(fuelUsed.rows[0])[0]; //Assign the Distance and fuel
    console.log("fuel used: " + fuel);//Print to console
    console.log("distance: " + fuelDistance + "nm");//Print to console
    let total = fuel / fuelDistance; //Average fuel consumption per km
    console.log("fuel per nm: " + total.toFixed(2)); //Print to console
    thisPlane.fuelToUse = total.toFixed(2);
    thisPlane.fuelUsed = (total * flightDistance).toFixed(2);

}

function roundDistance(currentDistanceKm) {
    console.log("KM: " + currentDistanceKm);//Print to console
    let currentDistanceNm = currentDistanceKm / 1.852; //Converts Kilometers to nautical miles
    console.log("NM: " + currentDistanceNm);//Print to console
    let roundedDistance = 0; //declaring variable
    let array = [125, 250, 500, 750, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500]; //Assigned distance interval for fuel chart
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
    console.log("CODE: " + code);//Print to console
    let RoundedDistance = roundDistance(flightDistance); //Round the distance to the nearest interval for the fuel chart
    model.query("SELECT \"" + RoundedDistance + "\" from Public.\"fuelChart\" where code = $1", [code]) //Query the fuel chart DB, with the rounded distance and aircraft code
        .then(function (results) {
            fuelChartAssign(results, RoundedDistance);//Send fuel chart results
        })
        .catch(e => console.log(e)) //if the response has an error
}







module.exports = router;
