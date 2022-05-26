const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = Tag = mongoose.model('tags', tagSchema);
