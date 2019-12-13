const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('dataAnalysis', {
        title: 'OpenSky Network Real Time Emissions Analysis',
        nameStudent: 'James Murphy',
        student_id: '16421512',
        uni: 'Maynooth University'
    });

});

module.exports = router;