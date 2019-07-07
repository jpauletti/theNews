var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// new story schema object
var SavedSchema = new Schema({
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
    }
})

// create model from schema
var Saved = mongoose.model("Saved", SavedSchema);

// export Story model
module.exports = Saved;