var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'OpenSky Network Real Time Emissions',
        name: 'James Murphy',
        student_id: '16421512',
        uni: 'Maynooth University'
    });

});

module.exports = router;