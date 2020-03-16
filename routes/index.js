const express = require('express');
const router = express.Router();
let planeEmissions = require('../controllers/planeEmissions');


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Real Time Aviation Emissions',
        nameStudent: 'James Murphy',
        student_id: '16421512',
        uni: 'Maynooth University'
    });

});


module.exports = router;