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
    model.query("SELECT * from Public.\"airportDatabase\"")
        .then(results => setGeoJson(results.rows))
        .catch(e => console.log(e));

    function setGeoJson(results) {
        // console.log(results);
        var geoJson = {
            "type": "Feature",
            "properties": {
                "name": results[0].name,
                "city": results[0].city,
                "country": results[0].country
            },
            "geometry": {
                "type": "Point",
                "coordinates": [results[0].latitude, results[0].longitude]
            }
        };
        // console.log(geoJson);
        res.render('index', {
            title: "Express API", // Give a title to our page
            jsonData: results// Pass data to the View
        });
    }


});


module.exports = router;