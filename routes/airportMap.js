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
    model.query("SELECT * from Public.\"airportDatabase\" where country like 'United Kingdom' OR country like 'Ireland'")
    // model.query("SELECT * from Public.\"airportDatabase\" where country like 'Ireland'")
        .then(results => setGeoJson(results.rows))
        .catch(e => console.log(e));

    function setGeoJson(results) {
        // console.log(results);
        // console.log(geoJson);
        res.render('airportMap', {
            title: "Express API", // Give a title to our page
            jsonData: results// Pass data to the View
        });
    }


});


module.exports = router;