const cloudinary = require("cloudinary");
const Q = require("q");
const fs = require('fs');
const util = require("util");
const deleteFile = util.promisify(fs.unlink);

function upload(file) {
    cloudinary.config({
        cloud_name: `${process.env.CLOUDINARY_NAME}`,
        api_key: `${process.env.CLOUDINARY_KEY}`,
        api_secret: `${process.env.CLOUDINARY_SECRET}`
    });

    return new Q.Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(file, { width: 700, height: 500 }, (err, res) => {
            if (err) {
                reject(err);
            } else {
                return resolve(res.url);
            }
        });
    });
};


module.exports.upload = upload;