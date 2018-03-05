var express = require('express');
var socket = require('socket.io');
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
var server = app.listen(port, function () {
    console.log(`api running on port ${port}`);
});

// Telling express to use routes in api.js
var router = express.Router();
app.use("/api", routes);

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
})
// Socket.io implementation
// var io = socket(server);
// io.sockets.on('connection', function (socket) {
//     socket.on('message', function (data) {
//         socket.broadcast.emit('message', data + " sent a message.")
//     });
// });