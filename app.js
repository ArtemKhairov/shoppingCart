var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require("hbs");
var mongoose = require("mongoose");
var session = require("express-session");
var passport = require("passport");
var flash = require("connect-flash");
var validator = require("express-validator");
var MongoStore = require("connect-mongo")(session);

var userRouter = require("./routes/user");

var app = express();

var indexRouter = require('./routes/index');
// Подключаемся к бд
mongoose.connect("mongodb://localhost:27017/shop", { useNewUrlParser: true });
require("./config/passport");

// view engine setup
app.set("view engine", "hbs")
hbs.registerPartials(__dirname + "/views/partials");

app.use(logger('dev'));
app.use(validator());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: "allah",
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 60 * 60 * 1000 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// Установка локали показывающей логирование во всех views
app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

// Регистрируем маршруты
app.use("/user", userRouter);
app.use('/', indexRouter);

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
