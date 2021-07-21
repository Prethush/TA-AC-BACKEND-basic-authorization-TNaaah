var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo');
var adminRouter = require('./routes/admin');
var clientRouter = require('./routes/clients');
var auth = require('./middlewares/auth');

require('dotenv').config();

mongoose.connect("mongodb://127.0.0.1:27017/ecommerce",  { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  console.log(err ? err : "connected to db");
});


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: "mongodb://127.0.0.1:27017/ecommerce"
  }),
  cookie: {maxAge: 180 * 60 * 1000}
}));

app.use(flash());
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});


app.use(auth.userInfo);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/clients', clientRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
