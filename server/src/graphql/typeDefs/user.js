import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    users: [User]!
    profile: User
    refreshToken: Auth!
    login(username: String!, password: String!): Auth!
  }
  extend type Mutation {
    register(username: String!, phone: String!, password: String!): Auth!
  }
  type User {
    id: ID!
    username: String!
    phone: String!
    password: String!
    created_at: String!
  }
  type Auth {
    user: User!
    token: String!
    refreshToken: String!
  }
`;
