var express = require('express');
// Create new instance of the express router (a router object)
var router = express.Router();
// Then we add all out routes to the router instance (e.g. router.get())

var Campground = require('../models/campground');

// Don't need to include the file name in the path if it's called index
var middleware = require('../middleware');

// INDEX RESTful Route - Display all campgrounds
router.get('/', function (req, res) {
  // An empty object as the first parameter means find all items in the collection
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      // render index.ejs in the campgrounds directory.
      // req.user is a passport property that holds the user's username and password.
      res.render('campgrounds/index', { campgrounds: allCampgrounds });
    }
  });
});

/** NOTE: The order of routes matters! If the '/new' route comes after the '/:id' route in this file
 * it will be treated as an '/:id' route (because ':id' can be anything). So if you try to implement
 * flash messaging you'll get this error: CastError: Cast to ObjectId failed for value "new" at path "_id" for model "Campground".
 */

// NEW RESTful Route - Displays form to create new campground when you click Add New Campground
// (Can't create new campground unless you're logged in)
router.get('/new', middleware.isLoggedIn, function (req, res) {
  res.render('campgrounds/new');
});

// SHOW RESTful Route - Shows more info about one campground.
router.get('/:id', function (req, res) {
  // Query the database for the campground using the provided ID
  Campground.findById(req.params.id)
    .populate('comments')
    .exec(function (err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        // Render show.ejs, passing in the foundCampground object so can access
        // the campground image, description, price etc in show.ejs
        res.render('campgrounds/show', { campground: foundCampground });
      }
    });
});

// EDIT RESTful Route - Display the campground edit form
// Can't edit a campground unless you created it (own it)
router.get('/:id/edit', middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findById(req.params.id, function (err, foundCampground) {
    res.render('campgrounds/edit', { campground: foundCampground });
  });
});

// UPDATE RESTful Route - Route that the edit form submits to
// Middleware - Can't update a campground unless you created it (own it)
router.put('/:id', middleware.checkCampgroundOwnership, function (req, res) {
  // find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      // redirect somewhere (usually the show page i.e. the updated campground)
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

// DESTROY RESTful Route
// Can't delete a campground unless you created it (own it)
router.delete('/:id', middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds');
    }
  });
});

// CREATE Restful Route - Create new campground from form data and add to the DB
// '/' is actually '/campgrounds' (see app.use() in app.js)
// (Can't create new campground unless you're logged in)
router.post('/', middleware.isLoggedIn, function (req, res) {
  // Get data from form request and add to campgrounds array.
  // The req.body properties correspond to the form input field attributes.
  var name = req.body.name;
  var img = req.body.image;
  var price = req.body.price;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCampground = {
    name: name,
    image: img,
    price: price,
    description: desc,
    author: author
  };

  Campground.create(newCampground, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      // Redirect back to campgrounds page
      console.log(newlyCreated);
      res.redirect('/campgrounds'); // redirects to the get route
    }
  });
});

// Then we export the router object with all the routes on it.
module.exports = router;
