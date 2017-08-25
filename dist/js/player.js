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
    
    //socket.emit('set user', userData, function(){
        showAndHide("roomCode", "pregame")
        // showAndHide("pregame", "game")
    //})
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


// Host Functions
function flipAllCards (){
    $(".played-card").each(function(){
        $(this).toggleClass('flipped');
    })
}
