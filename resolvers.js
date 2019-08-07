const fetch = require('node-fetch')

const baseURL = 'http://165.22.166.131:8080/';
const resolvers = {
  Mutation: {
    authentication: async (parent, { email, password }) => {
      const response = await fetch(`${baseURL}auth/`, {
        method: 'POST',
        body: JSON.stringify({ 'email': email, 'password': password }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      console.info(data);
      return data;
    },


  },
  Query: {
    currentUser: async (parent, args, token) => {
      const response = await fetch(`${baseURL}users/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token.authorization}`
        },
      });
      // console.info('hola')
      const data = await response.json();
      console.info(typeof `${token.authorization}`);
      console.log(data)
      return data;
    },
    products: async (parent, args, token) => {
      const response = await fetch(`${baseURL}products/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token.authorization}`
        },
      });
      // console.info('hola')
      const data = await response.json();
      console.info(typeof `${token.authorization}`);
      console.log(data)
      return data;
    },
    getOrders: async (parent, args, token) => {
      const response = await fetch(`${baseURL}orders/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token.authorization}`
        },
      });
      // console.info('hola')
      const data = await response.json();
      console.info(typeof `${token.authorization}`);
      console.log(data)
      return data;
    },
  },
};
module.exports = resolvers;
