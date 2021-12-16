const { ForbiddenError } = require('apollo-server-express');
const { paginateResults, paginateMerchantProducts } = require('../utils');

module.exports = {
    Query: {
        async getProduct(root, { id }, { models }) {
            try {
                const result = await models.Product.findByPk(id);
                return result;
            } catch (error) {
                throw new Error(error.message);
            }
        },

        async allProducts(root, { size, offset }, { models }) {
            try {
                const paginatedResult = paginateResults(size, offset, models.Product);
                return paginatedResult;
            } catch (error) {
                throw new Error(error.message);
            }
        },

        // Get all products of a merchant
        async merchantProducts(root, { merchantId, size, offset }, { models, user }) {

            if (!user) {
                throw new ForbiddenError("Not authorized");
            }

            if (user.role !== "Admin" && user.role !== "Superadmin") {
                throw new ForbiddenError("Not authorized");
            }

            if (user.blocked) {
                throw new ForbiddenError("Your account has been blocked by the administration");
            }

            try {
                const paginatedResults = paginateMerchantProducts(size, offset, models.Product, merchantId);
                return paginatedResults;

            } catch (error) {
                throw new Error(error.message)
            }
        },

        // Get all products with a specific type
        async parentProducts(root, { type, merchantId }, { models, user }) {
            if (!user) {
                throw new ForbiddenError("Not authorized");
            }

            if (user.role !== "Admin" && user.role !== "Superadmin") {
                throw new ForbiddenError("Not authorized");
            }

            try {
                const result = await models.Product.findAll({
                    where: { type: type, merchantId: merchantId }
                });

                return result;

            } catch (error) {
                throw new Error(error.message)
            }
        },

        async productImages(root, { id }, { models, user }) {
            if (!user || user.role !== 'Admin' && user.role !== 'Superadmin' && user.role !== 'Merchant') {
                throw new ForbiddenError("Not authorized");
            }
            try {
                const result = await models.ProductImages.findAll({ where: { ProductId: id } });
                return result;
            } catch (error) {
                throw new Error(error.message);
            }
        }

    },
    Mutation: {

        // async createProduct(root,
        //     {
        //         skuName,
        //         skuCompany,
        //         skuCategory,
        //         skuTag,
        //         skuStyle,
        //         skuColor,
        //         skuprice,
        //         type,
        //         parentId,
        //         promoPrice,
        //         stockQty,
        //         merchantId
        //     }, { models, user }) {

        //     if (!user) {
        //         throw new ForbiddenError("Not authorized");
        //     }

        //     if (user.role !== 'Admin' && user.role !== 'Superadmin') {
        //         throw new Error('Not authorized');
        //     }

        //     try {
        //         // Check if merchant exists;
        //         const merchant = await models.Merchant.findByPk(merchantId);

        //         if (!merchant) {
        //             throw new Error('Merchant does not exist, Please register the Merchant first');
        //         }

        //         const result = await models.Product.create({
        //             merchantId,
        //             skuName,
        //             skuCompany,
        //             skuCategory,
        //             skuStyle,
        //             skuTag,
        //             skuColor,
        //             type: type.toLowerCase(),
        //             parentId: parentId || null,
        //             skuprice,
        //             promoPrice,
        //             stockQty
        //         });

        //         return result;

        //     } catch (error) {
        //         throw new Error(error.message);
        //     }

        // },

        async removeProduct(root, { id }, { models, user }) {
            if (!user) {
                throw new ForbiddenError("Not authorized");
            }

            if (user.role !== 'Admin' && user.role !== 'Superadmin') {
                throw new Error('Not authorized');
            }

            try {
                const result = models.Product.destroy({
                    where: { id: id }
                });

                return result;

            } catch (error) {
                throw new Error(error.message);
            }

        },

        async updateProduct(root, {
            id,
            skuName,
            skuprice,
            promoPrice,
            disabled,
            stockQty
        }, { models, user }) {
            if (!user) {
                throw new ForbiddenError("Not authorized");
            }

            if (user.role !== 'Admin' && user.role !== 'Superadmin') {
                throw new Error('Not authorized');
            }

            try {
                const result = await models.Product.findByPk(id);

                if (result) {
                    result.update({
                        skuName,
                        skuprice,
                        disabled,
                        promoPrice,
                        stockQty
                    });
                }

                return result
            } catch (error) {
                throw new Error(error.message);
            }
        }
    },

    Product: {
        async merchant(product) {
            return product.getMerchant();
        },
    },

};