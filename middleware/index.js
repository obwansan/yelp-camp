var Campground = require('../models/campground');
var Comment = require("../models/comment");

var middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
  // is user logged in?
  if(req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, foundCampground) {
      if(err) {
          res.redirect("back");
      } else {
          // does user own the campground?
          /* Have to use .equals rather than == because foundCampground.author.id is an object
          with a weird mongoose schema type, but req.user._id is a string. The author id is the 
          id of the user who created the campground document and is put on the document 
          when it's created. The user id is the id of the currently logged in user (the id must stay the 
          same for this equality check to work, but not sure how to check as it's not explicitly declared 
          on the User model schema). */
          if(foundCampground.author.id.equals(req.user._id)) {
              next();
          } else {
              res.redirect("back");
          }
        }
    });
  } else {
    // redirects back to previous page
    res.redirect('back');
  }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
  // is user logged in?
  if(req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if(err) {
          res.redirect("back");
      } else {
          // does user own the comment?
          /* Have to use .equals rather than == because foundComment.author.id is an object
          with a weird mongoose schema type, but req.user._id is a string. The author id is the 
          id of the user who created the comment document and is put on the document 
          when it's created. The user id is the id of the currently logged in user (the id must stay the 
          same for this equality check to work, but not sure how to check as it's not explicitly declared 
          on the User model schema). */
          if(foundComment.author.id.equals(req.user._id)) {
              next();
          } else {
              res.redirect("back");
          }
        }
    });
  } else {
    // redirects back to previous page
    res.redirect('back');
  }
};

middlewareObj.isLoggedIn = function (req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

module.exports = middlewareObj;