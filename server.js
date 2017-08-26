// *********************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
// *********************************************************************************

// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

var port = process.env.PORT || 3006;

//access environmental variables for username, password, host
require('dotenv').config({path: 'dotenv.env'});

app.use(express.static(path.join(__dirname, '/dist')));

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// The below points our server to a series of route files.
// ================================================================================
require('./routes/htmlroutes.js')(app);

io.sockets.on('connection', function (socket){
    console.log(socket);
})

server.listen(port);
