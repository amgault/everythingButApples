// FILE TO READ CARDS LINE BY LINE, ADD THEM TO AN ARRAY, INSERT THEM INTO DB, THEN EXPORT ARRAYS


//******************* DEPENDENCIES *************************************************************
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var readline = Promise.promisifyAll(require('readline'));
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "us-cdbr-iron-east-05.cleardb.net",
    port: 3306,
    user: "bc389e17ac8656",
    password: "dc0c3ab7",
    database: "heroku_6aafb0838fd5e56"
});


//********************* CODE ********************************************************************
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
});


// green cards then red cards then export array
readfile("green.txt", "green").then(console.log("this is the deck"))
//readfile("red.txt", "red"); //);





//*********************************** FUNCTIONS ***********************************************************************

function returndeck(deck) {
    console.log(" THIS IS THE FIRST CARD IN THE DECK ======> " + deck[0]);
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
};

// card object 
class card {
    // title, description, role(green or red), isused, roomid, pid
    constructor(t, d, r, u, rid, pid) {
        this.title = "'" + t + "'";
        this.description = "'" + d + "'";
        this.role = "'" + r + "'";
        // this.usedThisRound = u;
        //this.roomID = rid;
        // this.playerID = pid;
    }
} // end card

// a function to get each line of specified file, separate @ '=' then create a card from the remaining strings
function readfile(filepath, role, cb) {

    var greencards = [];
    var redcards = [];
    var deck = [];


    // create the readline interface
    var rd = readline.createInterface({
        input: fs.createReadStream(filepath),
        output: process.stdout,
        console: false
    });
    // set up native vars
    var slicepoint = '';
    var title = '';
    var desc = '';
    //trying new promise method (failed)
    //return new Promise((resolve) => {
    // Get each line of the file (each line will be a card), slice it into 'title' & 'description' then push to deck.

    rd.on('line', function(line) {
        // need to sql-proof cards with quotes or apostraphes in them
        var left = '';
        var right = '';
        var midone = "'";
        var midtwo = '"';

        // find the '='
        slicepoint = line.indexOf('=');

        //grab everything right of the '='
        desc = line.slice(slicepoint + 2);

        //grab everything left of the '='
        title = line.slice(0, slicepoint - 1);

        //WRAP THEM IN NICE LITTLE QUOTES SO SQL DOESNT FREAK OUT

        // console.log("title: " + title);
        // console.log("Description: " + desc);

        //FIND ALL 's and "s AND DOUBLE THEM SO SQL CAN FIGURE IT THE FUCK OUT
        // console.log("BEFORE CHANGE:  " + desc);

        for (i = 0; i < title.length; i++) {
            if (title[i] == "'") {
                left = title.slice(0, i + 1);
                right = title.slice(i, title.length);
                title = left + right;
                i++;
                //desc = desc.replace("'", "''"); // lol wut
            }
        }

        for (i = 0; i < desc.length; i++) {
            if (desc[i] == "'") {
                //console.log("found a ' ");
                left = desc.slice(0, i + 1);
                right = desc.slice(i, desc.length);
                desc = left + right;
                //desc = desc.replace("'", "''"); // lol wut
                i++;
            }
            // dont need to check for quotes if using apostrophes
            // if (desc[i] == '"') {
            //    // console.log('found a " ');
            //     left = desc.slice(0, i + 1);
            //     right = desc.slice(i, desc.length);
            //     desc = left + right;
            //     //desc = desc.replace('"', '""'); // lolol
            //     i++;
            // }
        }
        // console.log("AFTER CHANGE: " + desc);

        //create card object from strings and push to respective arrays
        var anothaOne = new card(title, desc, role, false, 0, 0);
        deck.push(anothaOne);

        //connection.query("INSERT INTO cards (title, description, role, room_id, player_id) VALUES (" + anothaOne.title + "," + anothaOne.description + "," + anothaOne.role + "," + anothaOne.roomID + "," + anothaOne.playerID + ");", function(err, res) { if (err) console.log(err);
        //    console.log(res); });
    });

    return Promise.all(deck);

    //}); //belonged to promise
} //end readfile function