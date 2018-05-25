
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// The Schema for the Event collection
var EventSchema = new Schema({
    name: String,
    location: String,
    description: String,
    startDate: Date,
    creator: String,
    going: [String],
    key: String
});

// Exporting the Model for the EventSchema to be used in server.js and api.js
module.exports = mongoose.model('Event', EventSchema);