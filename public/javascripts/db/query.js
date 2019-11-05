const {Client} = require('pg');
const model = new Client({
    user: "postgres",
    password: "jamo1818",
    host: "localhost",
    port: 5433,
    database: "aircraftModel"
});

const aircraft = new Client({
    user: "postgres",
    password: "jamo1818",
    host: "localhost",
    port: 5433,
    database: "aircraftModel"
});

//Database query to send to function
// aircraftModel();
aircraftDatabase("a21432");//change out for api

function aircraftDatabase(icao) {
    model.connect()
        .then(() => console.log("Connected successfuly"))
        .then(() => model.query("select * from \"aircraftDatabase\" where icao24 = $1", [icao]))
        //.then(results => console.table(results.rows))
        .then(results => setValue(results))
        .catch(e => console.log(e))
        .finally(() => model.end())
}


function setValue(value) {
    if (value == null) {
        alert("Plane not found");
        console.log("ICAO24 not in aircraftDatabase");
    } else {
        console.log("Model: " + value.rows[0].model);
        // console.log(value.rows[0]);
        console.log("Rows: " + value.rowCount);
        aircraftModel((value.rows[0].model).toString());
    }
}

//Model information query fuel/seating
function aircraftModel(model) {
    model = model.substring(0, 4);
    console.log(model);
    aircraft.connect()
        .then(() => console.log("Connected successfuly"))
        .then(() => aircraft.query("SELECT * FROM \"aircraftModels\" where model LIKE $1", ["Airbus A320"]))
        //.then(results => console.table(results.rows))
        .then(results => printValue(results))
        .catch(e => console.log(e))
        .finally(() => aircraft.end())
}

function printValue(result) {
    console.log("Seats: " + result.rows[0].seats);
    console.log("FuelBurn:" + result.rows[0].fuelburn);
}

// while(value.rowCount > 1){
//     for(var i=model; i>0;i--){
//
//     }
// }
