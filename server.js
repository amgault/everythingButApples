var express = require("express");
var path = require("path");

var port = process.env.PORT || 3000;

var app = express();

app.use(express.static(path.join(__dirname, '/dist')));

require('./routes/htmlroutes.js')(app);



app.listen(port);