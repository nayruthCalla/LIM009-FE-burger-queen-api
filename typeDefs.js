const { gql } = require('apollo-server');

const typeDefs = gql`
type User {
    message: String!
    token: String!
    
  }  
  type Query {
    currentUser:[getUser]!
    products:[Product]!
    getOrders: [Order]!
  }  
  type Mutation {
    authentication(email: String!, password: String!): User!
  }
  type rol {
      admin: Boolean
  }
  type getUser {
      _id: ID!
      email: String!
      password: String!
      roles :  rol!
  }
  type Product {
    _id: ID!
    name: String!
    price: Int!
    image: String!
    type: String!
    dateEntry: String
  }
  type productsobj {
    productId: ID!
    name: String!
    price: Int!
  }
  type products {
    qty: Int!
    product: productsobj
  }
  type Order {
      _id: ID!
      userId: String!
      client: String!
      products: [products]!
      status: String!
      dateEntry: String
      dateProcessed: String
  }
  
`;

module.exports = typeDefs;
