var showAndHide = function (id1, id2) {
    $(`#${id1}`).hide
    $(`#${id2}`).show
}

$('#code-button').click(function() {
    showAndHide("roomCode", "pregame")
});
