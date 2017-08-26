// card object 
class card {
    // title, description, role(green or red), isused, roomid, pid
    constructor(t, d, r, pid) {
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
// contains functions: newhand, newcard, newdeck, markcards
class user{
	//on creation is passed playerID, Username, Role, RoomID
	constructor(pid, un, r, rid){
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
	newdeck(dek){
		// assuming cards is the key to the array value within passed object 'dek'
		this.deck = dek.cards;
		this.markcards();
		this.newhand();
	}
	// dis function assigns all the cards in the player's deck with the player's ID 
	markcards(){
		for(var i=0; i<this.deck.length; i++)
			this.deck[i].player_id = this.player_id; 
	}
	// dis function will give le player 4 new cards in their hand while destroying their current hand
	newhand(){
		//erase their hand
		this.hand = [];
		//give em new cards
		for(var i=this.deckindex; i<this.deckindex+4; i++)
			this.hand.push(this.deck[i]);
		//console.log("new hand: " + this.hand[0].player_id); working
	}

}//end player



// create the player object (not sure where im going to get the variables listed below from so ill hardcode for now)
// (playerID / username. role is always 'player' so i think its a bit redundant) 
var thisuser = new user(2, "Smitty Werbenjagermanjensen", "player", 1);



// *********************************** LISTEN FOR CARDS TO BE DEALT *****************************************************
// listener for "cardsout" message from socket goes here:
// socket.on('cardsout', thisuser.newdeck(data))
// for testing purposes
var cardme = new card("Test", "A Test",0);
var passme = {cards: [cardme, cardme, cardme, cardme]};
// console.log("Object Socket Passed: " + passme); working
thisuser.newdeck(passme); 

//this is where i need to show the cards to the user somehow


// *********************************** END CARDS DEALT *******************************************************************




//************************************ LISTEN FOR LEADER TO BE ASSIGNED **************************************************
// listener for "assignleader" message from socket goes here (assuming passed argument looks like object{leader: true} or object{leader: false})
// socket.on('assignleader', hideAll(CREAMFILLING));


//************************************* END LISTEN FOR LEADER **************************************************************


//************************************* LISTEN FOR GREEN CARD **************************************************************

// thought about this for a while and decided best course of action to avoid a listener within a listener is having a bool 
// within the user and setting it to true when they can click a card to submit it. 

// listen for socket emit here (beginturn)
	//what is socket sending here? and empty object? 
// socket.on('beginturn', function(datehr){ thisuser.cansub = true; } );





//************************************* END LISTEN FOR GREEN ***************************************************************

//*************************************     FUNCTIONS      *****************************************************************

// assuming there's a onclick="chooseCard()" in the html for the cards 
// also going to need them to either force pass "this" in the html or keep a data tag for the title of the card
// function checks if the user can currently submit a card, if they can it emits that card
function chooseCard(){
	if(!thisuser.cansub)
		return;
	else{
	}
}
// or i can just have an event listener for "player-hand-card"
$(".player-hand-card").on('click', function(){
	$(this).find('h2:first').text
}); 



// function to respond to whether they are the leader or not (hiding all their cards etc if they are)
function hideAll(bool){
	if(bool.leader == false){
		thisuser.trump = false;
		return;
	}
	else
	{
		thisuser.trump = true;
		// HIDE EVERYTHING ON THE FRONT END AND DISPLAY "AY, YOU, GO TO THE HOST COMPUTER TO PICK A CARD"
	}
}

//************************************    NO MORE FUNCTIONS    **************************************************************