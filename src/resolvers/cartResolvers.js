const { ForbiddenError } = require("apollo-server-express");

module.exports = {
    Query: {
        async getCart(root, { id }, { models }) {
            try {
                const result = await models.Cart.findByPk(id);
                return result;
            } catch (error) {
                throw new Error(error.message);
            }
        },

        async getCartByUser(root, { id }, { models }) {
            try {
                const result = await models.Cart.findOne({
                    where: { userId: id }
                });

                return result;

            } catch (error) {
                throw new Error(error.message);
            }
        },

    },
    Mutation: {

        async clearCart(root, { userId }, { models }) {
            try {
                const cart = await models.Cart.findOne({ where: { userId: userId } });

                await models.CartDetail.destroy({ where: { cartId: cart.id } });
                const result = await models.Cart.destroy({ where: { userId: userId } });

                return result;

            } catch (error) {
                throw new Error(error.message);
            }

        },
        async addToCart(root, { userId, productId, qty }, { models, user }) {
            try {
                const foundUser = await models.User.findByPk(user.id, {
                    include: [{ model: Cart }]
                });

                if (!user) {
                    throw new ForbiddenError('You must be logged in to add to cart');
                }

                const result = await sequelize.query('CALL add_to_cart(:cartId, :productId, :quantity)', {
                    replacements: { cartId: user.cart.id, productId: parseInt(req.body.productId), quantity: parseInt(req.body.quantity) }
                });
                res.status(200).json({ true: 'Product Added to cart' });

            } catch (error) {
                return res.status(500).json({ false: 'Internal Server Error' });
            }
        },

        async resetCartData(root, args, { models }) {
            try {
                const result = await models.Cart.destroy({ where: { id: { $gt: 0 } } });
                await models.CartDetail.destroy({ where: { id: { $gt: 0 } } });

                return result;

            } catch (error) {
                // server error
                throw new Error(error.message);
            }
        },



        async removeFromCart(root, { userId, productId }, { models }) {
            try {
                const cart = await models.Cart.findOne({ where: { userId: userId } })
                const prod = await models.Product.findOne({ where: { id: productId } });

                if (cart) {
                    await models.CartDetail.destroy({
                        where: {
                            cartId: cart.id,
                            productId: prod.id
                        }
                    });
                }

                return cart;
            } catch (error) {
                throw new Error(error.message);
            }

        },

        async saveCartInformation(root, { userId, clientFirstName, clientLastName, clientEmail, clientContactInfo, deliveryOption,
            deliveryFee, paymentInfo }, { models }) {
            try {
                const cart = await models.Cart.findOne({ where: { userId: userId } });

                if (cart) {
                    await cart.update({
                        clientFirstName,
                        clientLastName,
                        clientEmail,
                        clientContactInfo,
                        deliveryOption,
                        deliveryFee,
                        paymentInfo
                    });
                }

                return cart;

            } catch (error) {
                throw new Error(error.message);
            }

        },
    },


    Cart: {
        async user(cart) {
            return cart.getUser();
        },
        async details(cart) {
            return cart.getCartDetails();
        }
    },

    CartDetail: {
        async cart(dtl) {
            return dtl.getCart();
        },
        async product(dtl) {
            return dtl.getProduct();
        }
    }

};