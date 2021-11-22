module.exports = {
    Query: {},
    Mutation: {

        async addToWishlist(root, { userId, productId }, { models }) {
            try {
                const prod = await models.Product.findByPk(productId);
                const usr = await models.User.findByPk(userId);


                if (!prod) {
                    throw new Error('Product not found');
                }

                if (!usr) {
                    throw new Error('User not found');
                }


                await models.Wishlist.create({
                    userId: usr.id,
                    productId: prod.id,
                    description: prod.skuName
                });

                // Set product wishlist to true
                await prod.update({ inWishlist: true });

                return usr;
            } catch (error) {
                throw new Error(error.message);
            }

        },
        async removeFromWishlist(root, { userId, id }, { models }) {
            try {
                const result = models.Wishlist.destroy({
                    where: {
                        id: id,
                        userId: userId
                    }
                });

                return result;
            } catch (error) {
                throw new Error(error.message);
            }

        },
    },


    Wishlist: {
        async user(wish) {
            return wish.getUser();
        },
        async product(wish) {
            return wish.getProduct();
        }
    }

};