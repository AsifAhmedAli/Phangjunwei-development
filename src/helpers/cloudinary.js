const cloudinary = require("cloudinary");
const Q = require("q");
const fs = require('fs');
const util = require("util");
const deleteFile = util.promisify(fs.unlink);

function upload(file) {
    cloudinary.config({
        cloud_name: "burrowspteltd",
        api_key: "262168993796952",
        api_secret: "4woYhBPmOVjqyHgd-clbQJ6X_D0"
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