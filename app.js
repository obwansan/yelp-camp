var express         = require('express'),
    expressSession  = require("express-session"),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    Campground      = require('./models/campground'),
    Comment         = require('./models/comment'),
    User            = require('./models/user'),
    seedDB          = require('./seeds.js');

/****** APP CONFIGURATION ******/
var app = express();
// Means you don't have to use .ejs suffix on files
app.set("view engine", "ejs"); 
app.use(bodyParser.urlencoded({extended:true}));
// __dirname gets the path to the public directory (changes if the path changes)
app.use(express.static(__dirname + "/public")); 
// Creates (and connects to) the yelp_camp database inside mongodb 
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
// Seed the database with campgrounds
seedDB();

/****** PASSPORT CONFIGURATION ******/
app.use(expressSession({
  secret: "Hey lazer lips, your mama was a snow-blower!",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
// The authenticate, serializeUser and deserializeUser methods are from passportLocalMongoose.
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());


/****** MIDDLEWARE ******/
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

// The function is called on every route
app.use(function(req, res, next) {
  // This passes req.user to every template.
  // req.user will contain the username and password if the user is logged in.
  res.locals.currentUser = req.user;
  next();
});

// =============================
// VIEW/CREATE CAMPGROUNDS ROUTES
// =============================

app.get('/', function(req, res) {
  res.render('landing')
});

// INDEX (restful route) - Display all campgrounds
app.get('/campgrounds', function(req, res) {
  console.log(req.user);
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
  // Query the database for the campground using the provided ID
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

// Page where you can add a comment to a post
// isLoggedIn middleware: the 'next' callback runs if the user is logged in,
// otherwise user is redirected to the login page.
app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res) {
  // find campground by ID
  Campground.findById(req.params.id, function(err, campground) {
    if(err) {
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground}); 
    }
  })
})

// Add isLoggedIn middleware to this route to prevent a hacker posting data
// to this route/URL using something like Postman.
app.post('/campgrounds/:id/comments', isLoggedIn, function(req, res) {
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

// =============================
// AUTH ROUTES
// =============================

// show register form
app.get("/register", function(req, res) {
  res.render("register");
});

// handle sign-up logic
app.post("/register", function(req, res) {
  // The User model is like a class. Can instantiate a newUser object from it, 
  // but also use methods on it directly (like static access in PHP).
  var newUser = new User({username: req.body.username});
  // Sign up the user
  User.register(newUser, req.body.password, function(err, user) {
    if(err) {
      console.log(err);
      return res.render("register");
    }
    // Check their username and password, then redirect to /campgrounds page.
    passport.authenticate("local")(req, res, function() {
      res.redirect("/campgrounds");
    })
  });
});

// show login form
app.get("/login", function(req, res) {
  res.render("login");
});

// handle login logic
// passport.authenticate is middleware.
// "local" authentication means password and username are checked
// (against hashed version in the database).
// We could remove the callback as it's not doing anything.
app.post(
  "/login", 
  passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }),
  function(req, res) {
});

// log out route
app.get("/logout", function(req, res) {
  // logout() is a passport method. But how can it be called in the request object?
  req.logout();
  res.redirect("/campgrounds");
});



app.listen(3000, function() {
  console.log('The YelpCamp server has started...');
})