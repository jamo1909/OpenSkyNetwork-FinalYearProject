var express = require('express');
var router = express.Router();
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


function fuelChartAssign(fuelUsed) {
    const [dist, fuel] = Object.entries(fuelUsed.rows[0])[0];
    console.log(fuel);
    console.log(dist);
    let total = fuel / dist;
    console.log("fuel per km: " + total.toFixed(2));
}

function roundDistance(currentDistance) {
    let roundedDistance = 0;
    let array = [125, 250, 500, 750, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500];
    for (let i = 0; i < array.length; i++) {
        if (array[i] > currentDistance && i > 0) {
            roundedDistance = array[i];
            break;
        } else if (125 < currentDistance) {
            roundedDistance = 125;
        }
    }
    return roundedDistance;
}

function fuelChartDatabase(code, distance) {
    distance = roundDistance(distance);
    model.connect()
        .then(() => console.log("Connected successfuly"))
        .then(() => model.query("SELECT \"" + distance + "\" from Public.\"fuelChart\" where code = $1", [code]))
        .then(results => fuelChartAssign(results))
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
