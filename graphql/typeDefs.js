const { gql } = require("apollo-server-express");
const { GraphQLDateTime } = require("graphql-iso-date");

const typeDefs = gql`
  scalar GraphQLDateTime

  type Creator {
    id: ID!
    fullname: String!
    username: String!
    email: String!
    password: String!
    avatar: String
    ip_address: String
    user_agent: String
    createdAt: GraphQLDateTime
    updatedAt: GraphQLDateTime
  }

  type Post {
    id: ID!
    title: String!
    image: String!
    content: String!
    creator: String
    createdAt: GraphQLDateTime
    updatedAt: GraphQLDateTime
  }

  type Query {
    allCreators: [Creator!]!
    getCreator(id: ID!): Creator!
    allPosts: [Post!]!
    getPost(id: ID!): Post!
    getPostsByCreator(id: ID!): [Post]
  }

  input CreatorInput {
    fullname: String!
    username: String!
    email: String!
    password: String!
    avatar: String
  }

  input CreatorInputUpdate {
    fullname: String
    username: String
    email: String
    password: String
  }

  input postInput {
    title: String!
    image: String!
    content: String!
    creator: String!
  }

  input postInputUpadates {
    title: String
    image: String
    content: String
  }

  input loginInput {
    email: String!
    password: String!
  }

  type Mutation {
    registerCreator(creator: CreatorInput): Creator!
    loginCreator(credentials: loginInput): Creator!
    updateCreator(id: ID!, updates: CreatorInputUpdate): Creator!
    deleteCreator(id: ID!): String!
    createPost(post: postInput): Post!
    editPost(id: ID!, updates: postInputUpadates): Post!
    deletePost(id: ID!): String!
  }
`;

module.exports = typeDefs;
