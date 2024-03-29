const { ForbiddenError } = require("apollo-server-express");
const bcrypt = require('bcryptjs');
const blockSwitchMerchant = require("../helpers/blockSwitchMerchant");
const { paginateResults } = require('../utils');

module.exports = {
    Query: {

        // Get all merchants registered
        async allMerchants(root, { size, offset }, { models, user }) {
            // console.log(user)


            if (!user) {
                throw new Error("Please login to view all merchants");
            }

            if (user.role !== "Admin" && user.role !== "Superadmin") {
                throw new ForbiddenError("You are not authorized to perform this action");
            }

            const model = models.Merchant;
            const paginatedResult = paginateResults(size, offset, model);

            return paginatedResult;
        },

        // Get all information about a merchant
        async getMerchant(root, { id }, { models, user }) {
            console.log(user)

            if (!user) {
                throw new Error("Invalid Request")
            }

            if (user.role !== "Admin" && user.role !== "Superadmin") {
                throw new ForbiddenError("You are not authorized to perform this action");
            }

            try {
                const result = await models.Merchant.findByPk(id);

                if (!result) {
                    throw new Error("Merchant not found");
                }

                return result;
            } catch (error) {
                throw new Error(error.message)
            }
        },

        // Get orders belonging to a merchant
        async merchantOrders(root, { id }, { models, user }) {
            if (!user && user.role !== 'merchant' && user.role !== 'Admin' && user.role !== 'Superadmin') {
                throw new ForbiddenError("You are not authorized to perform this action");
            }
            try {
                const orderItems = await models.OrderItem.findAll({ where: { MerchantId: id } });

                if (!orderItems) {
                    throw new Error('Order not found');
                }

                if (orderItems.length === 0) {
                    throw new Error('No orders found');
                }

                return orderItems;
            } catch (error) {
                throw new Error(error.message);
            }
        },

        async merchantImages(root, { id }, { models, user }) {
            if (!user) {
                throw new Error('Invalid Request')
            }

            if (user.role !== "Admin" && user.role !== "Superadmin") {
                throw new ForbiddenError("You are not authorized to perform this action");
            }

            try {
                const result = await models.MerchantImages.findAll({ where: { MerchantId: id } });

                if (!result) {
                    throw new Error('Merchant Image not found');
                }

                if (result.length === 0) {
                    throw new Error('No Merchant Images found');
                }

                return result;
            } catch (error) {
                throw new Error(error.message);
            }
        }

    },
    Mutation: {
        // Create new merchant
        // async createMerchant(root,
        //     {
        //         name,
        //         email,
        //         password,
        //         address,
        //         contact,
        //     }, { models, user }) {

        //     if (!user) {
        //         throw new Error('Invalid Request')
        //     }
        //     if (user.role !== "Admin" && user.role !== "Superadmin") {
        //         throw new ForbiddenError("You are not authorized to perform this action");
        //     }

        //     try {
        //         // Check if email exists
        //         const userExists = await models.Merchant.findOne({ where: { email: email } });

        //         if (userExists) {
        //             throw new Error("Email already exists");
        //         }

        //         const result = await models.Merchant.create({
        //             name,
        //             email,
        //             password: await bcrypt.hash(password, 10),
        //             address,
        //             contact,
        //         });
        //         return result;
        //     } catch (error) {
        //         throw new Error(error.message)
        //     }

        // },

        // update merchant
        async updateMerchant(root,
            {
                id,
                name,
                email,
                password,
                address,
                contact,
            }, { models, user }) {

            if (!user) {
                throw new Error('Invalid Request')
            }

            if (user.role !== "Admin" && user.role !== "Superadmin") {
                throw new ForbiddenError("You are not authorized to perform this action");
            }

            try {
                const checkIfExists = await models.Merchant.findOne({ where: { email } });

                if (!checkIfExists) {
                    throw new Error("Email does not exist");
                }

                const result = await models.Merchant.update({
                    name,
                    email,
                    password,
                    address,
                    contact,
                }, {
                    where: { id: id }
                });
                return result;
            }

            catch (error) {
                throw new Error(error.message)
            }
        },

        async removeMerchant(root, { id }, { models, user }) {
            if (!user) {
                throw new ForbiddenError("You are not authorized to perform this action");
            }

            if (user.role !== "Admin" && user.role !== "Superadmin") {
                throw new ForbiddenError("You are not authorized to perform this action");
            }

            try {
                const checkIfExists = await models.Merchant.findOne({ where: { id } });
                if (!checkIfExists) {
                    throw new Error("Merchant does not exist")
                }
                const result = await models.Merchant.destroy({
                    where: { id: id }
                });

                return {
                    message: "Merchant deleted successfully"
                };
            } catch (error) {
                throw new Error(error.message)
            }
        },

        // Block merchant
        async blockMerchant(root, { id }, { models, user }) {
            try {
                const response = blockSwitchMerchant(id, models, user, true);
                return response;
            } catch (error) {
                throw new Error(error.message)
            }
        },

        // Unblock merchant
        async unblockMerchant(root, { id }, { models, user }) {
            try {
                const response = blockSwitchMerchant(id, models, user, false);
                return response;
            } catch (error) {
                throw new Error(error.message)
            }
        },

    },
    Merchant: {
        async products(merchant) {
            return merchant.getProducts();
        },
    },

};
