var express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser'),
    mongoose   = require('mongoose');

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs"); // Don't have to use .ejs suffix on files

// Creates (and connects to) the yelp_camp database inside mongodb 
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });

// Schema setup
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
});

// Create db.campgrounds database collection and Campground model to work with it (CRUD)
var Campground = mongoose.model("Campground", campgroundSchema);


// Campground.create({
//   name: "Granite Hill", 
//   image: "https://farm8.staticflickr.com/7268/7121859753_e7f787dc42.jpg",
//   description: "This is a granite hill. No bathrooms, no running water, beautiful views."
// }, function(err, campground) {
//   if(err) {
//     console.log(err);
//   } else {
//     console.log('NEWLY CREATED CAMPGROUND:');
//     console.log(campground);
//   }
// })


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
        res.render('index', {campgrounds:allCampgrounds});
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
  res.render('new.ejs');
});

// SHOW (restful route) - Shows more info about one campground.
// (NOTE: This kind of 'show' route must come after all other routes. Otherwise any other 
// route with a query string parameter after /campgrounds/ will be read as '/campgrounds/:id'.
// Anything after 'campgrounds/' will be read as ':id'.
// The campground object in the DB already has an ID (automatically assigned by mongoose when 
// the object (i.e. document) was created). 
// The button link href in index.ejs appends this ID to /campgrounds/, so when you click it the SHOW route is hit ('/campgrounds/:id').
// The href link performs a GET request (http://localhost:3000/campgrounds/5cd8077b100dd70cf3ce08af).
// Therefore the ID can be pulled off the params object on the request object (req.params.id). Because the ID is a parameter in the query string (http://localhost:3000/campgrounds/5cd8077b100dd70cf3ce08af).
app.get('/campgrounds/:id', function(req, res) {
  // Find the campground with provided ID
  Campground.findById(req.params.id, function(err, foundCampground) {
    if(err) {
      console.log(err);
    } else {
        // Render show template with that campground 
        res.render('show', {campground:foundCampground});
    }
  })
});

app.listen(3000, function() {
  console.log('The YelpCamp server has started...');
})