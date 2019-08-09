const { gql } = require('apollo-server');

const typeDefs = gql`
type User {
  """
  Description for field
  Supports **multi-line** description for your [API](http://example.com)!
  """
    message: String!
    token: String!
    
  }  
  input productsOrders{
    product: ID!
    qty: Float!
  }
  type Query { 
    GetUsers(page: Int):[getUser]!    
    Getproducts(page: Int):[Product]!
    GetOrders(page: Int): [Order]!
    GetUserById(uid: ID!): getUser!
    GetproductsById(productId: ID!): Product!
    GetOrdersById(orderid: ID!): Order!
  } 
  type rol {
      admin: Boolean
  }
  type Mutation {
    authentication(email: String!, password: String!): User!
    CreateUser(email: String!, password: String!, rol: Boolean): getUser!
    PutUserById(uid: ID!,email: String!, password: String!, rol: Boolean): getUser!
    DeleteUserById(uid: ID!): getUser!
    CreateProduct(name: String!, price: Float, image: String!, type: String!): Product!
    PutProduct(productId: ID!, name: String!, price: Float, image: String!, type: String!): Product!
    DeleteProduct(productId: ID!): Product!
    CreateOrder(userId: ID!, client: String!, input: [productsOrders]!): Order!
    PutOrderById(orderid: ID!, userId: ID, client: String, input: [productsOrders], status: String!): Order!
    DeleteOrderById(orderid: ID!): Order!
  }  
  type getUser {
    """
    Description for field
    Supports **multi-line** description for your [API](http://example.com)!
    """
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
    price: Float!
  }
  type products {
    qty: Float!
    product: productsobj!
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
