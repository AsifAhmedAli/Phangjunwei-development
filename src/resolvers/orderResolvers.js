module.exports = {
    Query: {
        async getOrder(root, { id }, { models, user }) {
            if (!user) {
                throw new Error('You must be logged in to view this page')
            }
            try {
                const order = await models.Order.findByPk(id);
                const orderItems = await models.OrderItem.findAll({ where: { OrderId: order.id } });

                if (!order) {
                    throw new Error('Order not found');
                }

                if (!orderItems) {
                    throw new Error('Empty Order');
                }

                return orderItems;
            } catch (error) {
                throw new Error(error.message);
            }
        },

        // Get merchant orders by its products
        async getMerchantOrders(root, { id }, { models, user }) {
            try {
                if (!user && user.role !== 'merchant') {
                    throw new Error('Invalid Request')
                }

                const orderItems = await models.OrderItem.findAll({ where: { MerchantId: id } });

                if (!orderItems) {
                    throw new Error('Order not found');
                }

                return orderItems;
            } catch (error) {
                throw new Error(error.message);
            }
        },

        async getUserOrders(root, { id }, { models, user }) {
            try {
                if (!user) {
                    throw new Error('You must be logged in to view this page')
                }

                if (user.role !== 'admin' && user.role !== 'Superadmin') {
                    throw new Error('You are not authorized to view this page')
                }

                const order = await models.Order.findAll({ where: { userId: id } });

                if (!order) {
                    throw new Error('Order not found');
                }

                let allOrders = [];
                let orderItems;

                for (let o of order) {
                    orderItems = await models.OrderItem.findOne({ where: { OrderId: o.id } });
                    allOrders.push(orderItems);
                }

                return allOrders;
            } catch (error) {
                throw new Error(error.message);
            }
        },

        async allOrders(root, args, { models, user }) {
            try {
                if (!user) {
                    throw new Error('You must be logged in to view this page')
                }
                if (user.role !== 'Admin' && user.role !== 'Superadmin') {
                    throw new Error('UnAuthorized')
                }
                const orders = await models.Order.findAll();

                if (!orders) {
                    throw new Error('No orders found');
                }

                // Get order Items
                let orderItems = [];
                let foundItem;

                for (const item of orders) {
                    foundItem = await models.OrderItem.findOne({
                        where: { OrderId: item.id }
                    });

                    orderItems.push(foundItem);
                }

                return orderItems;

            } catch (error) {
                throw new Error(error.message);
            }
        },
    },
    Mutation: {

        async createOrder(root, {
            clientFirstName,
            clientLastName,
            clientEmail,
            clientContactInfo,
            refCode,
            deliveryOption,
            deliveryFee,
            subTotal,
            promoCode,
            promoCodeValue,
            deliveryAddress,
            billingAddress,
            paymentStatus,
            paymentInfo,
        }, { models, user }) {

            try {
                if (!user) {
                    throw new Error('You must be logged in to view this page')
                }

                // Create New Order
                const createdOrder = await models.Order.create({ userId: user.id });

                // Get User Cart
                const userCart = await models.Cart.findOne({ where: { userId: user.id } });

                if (!userCart) {
                    throw new Error('No cart found');
                }

                // Get User Cart Items
                const userCartItems = await models.CartItem.findAll({ where: { CartId: userCart.id } });

                if (!userCartItems) {
                    throw new Error('Cart is empty');
                }

                // loop through cart items and add order items
                for (const item of userCartItems) {
                    await models.OrderItem.create({
                        OrderId: createdOrder.id,
                        ProductId: item.ProductId,
                        MerchantId: item.MerchantId,
                        clientFirstName,
                        clientLastName,
                        clientEmail,
                        clientContactInfo,
                        refCode,
                        deliveryOption,
                        deliveryFee,
                        subTotal,
                        promoCode,
                        promoCodeValue,
                        deliveryAddress,
                        billingAddress,
                        paymentStatus,
                        paymentInfo,
                    });
                }

                return {
                    message: 'Order Created Successfully',
                };

            } catch (error) {
                throw new Error(error.message);
            }
        },

        // UPdate Order Item
        async updateOrder(root, { id, status }, { models, user }) {
            try {
                if (!user) {
                    throw new Error('You must be logged in to view this page')
                }

                const order = await models.OrderItem.findOne({ where: { OrderId: id } });

                if (!order) {
                    throw new Error('Order not found');
                }

                await models.OrderItem.update({ paymentStatus: status }, { where: { OrderId: id } });

                return {
                    message: 'Order Updated Successfully',
                };

            } catch (error) {
                throw new Error(error.message);
            }
        },

        // Delete Order Item
        async deleteOrder(root, { id }, { models, user }) {
            try {
                if (!user) {
                    throw new Error('You must be logged in to view this page')
                }

                const order = await models.OrderItem.findOne({ where: { OrderId: id } });

                if (!order) {
                    throw new Error('Order not found');
                }

                await models.OrderItem.destroy({ where: { OrderId: id } });

                return {
                    message: 'Order Deleted Successfully',
                };

            } catch (error) {
                throw new Error(error.message);
            }
        }

    },

};