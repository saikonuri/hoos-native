var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
const routes = require("./routes/api");

// The two models we use in MongoDB 
const User = require("./models/user.js");
var Event = require('./models/event.js');

// Express Server listening on local port or remote port
var app = express();
var port = process.env.PORT || 4000;

// App middleware that allows us to make a REST API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,HEAD,OPTIONS,POST,PUT,DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    res.setHeader("Cache-Control", "no-cache");
    next();
});

// MongoDB Instance URL
var mongoDB = 'mongodb://saikonuri:hoosactive@ds253918.mlab.com:53918/hoosactive';

// Mongoose is an object modeling driver for MongoDB in Node.js (Makes it easier for us)
// Here we make a connection to the Instance URL through Mongoose  
mongoose.connect(mongoDB, {
    useMongoClient: true
});

// Using the global promise library with mongoose
mongoose.Promise = global.Promise;

// The connection to the database made with Mongoose
var db = mongoose.connection;

// Where our server is running
var server = require('http').Server(app);
server.listen(port);
var io = require('socket.io').listen(server);
io.on('connection',(client) => {
    console.log("Connected to Clients");
    client.on('newEvent',(event) => {
        client.broadcast.emit('newEvent',event);
        client.broadcast.emit('newEventInModal',event);
    })
    client.on('editEvent',(event) => {
        client.broadcast.emit('editEvent',event);
        client.broadcast.emit('editEventInModal',event);
    })
    client.on('deleteEvent',(event) =>{
        client.broadcast.emit('deleteEvent',event);
        client.broadcast.emit('deleteEventInModal',event);
    })
    client.on('updateGoing',(event) => {
        client.broadcast.emit('updateGoing', event)
    })
})

//app.use("/api", routes);

// Updating User: If new user logs in, save (insert/update) them into the User collection
//                If old user logs in, just send a response with the user already in database  
app.put("/user", function (req, res, next) {
    User.find({ displayName: req.body.displayName, email: req.body.email }, function (err, users) {
        if (err) {
            throw err;
        }
        if (users.length > 0) {
            res.send(users);
        }
        else {
            let newUser = new User({
                displayName: req.body.displayName,
                email: req.body.email
            });
            newUser.save(err => {
                if (err) {
                    throw err;
                }
                res.send(newUser);
            })
        }
    })
});

// Get All Events
app.get("/api/events", function (req, res, next) {
    Event.find({}, (err, events) => {
        if (err) {
            throw err;
        }
        res.send(events);
    });
});

// Get Events at a Certain Location
app.get("/api/events/location/:location", function (req, res, next) {
    // console.log(req.params)
    Event.find({location : req.params.location} , (err, events) => {
        if (err) {
            throw err;
        }
        res.send(events);
    })
})

// Get Events created by a specific person
app.get("/api/events/name/:name", function(req,res,next){
    Event.find({creator : req.params.name} , (err, events) => {
        if (err) {
            throw err;
        }
        res.send(events);
    })
})

// Post a new Event
app.post("/api/events", function (req, res) {
    console.log("Post Request",req.body)
    var event = new Event({
        name: req.body.name,
        location: req.body.location,
        creator: req.body.creator,
        startDate: req.body.startDate,
        description: req.body.description,
        going: req.body.going
    });
    event.key = event._id;
    event.save(err => {
        if (err) {
            throw err;
        }
        res.json(event);
    })
})

//Edit an existing Event
app.put("/api/events/:id", function (req, res) {
    Event.findByIdAndUpdate(req.params.id, req.body, (err,event)=>{
        if (err) {
            throw err;
        }
        res.json(event);
    })
})

// Delete an existing Event
app.delete("/api/events/:id", function (req, res, next) {
    Event.findByIdAndRemove(req.params.id, (err, event) => {
        if (err) {
            throw err;
        }
        res.json(event);
    })
})

// Edit Display Name of User
app.put("/api/users/:id",function(req, res, next){
    User.findByIdAndUpdate(req.params.id,{displayName : req.body.displayName},{new: true},(err,user)=>{
        if(err){
            throw err;
        }
        res.json(user)
    })
})
