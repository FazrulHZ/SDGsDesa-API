var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var refrtRouter = require('./routes/ref/refrt');
var refdesaRouter = require('./routes/ref/refdesa');
var refkecamatanRouter = require('./routes/ref/refkecamatan');
var refkabupatenRouter = require('./routes/ref/refkabupaten');

var desainfoRouter = require('./routes/desainfo');
var rtRouter = require('./routes/rt');
var kkRouter = require('./routes/kk');
var pendudukRouter = require('./routes/penduduk');
var lkdRouter = require('./routes/lkd');
var userRouter = require('./routes/user');
var loginRouter = require('./routes/login');

var app = express();
app.use(cors());
app.options('*', cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/refdesa', refdesaRouter);
app.use('/refrt', refrtRouter);
app.use('/refkecamatan', refkecamatanRouter);
app.use('/refkabupaten', refkabupatenRouter);

app.use('/desainfo', desainfoRouter);
app.use('/rt', rtRouter);
app.use('/kk', kkRouter);
app.use('/penduduk', pendudukRouter);
app.use('/lkd', lkdRouter);
app.use('/user', userRouter);
app.use('/login', loginRouter);

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
