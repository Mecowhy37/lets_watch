import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    users: [User]!
    profile: User
    refreshToken: Auth!
    login(username: String!): Auth!
  }
  extend type Mutation {
    getOtp(username: String!, phone: String): Checkup!
    register(otp: String!, token: String!): Auth!
  }
  type User {
    id: ID!
    username: String!
    phone: String!
    created_at: String!
  }
  type Checkup {
    username: String
    phone: String
    otptoken: String
  }
  type Auth {
    user: User!
    token: String!
    refreshToken: String!
  }
  # union Registering = Auth | Checkup
`;
// Auth @include(if: phone)
