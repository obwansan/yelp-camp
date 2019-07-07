var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

// Makes the passportLocalMongoose objects' methods available on the User model.
UserSchema.plugin(passportLocalMongoose);

// Creates (and exports) a User model that uses the UserSchema.
module.exports = mongoose.model("User", UserSchema);
