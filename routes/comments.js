var express = require('express');

// {mergeParams: true} preserves the req.params values from the parent router.
// So it preserves the params /campgrounds/:id/comments configured in app.js
var router = express.Router({mergeParams: true});
// Then we add all out routes to the router instance (e.g. router.get())

var Campground = require("../models/campground");
var Comment = require("../models/comment");

// Comments new
router.get('/new', isLoggedIn, function(req, res) {
  // Without var router = express.Router({mergeparams: true}); this log returns an empty object.
  console.log('req.params: ' + JSON.stringify(req.params));
  // find campground by ID
  Campground.findById(req.params.id, function(err, campground) {
    if(err) {
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground}); 
    }
  })
})

// Comment Create (entering in the comments form)
// Add isLoggedIn middleware to this route to prevent a hacker posting data to this route/URL 
// using something like Postman.
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
          // add username and id to comment
          // req.user is a passport property that holds the user's username and password (see notes). This code will only run if isLoggedIn returns next() and req.user will be available if req.isAuthenticated() is true.
          // The comment object is returned to the callback. A comment object has the key-value pairs specified in the Schema.
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment (to the database?)
          comment.save();
          campground.comments.push(comment);
          campground.save();
          console.log(comment);
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