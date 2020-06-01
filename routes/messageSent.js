const express = require('express');
const router = express.Router();

/* GET map page. */
router.post('/', function (req, res) {
    var name = req.body.name
    res.render('messageSent', {
        name: name,
    });

});


module.exports = router;