var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// The Scehma for the User Collection
var UserSchema = new Schema({
    displayName: String,
    email: String,
    events: [String]
});

// The User Model to be used in server.js and api.js
module.exports = mongoose.model('User', UserSchema);