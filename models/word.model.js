const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true,
        unique: true,
    },
    suggestionCount: {
        type: Number,
        default: 0,
    }
});

module.exports = mongoose.model('Word', wordSchema);
