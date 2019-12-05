const {Client} = require('pg');
const model = new Client({
    user: "postgres",
    password: "jamo1818",
    host: "localhost",
    port: 5433,
    database: "aircraftModel"
});
model.connect();


//
// function fetchAirports() {
//     model.query("SELECT * from Public.\"airportDatabase\" ")
//         .then((res) => console.log(res))
//         .catch((err) => {
//             if (err) throw err
//         })
// }
function originAirportLocation() {
    model.query("SELECT * from Public.\"airportDatabase\" ")
        .then(results => console.log(results))
        .catch(e => console.log(e))

}

exports.getAirportLocations = function () {
    originAirportLocation();
    console.log("WORKING");
};



