var express = require("express");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");

// scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// require models
var db = require("./models");

var PORT = 3000;

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

// mongoose.connect("mongodb://localhost/dbName", { useNewUrlParser: true });

// start server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + ".");
});