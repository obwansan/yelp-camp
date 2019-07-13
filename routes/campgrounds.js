var express = require('express');
// Create new instance of the express router (a router object)
var router = express.Router();
// Then we add all out routes to the router instance (e.g. router.get())

var Campground = require('../models/campground');

// INDEX (restful route) - Display all campgrounds
router.get('/', function(req, res) {
  // An empty object as the first parameter means find all items in the collection
  Campground.find({}, function(err, allCampgrounds) {
    if(err) {
      console.log(err);
    } else {
      // render index.ejs in the campgrounds directory.
      // req.user is a passport property that holds the user's username and password.
        res.render('campgrounds/index', {campgrounds:allCampgrounds});
    }
  })
});

// CREATE (restful route) - Add new campground to the DB
// '/' is actually '/campgrounds' (see app.use() in app.js)
router.post('/', function(req, res) {
   // Get data from form request and add to campgrounds array.
   // The req.body properties correspond to the form input field attributes.
  var name = req.body.name;
  var img = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = {
    name: name, 
    image: img, 
    description: desc,
    author: author
  };
  Campground.create(newCampground, function(err, newlyCreated) {
    if(err) {
      console.log(err);
    } else {
      // Redirect back to campgrounds page
      console.log(newlyCreated);
      res.redirect('/campgrounds'); // redirects to the get route
    }
  })
});

// NEW (restful route) - Displays form to create new campground
router.get('/new', isLoggedIn, function(req, res) {
  res.render('campgrounds/new');
});

// SHOW (restful route) - Shows more info about one campground.
router.get('/:id', function(req, res) {
  // Query the database for the campground using the provided ID
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if(err) {
      console.log(err);
    } else {
        // Render show template with that campground 
        res.render('campgrounds/show', {campground: foundCampground});
    }
  });
});

// EDIT CAMPGROUND ROUTE (renders the form)
router.get("/:id/edit", function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    if(err) {
      res.redirect("/campgrounds");
    } else {
      res.render("campgrounds/edit", {campground: foundCampground});
    }
  });
});

// UPDATE CAMPGROUND ROUTE (route the form submits to)
router.put("/:id", function(req, res) {
  // find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
    if(err) {
      res.redirect("/campgrounds");
    } else {
      // redirect somewhere (usually the show page i.e. the updated campground)
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});


/*
    if(err) {
      console.log('Campground update didn\'t work');
    } else {
      console.log("req.params " + req.params);
      console.log("foundCampground " + foundCampground);
*/


/****** MIDDLEWARE ******/
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

// Then we export the router object with all the routes on it.
module.exports = router;