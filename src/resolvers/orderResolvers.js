const crypto = require('crypto');

module.exports = {
    Query: {

        async getOrder(root, { id }, { models, user }) {
            if (!user) {
                throw new Error('You must be logged in to view this page')
            }
            try {
                const result = await models.Order.findByPk(id);
                return result;
            } catch (error) {
                throw new Error(error.message);
            }
        },

        async getOrdersByUser(root, { id }, { models, user }) {
            try {

                if (!user) {
                    throw new Error('You must be logged in to view this page')
                }
                if (user.role !== 'Admin' && user.role !== 'Superadmin') {
                    throw new Error('UnAuthorized')
                }

                const result = await models.Order.findAll({
                    where: { merchantId: id }
                });

                return result;

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
                const result = await models.Order.findAll();
                return result;
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
            status
        }, { models }) {

            try {
                const result = await models.Order.create({
                    merchantId: 5,
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
                    status
                });

                return result;
            } catch (error) {
                throw new Error(error.message);
            }
        },

        async removeOrderByRefCode(root, { refCode }, { models }) {
            try {
                const result = await models.Order.destroy({
                    where: { refCode: refCode }
                });

                return result;
            } catch (error) {
                throw new Error(error.message);
            }

        },

        async updateOrderByRefCode(root, { refCode, status }, { models }) {
            try {
                const result = await models.Order.findOne({ where: { refCode: refCode } });

                if (result) {
                    result.update({
                        status
                    });
                }

                return result;
            } catch (error) {
                throw new Error(error.message);
            }
        },


        async addToOrder(root, { refCode, productId, qty }, { models }) {
            try {
                const order = await models.Order.findOne({ where: { refCode: refCode } });

                console.log(order);
                if (order) {
                    const [detail, isCreated] = await models.OrderDetail.findOrCreate({
                        where: { productId: productId },
                        defaults: {
                            qty: qty,
                            orderId: order.id,
                            productId: productId
                        }
                    });

                    if (!isCreated) {
                        detail.update({
                            qty: detail.qty + qty
                        });
                    }
                }

                return order;
            } catch (error) {
                throw new Error(error.message);
            }
        },


    },

    Order: {
        async user(order) {
            return order.getUser();
        },
        async details(order) {
            return order.getOrderDetails();
        }
    },

    OrderDetail: {
        async order(dtl) {
            return dtl.getOrder();
        },
        async product(dtl) {
            return dtl.getProduct();
        }
    },

};