// *********************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
// *********************************************************************************

// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

//access environmental variables for username, password, host
require('dotenv').config({path: 'dotenv.env'});

var port = process.env.PORT || 3006;
var app = express();


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


app.listen(port, function () {console.log("App listening on PORT " + port);});