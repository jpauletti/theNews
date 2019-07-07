var db = require("../models");

module.exports = function(app) {
    app.get("/", function(req, res) {
        db.Story.find({}).then(function(dbStory) {
            console.log(dbStory);
            // var stories = dbStory[0];
            res.render("home", { stories: dbStory });
        }).catch(function(err) {
            res.json(err);
        })
    })

    app.get("/saved", function (req, res) {
        db.Saved.find({}).then(function (dbSaved) {
            console.log(dbSaved);
            res.render("saved", { saved: dbSaved });
        }).catch(function (err) {
            res.json(err);
        })
    })
}