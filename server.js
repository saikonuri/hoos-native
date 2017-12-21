var express = require('express');
var socket = require('socket.io');
const mysql = require('mysql');

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