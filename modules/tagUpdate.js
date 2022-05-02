// database models
const Tag = require('../models/Tag.model');

// add any new tags to database
const tagUpdate = async (cardTags) => {
    if (cardTags === undefined) return;
    try {
        // load current tags
        const storedTags = await Tag.find({}).select('tag -_id');

        // convert to array
        const tags = storedTags.map((storegTag) => storegTag.tag);

        cardTags.map((tag) => {
            if (!tags.includes(tag.trim()) && tag.trim().length > 0) {
                // save new tage to database
                tag = new Tag({ tag });
                tag.save();
            }
        });
    } catch (err) {
        console.error(`Error during message find ${err.message}`);
        res.status(500).send('server error');
    }
};

module.exports = {
    tagUpdate,
};
