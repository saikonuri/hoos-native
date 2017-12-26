const express = require("express");
const router = express.Router();

const Event = require("../models/event.js");

// Get Events
router.get("/events", function (req, res, next) {
    Event.find({}).then(function (events, err) {
        if (err) {
            throw err;
        }
        res.send(events);
    });
});

//Get Events at a Certain Location
router.get("/events/:location", function (req, res, next) {
    Event.find({ location: req.params.location }).then((events, err) => {
        if (err) {
            throw err;
        }
        res.send(events);
    })
})

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
    event.key = event._id;
    event.save(err => {
        if (err) {
            throw err;
        }
        res.json(event);
    })
})

//Edit Event
router.put("/events/:id", function (req, res) {
    Event.findOne({ _id: req.params.id }, function (err, event) {
        if (err) {
            throw err;
        }

        event.name = req.body.name;
        event.description = req.body.description;
        event.location = req.body.location;
        event.startDate = req.body.startDate;
        event.endDate = req.body.endDate;
        event.going = req.body.going;
        event.notGoing = req.body.notGoing;

        event.save(function (err, event) {
            if (err) {
                throw err;
            }
            res.json(event);
        })
    })
})

// Delete an Event
router.delete("/events/:id", function (req, res, next) {
    Event.findByIdAndRemove(req.params.id, function (err, event) {
        if (err) {
            throw err;
        }
        res.json(event);
    })
})

module.exports = router;