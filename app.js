var express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser'),
    mongoose   = require('mongoose'),
    Campground = require('./models/campground'),
    Comment    = require('./models/comment'),
    seedDB     = require('./seeds.js');

// CONFIG
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs"); // Don't have to use .ejs suffix on files

// Creates (and connects to) the yelp_camp database inside mongodb 
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });

// Seed the database with campgrounds
seedDB();

app.get('/', function(req, res) {
  res.render('landing')
});

// INDEX (restful route) - Display all campgrounds
app.get('/campgrounds', function(req, res) {
  // An empty object as the first parameter means find all items in the collection
  Campground.find({}, function(err, allCampgrounds) {
    if(err) {
      console.log(err);
    } else {
        res.render('campgrounds/index', {campgrounds:allCampgrounds});
    }
  })
});

// CREATE (restful route) - Add new campground to the DB
app.post('/campgrounds', function(req, res) {
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
app.get('/campgrounds/new', function(req, res) {
  res.render('campgrounds/new');
});

// SHOW (restful route) - Shows more info about one campground.
app.get('/campgrounds/:id', function(req, res) {
  // Find the campground with provided ID
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if(err) {
      console.log(err);
    } else {
        console.log(foundCampground);
        // Render show template with that campground 
        res.render('campgrounds/show', {campground: foundCampground});
    }
  });
});

// =============================
// COMMENTS ROUTES
// =============================

app.get('/campgrounds/:id/comments/new', function(req, res) {
  // find campground by ID
  Campground.findById(req.params.id, function(err, campground) {
    if(err) {
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground}); 
    }
  })
})

app.post('/campgrounds/:id/comments', function(req, res) {
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

app.listen(3000, function() {
  console.log('The YelpCamp server has started...');
})