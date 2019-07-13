var express         = require('express'),
    expressSession  = require("express-session"),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    methodOverride  = require('method-override');

var Campground      = require('./models/campground'),
    Comment         = require('./models/comment'),
    User            = require('./models/user'),
    seedDB          = require('./seeds');

// requiring routes
var commentRoutes     = require("./routes/comments"),
    campgroundRoutes  = require("./routes/campgrounds"),
    indexRoutes        = require("./routes/index");

/****** APP CONFIGURATION ******/
var app = express();
// Means you don't have to use .ejs suffix on files
app.set("view engine", "ejs"); 

app.use(bodyParser.urlencoded({extended:true}));
// __dirname gets the path to the public directory (changes if the path changes)

app.use(express.static(__dirname + "/public")); 

// Lets you use HTTP verbs such as PUT or DELETE in places where the client (i.e. older browsers) doesn't support it.
app.use(methodOverride("_method"));

// Creates (and connects to) the yelp_camp database inside mongodb 
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });

// seedDB();  // Seed the database with campgrounds

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

// The function is called (as middleware) on every route
app.use(function(req, res, next) {
  // This passes req.user to every template.
  // req.user will contain the username and password if the user is logged in.
  res.locals.currentUser = req.user;
  next();
});

// Tells the app to use the routes required above.
app.use("/", indexRoutes);
// Appends "/campgrounds" to all campground routes (DRYs the code)
app.use("/campgrounds", campgroundRoutes);
// Appends "/campgrounds/:id/comments" to all comment routes (DRYs the code)
// Have to pass {mergeParams: true} to the express router in comments.js in order 
// for req.params.id to be accessible on the comments/new route (not sure why)
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, function() {
  console.log('The YelpCamp server has started...');
})