const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema");
const express = require("express");
const cookieParser = require("cookie-parser");
const modelsGraphql = require("../models");
const _ = require("lodash");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
require("dotenv").config();
const tokenCheck = require("./middlewares/tokenCheck");
const userResolvers = require("./resolvers/userResolvers");
const cartResolvers = require("./resolvers/cartResolvers");
const orderResolvers = require("./resolvers/orderResolvers");
const productResolvers = require("./resolvers/productResolvers");
const merchantResolvers = require("./resolvers/merchantResolvers");
const wishlistResolvers = require("./resolvers/wishlistResolvers");
const authResolvers = require("./resolvers/authResolvers");
const jwt = require("jsonwebtoken");
const cors = require('cors');

(async function () {
  const corsOption = { origin: ["https://studio.apollographql.com", "http://localhost:3000"], credentials: true }
  const server = new ApolloServer({
    // cors: true,
    cors: true,
    typeDefs,
    resolvers: _.merge(
      wishlistResolvers,
      userResolvers,
      authResolvers,
      cartResolvers,
      orderResolvers,
      productResolvers,
      merchantResolvers
    ),
    context: ({ req, res }) => {
      let user = null;
      try {
        // Fetching the user from the request Token
        if (req.headers["authorization"]) {
          const token = req.headers["authorization"]
          const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
          user = data;
        }
      } catch (error) {
        return {
          models: modelsGraphql,
          user,
          req,
          res,
        }
      }

      return {
        models: modelsGraphql,
        user,
        req,
        res,
      };
    },
  });

  const app = express();
  app.set("trust proxy", process.env.NODE_ENV !== "production");

  // Middlewares
  app.use(express.json()); // bodyparser

  app.use(cookieParser());

  app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
      return res.status(401).send({ error: "Invalid Request" });
    }
    return next();
  });

  await server.start();
  server.applyMiddleware({
    app,
    cors: corsOption,
  });

  app.use("/api/payment", cors(corsOption), require("./routes/payment"));
  app.use('/api/merchant/create', cors(corsOption), tokenCheck, upload.array("mImage"), require('./routes/merchant'));
  app.use('/api/product/create', cors(corsOption), tokenCheck, upload.array("mImage"), require('./routes/product'));

  app.listen(4000, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
})();
