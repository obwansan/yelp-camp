var express = require('express');
var app = express();

app.set("view engine", "ejs"); // Don't have to use .ejs suffix on files

app.get('/', function(req, res) {
  res.render('landing')
});

app.get('/campgrounds', function(req, res) {
  var campgrounds = [
    {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8300/7930013108_cd3e432ba5.jpg"},
    {name: "Granite Hill", image: "https://farm8.staticflickr.com/7268/7121859753_e7f787dc42.jpg"},
    {name: "Mountain Goat's Rest", image: "https://farm1.staticflickr.com/82/225912054_690e32830d.jpg"}
  ];

  res.render('campgrounds', {campgrounds:campgrounds});
});

app.listen(3000, function() {
  console.log('The YelpCamp server has started...');
})