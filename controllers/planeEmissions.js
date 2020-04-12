const {Client} = require('pg');

//Importing javascript files
const airport = require('./../public/javascripts/api/airportQuery');//API call to receive a JSON file of planes
const dist = require('./../public/javascripts/calculations/greatCircleDistance');//API call for querying origin and destination airport
const plane = require('../public/javascripts/getSinglePlane'); //Calculation of the haversine function

const model = new Client({
    user: "postgres",
    password: "jamo1818",
    host: "localhost",
    port: 5433,
    database: "aircraftModel"
});//Details needed to connect to Database
model.connect();//Connection made to database
var infoCorrect = true;//Used to check if aircraft emissions should be inserted in DB


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

var now = new Date();
var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0, 0) - now;
if (millisTill10 < 0) {
    millisTill10 += 86400000;
}//is used to mark 10am every day

setTimeout(function () {
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
                    if (resultAirports.arrival == null || resultAirports.destination == null) {//if the return airports are null
                        console.log("The airports returned null");//print to console
                        console.log("Origin: " + resultAirports.arrival);//print to console
                        console.log("Destination: " + resultAirports.destination);//print to console
                    } else { //if the airports returned are valid
                        thisPlane.airport.origin = resultAirports.arrival; // set origin airport
                        thisPlane.airport.destination = resultAirports.destination;// set destination airport
                        console.log("Origin: " + thisPlane.airport.origin);//print to console
                        console.log("Destination: " + thisPlane.airport.destination);//print to console
                        originAirportLocation(thisPlane.airport.origin); //Get origin airport information from database
                        destinationAirportLocation(thisPlane.airport.destination); //Get destination airport information from database
                        aircraftDatabase(thisPlane.icao); //Get aircraft information from database
                    }//else
                })//airport
            } else {//if the aircraft's information is not valid
                console.log("Plane info incorrect");
            }//else
        }).catch(err => {
            console.log(err);//print to console
        });//catch

        if (--indexPlane) myLoop(indexPlane);      //  decrement i and call myLoop again if i > 0
    }, 3000)//Wait 3 seconds between each aircraft
})(100);//Preform the emission function on 100 aircraft
}, millisTill10);//Preform the function at 10am every day


function checkAirportInformation(airports) {//checks that the airport information is valid
    if (airports == null) {//if the airport is null
        console.log("There is a null " + airports);//Print to console
        infoCorrect = false; //Set infoCorrect to false
        return false; //Send false back
    } else { //if the airport is valid
        console.log("Information is correct");
        return true;//Send true back
    }
}

function checkPlaneInformation(planeICAO, long, lat) { //check if plane from API is valid
    if (planeICAO == null || long == null || lat == null) { //if any of plane information is null
        console.log("This Plane info is incorrect");// Print to console
        return false //send false back
    } else { //plane information is correct
        return true; //send true back
    }
}

//GET origin airport information from DB
async function originAirportLocation(airportCode) {
    if (checkAirportInformation(airportCode)) {//check if the airportCode is valid
        model.query("SELECT * from Public.\"airportDatabase\" where icaocode = $1", [airportCode])//Get all airports from database with the same ICAO code
            .then(results => setOrigin(results))//if the response is valid
            .catch(e => console.log(e))//if there is an error print to console
    }//if

}

//GET destination airport information from DB
async function destinationAirportLocation(airportCode) {
    if (checkAirportInformation(airportCode)) {//check if the airportCode is valid
        model.query("SELECT * from Public.\"airportDatabase\" where icaocode = $1", [airportCode])
            .then(results => setDest(results))//if the response is valid
            .catch(e => console.log(e)) //if there is an error print to console
    }//if

}

//Collect origin airport long/lat
function setOrigin(originAirportData) {
    console.log("Origin");//print to console
    console.log("Name: " + originAirportData.rows[0].name);//print to console
    console.log("Latitude: " + originAirportData.rows[0].latitude + "\nLongitude: " + originAirportData.rows[0].longitude);//print to console
    originAirportCoordinates.name = originAirportData.rows[0].name;//assign origin airport name
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
    thisPlane.manufacture = aircraftData.rows[0].manufacture;//Assign aircraft manufacture
    thisPlane.model = aircraftData.rows[0].model;//Assign aircraft model
    thisPlane.owner = aircraftData.rows[0].owner;//Assign aircraft owner
    thisPlane.modelIcao = aircraftData.rows[0].typecode;//Assign aircraft type code
    if (thisPlane.manufacture == "Airbus" || thisPlane.manufacture == "Airbus Industrie") {
        console.log((thisPlane.model).substr(0, 4));//print to console
        codeConvertion((thisPlane.model).substr(0, 4));
    } else {
        console.log(thisPlane.modelIcao);//print to console
        codeConvertion(thisPlane.modelIcao);
    }

}

