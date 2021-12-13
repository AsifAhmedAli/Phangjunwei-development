const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ForbiddenError } = require("apollo-server-express");

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
    async login(root, { email, password }, { models, res }) {
      try {
        const user = await models.User.findOne({ where: { email: email } });

        if (!user) {
          return new Error("User not registered");
        }

        let retVal = {
          message: "Invalid username or password",
          success: false,
          user: null,
        };

        retVal.success = await bcrypt.compare(password, user.password);

        if (!retVal.success && password !== user.password) {
          throw new Error("Wrong password");
        }

        retVal.message = "Successfull";
        retVal.user = user;

        // const token = jwt.sign(
        // {
        //     id: user.id,
        //     username: user.name,
        //     role: user.role,
        //     email: user.email,
        // },
        //     process.env.REFRESH_TOKEN_SECRET,
        //     { expiresIn: "1h" }
        // )
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
        // console.log(refresh_token)

        res.cookie("refreshtoken", refresh_token, {
          // httpOnly: true,
          path: "/",
          secure: true,
          sameSite: "none",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
        });
        console.log(res);

        return { token: access_token };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    // make admin Resolver
    async makeAdmin(root, { email }, { models, user }) {
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
    async merchantLogin(root, { email, password }, { models }) {
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

        const token = jwt.sign(
          {
            id: merchant.id,
            name: merchant.name,
            email: merchant.email,
            blocked: merchant.blocked,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        return { token };
      } catch (error) {
        throw new Error(error.message);
      }
    },
    // generate Access resolver
    async generateAccessToken(root, {}, { req, res, models }) {
      let tokens = "";
      try {
        const rf_token = req.cookies.refreshtoken;
        if (!rf_token) {
          throw new Error("Please Login Now");
        }

        const result=jwt.verify(rf_token,process.env.REFRESH_TOKEN_SECRET)
        console.log(result)
        const user = await models.User.findOne({
            where: { id: result.id },
          });
        //   console.log(user)
        if (!user)
        {
            throw new Error("This doesnt exits");
        }
        const access_token =  createAccessToken({
            id: result.id,
            username: result.name,
            role: result.role,
            email: result.email,
          });
          console.log(access_token)
        
        return {token : access_token}
        // jwt.verify(
        //   rf_token,
        //   process.env.REFRESH_TOKEN_SECRET,
        //   async (err, result) => {
        //     if (err) {
        //       throw new Error("Please Login now");
        //     }
           
        //     console.log(result);

        //     // console.log(user)

        //     // const user = await Users.findById(result.id).select("-password")
        //     // .populate('followers following', 'avatar username fullname followers following')
        //     // console.log(result);

            // if (!user)
            // {
            //     throw new Error("This doesnt exits");
            // } 

           
        //     console.log(access_token);
        //     // tokens=access_token
        //     console.log(typeof(access_token))

        //     return {access_token}
           
            

        //     // console.log(access_token);
        //   }
        // );
        
      } catch (error) {
        throw new Error(error.message);
      }

      //   console.log(req.cookies.refreshtoken)
      //   console.log(res)
      //   console.log(res)
    },



  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};
