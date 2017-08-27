/*===============================================================
    #SRM host functions
===============================================================*/
var currentURL = window.location.origin;

//An object that holds the global variables for the game that the host machine needs to track
var hostGlobalVar = {
    deckArray: [],
    playersArray: [],
    redCardsArray: [],
    greenCardsArray: [],
    playerDecks: []
};

// #SRM need to delete this part and make the server actualy work

//1.) Host presses button to create room
//2.) Enters room ID (and told that a game must have 5 players, and will last 2 rounds)
//3.) Assigned a socket, object with roomName, role, players (hardcode 5), and gameLength (hardcode 2)


// #SRM This is hardcoded as a button press. We need to change it to a socket listener event: 
// "5 PLAYERS HAVE JOINED ROOM"
$("#grabPlayers").on("click", function(){

    hostGlobalVar.roundsNum = 2;

    // #SRM FIX HARDCODING: take in the players from socket, right now they're hardcoded.
    // #SRM Host pulls the players from socket
    hostGlobalVar.playersNum = initializePlayersLocally();
    hostGlobalVar.greenCardsTotal = (hostGlobalVar.playersNum*hostGlobalVar.roundsNum);
    hostGlobalVar.redCardsTotal = ( ((hostGlobalVar.playersNum*4)*hostGlobalVar.roundsNum) + ( ( (hostGlobalVar.playersNum - 1)*(hostGlobalVar.playersNum) )*hostGlobalVar.roundsNum ) );

    // #SRM AJAX call to grab an array of all the red cards that all players will need for the game
    $.ajax({
        url: currentURL + "/api/cards/draw",
        method: "POST",
        // #SRM Create a shuffled array of all red card ids in our db, then splice it to match our game length, and turn it into a string
        // NOTE: the card ids have been set to match our database as it appeared on 2017.08.26 
        data: {idsString: ( generateIdArray( 7461+1, 1 ).splice( 0, hostGlobalVar.redCardsTotal ).toString() )} 
    }).done(function(data){
        hostGlobalVar.redCardsArray = data;
        console.log(hostGlobalVar.redCardsArray)
    });

   // #SRM AJAX call to grab an array of all the green cards needed for the game
    $.ajax({
        url: currentURL + "/api/cards/draw",
        method: "POST",
        // #SRM Create a shuffled array of all green card ids in our db, then splice it to match our game length, and turn it into a string
        // NOTE: the card ids have been set to match our database as it appeared on 2017.08.26 
        data: {idsString: ( generateIdArray( 9951+1, 7471 ).splice( 0, hostGlobalVar.greenCardsTotal ) ).toString() } 
    }).done(function(data){
        hostGlobalVar.greenCardsArray = data;
        console.log(hostGlobalVar.greenCardsArray)
    });
   
    
});


//7.) Host deals the game's worth of red cards to each player via an array of card objects in socket
    
    // #SRM create the individual player decks
    //createDecks(function(){
    //    console.log(hostGlobalVar.playerDecks);
    //});

//#### EMIT A: "CARDS DEALT" ####################################################

/*===============================================================
    PlayRound
===============================================================*/
//8.) Host will determine who the next leader is by who is up next in the player array
//#### EMIT B: "YOU ARE THE LEADER" ################
//9.) Send this message to 1 player

//#### EMIT C: "YOU ARE NOT THE LEADER" #########################################
//10.) Send this message to all other players

//11.) Reveal next green card in array
//#### EMIT D: "GREEN CARD REVEALED" ############################################

//#### LISTENER E: ALL 4 "RED CARD PLAYED" MESSAGES RECEIVED ####################
//12.) Host will draw al the submitted cards from socket
//13.) Host will store them locally in a submittedCards array
//14.) Submitted cards will display on the host's machine
//15.) Host will pick a card to win this turn
//16.) Host will check the card.player_id value for teh submitted card, and update that player's score on local storage
//17.) Host adds the winning card to a winningCards array locally
//18.) Host clears the submittedCArds array

//19.) If it is not the last turn of a round start this section of code again from step 8
//20.) If it is the last turn of the round, check if it is the last round as well
//21.) If it is not also the last round, increase the local round counter
//#### EMIT F: "END OF ROUND" ###############################################
//22.) Go back to step 8 and repeat

/*===============================================================
    #SRM EndGame
===============================================================*/
//23.) If it is the last turn of the last round, display winner on screen, and whatever else we want to do
//#### EMIT G: "END OF GAME" ###############################################

/*
function createDecks(cb){

    var deckIndexTracker = 0;

    for (i=0; i<hostGlobalVar.playersNum; i++){
        
        var playerDeckArray = [];
        push    
        hostGlobalVar.playerDecks.push(playerDeckArray);

    }

    return cb;

};
*/

// #SRM FIX HARCODING, the players are hardcoded right now, needs to be switched to get them via socket
// This sets the global variable of the players array.
function initializePlayersLocally(){

    //#SRM REPLACE THIS WITH A SOCKET CALL
    hostGlobalVar.playersArray = [
        {
            id: 1,
            username: "Player1",
            room_id: 1,
        },
        {
            id: 11,
            username: "Player2",
            room_id: 1,
        },
        {
            id: 21,
            username: "Player3",
            room_id: 1,
        },
        {
            id: 31,
            username: "Player4",
            room_id: 1,
        },
        {
            id: 41,
            username: "Player5",
            room_id: 1,
        }
    ];

return hostGlobalVar.playersArray.length;

};


//Bex: Generating array of ids
function serialArray(n, initialId){
    var arr = [];
    for (var i = initialId; i <= n-1; i+=10) {
        arr.push(i);
    }
    return arr;
}

// Function supplied directly by Bex
function shuffle(array) {
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

// #SRM this assumes a databse identical to the 2017.08.26 version, if cards/ids change, the query incorporating these ids risks breaking
// #SRM This function generates a shuffled array of ids corresponding to cards in our db
function generateIdArray(endNum, startNum){
    return shuffle(serialArray(endNum, startNum))
};