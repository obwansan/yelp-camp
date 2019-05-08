var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var campgrounds = [
  {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8300/7930013108_cd3e432ba5.jpg"},
  {name: "Granite Hill", image: "https://farm8.staticflickr.com/7268/7121859753_e7f787dc42.jpg"},
  {name: "Mountain Goat's Rest", image: "https://farm1.staticflickr.com/82/225912054_690e32830d.jpg"}
];

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs"); // Don't have to use .ejs suffix on files

app.get('/', function(req, res) {
  res.render('landing')
});

app.get('/campgrounds', function(req, res) {
  res.render('campgrounds', {campgrounds:campgrounds});
});

app.post('/campgrounds', function(req, res) {
   // Get data from form request and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {name:name, image:image};
  campgrounds.push(newCampground);
  // Redirect back to campgrounds page
  res.redirect('/campgrounds'); // redirects to the get route
});

app.get('/campgrounds/new', function(req, res) {
  res.render('new.ejs');
});

app.listen(3000, function() {
  console.log('The YelpCamp server has started...');
})