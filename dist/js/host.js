function flipAllCards (){
    $(".played-card").each(function(){
        $(this).toggleClass('flipped');
    })
}

console.log("Test")