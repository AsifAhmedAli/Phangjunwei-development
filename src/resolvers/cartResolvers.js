const { ForbiddenError } = require("apollo-server-express");

module.exports = {
    Query: {
        async getCart(root, { id }, { models }) {
            try {
                const result = await models.Cart.findOne({
                    where: { userId: id }
                });

                if (!result) {
                    throw new Error('Cart not found');
                }

                return result;
            } catch (error) {
                throw new Error(error.message);
            }
        },

        // get cart items
        async getCartItems(root, { id }, { models }) {
            try {
                const result = await models.CartItem.findAll({
                    where: { CartId: id }
                });

                if (!result) {
                    throw new Error('Cart items not found');
                }

                let products = [];
                let foundItem;
                // Fetch products
                for (const item of result) {
                    foundItem = await models.Product.findOne({
                        where: { id: item.ProductId }
                    });

                    if (!foundItem) {
                        throw new Error('Product not found');
                    }

                    products.push(foundItem);
                }

                return products;

            } catch (error) {
                throw new Error(error.message);
            }
        }
    },
    Mutation: {
        async addToCart(root, { productId }, { models, user }) {
            try {
                const product = await models.Product.findByPk(productId);

                // check if product exists
                if (!product) {
                    throw new Error("Product not found");
                }

                // Check if cart exists
                const cart = await models.Cart.findOne({ where: { userId: user.id } });

                if (!cart) {
                    const newCart = await models.Cart.create({
                        userId: user.id
                    });

                    const cartItem = await models.CartItem.create({
                        CartId: newCart.id,
                        ProductId: productId,
                        qty: 1,
                        price: product.price || 0
                    })

                    if (!cartItem || !newCart) {
                        throw new Error("Error adding to cart");
                    }

                    return newCart;
                }

                // Check if cart item exists
                const cartItem = await models.CartItem.findOne({
                    where: { CartId: cart.id, ProductId: productId }
                })

                if (cartItem) {
                    cartItem.qty = cartItem.qty + 1;
                    await cartItem.save();
                } else {
                    const cartItem = await models.CartItem.create({
                        CartId: cart.id,
                        ProductId: productId,
                        qty: 1,
                        price: product.price || 0
                    })

                    if (!cartItem) {
                        throw new Error("Error adding to cart");
                    }
                }

                return cart;

            } catch (error) {
                throw new Error(error.message);
            }
        },

        // Reset cart
        async clearCart(root, { id }, { models }) {
            try {
                const result = await models.CartItem.destroy({
                    where: { CartId: id }
                });

                if (!result) {
                    throw new Error("invalid input");
                }

                return result;
            } catch (error) {
                throw new Error(error.message);
            }
        },

        // Remove item from cart
        async removeFromCart(root, { id, productId }, { models }) {
            try {
                const result = await models.CartItem.destroy({
                    where: { CartId: id, ProductId: productId }
                });

                if (!result) {
                    throw new Error("Invalid input");
                }

                return result;
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

};