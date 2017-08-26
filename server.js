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
var game =  require('./dist/js/game');

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

var routes = require("./controllers/players_controller.js");
app.use("/", routes);



io.sockets.on('connection', function (socket){
    //console.log(socket);
<<<<<<< HEAD
});
=======
    game.initGame(io, socket);
})
>>>>>>> 34664e98604eae7e9c9e2e5a3a0fe87c287566f9

server.listen(port, function () {
	console.log('Example app listening on port ' + port + '!');
})

