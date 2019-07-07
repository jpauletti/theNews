var db = require("../models");

module.exports = function (app) {
    app.get("/api/posts", function (req, res) {
        db.Story.find({}).then(function(dbStory) {
            res.json(dbStory);
        }).catch(function (err) {
            res.json(err);
        });

    });

}