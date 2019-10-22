var express = require('express'),
  expressSession = require('express-session'),
  bodyParser = require('body-parser'),
  flash = require('connect-flash'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  methodOverride = require('method-override');

var Campground = require('./models/campground'),
  Comment = require('./models/comment'),
  User = require('./models/user'),
  seedDB = require('./seeds');

// requiring routes
var commentRoutes = require('./routes/comments'),
  campgroundRoutes = require('./routes/campgrounds'),
  indexRoutes = require('./routes/index');

/****** DATABASE SETUP ******/

// Creates (and connects to) the yelp_camp database inside mongodb
// process.env.DATABASEURL holds 'mongodb://localhost:27017/yelp_camp_dynamic_price'
// It's assigned in the CLI like this: export DATABASEURL=mongodb://localhost:27017/yelp_camp_dynamic_price

/*** Development database ***/
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });

/*** Production database ***/
// mongoose.connect('mongodb+srv://bobs:bmubobs17@cluster0-yeyzg.mongodb.net/YelpCamp?retryWrites=true&w=majority', {
//   useNewUrlParser: true
// });

// Make Mongoose use MongoDB driver's findOneAndUpdate() function using the useFindAndModify global option.
mongoose.set('useFindAndModify', false);

// seedDB();  // Clear and seed the database with campgrounds

/****** APP CONFIGURATION ******/

var app = express();
// Means you don't have to use .ejs suffix on files
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
// __dirname gets the path to the public directory (changes if the path changes)
app.use(express.static(__dirname + '/public'));
// Lets you use HTTP verbs such as PUT or DELETE in places where the client (i.e. older browsers) doesn't support it.
app.use(methodOverride('_method'));
app.use(flash());

/****** PASSPORT CONFIGURATION ******/

app.use(
  expressSession({
    secret: 'Hey lazer lips, your mama was a snow-blower!',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
// The authenticate, serializeUser and deserializeUser methods are from passportLocalMongoose.
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/****** MIDDLEWARE ******/

// app.use() automagically calls the function as middleware on every route
app.use(function (req, res, next) {
  // This makes req.user available to every template (in the currentUser variable).
  // req.user comes from passport.js and will contain the username, password and id if the user is logged in.
  res.locals.currentUser = req.user;
  // Makes the error/success message stored in flash (object?) in middlewareObj.isLoggedIn available to
  // every template as the message variable.
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// Tells the app to use the routes required in above.
app.use('/', indexRoutes);
// Appends "/campgrounds" to all campground routes (DRYs the code)
app.use('/campgrounds', campgroundRoutes);
// Appends "/campgrounds/:id/comments" to all comment routes (DRYs the code)
app.use('/campgrounds/:id/comments', commentRoutes);

/****** SERVER ******/

// Listens on port 3000. The callback runs when the server is started on port 3000.
// Heroku uses process.env.PORT so have to provide it.
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('The YelpCamp server has started...');
});
