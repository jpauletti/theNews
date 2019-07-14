var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

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

    // new scrape call
    app.get("/api/new-scrape", function(req, res) {
        console.log("getting stories now....");

        // scrape site
        axios.get("https://www.buzzfeed.com/").then(function (response) {
            var $ = cheerio.load(response.data);
            // get list of articles on homepage
            $('div[data-module="story-card"]').each(function (i, element) {
                var result = {};
                result.image = $(this).find(".card__image img").attr("src");
                result.headline = $(this).find(".js-card__link.link-gray").text();
                result.summary = $(this).find(".js-card__description").text();
                result.link = $(this).find(".js-card__link").attr("href");

                // make sure no fields are null
                if (result.image && (result.image).indexOf("data:image/gif") === -1 && result.headline && result.summary && result.link) {
                    var query = result;
                    var update = {};
                    var options = { upsert: true, new: true, setDefaultsOnInsert: true };
                    // does story already exist in db?
                    // headline/titles and images seem to be changed out a lot on buzzfeed, but summary stays the same so search for that
                    db.Story.find({ summary: result.summary }).then(function (dbFind) {
                        // if not found, add to db
                        if (dbFind.length === 0) {
                            db.Story.findOneAndUpdate(query, update, options, function (err, data) {
                                if (err) console.log(err);
                                console.log(data);
                            });
                            // if found, update the current story
                        } else {
                            db.Story.findOneAndUpdate({ summary: result.summary }, query, options, function (err, data) {
                                if (err) console.log(err);
                                console.log(data);
                            });
                        }
                    }).catch(function (err) {
                        if (err) console.log(err);
                    });
                }
            })
            res.redirect("/");
        }) //.then(function() {
        //     res.redirect("/");
        // });
    })


    // clear stories call
    app.get("/clear", function(req, res) {
        db.Story.deleteMany({}, function (err) {
            res.redirect("/");
        });
    })


    // save a story
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


    // remove a saved story
    app.post("/api/unsave", function (req, res) {
        var summary = req.body.summary;
        console.log(summary);
        // find all info about story
        db.Story.findOneAndUpdate({ summary: summary }, { saved: false }).then(function (dbStory) {
            console.log("saved value updated");
            res.json(true);
        }).catch(function (err) {
            if (err) console.log(err);
        })
    })


    // clear all saved stories
    app.get("/clear-saved", function (req, res) {
        // change all stories to saved: false
        db.Story.updateMany({}, { saved: false }).then(function (dbStory) {
            console.log("no more saved stories");
            res.json(true);
        }).catch(function (err) {
            if (err) console.log(err);
        })
    })



    // view notes about a story
    app.get("/api/notes/:id", function(req, res) {
        var id = req.params.id;

        db.Story.findOne({_id: req.params.id}).then(function(dbStory) {
            console.log(dbStory);
            res.send(dbStory.notes);
        }).catch(function(err) {
            if (err) console.log(err);
        })
    })


    // save a note
    app.post("/api/savenote/:id", function(req, res) {
        var note = req.body.newNote;

        // add note to story
        db.Story.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: note }}).then(function (dbStory) {
            console.log("saved new note");
            res.json(true);
        }).catch(function (err) {
            if (err) console.log(err);
        })
    })


    // delete a note
    app.post("/api/notes", function(req, res) {
        var storyId = req.body.storyId;
        var noteId = req.body.noteId;
        var noteContent = req.body.noteContent;

        // delete from db
        db.Story.findOneAndUpdate({ _id: storyId }, { $pullAll: { notes: [noteContent] } }).then(function(dbStory) {
            console.log("deleted a note");
            res.json(true);
        }).catch(function(err) {
            if (err) console.log(err);
        })
    })

}