var express = require('express');
// Create new instance of the express router (a router object)
// Then we add all out routes to the router instance (e.g. router.get())
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

// root route
router.get('/', function(req, res) {
  res.render('landing');
});

// show register form
router.get('/register', function(req, res) {
  res.render('register');
});

// handle sign up logic
router.post('/register', function(req, res) {
  // The User model is like a class. Can instantiate a newUser object from it,
  // but also use methods on it directly (like static access in PHP).
  var newUser = new User({ username: req.body.username });
  // Sign up the user
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render('register');
    }
    // Check their username and password, then redirect to /campgrounds page.
    passport.authenticate('local')(req, res, function() {
      res.redirect('/campgrounds');
    });
  });
});

// show login form
router.get('/login', function(req, res) {
  // renders login.ejs and passes in object
  res.render('login');
});

// handle login logic
// passport.authenticate is middleware.
// "local" authentication means password and username are checked
// (against hashed version in the database).
// We could remove the callback as it's not doing anything.
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }),
  function(req, res) {}
);

// log out route
router.get('/logout', function(req, res) {
  // logout() is a passport method. req already exists each time a request is made
  // from the client (front-end) to the server (back-end). passport "hijacks"
  // the req object and adds the logout object to it.
  req.logout();
  req.flash('success', 'Logged you out!');
  res.redirect('/campgrounds');
});

/****** MIDDLEWARE ******/
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Then we export the router object with all the routes on it.
module.exports = router;
