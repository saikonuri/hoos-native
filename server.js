var express = require('express');
var socket = require('socket.io');
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
const routes = require("./routes/api");
const User = require("./models/user.js");

var Event = require('./models/event.js');
var router = express.Router();

var app = express();
var port = process.env.PORT || 4000;

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

    //and remove cacheing so we get the most recent comments
    res.setHeader("Cache-Control", "no-cache");
    next();
});

var mongoDB = 'mongodb://saikonuri:hoosactive@ds253918.mlab.com:53918/hoosactive';
mongoose.connect(mongoDB, {
    useMongoClient: true
});

mongoose.Promise = global.Promise;

var db = mongoose.connection;

var server = app.listen(port, function () {
    console.log(`api running on port ${port}`);
});

app.use("/api", routes);

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

var io = socket(server);
io.sockets.on('connection', function (socket) {
    socket.on('message', function (data) {
        socket.broadcast.emit('message', data + " sent a message.")
    });
});