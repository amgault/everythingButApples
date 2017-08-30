let socket = io.connect();

// #Max To hide first div and show second
let showAndHide = function(id1, id2) {
    $(`#${id1}`).hide()
    $(`#${id2}`).show()
    console.log(`hiding:${id1}  showing:${id2}`)
}

function getRandNum() {
    return (Math.floor(Math.random() * (99999 - 10000 + 1) + 10000));
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
    console.log(userData);
    socket.emit('set user', userData);
});

// #Gowri moved into a listener so as to control from server the display of player page only if there is a place in the room
socket.on("display pregame", function() {
    showAndHide("roomCode", "pregame");
});

// #Max New Card submit listener
$("#createCards").submit(function(e) {
    e.preventDefault();
    submitCards()
})

//#Max  Posting new cards to database
function submitCards() {
    $.post("/api/cards/create", $("#card-form").val().trim())
    $("#card-form").val("");
}

//listener for host a game 
$("#host").on("click", function() {
    let room = getRandNum()
    let userData = {
        userName: "Host-" + room,
        roomId: room,
        role: "host",
        playerId: socket.id
    }
    console.log(userData)

    //Bex: some setup for displaying the lobby page
    $("#room-code").text(userData.roomId);
    socket.emit('set user', userData);
})

//Bex: I moved this out here so I can see the host page while I'm working on it; it wasn't working before
// #Gowri moved into a listener so as to control from server the display of host page only if there are no hosts
socket.on("display host", function() {
    showAndHide('landing', 'host-page')
});

//#Gowri changed this button to emit a check function to know if a player can join
// $("#play-a-game").on("click", function() {
//     socket.emit("can player join");
// })

//#Gowri on receiving confirmation from server then display the player page
// socket.on("display player", function() {
//     showAndHide('landing', 'player-room')
// });

//#Gowri added listener to know when room is full and call function to display room full message
socket.on('player limit reached', isRoomFull);


//#Max Writing card click to favorite
function cardClickToFavorite(cardNum) {
    // let card = document.getElementById(cardNum).innerHTML
    // // console.log(document.getElementById(cardNum).innerHTML)
    // document.getElementById("fav").innerHTML = card

 //#Jordan This is to fix having to change two cards html when changing hand. First option is a copy and puts the IDs of the
 // card chosen in the fav div as well. This option only changes the text. 
    var clickedcardtitle = document.getElementById(cardNum).childNodes[1].innerHTML;
    var clickedcarddescription = document.getElementById(cardNum).childNodes[3].innerHTML;
    // console.log("number of children: " + document.getElementById(cardNum).childNodes.length);
    // for(i=0; i<document.getElementById(cardNum).childNodes.length; i++)
    //     console.log("Child node "+i+" :" + document.getElementById(cardNum).childNodes[i]);
    
    document.getElementById("fav").childNodes[1].innerHTML = clickedcardtitle;
    document.getElementById("fav").childNodes[3].innerHTML = clickedcarddescription;
}
//#Max  These listeners are for switching each specific card into the fav div.
$("#card1").on("click", function() {
    cardClickToFavorite('card1')
})
$("#card2").on("click", function() {
    cardClickToFavorite('card2')
})
$("#card3").on("click", function() {
    cardClickToFavorite('card3')
})
$("#card4").on("click", function() {
    cardClickToFavorite('card4')
})
$("#card5").on("click", function() {
    cardClickToFavorite('card5')
})







