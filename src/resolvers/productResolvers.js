const { paginateResults } = require('../utils');

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

        async allProducts(root, { offset, limit }, { models }) {
            try {
                const result = await models.Product.findAll();
                return result;
            } catch (error) {
                throw new Error(error.message);
            }
        },

        // Get all products of a merchant
        async merchantProducts(root, { merchantId }, { models, user }) {
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
                const result = await models.Product.findAll({
                    where: { merchantId: merchantId }
                });

                return result;

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


        // Paginated products
        async searchProductsPaged(root, { pageSize = 20, merchantId, after }, { models }) {
            const allProducts = await models.Product.findAll({
                where: { merchantId: merchantId }
            });

            //Use if needs to be reversed
            //allProducts.reverse();

            const products = paginateResults({
                after,
                pageSize,
                results: allProducts,
            });

            return {
                products,
                cursor: products.length ? products[products.length - 1].cursor : null,
                // if the cursor of the end of the paginated results is the same as the
                // last item in _all_ results, then there are no more results after this
                hasMore: products.length
                    ? products[products.length - 1].cursor !== allProducts[allProducts.length - 1].cursor : false,
            };
        },

    },
    Mutation: {

        async createProduct(root,
            {
                skuId,
                skuName,
                skuCompany,
                skuCategory,
                skuTag,
                skuStyle,
                skuColor,
                skuPrice1,
                skuPrice2,
                skuPrice3,
                skuPrice4,
                srpPrice,
                type,
                parentId,
                promoPrice,
                stockQty,
                merchantId
            }, { models, user }) {

            if (!user) {
                throw new ForbiddenError("Not authorized");
            }

            if (user.role !== 'Admin' && user.role !== 'Superadmin') {
                throw new Error('Not authorized');
            }

            try {
                // Check if merchant exists;
                const merchant = await models.Merchant.findByPk(merchantId);

                if (!merchant) {
                    throw new Error('Merchant does not exist, Please register the Merchant first');
                }

                const result = await models.Product.create({
                    merchantId,
                    skuId,
                    skuName,
                    skuCompany,
                    skuCategory,
                    skuStyle,
                    skuTag,
                    skuColor,
                    type: type.toLowerCase(),
                    parentId: parentId || null,
                    skuPrice1,
                    skuPrice2,
                    skuPrice3,
                    skuPrice4,
                    srpPrice,
                    promoPrice,
                    stockQty
                });

                return result;

            } catch (error) {
                throw new Error(error.message);
            }

        },

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
            skuId,
            skuName,
            skuPrice1,
            skuPrice2,
            skuPrice3,
            skuPrice4,
            srpPrice,
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
                        skuId,
                        skuName,
                        skuPrice1,
                        skuPrice2,
                        skuPrice3,
                        skuPrice4,
                        srpPrice,
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