const express = require('express');
const router = express.Router();
const {Client} = require('pg');

const model = new Client({
    user: "postgres",
    password: "jamo1818",
    host: "localhost",
    port: 5433,
    database: "aircraftModel"
});

//Testing
fuelChartDatabase("320", '500');


function fuelChartAssign(fuelUsed, distance) {
    const [dist, fuel] = Object.entries(fuelUsed.rows[0])[0];
    console.log("fuel used: " + fuel);
    console.log("distance: " + dist + "nm");
    let total = fuel / (dist * 1.852);
    console.log("fuel per km: " + total.toFixed(2)); //kg/km

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
    let RoundedDistance = roundDistance(distance);
    model.connect()
        .then(() => console.log("Connected successfuly"))
        .then(() => model.query("SELECT \"" + RoundedDistance + "\" from Public.\"fuelChart\" where code = $1", [code]))
        .then(results => fuelChartAssign(results, distance))
        .catch(e => console.log(e))
        .finally(() => model.end())
}


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('fuelChart', {
        fuel: "Hello",
    });

});

module.exports = router;
