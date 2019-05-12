var express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser'),
    mongoose   = require('mongoose');

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs"); // Don't have to use .ejs suffix on files

// Creates (and connects to) the yelp_camp database inside mongodb 
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });

// Schema setup
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
});

// Create db.campgrounds database collection and Campground model to work with it (CRUD)
var Campground = mongoose.model("Campground", campgroundSchema);

/*
Campground.create({
  name: "Granite Hill", 
  image: "https://farm8.staticflickr.com/7268/7121859753_e7f787dc42.jpg"
}, function(err, campground) {
  if(err) {
    console.log(err);
  } else {
    console.log('NEWLY CREATED CAMPGROUND:');
    console.log(campground);
  }
})
*/

app.get('/', function(req, res) {
  res.render('landing')
});

app.get('/campgrounds', function(req, res) {
  // An empty object as the first parameter means find all items in the collection
  Campground.find({}, function(err, allCampgrounds) {
    if(err) {
      console.log(err);
    } else {
        res.render('campgrounds', {campgrounds:allCampgrounds});
    }
  })
});

app.post('/campgrounds', function(req, res) {
   // Get data from form request and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {name:name, image:image};

  Campground.create(newCampground, function(err, newlyCreated) {
    if(err) {
      console.log(err);
    } else {
      // Redirect back to campgrounds page
      res.redirect('/campgrounds'); // redirects to the get route
    }
  })
});

app.get('/campgrounds/new', function(req, res) {
  res.render('new.ejs');
});

app.listen(3000, function() {
  console.log('The YelpCamp server has started...');
})