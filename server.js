var express = require('express');
var socket = require('socket.io');
var mongoose = require('mongoose');

var app = express();
var port = process.env.PORT || 4000;

var server = app.listen(port, function () {
    console.log(`api running on port ${port}`);
});

app.get('/', function (req, res) {
    res.send({ data: "Hello world!" });
});

var io = socket(server);
io.sockets.on('connection', function (socket) {
    socket.on('message', function (data) {
        socket.broadcast.emit('message', data + " sent a message.")
    });
});

var mongoDB = 'mongodb://ankithy:hoosactive@ds157653.mlab.com:57653/hoosactive';
mongoose.connect(mongoDB, {
    useMongoClient: true
});

mongoose.Promise = global.Promise;

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));