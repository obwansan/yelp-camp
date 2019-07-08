var express = require('express');
// Create new instance of the express router (a router object)
var router = express.Router({mergeParams: true});
// Then we add all out routes to the router instance (e.g. router.get())

var Campground = require("../models/campground");
var Comment = require("../models/comment");

// Comments new
router.get('/new', isLoggedIn, function(req, res) {
  // find campground by ID
  console.log(req.params.id);
  Campground.findById(req.params.id, function(err, campground) {
    if(err) {
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground}); 
    }
  })
})

// Comments create
// Add isLoggedIn middleware to this route to prevent a hacker posting data
// to this route/URL using something like Postman.
router.post('/', isLoggedIn, function(req, res) {
  // look up campground using ID
  Campground.findById(req.params.id, function(err, campground) {
    if(err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      // the text and author values are stored on the comment object created in new.ejs form
      Comment.create(req.body.comment, function(err, comment) {
        if(err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});

/****** MIDDLEWARE ******/
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

// Then we export the router object with all the routes on it.
module.exports = router;