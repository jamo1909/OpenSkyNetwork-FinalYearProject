var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('search', {
        title: 'OpenSky Network Real Time Emissions',
        name: 'Search planes'
    });

});

module.exports = router;
