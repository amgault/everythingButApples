let socket = io.connect();

// #Max To hide first div and show second
let showAndHide = function (id1, id2) {
    $(`#${id1}`).hide()
    $(`#${id2}`).show()
}

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
        playerId: socket.id
    }
    console.log(userData)
    
    socket.emit('set user', userData);
    showAndHide("roomCode", "pregame")
});

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
        playerId: socket.id
    }
    console.log(userData)
    //Bex: I moved this out here so I can see the host page while I'm working on it; it wasn't working before
    showAndHide('landing','host-page');
    //Bex: some setup for displaying the lobby page
    $("#room-code").text(userData.roomId);
    
    socket.emit('set user', userData, function(){
        
    })
})

$("#play-a-game").on("click", function(){
    showAndHide('landing','player');
    isRoomFull();
})



//#Max Writing card click to favorite
function cardClickToFavorite(cardNum) {
    let card = document.getElementById(cardNum).innerHTML
    // console.log(document.getElementById(cardNum).innerHTML)
    document.getElementById("fav").innerHTML = card
}
 //#Max  These listeners are for switching each specific card into the fav div.
$("#card1").on("click", function(){
    cardClickToFavorite('card1')
})
$("#card2").on("click", function(){
    cardClickToFavorite('card2')
})
$("#card3").on("click", function(){
    cardClickToFavorite('card3')
})
$("#card4").on("click", function(){
    cardClickToFavorite('card4')
})
$("#card5").on("click", function(){
    cardClickToFavorite('card5')
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

function flipPlayedCards (cardArray){
    $(".played-card").each(function(){
        $(this).toggleClass('flipped');
    })
}

function preparePlayedCards (cardArray){
    var index = 0;
    $(".played-card").each(function(){
        console.log(cardArray[index])
        $(this).find(".card-back").data("cardInfo", cardArray[index]);
        $(this).toggleClass('flipped');
        index++;
    })
}

function startJudging (){
    // Bex: should run whenever all player cards are submitted
    // Bex: switch the prompt on the host screen
    showAndHide("pre-judging-message", "mid-judging-message");
    // Bex: TODO: assign the data for the cards (and the players they belong to? might not be necessary if we keep info on player hands in the host side) on each card div
    var dummySubmittedCards = ["1", "2", "3", "4"]

    preparePlayedCards(dummySubmittedCards);
    
}


function startGame(){
    //Bex: TODO: Generate random numbers to represent each card for each player
    //then run a query to obtain all of those cards and shuffle them
    //then construct an array of cards for each players hand and the remaining cards

    showAndHide("host-pregame-lobby", "host-game");
}

// #Gowri socket emit to the server to start the game
$("#start-game-button").on("click", function(){
    socket.emit('start game');
    startGame();

});

//#Gowri added the userName since playerlist is an object
function updatePlayerConnections(playerList){
    $("#player-connections-container").empty();
    for(var p in playerList){
        $("#player-connections-container").append($("<div>").addClass("player-circle").text(playerList[p].userName))
    }
}

function updateScore(winningPlayerId, winningPlayerName){
    // Increment the score of the winner
    var winnerJqueryObj = $("#"+winningPlayerId);
    var updatedScore = parseInt(winnerJqueryObj.attr("data-score")) + 1;
    winnerJqueryObj.attr("data-score", updatedScore).text(updatedScore+" : "+winningPlayerName);

}

function isRoomFull(){
    //Bex: dummy hard coding
    var fullRoom = false;
    if (fullRoom){
        showAndHide("room-form", "room-full-message");
    }
}

$(".card-back").on("dblclick", function(){
    console.log($(this).data("cardInfo"));
});

//#Gowri listen for the players joined and update the host screen
socket.on('player joined', function(players){
    updatePlayerConnections(players);
})

socket.on('deal cards', function(cards) {
    cards.forEach( card => console.log(card.title));
})


//============================================================================================================================
//***************************************** JORDAN'S DUMB SHIT ***************************************************************
//============================================================================================================================
// card object 
class card {
    // title, description, role(green or red), isused, roomid, pid
    constructor(t, d, r, pid) {
        this.id = null;
        this.title = t;
        this.description = d;
        // player only receives red cards
        // deez are useless as it stands
        // this.role = r;
        // this.usedThisRound = u;
        // this.roomID = rid;
        this.player_id = pid;
    }
} // end card

// player object to hold essential information regarding the player and the game
// contains functions: newhand, newcard, newdeck, markcards, findcard, removecard
class user {
    //on creation is passed playerID, Username, Role, RoomID
    constructor(pid, un, r, rid) {
        this.player_id = pid;
        this.username = un;
        this.role = r;
        this.room_id = rid;
        //holds all the cards the user will ever use
        this.deck = [];
        //the cards the user can currently see
        this.hand = [];
        //where we are at in the deck array (useful for determining which cards to put in user's hand)
        this.deckindex = 0;
        // //keep track if they are the leader or nah...... DONT NEED LUL.. wait maybe i do
        this.trump = false;
        // can the user submit a card yet? or nah
        this.cansub = false;
    }
    // receive an object with an array of cards within, put dem in da deck
    newdeck(dek) {
        // assuming cards is the key to the array value within passed object 'dek'
        this.deck = dek.cards;
        this.markcards();
        this.newhand();
    }
    // dis function assigns all the cards in the player's deck with the player's ID 
    markcards() {
        for (var i = 0; i < this.deck.length; i++)
            this.deck[i].player_id = this.player_id;
    }
    // dis function will give le player 4 new cards in their hand while destroying their current hand
    newhand() {
        //erase their hand
        this.hand = [];
        //give em new cards
        for (var i = this.deckindex; i < this.deckindex + 4; i++)
            this.hand.push(this.deck[i]);
        //console.log("new hand: " + this.hand[0].player_id); working
        this.deckindex += 4;

        //call function to show cards to user here:

    }
    //adds a new card to the user's hand
    newcard() {
        this.hand.push(this.deck[this.deckindex]);
        this.deckindex++;

        //call function to show cards to user here:

    }
    //removes the card at the index of the argument from hand
    removecard(here) {
        this.hand.splice(here, 1);
        this.newcard();
        this.cansub = false;
    }
    //this function finds the index of the card with the passed title
    findcard(noun) {
        for (var i = 0; i < this.hand.length; i++) {
            if (this.hand[i].title == noun)
                return i;
        }
        return -1;
    } //end findcard

} //end player

//*************************************** LISTEN FOR PLAYERS  ***********************************************************
// socket.on('sendplayers', DIDNT WRITE FUNCTION YET TO MAKE PLAYER)


// create the player object (not sure where im going to get the variables listed below from so ill hardcode for now)
// (playerID / username. role is always 'player' so i think its a bit redundant) 
// var thisuser = new user(2, "Smitty Werbenjagermanjensen", "player", 1);



// *********************************** LISTEN FOR CARDS TO BE DEALT *****************************************************
// listener for "cardsout" message from socket goes here:
// socket.on('cardsout', thisuser.newdeck(data))


// for testing purposes
// var cardme = new card("Test", "A Test", 0);
// var passme = { cards: [cardme, cardme, cardme, cardme] };
// // console.log("Object Socket Passed: " + passme); working
// // console.log("IM WORKING I THINK");
// thisuser.newdeck(passme);


// *********************************** END CARDS DEALT *******************************************************************




//************************************ LISTEN FOR LEADER TO BE ASSIGNED **************************************************
// listener for "assignleader" message from socket goes here (assuming passed argument looks like object{leader: true} or object{leader: false})
// socket.on('assignleader', hideAll(CREAMFILLING));


//************************************* END LISTEN FOR LEADER **************************************************************


//************************************* LISTEN FOR GREEN CARD **************************************************************

// thought about this for a while and decided best course of action to avoid a listener within a listener is having a bool 
// within the user and setting it to true when they can click a card to submit it. 

// listen for socket (beginturn) goes here: 
// socket.on('beginturn', function(){ thisuser.cansub = true; } );


//************************************* END LISTEN FOR GREEN ***************************************************************


//************************************* LISTEN FOR END OF ROUND ************************************************************

//socket listener for endofround goes here:
//socket.on('endofround', thisuser.newhand());


//************************************* END LISTEN FOR ROUND END ************************************************************


//************************************* LISTEN FOR END OF GAME **************************************************************

//socket listener for endofgame goes here:
//socket.on('endofgame', ENDIT());



//*************************************     FUNCTIONS      *****************************************************************

//this function signifies the end of the game and will hide all cards and display a message for the time being
function ENDIT() {

}



// assuming there's a onclick="chooseCard()" in the html for the cards 
// also going to need them to either force pass "this" in the html or keep a data tag for the title of the card
// function checks if the user can currently submit a card, if they can it emits that card
// function chooseCard() {
//     if (!thisuser.cansub)
//         return;
//     else {}
// }
// or i can just have an event listener for "player-hand-card"
$(".player-hand-card").on('click', function() {
    // CHECK IF THE USER CAN SUBMIT A CARD YET
    if (!thisuser.cansub)
        return;
    else {
        //get the title of the card
        var findthis = $(this).children('h2').text;
        //find what index of hand array it is at
        var itshere = thisuser.findcard(findthis);
        if (itshere == -1)
            console.log("you suck, thats not it");

        //EMIT THE CARD THAT HAD BEEN CHOSEN
        //socket.emit('chosencard', thisuser.hand[itshere]);

        //REMOVE THE CHOSEN CARD FROM HAND & DRAW NEED CARD
        thisuser.removecard(itshere);
    }
});


// function to respond to whether they are the leader or not (hiding all their cards etc if they are)
function hideAll(bool) {
    if (bool.leader == false) {
        thisuser.trump = false;
        return;
    } else {
        thisuser.trump = true;
        // HIDE EVERYTHING ON THE FRONT END AND DISPLAY "AY, YOU, GO TO THE HOST COMPUTER TO PICK A CARD"
    }
}
//************************************    NO MORE FUNCTIONS    **************************************************************

//============================================================================================================================
//************************************* END JORDAN'S DUMB SHIT ***************************************************************
//============================================================================================================================
