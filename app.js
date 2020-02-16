var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var start = require('./routes/start');
var indexRouter = require('./routes/index');
var planeMap = require('./routes/planeMap');
var airportMap = require('./routes/airportMap');
var planeEmissions = require('./routes/planeEmissions');
var data = require('./routes/data');
var dataAnalysis = require('./routes/dataAnalysis');
var documentation = require('./routes/documentation');
var airportEmissions = require('./routes/airportEmissions');


//TODO: Get rid when finished
var distance = require('./routes/distance');
var planeInformation = require('./routes/planeInformation');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(__dirname + "/public"));


app.use('/', start);
app.use('/index', indexRouter);
app.use('/planeEmissions', planeEmissions);
app.use('/planeMap', planeMap);
app.use('/airportMap', airportMap);
app.use('/dataAnalysis', dataAnalysis);
app.use('/documentation', documentation);
app.use('/airportEmissions', airportEmissions);

//TODO: Get rid when finished
app.use('/data', data);
app.use('/users', usersRouter);
app.use('/planeInformation', planeInformation);
app.use('/distance', distance);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
