const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('start', {
        title: 'Real Time Aviation Emissions',
    });

});

module.exports = router;