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
// change to import values - Remove
const originAirport = "ESSA";
const destinationAirport = "EDDF";
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
        .then(results => module.exports = setDest(results))
        .catch(e => console.log(e))
        .finally(() => dest.end())
}

function setDest(destinationAirportData) {
    console.log("Destination");
    // console.log(destinationAirportData.rows);
    console.log("Name: " + destinationAirportData.rows[0].name);
    console.log("Latitude: " + destinationAirportData.rows[0].latitude + "\nLongitude: " + destinationAirportData.rows[0].longitude);
    destinationAirportCoordinates.lat = parseFloat(destinationAirportData.rows[0].latitude);
    destinationAirportCoordinates.lat = parseFloat(destinationAirportData.rows[0].longitude);
}
//Collect origin airport long/lat
function setOrigin(originAirportData) {
    console.log("Origin");
    // console.log(originAirportData.rows);
    console.log("Name: " + originAirportData.rows[0].name);
    console.log("Latitude: " + originAirportData.rows[0].latitude + "\nLongitude: " + originAirportData.rows[0].longitude);
    originAirportCoordinates.lat = parseFloat(originAirportData.rows[0].latitude);
    originAirportCoordinates.long = parseFloat(originAirportData.rows[0].longitude);

}

//Collect destination airport long/lat


// var pg = require('pg');
// var connectionString = "postgres://postgres:jamo1818@localhost/ip:5433/aircraftModel";
// var pgClient = new pg.Client(connectionString);
// pgClient.connect()
//     .then(() => console.log("Connected successfuly"))
//     .then(() => model.query("SELECT * from Public.\"airportDatabase\" where icaocode = $1", [airportCode]))
//     .then(results => setOrigin(results))
//     .catch(e => console.log(e))
//     .finally(() => model.end())

// var pgp = require('pg-promise')(/* options */)
// var db = pgp('postgres://postgres:jamo1818@localhost:5433/aircraftModel')
//
// function originAirportLocation(airportCode) {
//     db.one("SELECT * from \"airportDatabase\" where icaocode = $1", [airportCode])
//         .then(function (data) {
//             console.log('DATA:', data)
//         })
//         .catch(function (error) {
//             console.log('ERROR:', error)
//         })
// }