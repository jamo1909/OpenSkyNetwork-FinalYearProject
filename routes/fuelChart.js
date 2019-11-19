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

fuelChartDatabase("141", '125');

function fuelChartAssign(fuelUsed, distance) {
    const [dist, fuel] = Object.entries(fuelUsed.rows[0])[0];
    console.log(fuel);
    console.log(dist);
}


function fuelChartDatabase(code, distance) {
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
        planeIcao: "Hello",
    });

});

module.exports = router;
