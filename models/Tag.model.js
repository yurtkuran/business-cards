const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema(
    {
        tag: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = Tag = mongoose.model('tags', tagSchema);
