var db = require("../models");
var axios = require("axios");

module.exports = function (app) {
    app.get("/api/stories", function (req, res) {
        db.Story.find({}).then(function (dbStory) {
            console.log(dbStory);
            // var stories = dbStory[0];
            res.json(dbStory);
        }).catch(function (err) {
            res.json(err);
        })
    })

    app.get("/api/saved", function (req, res) {
        db.Saved.find({}).then(function (dbSaved) {
            console.log(dbSaved);
            res.json(dbSaved);
        }).catch(function (err) {
            res.json(err);
        })
    })

    app.get("/api/new-scrape", function(req, res) {

        // scrape site
        axios.get("https://www.buzzfeed.com/").then(function (response) {
            var $ = cheerio.load(response.data);

            // get list of articles on homepage
            $('div[data-module="story-card"]').each(function (i, element) {
                var result = {};

                result.image = $(this).find(".card__image").css("background-image").split("'")[1];
                result.headline = $(this).find(".js-card__link.link-gray").text();
                result.summary = $(this).find(".js-card__description").text();
                result.link = $(this).find(".js-card__link").attr("href");

                // if it doesn't already exist, create it (if no fields are null)
                if (result.image && result.image !== "data:image/gif" && result.headline && result.summary && result.link) {
                    var query = result;
                    var update = {};
                    var options = { upsert: true, new: true, setDefaultsOnInsert: true };
                    db.Story.find({ summary: result.summary }).then(function (dbFind) {
                        console.log(dbFind);
                        console.log(dbFind.length);
                        console.log("did i find it?");
                        if (dbFind.length === 0) {
                            db.Story.findOneAndUpdate(query, update, options, function (err, data) {
                                if (err) console.log(err);
                            });
                        } else {
                            db.Story.findOneAndUpdate({ summary: result.summary }, query, options, function (err, data) {
                                if (err) console.log(err);
                            });
                        }
                    }).catch(function (err) {
                        if (err) console.log(err);
                    });
                }
            })
        })


        res.redirect("/");
    })

    app.post("/api/save", function(req, res) {
        var summary = req.body.summary;
        console.log(summary);
        // find all info about story
        db.Story.findOneAndUpdate({summary: summary}, {saved: true}).then(function(dbStory) {
            console.log("saved value updated");
            res.json(true);
        }).catch(function(err) {
            if (err) console.log(err);
        })
    })

}