function aircraftIata(aircraftData) {
    if (aircraftData.rowCount == 0) {//If the aircraft is not in the database
        console.log(thisPlane.modelIcao + " Not in Database");//print to console
        model.query("INSERT INTO Public.\"missingPlanes\"(planeName) values($1) ", [thisPlane.model]) //Insert the missing aircraft into missing plane DB
            .catch(e => console.log(e))//If there is an error print to console
    } else {
        console.log("Name: " + aircraftData.rows[0].iata);//print to console
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
    model.query("SELECT distinct *  FROM Public.\"aircraftCodeConvertion\" where icao=$1", [airportCode])
        .then(results => aircraftIata(results))
        .catch(e => console.log(e))
}

function fuelChartAssign(fuelUsed, flightDistance) {
    const [fuelDistance, fuel] = Object.entries(fuelUsed.rows[0])[0];//Assign the Distance and fuel
    console.log("fuel used: " + fuel);//print to console
    console.log("distance: " + fuelDistance + "nm");//print to console
    let total = fuel / fuelDistance; //Average fuel consumption per km
    console.log("fuel per nm: " + total.toFixed(2)); //kg/km //print to console
    thisPlane.fuelToUse = total.toFixed(2); //Assign total
    thisPlane.fuelUsed = (total * flightDistance).toFixed(2);//Assign fuel used
    if (infoCorrect == true) {//If the data is correct
        insertEmissions(thisPlane.icao, originAirportCoordinates.name, destinationAirportCoordinates.name, thisPlane.owner, thisPlane.manufacture, thisPlane.model, thisPlane.fuelToUse, thisPlane.fuelUsed, thisPlane.callsign, thisPlane.originCountry)//Insert the aircraft Information and emissions to the DB
    }//if
}

function roundDistance(currentDistanceKm) {
    console.log("KM: " + currentDistanceKm);//print to console
    let currentDistanceNm = currentDistanceKm / 1.852;//Assigning and convertion the distance to KM from nm
    console.log("NM: " + currentDistanceNm);//print to console
    let roundedDistance = 0; //declaring variable
    let array = [125, 250, 500, 750, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500];//Assigned distance interval for fuel chart
    for (let i = 0; i < array.length; i++) {//for loop
        if (array[i] >= currentDistanceNm && i > 0) {
            roundedDistance = array[i];
            console.log("Rounded Distance " + roundedDistance);//print to console
            break;
        } else if (125 > currentDistanceNm) {
            roundedDistance = 125;
        }
    }
    return roundedDistance; // in nm/kg
}

function fuelChartDatabase(code, flightDistance) {
    console.log("CODE: " + code);//print to console
    let RoundedDistance = roundDistance(flightDistance);//Round the distance to the nearest interval for the fuel chart
    model.query("SELECT \"" + RoundedDistance + "\" from Public.\"fuelChart\" where code = $1", [code])//Query the fuel chart DB, with the rounded distance and aircraft code
        .then(function (results) {
            fuelChartAssign(results, RoundedDistance);//Send fuel chart results
        })
        .catch(e => console.log(e))//if the response has an error
}

function insertEmissions(icaoValue, originAirportValue, destinationAirportValue, ownerValue, manufactureValue, modelValue, fuelPerKmValue, fuelUsedValue, callsign, originCountry) {
    model.query("INSERT INTO Public.\"dataAnalysisTest\"(icao, callsign,originAirport, destinationAirport, airline, manufacture, model,origincountry, fuelPerKm, fuelUsed,emissions) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)", [icaoValue, callsign, originAirportValue, destinationAirportValue, ownerValue, manufactureValue, modelValue, originCountry, fuelPerKmValue, fuelUsedValue, null])//insert aircraft emissions into data analysis DB
        .catch(e => console.log(e))
}


