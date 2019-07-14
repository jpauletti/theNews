var express = require("express");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");

// scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// require models
var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

// middleware
// log requests with morgan logger
app.use(logger("dev"));
// parse req body as json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// make public a static folder
app.use(express.static("public"));

// Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);


// connect to mongo db
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
// fix deprecation surrounding findOneAndUpdate()
mongoose.set('useFindAndModify', false);

// mongoose.connect("mongodb://localhost/dbName", { useNewUrlParser: true });


// scrape site
// axios.get("https://www.buzzfeed.com/").then(function(response) {
//     var $ = cheerio.load(response.data);
//     // get list of articles on homepage
//     $('div[data-module="story-card"]').each(function(i, element) {
//         var result = {};
//         result.image = $(this).find(".card__image img").attr("src");
//         result.headline = $(this).find(".js-card__link.link-gray").text();
//         result.summary = $(this).find(".js-card__description").text();
//         result.link = $(this).find(".js-card__link").attr("href");

//         // make sure no fields are null
//         if (result.image && (result.image).indexOf("data:image/gif") === -1 && result.headline && result.summary && result.link) {
//             var query = result;
//             var update = {};
//             var options = { upsert: true, new: true, setDefaultsOnInsert: true };
//             // does story already exist in db?
//             // headline/titles and images seem to be changed out a lot on buzzfeed, but summary stays the same so search for that
//             db.Story.find({ summary: result.summary }).then(function (dbFind) {
//                 // if not found, add to db
//                 if (dbFind.length === 0) {
//                     db.Story.findOneAndUpdate(query, update, options, function (err, data) {
//                         if (err) console.log(err);
//                     });
//                 // if found, update the current story
//                 } else {
//                     db.Story.findOneAndUpdate({summary: result.summary}, query, options, function (err, data) {
//                         if (err) console.log(err);
//                     });
//                 }
//             }).catch(function (err) {
//                 if (err) console.log(err);
//             });
//         }
//     })
// })





// start server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + ".");
});