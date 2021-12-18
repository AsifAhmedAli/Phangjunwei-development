const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ForbiddenError } = require("apollo-server-express");
const { createAccessToken, createRefreshToken } = require("../helpers/tokenGenerators");

module.exports = {
  Mutation: {
    // Register Resolver
    async register(root, { name, email, password }, { models, user }) {
      try {
        const user = await models.User.findOne({ where: { email } });

        if (user) {
          throw new Error("User already registered");
        }

        const result = await models.User.create({
          name,
          email,
          password: await bcrypt.hash(password, 10),
          role: "User",
        });

        return result;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    // Login Resolver
    async login(root, { email, password }, { models, req, res }) {

      try {
        const user = await models.User.findOne({ where: { email: email } });

        if (!user) {
          return new Error("User not registered");
        }

        let retVal = {
          message: "Invalid username or password",
          success: false,
        };

        retVal.success = await bcrypt.compare(password, user.password);

        if (!retVal.success && password !== user.password) {
          throw new Error("Wrong password");
        }

        const access_token = createAccessToken({
          id: user.id,
          username: user.name,
          role: user.role,
          email: user.email,
        });
        const refresh_token = createRefreshToken({
          id: user.id,
          username: user.name,
          role: user.role,
          email: user.email,
        });

        res.cookie("refreshtoken", refresh_token, {
          // httpOnly: true,
          path: "/",
          secure: true,
          sameSite: "none",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
        });

        return { token: access_token };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    // make admin Resolver
    async makeAdmin(root, { email }, { models, user, }) {
      if (!user) {
        throw new ForbiddenError("Not authorized");
      }

      if (user.role !== "Superadmin") {
        throw new ForbiddenError("Not authorized, contact Super-admin");
      }

      try {
        const user = await models.User.findOne({ where: { email } });

        if (!user) {
          throw new Error("User not found");
        }

        if (user.role === "Admin") {
          throw new Error("User already an admin");
        }

        user.role = "Admin";

        await user.save();

        return user;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    // Merchant login Resolver
    async merchantLogin(root, { email, password }, { models, res }) {
      try {
        const merchant = await models.Merchant.findOne({
          where: { email: email },
        });

        if (!merchant) {
          throw new Error("Email does not exist");
        }

        if (merchant.blocked === true) {
          throw new Error("You have been blocked by the administration");
        }

        const trueUser = await bcrypt.compare(password, merchant.password);
        if (!trueUser) {
          throw new Error("Incorrect password");
        }

        const access_token = createAccessToken({
          id: merchant.id,
          name: merchant.name,
          email: merchant.email,
          blocked: merchant.blocked,

        });
        const refresh_token = createRefreshToken({
          id: merchant.id,
          name: merchant.name,
          email: merchant.email,
          blocked: merchant.blocked,
        });
        res.cookie("refreshtoken", refresh_token, {
          // httpOnly: true,
          path: "/",
          secure: true,
          sameSite: "none",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
        });

        return { token: access_token };

      } catch (error) {
        throw new Error(error.message);
      }
    },

    // generate Access Token resolver from refresh token
    async generateAccessToken(root, _, { req, res, models }) {
      const tokeni = req.headers["authorization"]

      try {
        const rf_token = req.cookies.refreshtoken;

        if (!rf_token) {
          throw new Error("Please Login Now");
        }

        const result = jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET)
        const user = await models.User.findOne({
          where: { id: result.id },
        });

        if (!user) {
          throw new Error("This doesnt exits");
        }

        jwt.verify(tokeni, process.env.ACCESS_TOKEN, function (err, decoded) {
          if (err) {
            const access_token = createAccessToken({
              id: result.id,
              username: result.name,
              role: result.role,
              email: result.email,
            });

            return {
              token: access_token
            }
          }
        });
        return {
          token: tokeni
        }

      } catch (error) {
        throw new Error(error.message);
      }

    },
  },
};


