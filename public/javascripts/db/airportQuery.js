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

// const originAirport = "ESSA";
// const destinationAirport = "EDDF";
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

    destinationAirportCoordinates.lat = parseFloat(destinationAirportData.rows[0].latitude);
    destinationAirportCoordinates.lat = parseFloat(destinationAirportData.rows[0].longitude);
}
//Collect origin airport long/lat
function setOrigin(originAirportData) {
    originAirportCoordinates.lat = parseFloat(originAirportData.rows[0].latitude);
    originAirportCoordinates.long = parseFloat(originAirportData.rows[0].longitude);

}
