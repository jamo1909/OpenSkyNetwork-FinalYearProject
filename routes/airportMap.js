var express = require('express'); // require Express
var router = express.Router(); // setup usage of the Express router engine
const {Client} = require('pg');
const model = new Client({
    user: "postgres",
    password: "jamo1818",
    host: "localhost",
    port: 5433,
    database: "aircraftModel"
});
model.connect();

router.get('/', function (req, res, next) {
    model.query("SELECT * from Public.\"airportDatabase\" where country like 'United Kingdom' OR country like 'Ireland' OR country like 'France'OR country like 'Germany' OR country like 'Spain'")
        .then(function (airports) {
            res.render('airportMap', {
                title: "Express API", // Give a title to our page
                jsonData: airports.rows // Pass data to the View
            });
        })
        .catch(e => console.log(e));
});




module.exports = router;