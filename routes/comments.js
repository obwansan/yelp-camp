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

// COMMENT CREATE (entering in the comments form)
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

// COMMENT EDIT
// Have to prefix the id query string parameter with a colon for it to work.
// But the name of the id query string parameter can be anything.
// The name of the id query string parameter - :comment_id - is the name of 
// the property stored on req.params - comment_id.
// The full route is /campgrounds/:id/comments/:comment_id/edit
router.get('/:comment_id/edit', function(req, res) {
  Comment.findById(req.params.comment_id , function(err, foundComment) {
    if(err) {
        res.redirect('back');
    } else {
        // Must not have / infront of comments/edit because it denotes 
        // the root, i.e. localhost:3000
        // req.params.id matches the id in /campgrounds/:id/comments (see app.js)
        res.render('comments/edit', {
          campground_id: req.params.id, 
          comment: foundComment
        });
    }
  });
});

// UPDATE COMMENT ROUTE (route the form submits to)
router.put('/:comment_id', function(req, res) {
  // Find comment in database by it's id and update it with the data from the form
  // stored on req.body.comment
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
    if(err) {
      res.redirect("back");
    } else {
      // redirect somewhere (usually the show page i.e. the campground that has the comment)
      res.redirect("/campgrounds/" + req.params.id);
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