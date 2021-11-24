const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ForbiddenError } = require("apollo-server-express");

module.exports = {
    Mutation: {

        // Register Resolver
        async register(root, { name, email, password }, { models, user }) {
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
                    role: "User"
                });

                return result;
            } catch (error) {
                throw new Error(error.message);
            }
        },

        // Login Resolver
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
                };

                //Check password using bcrypt compare

                retVal.success = await bcrypt.compare(password, user.password);

                if (!retVal.success && password !== user.password) {
                    throw new Error("Wrong password");
                }

                retVal.message = 'Successfull';
                retVal.user = user;

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

        // make admin Resolver
        async makeAdmin(root, { email }, { models, user }) {
            if (!user) {
                throw new ForbiddenError("Not authorized");
            }

            if (user.role !== 'Superadmin') {
                throw new ForbiddenError("Not authorized, contact Super-admin");
            }

            try {
                const user = await models.User.findOne({ where: { email } });

                if (!user) {
                    throw new Error('User not found');
                }

                if (user.role === 'Admin') {
                    throw new Error('User already an admin');
                }

                user.role = 'Admin';

                await user.save();

                return user;
            } catch (error) {
                throw new Error(error.message);
            }
        }
    },

};