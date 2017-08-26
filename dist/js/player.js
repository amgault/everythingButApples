let socket = io.connect();

// #Max To hide first div and show second
let showAndHide = function (id1, id2) {
    $(`#${id1}`).hide()
    $(`#${id2}`).show()
}

// #Max This was all Written before socket and is useless no
// //This is to validate code
// function codeComparison() {
//     let inputCode = $("#code-input").val();
//     console.log(inputCode)
//     //Compare input code to room codes available
//     // if (input code exists)
//         showAndHide("roomCode", "pregame")
//     // else
//     // Request new code
// } /#Max

function submitUsername() {
    //#Max  I don't think there needs to be validation if name is already taken but it may mess us up.  Unless each player is named player i to our programming

    //AJAX post user name to room
        //This should post it to the host to display the name on the players box

    //Shows next input if they want /#Max
    showAndHide("username", "createCards")
}

function Card(text, player) {
    this.text = text;
    this.description = "A homemade card, made with love from " + player
}


function getRandNum(){
		return (Math.floor(Math.random()*(99999-10000+1)+10000));
}

//Code comparison listener
$('#roomCode').submit(function(e) {
    e.preventDefault()
    let userData = {
        userName: $("#player-name-form").val().trim(),
        roomId: $("#code-input").val().trim(),
        role: "player",
        socketId: socket.id
    }
    console.log(userData)
    
    socket.emit('set user', userData, function(){
        
        // showAndHide("", "game")
    })
    showAndHide("roomCode", "pregame")
});

//Name submit listener
// $("#username").submit(function(e) {
//     e.preventDefault();
//     submitUsername()
// })

//New Card submit listener
$("#createCards").submit(function(e) {
    e.preventDefault();
    submitCards()
})

//listener for host a game 
$("#host").on("click", function(){
    let room = getRandNum()
    let userData = {
        userName: "Host-"+room,
        roomId: room,
        role: "host",
        socketId: socket.id
    }
    console.log(userData)
    //Bex: I moved this out here so I can see the host page while I'm working on it; it wasn't working before
    showAndHide('landing','host-page')
    
    socket.emit('set user', userData, function(){
        
    })
})



// general functions for running Host
function getRandNumByInterval(min, max){
  return Math.floor(Math.random()*(max-min+1)+min);
}

//from: https://stackoverflow.com/a/2450976
function shuffleArray(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function removeItemFromArray(item, array){
    return array.splice($.inArray(item, array),1);
}


// Host Functions
function flipAllCards (){
    $(".played-card").each(function(){
        $(this).toggleClass('flipped');
    })
}

function startJudging (){
    // Bex: should run whenever all player cards are submitted
    flipAllCards();
    // Bex: switch the prompt on the host screen
    showAndHide("pre-judging-message", "mid-judging-message");
    // Bex: TODO: assign the data for the cards (and the players they belong to? might not be necessary if we keep info on player hands in the host side) on each card div
    //there's a .each function in jquery (see flipAllCards) that can be used to assign each card div the necessary data
}

function startGame(){
    //Bex: TODO: Generate random numbers to represent each card for each player
    //then run a query to obtain all of those cards and shuffle them
    //then construct an array of cards for each players hand and the remaining cards
}
