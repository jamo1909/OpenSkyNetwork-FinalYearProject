var express = require('express');
var router = express.Router();
// var myModule = require('./../public/javascripts/api/airportQuery');



/* GET data page. */
router.get('/', function (req, res, next) {
    res.render('test', {
        title: 'Data'
    });

});

module.exports = router;
