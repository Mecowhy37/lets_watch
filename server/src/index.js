import db from "../db";
import express from "express";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import { ApolloServer } from "apollo-server-express";

async function startApolloServer() {
  const app = express();
  const PORT = 4000;
  app.disable("x-powered-by");
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();

  server.applyMiddleware({ app });

  app.use((req, res) => {
    res.status(200);
    res.send("Hello!");
    res.end();
  });

  await new Promise((resolve) => app.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  return { server, app };
}

startApolloServer();
