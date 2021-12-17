const express = require("express");
const db = require("../../models");
const { upload } = require("../helpers/cloudinary");
const router = express.Router();
const fs = require("fs");
const { Product, ProductImages, Merchant } = db;

router.post('/', async (req, res) => {
    if (!req.user && req.user.role !== 'Admin' && req.user.role !== 'Superadmin') {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No file uploaded" })
    }

    const userExists = await Merchant.findOne({ where: { id: req.body.merchantId } });

    if (!userExists) {
        return res.status(400).json({ message: "Merchant not exists" });
    }

    const files = req.files;

    try {
        let urls = [];
        let multiple = async (path) => await upload(path);
        for (const file of files) {
            const { path } = file;
            const newPath = await multiple(path);
            fs.unlinkSync(path);
            urls.push(newPath);
        }

        // Create merchant and save to database
        const product = await Product.create({
            skuName: req.body.skuName,
            skuCompany: req.body.skuCompany || null,
            skuCategory: req.body.skuCategory || null,
            skuTag: req.body.skuTag || null,
            skuStyle: req.body.skuStyle || null,
            skuColor: req.body.skuColor || null,
            skuprice: req.body.skuprice || null,
            type: req.body.parentId ? 'child' : 'parent',
            parentId: req.body.parentId || null,
            promoPrice: req.body.promoPrice,
            stockQty: req.body.stockQty,
            merchantId: req.body.merchantId
        })

        if (!product) {
            return res.status(400).json({ error: "Product not created" })
        }

        // Get collection and banner image urls
        for (let i = 0; i < urls.length; i++) {
            await ProductImages.create({
                mainImage: urls[i],
                ProductId: product.id
            })
        }

        return res.status(200).json({ message: "Product created successfully", product })

    } catch (e) {
        throw new Error(e);
    }
})


module.exports = router;