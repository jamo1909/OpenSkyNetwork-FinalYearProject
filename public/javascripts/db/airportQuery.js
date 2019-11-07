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

//TODO: Remove
//change to import values - Remove
var originAirport = "ESSA";
var destinationAirport = "EDDF";
originAirportLocation(originAirport);
destinationAirportLocation(destinationAirport);

let originAirportCoordinates = {
    lat: 0,
    long: 0
};

let destinationAirportCoordinates = {
    lat: 0,
    long: 0
};

function originAirportLocation(airportCode) {
    model.connect()
        .then(() => console.log("Connected successfuly"))
        .then(() => model.query("select * from \"airportDatabase\" where code = $1", [airportCode]))
        .then(results => setOrigin(results))
        .catch(e => console.log(e))
        .finally(() => model.end())
}

function destinationAirportLocation(airportCode) {
    dest.connect()
        .then(() => console.log("Connected successfuly"))
        .then(() => dest.query("select * from \"airportDatabase\" where code = $1", [airportCode]))
        .then(results => setDest(results))
        .catch(e => console.log(e))
        .finally(() => dest.end())
}

function setOrigin(originAirportData) {
    console.log("Origin");
    console.log(originAirportData.rows);
    // console.log("Name: " + originAirportData.name);
    // console.log("Latitude: " + originAirportData.latitude + "\nLongitude: " + originAirportData.longtitude);
    // originAirportCoordinates.lat = originAirportData.latitude;
    // originAirportlong.lat = originAirportData.longtitude;
}

function setDest(destinationAirportData) {
    console.log("Destination");
    console.log(destinationAirportData.rows);
    // console.log("Name: " + destinationAirportData.name);
    // console.log("Latitude: " + destinationAirportData.latitude + "\nLongitude: " + destinationAirportData.longtitude);
    // destinationAirportCoordinates.lat = destinationAirportData.latitude;
    // destinationAirportCoordinates.lat = destinationAirportData.longtitude;
}

