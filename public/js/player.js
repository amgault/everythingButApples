let showAndHide = function (id1, id2) {
    $(`#${id1}`).hide()
    $(`#${id2}`).show()
}

$('#roomCode').submit(function(e) {
    e.preventDefault();
    // console.log(e)
    let inputCode = $("#code-input").val();
    console.log(inputCode)
    //Compare input code to room codes available
    // if (input code exists)
        showAndHide("roomCode", "pregame")
    // else
    // Request new code
});

//On game start
    // showAndHide("pregame", "hand")

//On code form submit