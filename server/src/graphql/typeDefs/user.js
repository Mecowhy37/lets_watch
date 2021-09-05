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
    title: String!
  }
  type MovieSearch {
    Title: String
    Year: String
    imdbID: String
    Poster: String
  }

  type AuthUser {
    user: User!
    token: String!
  }
  type WatchList {
    list: [Movie]!
    updated_at: String!
  }

  input SignupInput {
    username: String!
    phone: String!
  }
  input SigninInput {
    username: String!
    # phone: String!
  }
  extend type Query {
    profile: User!
    watch_list: WatchList!
    searchtowatchlist(title: String!): [MovieSearch]!
  }
  extend type Mutation {
    signup(input: SignupInput!): AuthUser!
    signin(input: SigninInput!): AuthUser!
    addtowatchlist(imdbID: String!): Movie!
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
