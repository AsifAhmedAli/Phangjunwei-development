const bcrypt = require('bcryptjs');
const { ForbiddenError } = require("apollo-server-express");
const { paginateResults } = require('../utils');

module.exports = {
    Query: {
        async allUser(root, { size, offset }, { models, user }) {
            if (!user) {
                throw new ForbiddenError("Not authorized, Signin again");
            }

            if (user.role !== 'Admin' && user.role !== 'Superadmin') {
                throw new ForbiddenError("Not authorized");
            }

            try {
                const paginatedResults = paginateResults(size, offset, models.User);
                return paginatedResults;
            } catch (error) {
                throw new Error(error.message);
            }
        },

        async getUser(root, { id }, { models, user }) {

            if (!user) {
                throw new ForbiddenError("Token not valid, try signing in again");
            }

            if (user.role !== 'Admin' || user.role !== 'Superadmin') {
                throw new ForbiddenError("Not authorized");
            }

            try {
                const result = await models.User.findByPk(id);
                return result;

            } catch (error) {
                throw new Error(error.message);
            }

        },

    },
    Mutation: {
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

        async removeUser(root, { id }, { models, user }) {
            if (!user) {
                throw new ForbiddenError("Not authorized, try signing in Again");
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
    }

};