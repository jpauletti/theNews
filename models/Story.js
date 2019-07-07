var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// new story schema object
var StorySchema = new Schema({
    headline: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
})

// create model from schema
var Story = mongoose.model("Story", StorySchema);

// export Story model
module.exports = Story;