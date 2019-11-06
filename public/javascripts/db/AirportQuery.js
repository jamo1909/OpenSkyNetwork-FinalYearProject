/*
TODO: connect to postgresql db for airport locations
      Change sql statment to suit db
      set functions to return answer
*/

//Connect to local Postgresql database
const {Client} = require('pg');
const airport = new Client({
    user: "postgres",
    password: "jamo1818",
    host: "localhost",
    port: 5433,
    database: "aircraftModel"
});

//TODO: Remove
//change to import values - Remove
var originAirport;
var destinationAirport;
originAirportLocation(originAirport);
destinationAirportLocation(destinationAirport);

let originAirportCoordinates={
    lat = 0,
    long =0
};

let destinationAirportCoordinates={
    lat = 0,
    long =0
};

function originAirportLocation(airportCode) {
    model.connect()
        .then(() => console.log("Connected successfuly"))
        .then(() => model.query("select name, latitude, longitude from \"airportLocation\" where airportIcao = $1", [airportCode]))
        .then(results => setOrigin(results))
        .return(results => setOrigin(results))
        .catch(e => console.log(e))
        .finally(() => model.end())
}

function destinationAirportLocation(airportCode) {
    model.connect()
        .then(() => console.log("Connected successfuly"))
        .then(() => model.query("select name,latitude, longitude from \"airportLocation\" where airportIcao = $1", [airportCode]))
        .then(results => setDest(results))
        .catch(e => console.log(e))
        .finally(() => model.end())
}

function setOrigin(originAirportData){
    console.log("Name: " + originAirportData.name);
    console.log("Latitude: " + originAirportData.latitude + "\nLongitude: " + originAirportData.longtitude);
    originAirportCoordinates.lat = originAirportData.latitude;
    originAirportlong.lat = originAirportData.longtitude;
}

function setOrigin(destinationAirportData){
    console.log("Name: " + destinationAirportData.name);
    console.log("Latitude: " + destinationAirportData.latitude + "\nLongitude: " + destinationAirportData.longtitude);
    destinationAirportCoordinates.lat = destinationAirportData.latitude;
    destinationAirportCoordinates.lat = destinationAirportData.longtitude; 
}

