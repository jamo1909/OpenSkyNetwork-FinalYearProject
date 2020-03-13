const express = require('express');
const router = express.Router();


// /* GET home page. */
// router.get('/', function (req, res, next) {
//     res.render('test', {
//         test: 'Real Time Aviation Emissions',
//     });
//
// });


/* GET Game page. */
// router.get('/', function(req, res) {
//     res.render('test', {
//         test: req.body.name,
//     });
// });

router.post('/', function (req, res) {
    // res.send(req.body.icaocode);
    res.render('test', {
        icaocode: req.body.icaocode,
        lat: req.body.lat,
        long: req.body.long,
    });
});

module.exports = router;