// general functions for running Host
function getRandNumByInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//from: https://stackoverflow.com/a/2450976
function shuffleArray(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

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

function removeItemFromArray(item, array) {
    return array.splice($.inArray(item, array), 1);
}


// Host Functions

function flipPlayedCards(cardArray) {
    $(".played-card").each(function() {
        $(this).toggleClass('flipped');
    })
}

function preparePlayedCards(cardArray) {
    var index = 0;
    $(".played-card").each(function() {
        //Change display of of red cards to fill them with text and flip them over
        $(this).find(".nounTitleText").html(cardArray[index].title);
        $(this).find(".nounDescriptionText").html(cardArray[index].description);
        //.data("cardInfo", cardArray[index]);
        $(this).toggleClass('flipped');

        //change the data attribute of the card so we can access it later when we pick a winner
        $(this).attr("data-player-id", cardArray[index].player_id);
        $(this).attr("data-player-username", cardArray[index].userName);

        index++;
    })
}


function clearPlayedCards() {
    $(".played-card").each(function() {
        //Change display of of red cards to fill them with text and flip them over
        $(this).find(".nounTitleText").html();
        $(this).find(".nounDescriptionText").html();
        $(this).toggleClass('flipped');

        //change the data attribute of the card so we can access it later when we pick a winner
        $(this).attr("data-player-id", "null");
        $(this).attr("data-player-username", "null");

    })
}

function hostStartJudging(submittedCards) {
    // Bex: should run whenever all player cards are submitted
    // Bex: switch the prompt on the host screen
    showAndHide("pre-judging-message", "mid-judging-message");
    // Bex: TODO: assign the data for the cards (and the players they belong to? might not be necessary if we keep info on player hands in the host side) on each card div

    preparePlayedCards(submittedCards);

}


function startGame() {
    //Bex: TODO: Generate random numbers to represent each card for each player
    //then run a query to obtain all of those cards and shuffle them
    //then construct an array of cards for each players hand and the remaining cards

    showAndHide("host-pregame-lobby", "host-game");
}

// #Gowri socket emit to the server to start the game
$("#start-game-button").on("click", function() {
    socket.emit('start game');
    startGame();

});

//#Gowri added the userName since playerlist is an object
function updatePlayerConnections(players) {
    console.log("IN updatePlayerCOnnections we received: " + players);
    $("#player-connections-container").empty();
    for (var p in players) {
        $("#player-connections-container").append($("<div>").addClass("player-circle").text(players[p].userName))
    }
}

function updateScore(winningPlayerId, winningPlayerName) {
    // Increment the score of the winner
    var winnerJqueryObj = $("#" + winningPlayerId);
    var updatedScore = parseInt(winnerJqueryObj.attr("data-score")) + 1;
    winnerJqueryObj.attr("data-score", updatedScore).text(updatedScore + " : " + winningPlayerName);

}

//#Bex added function with dummy variable
//# Gowri changed isRoomFull to receive the div name that should be hidden
function isRoomFull(where) {
    showAndHide(where, "room-full-message");
}


//#Gowri listen for the players joined and update the host screen

socket.on('player joined', function(players) {
    updatePlayerConnections(players);
})

socket.on('all players joined', function(hostGlobalVar) {
    hostLocalVar = hostGlobalVar;
})

//#Gowri listen for the deal cards after host starts game and switch the users to play screen
// socket.on('deal cards', function(cards) {
//     showAndHide('pregame', 'game');
//     cards.forEach(card => console.log(card.title));
// })

//#Gowri listen for the start game and get the green cards for Host
socket.on('green cards', function(hostGlobalVar) {
    hostLocalVar = hostGlobalVar;
})


//============================================================================================================================
//***************************************** JORDAN'S DUMB Stuff **********************************************************
//============================================================================================================================
// card object 
class card {
    // title, description, role(green or red), isused, roomid, pid
    constructor(t, d, pid) {
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
        this.deck = dek;
        //this.markcards();
        this.newhand();
    }
    // // dis function assigns all the cards in the player's deck with the player's ID///// OBSOLETE
    // markcards() {
    //     for (var i = 0; i < this.deck.length; i++)
    //         this.deck[i].player_id = this.player_id;
    // }
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
        swapHand();
    }
    //adds a new card to the user's hand
    newcard() {
        console.log("adding " + this.deck[this.deckindex].title)
        this.hand.push(this.deck[this.deckindex]);
        this.deckindex++;

        //call function to show cards to user here:
        swapHand();
    }
    //removes the card at the index of the argument from hand
    removecard(here) {
        console.log("removing " + this.hand[here].title + " from hand");
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
var thisuser = new user("", "", "player", "");
var myhost = '';
socket.on('checkyoself', function(playa) {
    if (thisuser.player_id == "") {
        //console.log("player emit recieved");
        thisuser.player_id = playa.playID;
        thisuser.username = playa.thename;
        thisuser.room_id = playa.room;
        myhost = playa.hostsock;

        //change player names on screen
        document.getElementById("playername").innerHTML = thisuser.username;
    }
});

// *********************************** LISTEN FOR CARDS TO BE DEALT *****************************************************
// listener for "cardsout" message from socket goes here:
// socket.on('cardsout', thisuser.newdeck(data))


// for testing purposes
//var cardme = new card("Test", "A Test", 0);
//var cardtwo = new card("NewCard", "A new card", 1);
var passme = [];
// console.log("Object Socket Passed: " + passme); working
// console.log("IM WORKING I THINK");
//thisuser.newdeck(passme);

//#Gowri listen for the deal cards after host starts game and switch the users to play screen
socket.on('deal cards', function(cards) {
    showAndHide('pregame', 'game');
    //console.log("cards dealt");
    for (i = 0; i < cards.length; i++) {
        passme.push(new card(cards[i].title, cards[i].description, thisuser.player_id));
    }
    thisuser.newdeck(passme);
})


// *********************************** END CARDS DEALT *******************************************************************




//************************************ LISTEN FOR LEADER (start turn) ******************************************************
// listener for "assignleader" message from socket goes here (assuming passed argument looks like object{leader: true} or object{leader: false})
// socket.on('assignleader', hideAll(CREAMFILLING));

socket.on('turn lead', function(turnlead) {
    console.log("next leader received");
    hideAll(turnlead);
});


//************************************* END LISTEN FOR LEADER **************************************************************



//************************************* LISTEN FOR END OF ROUND ************************************************************

//socket listener for endofround goes here:
//socket.on('end of round', thisuser.newhand());


//************************************* END LISTEN FOR ROUND END ************************************************************


//************************************* LISTEN FOR END OF GAME **************************************************************

//socket listener for endofgame goes here:
//socket.on('endofgame', ENDIT());



//*************************************     FUNCTIONS      *****************************************************************

// this function will change the html of the cards to match the local user's hand
function swapHand() {
    for (i = 1; i <= thisuser.hand.length; i++) {
        console.log("card " + i + ": " + thisuser.hand[i - 1].title);
        document.getElementById("card" + i + "-noun").innerHTML = thisuser.hand[i - 1].title;
        document.getElementById("card" + i + "-desc").innerHTML = thisuser.hand[i - 1].description;
    }
    document.getElementById("fav").childNodes[1].innerHTML = thisuser.hand[thisuser.hand.length-1].title;
    document.getElementById("fav").childNodes[3].innerHTML = thisuser.hand[thisuser.hand.length-1].description;

} //end swaphand


//this function signifies the end of the game and will hide all cards and display a message for the time being
function ENDIT() {

} // end endit

// assuming there's a onclick="chooseCard()" in the html for the cards 
// also going to need them to either force pass "this" in the html or keep a data tag for the title of the card
// function checks if the user can currently submit a card, if they can it emits that card
// function chooseCard() {
//     if (!thisuser.cansub)
//         return;
//     else {}
// }
// or i can just have an event listener for "player-hand-card"

// THERE IS NOW A SUBMIT BUTTON, PUT THE LISTENER HERE

$("#playerschoice").on('click', function() {
    // CHECK IF THE USER CAN SUBMIT A CARD YET
    if (!thisuser.cansub) {
        console.log("you cant submit a card yet");
        return;
    } else {
        //get the title of the card
        var findthis = document.getElementById("fav").childNodes[1].innerHTML;
        //console.log("child node 1: " + document.getElementById("fav").childNodes[1]);
        //find what index of hand array it is at
        //console.log("find this: " + findthis);
        var itshere = thisuser.findcard(findthis);
        //if (itshere == -1){
        //    console.log("you suck, thats not it");
        //}
        //EMIT THE CARD THAT HAD BEEN CHOSEN
        //console.log("card position in hand: " + itshere);
        // console.log("card emitted: " + thisuser.hand[itshere]);
        socket.emit('chosencard', thisuser.hand[itshere]);
        //console.log("SUBMITTED?");

        //REMOVE THE CHOSEN CARD FROM HAND & DRAW NEED CARD
        thisuser.removecard(itshere);

        //DISALLOW FURTHER SUBMISSIONS
        thisuser.cansub = false;
    }

    //thisuser.newhand();
    // var testbool = { leader: true };
    // hideAll(testbool);
});

// function to respond to whether they are the leader or not (hiding all their cards etc if they are)
function hideAll(pid) {
    if (thisuser.player_id == pid) {
        thisuser.trump = true;
        thisuser.cansub = false;
        //HIDE EVERYTHING ON THE FRONT END AND DISPLAY "AY, YOU, GO TO THE HOST COMPUTER TO PICK A CARD"
        $("#pregame").hide();
        $("#game").hide();
        $("#player").hide();
        $("#hand").hide();

        var fingey = "░░░░░░░░░░░░░░░░█████████\n";
        fingey += "░░███████░░░░░███▒▒▒▒▒▒███\n";
        fingey += "░░█▒▒▒▒▒▒█░░░░███▒▒▒▒▒▒▒▒▒███\n";
        fingey += "░░░█▒▒▒▒▒▒█░░░░██▒▒▒▒▒▒▒▒▒▒▒▒██\n";
        fingey += "░░░░█▒▒▒▒▒█░░██▒▒▒██▒▒▒▒██▒▒▒███\n";
        fingey += "░░░░░█▒▒▒█░░█▒▒▒▒████▒▒████▒▒▒▒██\n";
        fingey += "░░░█████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██\n";
        fingey += "░░░█▒▒▒▒▒▒▒▒▒▒▒▒█▒▒▒▒▒▒█▒▒▒▒▒▒▒██\n";
        fingey += "░██▒▒▒▒▒▒▒▒▒▒▒▒▒█▒▒██▒▒▒▒▒▒██▒▒██\n";
        fingey += "██▒▒▒███████████▒▒▒▒██▒▒▒▒██▒▒▒██\n";
        fingey += "█▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█▒▒▒▒██████▒▒▒▒██\n";
        fingey += "██▒▒▒▒▒▒▒▒▒▒▒▒▒▒█▒▒▒▒▒▒▒▒▒▒▒▒▒██\n";
        fingey += "░█▒▒▒███████████▒▒▒▒▒▒▒▒▒▒▒▒██\n";
        fingey += "░██▒▒▒▒▒▒▒▒▒▒████▒▒▒▒▒▒▒▒▒▒█\n";
        fingey += "░░████████████░░███████████\n";

        alert("You are the leader, CHOOSE WINNER FROM THE MAIN COMPOOTER \n" + fingey);
    } else {
        thisuser.cansub = true;
        if (thisuser.trump == true) {
            thisuser.trump = false;
            $("#game").show();
            $("#player").show();
            $("#hand").show();
        }
        return;
    }
}


//************************************    NO MORE FUNCTIONS    **************************************************************


/*============================================================================
    
    #SRM
    HOST Local VARIABLES

=============================================================++==============*/
var hostLocalVar = {
    currentGreenCard: null,
    currentGreenCardIndex: 0,
    currentLeaderIndex: 0,
    dealerTracker: 0,
    greenDeck: [],
    hostArray: [],
    playersArray: [],
    playerDecks: [],
    roundsNum: 2,
    roundsTracker: 1,
    submittedCards: [],
    winningCards: [],
    playersNum: 0
};


/*============================================================================
    
    #SRM 
    HOST FUNCTIONS

============================================================================*/

/*============================================================================
    
    #SRM 
    HOST GAME LOGIC

============================================================================*/

$("#start-game-button").on("click", function() {

    var hostStartGameVar = $("#start-game-button").data("hostVar");
    showAndHide("host-pregame-lobby", "host-game");
    socket.emit('next leader', hostLocalVar.playersArray[hostLocalVar.currentLeaderIndex].playerId);
    $("#judging-player").html(hostLocalVar.playersArray[hostLocalVar.currentLeaderIndex].userName);
    $("#host-round-number").html(hostLocalVar.roundsTracker);
});

//#SRM for FRONTEND:This needs to be an actual button
$("#showGreenCard").on("click", function() {

    hostLocalVar.currentGreenCard = hostLocalVar.greenDeck[hostLocalVar.currentGreenCardIndex];

    //DISPLAY CURRENT LEADER
    showAndHide("pre-judging-message", "mid-judging-message");
    $("#mid-judging-player").html(hostLocalVar.playersArray[hostLocalVar.currentLeaderIndex].userName);

    //green card will display on-screen
    $("#adj-title").text(hostLocalVar.currentGreenCard.title);
    $("#adj-description").text(hostLocalVar.currentGreenCard.description);
    socket.emit('green card revealed');

});

// #SRM This is the listener for red cards received
socket.on('here goes nothing and a red card', function(card) {
    console.log(card);
    hostLocalVar.submittedCards.push(card);
    //If all cards have now been submitted, start judging
    if (hostLocalVar.submittedCards.length === (hostLocalVar.playersArray.length - 1)) {
        hostStartJudging(hostLocalVar.submittedCards);
    }
})

//#SRM When the host double-clicks on their favorite card
$(".played-card").on("dblclick", function() {

    /*
    for (i=0; i<hostLocalVar.playersArray.length; i++{
        if (hostLocalVar.playersArray)
    }
    */

    $("#adj-title").text('ヘ(^o^ヘ)');
    $("#adj-description").text("+1 pt");
    //Host adds the winning card to a winningCards array locally
    //hostLocalVar.winningCards.push();

    //Host clears the submittedCArds array
    hostLocalVar.submittedCards = [];
    clearPlayedCards();

    //Check if it is the last turn of the last round
    if (hostLocalVar.currentLeaderIndex + 1 === hostLocalVar.playersArray.length && hostLocalVar.roundsTracker === hostLocalVar.roundsNum) {

        // Display the winner?

        //#SRM EMIT AN END OF GAME MESSAGE TO ALL THE PLAYERS
        socket.emit('end of game', { message: "End of Game!" });
        alert("END OF GAME");

    } else if (hostLocalVar.currentLeaderIndex + 1 === hostLocalVar.playersArray.length) {
        //if it is not the last round, get ready for the next round 

        //increase the round tracker
        hostLocalVar.roundsTracker++;
        $("#host-round-number").html(hostLocalVar.roundsTracker);

        //reset the leader rotation for the next round
        hostLocalVar.currentLeaderIndex = 0;

        //go to the next green card
        hostLocalVar.currentGreenCardIndex++;
        hostLocalVar.currentGreenCard = hostLocalVar.greenDeck[hostLocalVar.currentGreenCardIndex];

        //# EMIT "END OF ROUND" to all players via socket
        socket.emit('next leader', hostLocalVar.playersArray[hostLocalVar.currentLeaderIndex].playerId);
        socket.emit('end of round', { message: "End of Round!" });
        showAndHide("mid-judging-message", "pre-judging-message");
        $("#judging-player").html(hostLocalVar.playersArray[hostLocalVar.currentLeaderIndex].userName);
    }

    // if it's not the last turn of a round, then get ready for the next turn
    else {
        //#SRM for frontend: display a temp message on the host screen that it's the next person's turn?

        // Queue up the next green card for the next time someone presses the reveal button
        hostLocalVar.currentGreenCardIndex++;
        hostLocalVar.currentGreenCard = hostLocalVar.greenDeck[hostLocalVar.currentGreenCardIndex];

        // Queue up the next leader for the next time and emit the round leader messages to prep for next turn
        hostLocalVar.currentLeaderIndex++;

        //When I console log this mess of a variable in the window after the emit was supposed to go out,I still get something.
        socket.emit('next leader', hostLocalVar.playersArray[hostLocalVar.currentLeaderIndex].playerId);
        //DISPLAY CURRENT LEADER
        showAndHide("mid-judging-message","pre-judging-message");
        $("#judging-player").html(hostLocalVar.playersArray[hostLocalVar.currentLeaderIndex].userName);
    }

});