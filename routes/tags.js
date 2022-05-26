const express = require('express');
const router = express.Router();

// database models
const Tag = require('../models/Tag.model');
const BusinessCard = require('../models/BusinessCard.model');

// method: GET
// route:  api/tags
// desc:   get all tags
// access: to-do
// role:
router.get('/', async (req, res) => {
    try {
        // find all tags
        const tags = await Tag.find({}).select('name');
        res.json(tags);
    } catch (err) {
        console.error(`T00 Error during find ${err.message}`);
        res.status(500).send('server error');
    }
});

// method: POST
// route:  api/tags
// desc:   update tag and cards
// access: to-do
// role:
router.post('/', async (req, res) => {
    // destructure request body
    const { _id, name } = req.body;

    try {
        // retrieve existing tag
        let tag = await Tag.findById(_id);

        // update bcards with revised tag
        let bcards = await BusinessCard.find({ tags: { $in: [tag.name] } });

        // use for of loop because of async findOneAndUpdate function
        for (const bcard of bcards) {
            const tags = bcard.tags.map((cardTag) => {
                return cardTag === tag.name ? name : cardTag;
            });
            await BusinessCard.findOneAndUpdate({ _id: bcard._id }, { $set: { tags: tags } });
        }

        // finally, update tag name
        tag = await Tag.findByIdAndUpdate(_id, { name }, { new: true });

        res.status(200).json({ tag });
    } catch (err) {
        console.error(`T00 Error during tag update: ${err.message}`);
        res.status(500).send('server error');
    }
});

// method: DELETE
// route:  api/tags
// desc:   delete tag
// access: to-do
// role:
router.delete('/:ID', async (req, res) => {
    try {
        // remove record
        await Tag.findOneAndRemove({ _id: req.params.ID });
        res.json({ msg: 'tag deleted' });
    } catch (err) {
        console.log(`T03 Error during record delete: ${err.message}`);
        res.status(500).send('server error');
    }
});

module.exports = router;
