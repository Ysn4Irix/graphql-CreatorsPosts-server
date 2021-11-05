<p align="center">
 <img width="200px" src="https://res.cloudinary.com/ydevcloud/image/upload/v1636141782/r6obdkhwfubdoexxtwck.svg" align="center" alt="graphqlLogo" />
</p>

<h1 align="center">Graphql Creators & Posts Server</h1>

Give me a Star 🌟

A Graphql Server for creators and posts with relations build using [Graphql](https://nodejs.org) & [Apollo Server](https://nodejs.org) & [Express](https://expressjs.com) & [MongoDB](https://www.mongodb.com/)

## Installation

API requires [Node.js](https://nodejs.org/) v14+ to run.

Clone
Install the dependencies and start the production.

```sh
cd graphql-CreatorsPosts
npm install
npm start or npm run devStart
```

## Usage

GraphQL Creator TypeDefs

```sh
Creator {
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
```

GraphQL Post TypeDefs

```sh
Post {
    id: ID!
    title: String!
    image: String!
    content: String!
    creator: String
    createdAt: GraphQLDateTime
    updatedAt: GraphQLDateTime
}
```

GraphQL Queries

```sh
Query {
    allCreators: [Creator!]!
    getCreator(id: ID!): Creator!
    allPosts: [Post!]!
    getPost(id: ID!): Post!
    getPostsByCreator(id: ID!): [Post]
}
```

GraphQL Mutations

```sh
Mutation {
    registerCreator(creator: CreatorInput): Creator!
    loginCreator(credentials: loginInput): Creator!
    updateCreator(id: ID!, updates: CreatorInputUpdate): Creator!
    deleteCreator(id: ID!): String!
    createPost(post: postInput): Post!
    editPost(id: ID!, updates: postInputUpadates): Post!
    deletePost(id: ID!): String!
}
```

## License

MIT