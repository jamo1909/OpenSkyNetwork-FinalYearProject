const express = require('express');
const router = express.Router();
let planeEmissions = require('../controllers/planeEmissions');

router.get('/', planeEmissions.getPlaneEmissions);







module.exports = router;
