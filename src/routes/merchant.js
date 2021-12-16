const express = require("express");
const db = require("../../models");
const { upload } = require("../helpers/cloudinary");
const router = express.Router();
const fs = require("fs");
const { Merchant, MerchantImages } = db;

router.post('/', async (req, res) => {
    if (!req.user && req.user.role !== 'Admin' && req.user.role !== 'Superadmin') {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No file uploaded" })
    }

    const userExists = await Merchant.findOne({ where: { email: req.body.email } });

    if (userExists) {
        return res.status(400).json({ error: "Email already exists" })
    }

    const files = req.files;

    try {
        let urls = [];
        let multiple = async (path) => await upload(path);
        for (const file of files) {
            const { path } = file;
            console.log("path", file);
            const newPath = await multiple(path);
            urls.push(newPath);
            fs.unlinkSync(path);
        }
        if (urls) {
            console.log(urls);
        }

        // Create merchant and save to database
        const merchant = await Merchant.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            address: req.body.address,
            contact: req.body.contact,
        })

        if (!merchant) {
            return res.status(400).json({ error: "Merchant not created" })
        }

        // Get collection and banner image urls
        const collectionImages = urls.slice(0, 3);
        const bannerImages = urls.splice(3);

        for (let i = 0; i < collectionImages.length; i++) {
            await MerchantImages.create({
                collectionImg: collectionImages[i],
                MerchantId: merchant.id
            })
        }

        for (let i = 0; i < bannerImages.length; i++) {
            await MerchantImages.create({
                bannerImg: bannerImages[i],
                MerchantId: merchant.id
            })
        }

        return res.status(200).json({ message: "Merchant created successfully", merchant })

    } catch (e) {
        throw new Error(e);
    }
})

module.exports = router;