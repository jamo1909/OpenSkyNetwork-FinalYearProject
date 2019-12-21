var express = require('express');
var router = express.Router();

/* GET data page. */
router.get('/', function (req, res, next) {
    res.render('documentation', {
        title: 'Data'
    });

});

module.exports = router;
