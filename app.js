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

/****** DATABASE SETUP ******/

// Creates (and connects to) the yelp_camp database inside mongodb 
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
// Make Mongoose use MongoDB driver's findOneAndUpdate() function using the useFindAndModify global option.
mongoose.set('useFindAndModify', false);

// seedDB();  // Seed the database with campgrounds

/****** APP CONFIGURATION ******/

var app = express();
// Means you don't have to use .ejs suffix on files
app.set("view engine", "ejs"); 
app.use(bodyParser.urlencoded({extended:true}));
// __dirname gets the path to the public directory (changes if the path changes)
app.use(express.static(__dirname + "/public")); 
// Lets you use HTTP verbs such as PUT or DELETE in places where the client (i.e. older browsers) doesn't support it.
app.use(methodOverride("_method"));

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

// app.use() automagically calls the function as middleware on every route
app.use(function(req, res, next) {
  // This makes req.user available to every template in the currentUser variable.
  // req.user comes from passport.js and will contain the username, password and id if the user is logged in.
  res.locals.currentUser = req.user;
  next();
});

// Tells the app to use the routes required in above.
app.use("/", indexRoutes);
// Appends "/campgrounds" to all campground routes (DRYs the code)
app.use("/campgrounds", campgroundRoutes);
// Appends "/campgrounds/:id/comments" to all comment routes (DRYs the code)
app.use("/campgrounds/:id/comments", commentRoutes);

/****** SERVER ******/

// Listens on port 3000. The callback runs when the server is started on port 3000.
app.listen(3000, function() {
  console.log('The YelpCamp server has started...');
})