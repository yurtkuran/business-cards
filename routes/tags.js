const express = require('express');
const router = express.Router();

// database models
const Tag = require('../models/Tag.model');

// method: GET
// route:  api/tags
// desc:   get all tags
// access: to-do
// role:
router.get('/', async (req, res) => {
    try {
        // find all tags
        const storedTags = await Tag.find({}).select('tag -_id');

        // convert to array
        const tags = storedTags.map((storegTag) => storegTag.tag);

        res.json(tags);
    } catch (err) {
        console.error(`T00 Error during find ${err.message}`);
        res.status(500).send('server error');
    }
});

module.exports = router;
