//full-names (first and last), 
//usernames (you can use email for this), 
//passwords
// membership-status.

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {type: String, required: true},
    secondName: {type: String, required: true},
    usernameEmail: {type: String, required: true},    
    password: {type: String, required: true},
    membershipStatus: {type: Boolean, required: true},
    adminStatus: {type: Boolean}
})

UserSchema.virtual("url").get(function () {
    return `/catalog/user/${this._id}`;
  });

module.exports = mongoose.model("User", UserSchema);