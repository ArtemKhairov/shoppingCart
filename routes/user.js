const express = require("express");
const userRouter = express.Router();
const csrf = require("csurf");
var passport = require('passport');

const csrfProtection = csrf();
userRouter.use(csrfProtection);

userRouter.get("/profile", isLoggedIn, function (req, res, next) {
  res.render("user/profile.hbs", { username: req.user.email });
})

userRouter.get("/logout", isLoggedIn, function (req, res, next) {
  req.logout();
  res.redirect("/");
});

userRouter.use("/", notLoggedIn, function (req, res, next) {
  next();
})



userRouter.get("/signup", function (req, res, next) {
  var messages = req.flash("error");
  res.render("user/signup.hbs", { csrfToken: req.csrfToken, messages: messages, hasErrors: messages.length > 0 });
});

userRouter.post("/signup", passport.authenticate("local.signup", {
  successRedirect: "./profile",
  failureRedirect: "./signup",
  failureFlash: true
}));

userRouter.get("/signin", function (req, res, next) {
  var messages = req.flash("error");
  res.render("user/signin.hbs", { csrfToken: req.csrfToken, messages: messages, hasErrors: messages.length > 0 });
});

userRouter.post("/signin", passport.authenticate("local.signin", {
  successRedirect: "./profile",
  failureRedirect: "./signin",
  failureFlash: true
}));

// Проверяем вошел пользователь или нет для доступа к ссылкам

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
};

// Проверяем на авторизацию 

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = userRouter;