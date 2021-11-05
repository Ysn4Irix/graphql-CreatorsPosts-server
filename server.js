require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const helmet = require("helmet");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const {
  ApolloServerPluginLandingPageProductionDefault,
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");
const mongoose = require("mongoose");

async function startServer() {
  const app = express();

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    debug: process.env.NODE_ENV === "development",
    plugins: [
      process.env.NODE_ENV === "development"
        ? ApolloServerPluginLandingPageGraphQLPlayground({ footer: false })
        : ApolloServerPluginLandingPageProductionDefault({ footer: false }),
    ],
    formatError: (err) => {
      if (process.env.NODE_ENV !== "development")
        throw new Error("Internal Server Error");
      if (err.message.startsWith("Cast to ObjectId failed for value"))
        throw new Error("Invalid ID");

      return err;
    },
    context: ({ req }) => req,
  });

  app.use(logger("common"));
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [
            "'self' cdn.jsdelivr.net fonts.googleapis.com",
            "'unsafe-inline'",
          ],
          baseUri: ["'self'"],
          blockAllMixedContent: [],
          fontSrc: ["'self'", "https:", "data:"],
          frameAncestors: ["'self'"],
          imgSrc: ["'self' cdn.jsdelivr.net", "data:"],
          objectSrc: ["'none'"],
          scriptSrc: [
            "'self' cdn.jsdelivr.net",
            "'unsafe-inline'",
            "'unsafe-eval'",
          ],
          upgradeInsecureRequests: [],
        },
      },
    })
  );

  await apolloServer.start();
  apolloServer.applyMiddleware({ app: app, path: "/ysn4irix/pblog/graphql" });

  app.use((_, res) => {
    res.status(200).json({
      status: 200,
      success: true,
      response: "I'm Running ✅",
    });
  });

  await mongoose.connect(
    process.env.MONGODB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => console.log("Database Connected")
  );

  app.listen(`${process.env.PORT || 6699}`, () => {
    console.log(`Listening at http://localhost:${process.env.PORT || 6699}`);
  });
}
startServer();
