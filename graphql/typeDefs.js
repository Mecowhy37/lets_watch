const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    id: ID!
    createdAt: String!
    username: String!
    fullname: String!
    email: String!
    reviews: [Review]!
    watchlist: [String]!
    follows: [User]!
    token: String!
  }
  type Film {
    id: ID!
    lastReview: String
    title: String!
    director: String!
    release: String!
    reviews: [Review]!
  }
  type Review {
    id: ID!
    createdAt: String!
    user: User!
    film: Film!
    body: String!
    tags: [String]!
    comments: [Comment]!
    upvotes: [Vote]!
  }
  type Comment {
    id: ID!
    username: String!
    body: String!
    createdAt: String!
  }
  type Vote {
    id: ID!
    createdAt: String!
    username: String!
  }
  type Query {
    getUsers: [User]
  }
`;
