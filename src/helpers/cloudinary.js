const cloudinary = require("cloudinary");
const Q = require("q");

function upload(file) {
    cloudinary.config({
        cloud_name: "burrowspteltd",
        api_key: "262168993796952",
        api_secret: "4woYhBPmOVjqyHgd-clbQJ6X_D0"
    });

    return new Q.Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(file, { width: 700, height: 500 }, (err, res) => {
            if (err) {
                console.log('cloudinary err:', err);
                reject(err);
            } else {
                console.log('cloudinary res:', res);
                return resolve(res.url);
            }
        });
    });
};


module.exports.upload = upload;