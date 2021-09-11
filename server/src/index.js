import { ApolloServer } from "apollo-server";
import db from "../db";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
const { getUserFromToken, createToken } = require("../src/functions/auth.js");

const rooms = [];

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    //auth will have to check if users arent in other rooms ect
    let token = connection ? connection.context.Authorization : req.headers.authorization;
    const user = await getUserFromToken(token);
    // const room = rooms.find((ro) => ro.users.find((u) => u.id === user.id));
    // console.log(room);
    const roomIDs = rooms.map((ro) => ro.number);
    return { db, user, createToken, roomIDs };
  },
});

server.listen(4000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
