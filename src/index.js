const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema");
const express = require("express");
const expressJwt = require("express-jwt");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const modelsGraphql = require("../models");
const _ = require("lodash");
require("dotenv").config();
const userResolvers = require("./resolvers/userResolvers");
const cartResolvers = require("./resolvers/cartResolvers");
const orderResolvers = require("./resolvers/orderResolvers");
const productResolvers = require("./resolvers/productResolvers");
const merchantResolvers = require("./resolvers/merchantResolvers");
const wishlistResolvers = require("./resolvers/wishlistResolvers");
const authResolvers = require("./resolvers/authResolvers");
const { includes } = require("lodash");

(async function () {
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
      const user = req.user || null;
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
  // app.use(cors({
  //   origin: ["https://studio.apollographql.com"],
  //   credentials: true
  // }));
  app.use(
    expressJwt({
      secret: process.env.REFRESH_TOKEN_SECRET,
      algorithms: ["HS256"],
      credentialsRequired: false,
    })
  );

  app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
      return res.status(401).send({ error: "Invalid Request" });
    }
    return next();
  });

  await server.start();
  server.applyMiddleware({
    app,
    cors: { origin: "https://studio.apollographql.com", credentials: true },
  });

  app.use("/api/payment", require("./routes/payment"));

  app.listen(4000, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
})();
