import { ApolloServer } from "apollo-server";
import db from "../db";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
const { getUserFromToken, createToken } = require("../src/functions/auth.js");

const rooms = [];

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    //auth will have to check if users arent in other rooms ect
    const token = req.headers.authorization;
    const user = await getUserFromToken(token);
    return { db, user, createToken, rooms };
  },
});

server.listen(4000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
