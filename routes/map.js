const express = require('express');
const router = express.Router();

/* GET map page. */
router.get('/', function (req, res, next) {
    res.render('map', {
        title: 'OpenSky Network Mapping',
    });

});

module.exports = router;
