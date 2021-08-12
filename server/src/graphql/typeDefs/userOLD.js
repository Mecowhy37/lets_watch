import { gql } from "apollo-server";

export default gql`
  type User {
    id: ID!
    username: String!
    phone: String!
    created_at: String!
  }
  extend type Query {
    profile: User!
    login(username: String!, phone: String!): Auth!
  }
  # union Registering = Auth | Checkup
`;

// type Checkup {
//   username: String
//   phone: String
//   otptoken: String
// }
// type Auth {
//   user: User!
//   token: String!
//   refreshToken: String!
// }

// extend type Mutation {
//   getOtp(username: String!, phone: String): Checkup!
//   register(otp: String!, token: String!): Auth!
// }
