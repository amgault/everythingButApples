let socket = io.connect();

//To hide first div and show second
let showAndHide = function (id1, id2) {
    $(`#${id1}`).hide()
    $(`#${id2}`).show()
}

//This is to validate code
function codeComparison() {
    let inputCode = $("#code-input").val();
    console.log(inputCode)
    //Compare input code to room codes available
    // if (input code exists)
        showAndHide("roomCode", "pregame")
    // else
    // Request new code
}

function submitUsername() {
    //I don't think there needs to be validation if name is already taken but it may mess us up.  Unless each player is named player i to our programming

    //AJAX post user name to room
        //This should post it to the host to display the name on the players box

    //Shows next input if they want
    showAndHide("username", "createCards")
}

function Card(text, player) {
    this.text = text;
    this.description = "A homemade card, made with love from " + player
}

function submitCards() {
    //Can they make duplicates in the deck or not (?)
    let newCard = new Card(inputText, playerThatWroteit);

    //AJAX post card words to room
        // post newCard
        //This should post it to the deck (?)
        //I think this means a deck instance has to be made for each game.  So maybe you pull the original deck once then you post new cards into our "Sudodeck"
    
    //reset input so they can make more cards
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
    
    //socket.emit('set user', userData, function(){
        showAndHide("pregame", "game")
    //})
    //codeComparison()
});

//Name submit listener
$("#username").submit(function(e) {
    e.preventDefault();
    submitUsername()
})

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
    
    socket.emit('set user', userData, function(){
        showAndHide('landing','host')
    })
})

//On game start
    // showAndHide("pregame", "hand")
