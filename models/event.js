
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
    name: String,
    location: String,
    description: String,
    startDate: String,
    endDate: String,
    creator: String,
    going: [String],
    notGoing: [String]
});

module.exports = mongoose.model('Event', EventSchema);