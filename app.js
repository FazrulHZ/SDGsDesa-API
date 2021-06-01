var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var refdesaRouter = require('./routes/ref/refdesa');
var refkecamatanRouter = require('./routes/ref/refkecamatan');
var refkabupatenRouter = require('./routes/ref/refkabupaten');
var desainfoRouter = require('./routes/desainfo');
var rtRouter = require('./routes/rt');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: '*' }));

app.use('/', indexRouter);
app.use('/refdesa', refdesaRouter);
app.use('/refkecamatan', refkecamatanRouter);
app.use('/refkabupaten', refkabupatenRouter);
app.use('/desainfo', desainfoRouter);
app.use('/rt', rtRouter);

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
