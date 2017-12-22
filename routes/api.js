const express = require("express");
const router = express.Router();

const Event = require("../models/event.js");

// Get Events
router.get("/events", function (req, res, next) {
    Event.find({}).then(function (events) {
        res.send(events);
    });
});

module.exports = router;