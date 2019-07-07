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
        required: false
    },
    link: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false,
        trim: true
    },
    saved: {
        type: Boolean,
        required: true,
        default: false
    },
    notes: {
        type: Array,
        required: false
    }
})

// create model from schema
var Story = mongoose.model("Story", StorySchema);

// export Story model
module.exports = Story;