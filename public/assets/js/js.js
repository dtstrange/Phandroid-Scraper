$("#scrape").on("click", function(){
    $.ajax({
        url: '/scrape',
        mehtod:'GET'
    })
    .done(
        location.reload()
    )
});