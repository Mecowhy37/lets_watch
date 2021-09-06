import { gql } from "apollo-server";

export default gql`
  enum Role {
    GUEST
    ADMIN
  }

  type User {
    id: ID!
    username: String!
    phone: String!
    created_at: String!
  }

  type Movie {
    title: String!
    movie_imdb_id: String!
    watched: Boolean!
  }
  type FlashRoom {
    id: ID!
    name: String!
    code: String!
    users: [User!]!
    movies: [Movie]!
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
  type Room {
    number: String!
    users: [User]!
    admin: User!
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
    getrooms: [Room]!
  }
  extend type Mutation {
    signup(input: SignupInput!): AuthUser!
    signin(input: SigninInput!): AuthUser!
    addtowatchlist(imdbID: String!): Movie!
    markwatched(imdbID: String!): Movie!
    delete(imdbID: String!): Movie!
    createroom: Room!
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
