const express = require("express");
const router = express.Router();

const Event = require("../models/event.js");

// Get Events
router.get("/events", function (req, res, next) {
    Event.find({}).then(function (events) {
        res.send(events);
    });
});

//Post Event
router.post("/events", function (req, res) {
    var event = new Event({
        name: req.body.name,
        location: req.body.location,
        creator: req.body.creator,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        description: req.body.description
    });
    event.save(err => {
        if (err) {
            throw err;
        }
        res.status(200);
    })
})

module.exports = router;