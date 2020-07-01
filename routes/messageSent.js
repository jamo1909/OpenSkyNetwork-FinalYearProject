const express = require('express');
const router = express.Router();
var nodemailer = require('nodemailer');

/* GET map page. */
router.post('/', function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    console.log(email);
    var subject = req.body.subject;
    var message = req.body.message;

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jmurphy1909@gmail.com',
            pass: 'Courtown1818'
        }
    });

    var mailOptions = {
        from: email,
        to: 'jmurphy1909@gmail.com',
        subject: "RTAE - "+subject,
        text: message
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            res.render('messageSent', {
                name: name,
            });
        }
    });





});


module.exports = router;