import { ApolloServer as ExpressApolloServer } from "apollo-server-express";
import express from "express";
import http from "http";
import { JWT } from "jose";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { ConnectionOptions, createConnection } from "typeorm";
import { pubSub } from "./src/connectors/pubsub";
import { keyStore, RequestContext, Token } from "./src/keys";
import { categoryChildrenLoader } from "./src/loaders/CategoryChildrenLoader";
import { categoryLoader } from "./src/loaders/CategoryLoader";
import { imageLoader } from "./src/loaders/ImageLoader";
import { imagesOfProductsLoader } from "./src/loaders/ImagesOfProductsLoader";
import { productsOfCategoriesLoader } from "./src/loaders/ProductsOfCategoriesLoader";
import { skusOfProductsLoader } from "./src/loaders/SkusOfProducts";
import { storeLoader } from "./src/loaders/StoreLoader";
import { resolvers } from "./src/resolvers";

let connectionOptions: ConnectionOptions = {
  name: "default",
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "example",
  database: process.env.DB_DATABASE || "pop",
  logging: ["query"],
  entities: [__dirname + "/src/entities/*.*"]
};

const main = async () => {
  await createConnection(connectionOptions);

  const key = keyStore.all()[0];
  const schema = await buildSchema({
    resolvers,
    pubSub: pubSub as any
  });

  const server = new ExpressApolloServer({
    schema,
    introspection: true,
    playground: true,
    context: ({ req }) => {
      if (
        !(req && req.body && req.body.operationName == "IntrospectionQuery")
      ) {
        console.log("Request______________________________________");
      }

      const context: RequestContext = {
        user: null,
        loaders: {
          categoryLoader: categoryLoader(),
          productsOfCategoriesLoader: productsOfCategoriesLoader(),
          categoryChildrenLoader: categoryChildrenLoader(),
          imagesOfProductsLoader: imagesOfProductsLoader(),
          skusOfProductsLoader: skusOfProductsLoader(),
          storeLoader: storeLoader(),
          imageLoader: imageLoader()
        }
      };

      try {
        let token = req.headers.authorization;

        if (token) {
          const parts = (token as string).split(" ");
          if (parts.length > 1 && parts[0] === "Bearer") {
            token = parts[1];
          } else {
            token = null;
          }
        }

        const decoded: Token = JWT.verify(token, key) as Token;

        context.user = decoded;

        return context;
      } catch (_) {
        return context;
      }
    }
  });

  const port = process.env.PORT || 4000;
  const app = express();

  server.applyMiddleware({
    app
  });

  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);

  httpServer.listen(
    {
      port
    },
    () => {
      console.log(
        `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
      );
      console.log(
        `🚀 Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`
      );
    }
  );
};

main();
