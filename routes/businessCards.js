//
// references:
// https://stackoverflow.com/questions/6784753/passing-route-control-with-optional-parameter-after-root-in-express
//
// James Quick YouTube tutorial
// https://github.com/jamesqquick/cloudinary-react-and-node

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// bring in local dependencies
const { tagUpdate } = require('../modules/tagUpdate');
const { uploadToCloudinary, remaneCloudinaryImage } = require('../config/cloudinary');

// database models
const BusinessCard = require('../models/BusinessCard.model');

// configre multer
const storage = multer.diskStorage({
    destination: `${__dirname}/../uploads/`,
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}${path.extname(file.originalname)}`;
        console.log(fileName);
        cb(null, fileName);
    },
});

// setup multer middileware
const uploadImage = multer({ storage }).fields([
    { name: 'front', maxCount: 1 },
    { name: 'back', maxCount: 1 },
]);

// method: GET
// route:  api/bcards
// desc:   get all business cards
// access: to-do
// role:
router.get('/', async (req, res) => {
    try {
        const bcards = await BusinessCard.find({});
        res.json(bcards);
    } catch (err) {
        console.error(`B00 Error during find ${err.message}`);
        res.status(500).send('server error');
    }
});

// method: GET
// route:  api/bcards/fineOne
// desc:   get single business card including images
// access: to-do
// role:
router.get('/findOne/:ID', async (req, res) => {
    try {
        const bcard = await BusinessCard.findOne({ _id: req.params.ID });
        res.json(bcard);
    } catch (err) {
        console.error(`B00 Error during find ${err.message}`);
        res.status(500).send('server error');
    }
});

// method: POST
// route:  api/bcards
// desc:   add or update business card
// access: to-do
// role:
router.post('/', uploadImage, async (req, res) => {
    // destructure request body
    let { _id, firstName, lastName, company, comment, imageAttacted } = req.body;
    let tags = JSON.parse(req.body.tags);

    // console.log(req.body);

    // build save object
    let bCardFields = {
        firstName,
        lastName,
        company,
        comment,
        images: [],
    };

    console.log(tags);

    bCardFields.tags = Array.isArray(tags)
        ? tags
        : tags
              .split(',')
              .map((tag) => tag.trim())
              .filter((tag) => tag.length > 0);

    // add any new tags to database
    tagUpdate(bCardFields.tags);

    // determine mode: add or edit, based on presence of id
    const mode = _id ? 'edit' : 'add';

    if (mode === 'add') {
        // insert new record
        console.log('insert new card');
        try {
            // process image save
            if (req?.files !== undefined) {
                console.log(`${Object.keys(req.files).length} file(s) attached`);
                if (Object.keys(req.files).length > 0) {
                    for (const side in req.files) {
                        const { fieldname, filename } = req.files[side][0];
                        // console.log(fieldname);
                        // console.log(req.files[side]);

                        // upload to cloudinary
                        uploadResponse = await uploadToCloudinary(filename);

                        bCardFields.images.push({
                            side: fieldname,
                            filename,
                            image: {
                                ...uploadResponse,
                            },
                        });
                    }
                }
            } else {
                console.log('No files attached');
            }

            // save to database
            bcard = new BusinessCard(bCardFields);
            bcard = await bcard.save();

            res.json(bcard);
        } catch (err) {
            console.log(`B01: Error during new record save: ${err.message}`);
            res.status(500).send('server error');
        }
    } else {
        // update existing record
        try {
            console.log('existing card');

            // retrieve full document in order to move images to soft_delete folder
            let { images } = await BusinessCard.findOne({ _id });

            // determine if user removed images
            imageAttacted?.map((image) => {
                const { side, exists } = JSON.parse(image);

                if (!exists) {
                    console.log(side);
                    imgIdx = images.findIndex((image) => image.side === side);

                    if (imgIdx !== -1) {
                        // soft delete image
                        const { public_id, original_filename } = images[imgIdx].image;
                        remaneCloudinaryImage(public_id, original_filename);

                        // remove from images array
                        images.splice(imgIdx, 1);
                    }
                }
            });

            // process images
            if (req?.files !== undefined) {
                console.log(`${Object.keys(req.files).length} file(s) attached`);
                if (Object.keys(req.files).length > 0) {
                    for (const side in req.files) {
                        const { fieldname, filename } = req.files[side][0];
                        console.log(fieldname);

                        // deteremine if new file replaces existing image
                        imgIdx = images.findIndex((image) => image.side === fieldname);
                        if (imgIdx !== -1) {
                            // soft delete image
                            const { public_id, original_filename } = images[imgIdx].image;
                            remaneCloudinaryImage(public_id, original_filename);

                            // remove from images array
                            images.splice(imgIdx, 1);
                        }

                        // upload to cloudinary
                        uploadResponse = await uploadToCloudinary(filename);
                        images.push({
                            side: fieldname,
                            filename,
                            image: {
                                ...uploadResponse,
                            },
                        });
                    }
                }
            } else {
                console.log('No files attached');
            }

            // update & save
            bcard = await BusinessCard.findOneAndUpdate(
                { _id },
                { $set: { firstName, lastName, company, comment, images, tags: bCardFields.tags } },
                { new: true }
            );
            res.json(bcard);
        } catch (err) {
            console.log(`B02 Error during record update: ${err.message}`);
            res.status(500).send('server error');
        }
    }
});

// method: DELETE
// route:  api/bcard
// desc:   delete business card
// access: to-do
// role:
router.delete('/:ID', async (req, res) => {
    try {
        // remove record

        // retrieve full document in order to move images to soft_delete folder
        const { images } = await BusinessCard.findOne({ _id: req.params.ID });

        images.forEach(async (image) => {
            // destricture
            const { public_id, original_filename } = image.image;

            // soft delete image
            remaneCloudinaryImage(public_id, original_filename);
        });

        await BusinessCard.findOneAndRemove({ _id: req.params.ID });
        res.json({ msg: 'business card deleted' });
    } catch (err) {
        console.log(`B03 Error during record update: ${err.message}`);
        res.status(500).send('server error');
    }
});

module.exports = router;
