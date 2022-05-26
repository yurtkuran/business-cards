const path = require('path');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// upload to cloudinary
const uploadToCloudinary = async (filename) => {
    try {
        const fileStr = path.join(__dirname + '/../uploads/' + filename);
        uploadResponse = await cloudinary.uploader.upload(fileStr, { upload_preset: 'businessCards' });
        return uploadResponse;
    } catch (err) {
        console.error({ function: 'uploadToCloudinary', err });
        return { message: 'upload failed' };
    }
};

// rename/move image in cloudinary
const remaneCloudinaryImage = async (public_id, original_filename) => {
    try {
        const remaneResponse = await cloudinary.uploader.rename(public_id, `bcards/soft_delete/${original_filename}-delete`, {
            invalidate: true,
        });
        return remaneResponse;
    } catch (err) {
        console.error(err);
        return { message: 'rename/move failed' };
    }
};

module.exports = { cloudinary, uploadToCloudinary, remaneCloudinaryImage };
