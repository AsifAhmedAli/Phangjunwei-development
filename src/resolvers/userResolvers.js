const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ForbiddenError } = require("apollo-server-express");

module.exports = {
    Query: {
        async allUser(root, args, { models, user }) {
            try {
                // if (user === null) {
                //     throw new ForbiddenError("Token not valid, try signing in again");
                // }
                // if (user.role !== 'Admin') {
                //     throw new ForbiddenError("Not authorized");
                // }
                const result = await models.User.findAll();
                return result;

            } catch (error) {
                throw new Error(error.message);
            }
        },
        async getUser(root, { id }, { models, user }) {
            try {
                // if (user === null) {
                //     throw new ForbiddenError("Token not valid, try signing in again");
                // }
                // if (user.role !== 'Admin') {
                //     throw new ForbiddenError("Not authorized");
                // }
                const result = await models.User.findByPk(id);
                return result;

            } catch (error) {
                throw new Error(error.message);
            }

        },

    },
    Mutation: {
        async register(root, { name, email, password }, { models, user }) {
            if (!user) {
                throw new ForbiddenError("Not authorized");
            }

            if (user.role !== 'Superadmin') {
                throw new ForbiddenError("Not authorized, contact Super-admin");
            }
            try {
                // Check if user already registered
                const user = await models.User.findOne({ where: { email } });

                if (user) {
                    throw new Error('User already registered');
                }

                const result = await models.User.create({
                    name,
                    email,
                    password: await bcrypt.hash(password, 10),
                    role: "Admin"
                });

                return result;
            } catch (error) {
                throw new Error(error.message);
            }
        },

        async updateUser(root, { id, name, email, password }, { models, user }) {
            if (!user) {
                throw new ForbiddenError("Not authorized");
            }

            if (user.role !== 'Superadmin') {
                throw new ForbiddenError("Not authorized, contact Super-admin");
            }

            try {
                const user = await models.User.findByPk(id);

                if (!user) {
                    throw new Error('User not found');
                }

                const result = await models.User.update({
                    name,
                    email,
                    password: await bcrypt.hash(password, 10),
                    role: "Admin"
                }, {
                    where: { id }
                });

                return result;
            } catch (error) {
                throw new Error(error.message);
            }

        },
        async login(root, { email, password }, { models }) {
            try {
                const user = await models.User.findOne({ where: { email: email } });

                if (!user) {
                    return new Error("User not registered");
                }

                let retVal = {
                    message: 'Invalid username or password',
                    success: false,
                    user: null,
                    merchant: null,
                };

                //Check password using bcrypt compare

                retVal.success = await bcrypt.compare(password, user.password);

                if (!retVal.success && password !== user.password) {
                    throw new Error("Wrong password");
                }

                retVal.message = 'Successfull';
                retVal.user = user;

                if (user.role === 'merchant') {
                    const merch = await models.Merchant.findOne({ where: { userId: user.id } });

                    if (merch) {
                        retVal.merchant = merch;
                    }
                }

                const token = jwt.sign(
                    {
                        id: user.id,
                        username: user.name,
                        role: user.role,
                        email: user.email,
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: "1h" }
                )

                return { token };

            } catch (error) {
                throw new Error(error.message);
            }


        },

        async removeUser(root, { id }, { models, user }) {
            if (!user) {
                throw new ForbiddenError("Not authorized");
            }

            if (user.role !== 'Superadmin') {
                throw new ForbiddenError("Not authorized, contact Super-admin");
            }

            try {
                const user = await models.User.findByPk(id);

                if (!user) {
                    throw new Error('User not found');
                }

                const result = models.User.destroy({
                    where: { id: id }
                });

                return result;
            } catch (error) {
                throw new Error(error.message);
            }

        },

    },

    User: {
        async wishlists(usr) {
            return usr.getWishlists();
        },
        async orders(usr) {
            return usr.getOrders();
        }
    }

};