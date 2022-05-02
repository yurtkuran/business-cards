const mongoose = require('mongoose');

const businessCardSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
        },
        company: {
            type: String,
            trim: true,
        },
        comment: {
            type: String,
        },
        tags: {
            type: [String],
            trim: true,
        },
        images: [
            {
                // side: {
                //     type: String,
                // },
                // filename: {
                //     type: String,
                //     trim: true,
                // },
                // image: {
                //     data: Buffer,
                //     contentType: String,
                // },
            },
            { timestamps: true },
        ],
    },
    { timestamps: true }
);

module.exports = BusinessCard = mongoose.model('businessCards', businessCardSchema);
