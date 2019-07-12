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
router.post('/', function(req, res) {
   // Get data from form request and add to campgrounds array.
   // The req.body properties correspond to the form input field attributes.
  var name          = req.body.name,
      image         = req.body.image,
      desc          = req.body.description,
      newCampground = {name:name, image:image, description: desc};

  Campground.create(newCampground, function(err, newlyCreated) {
    if(err) {
      console.log(err);
    } else {
      // Redirect back to campgrounds page
      res.redirect('/campgrounds'); // redirects to the get route
    }
  })
});

// NEW (restful route) - Displays form to create new campground
router.get('/new', function(req, res) {
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

// Then we export the router object with all the routes on it.
module.exports = router;