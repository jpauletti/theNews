var scrapeNew = $("#scrape-new");
var clearArticles = $("#clear-articles");
var saveStory = $(".saveStory")

// click scrape new articles button
scrapeNew.on("click", function(event) {
    event.preventDefault();

    // get request for new scrape
    $.get("/api/new-scrape", function (data) {
        console.log("new scrape performed");
        window.location.reload();
    })
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