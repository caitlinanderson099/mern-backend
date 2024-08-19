const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    // Add other properties if wanted
}, {timestamps: true})

module.exports = mongoose.model('Comment', commentSchema);