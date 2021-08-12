import { gql } from "apollo-server";

export default gql`
  enum Role {
    ADMIN
    MEMBER
    GUEST
  }

  type User {
    id: ID!
    username: String!
    phone: String!
    created_at: String!
  }
  type Movie {
    id: ID!
    title: String!
  }

  type AuthUser {
    user: User!
    token: String!
  }
  input SignupInput {
    username: String!
    phone: String!
    role: Role!
  }
  input SigninInput {
    username: String!
    phone: String!
  }
  extend type Query {
    profile: User!
    # login(username: String!, phone: String!): Auth!
    # watch_list: WatchList!
    watch_list: [Movie]!
  }
  extend type Mutation {
    signup(input: SignupInput!): AuthUser!
    signin(input: SigninInput!): AuthUser!
    addtowatchlist(title: String!): [Movie]!
  }
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
