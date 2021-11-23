const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const express = require('express');
const expressJwt = require('express-jwt');
const cors = require("cors");
const modelsGraphql = require('../models');
const _ = require('lodash');
require('dotenv').config();
const userResolvers = require('./resolvers/userResolvers');
const cartResolvers = require('./resolvers/cartResolvers');
const orderResolvers = require('./resolvers/orderResolvers');
const productResolvers = require('./resolvers/productResolvers');
const merchantResolvers = require('./resolvers/merchantResolvers');
const wishlistResolvers = require('./resolvers/wishlistResolvers');
const authResolvers = require('./resolvers/authResolvers');

(async function () {
  const server = new ApolloServer({
    cors: true,
    typeDefs,
    resolvers: _.merge(wishlistResolvers,
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
      }
    }
  });

  const app = express();

  // Middlewares
  app.use(express.json()); // bodyparser
  app.use(cors());
  app.use(
    expressJwt({
      secret: process.env.JWT_SECRET,
      algorithms: ["HS256"],
      credentialsRequired: false,
    })
  );

  app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
      return res.status(401).send({ error: "Invalid Request" });
    }
    return next();
  })

  await server.start();
  server.applyMiddleware({ app });

  app.use("/api/payment", require('./routes/payment'))

  app.listen(4000, () =>
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    )
  );
})();
