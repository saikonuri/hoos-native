var express = require('express');
const mysql = require('mysql');

var app = express();
var port = process.env.PORT || 4000;

app.get('/', function (req, res) {
    res.send({ data: "Hello world!" });
});

app.listen(port, function () {
    console.log(`api running on port ${port}`);
});