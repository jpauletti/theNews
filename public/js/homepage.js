var scrapeNew = $("#scrape-new");
var clearArticles = $("#clear-articles");
var saveStory = $(".saveStory");

function loadNewStories() {
    Swal.fire({
        title: 'New stories loading...',
        showCancelButton: false,
        showConfirmButton: false,
        showLoaderOnConfirm: false,
        onBeforeOpen: () => {
            Swal.showLoading()
            $.get("/api/new-scrape", function (data) {
                console.log("new scrape performed");
                $(".swal2-title").text("Loaded!");
                Swal.hideLoading();
                setTimeout(function () {
                    window.location.reload();
                }, 1500);
            })
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {

    })
}

// click scrape new articles button
scrapeNew.on("click", function(event) {
    event.preventDefault();
    loadNewStories();
})

// scrape new articles btn for empty page
$("#scrapeNew").on("click", function (event) {
    event.preventDefault();
    loadNewStories();
})


// click clear articles button
clearArticles.on("click", function(event) {
    event.preventDefault();

    $.get("/clear", function(data) {
        window.location.reload();
    })
})


// click save story button
saveStory.on("click", function(event) {
    event.preventDefault();

    var summary = $(this).prev().text();
    console.log(summary);
    
    // send summary for the story to be updated
    $.post("/api/save", {summary: summary}, function(data) {
        console.log(data);
        // refesh page
        window.location.reload();
    })
})