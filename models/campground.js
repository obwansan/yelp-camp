var mongoose = require('mongoose');

var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

// Create db.campgrounds database collection and Campground model to work with it (CRUD)
module.exports = mongoose.model("Campground", campgroundSchema);