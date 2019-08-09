const fetch = require('node-fetch');
const { ApolloError } = require('apollo-server');

const baseURL = 'http://165.22.166.131:8080/';
const resolvers = {
  Mutation: {
    authentication: async (parent, { email, password }) => {
      const response = await fetch(`${baseURL}auth/`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.statusCode !== '200' && data.statusCode !== undefined) {
        throw new ApolloError(data.message);
      }
      return data;
    },
    CreateUser: async (parent, { email, password, rol }, token) => {
      const response = await fetch(`${baseURL}users/`, {
        method: 'POST',
        body: JSON.stringify({ email, password, roles: { admin: rol } }),
        headers: {
          'Content-Type': 'application/json',
          // eslint-disable-next-line quote-props
          'Authorization': `${token.authorization}`,
        },
      });
      const data = await response.json();
      if (data.statusCode !== 200) {
        throw new ApolloError(data.message);
      }
      return data;
    },
    PutUserById: async (parent, {
      uid, email, password, rol,
    }, token) => {
      const response = await fetch(`${baseURL}users/${uid}`, {
        method: 'PUT',
        body: JSON.stringify({ email, password, roles: { admin: rol } }),
        headers: {
          'Content-Type': 'application/json',
          // eslint-disable-next-line quote-props
          'Authorization': `${token.authorization}`,
        },
      });
      const data = await response.json();
      if (data.statusCode !== 200 && data.statusCode !== undefined) {
        throw new ApolloError(data.message);
      }
      return data;
    },
    DeleteUserById: async (parent, { uid }, token) => {
      const response = await fetch(`${baseURL}users/${uid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // eslint-disable-next-line quote-props
          'Authorization': `${token.authorization}`,
        },
      });
      const data = await response.json();
      if (data.statusCode !== 200 && data.statusCode !== undefined) {
        throw new ApolloError(data.message);
      }
      return data;
    },
    CreateProduct: async (parent, {
      name, price, image, type,
    }, token) => {
      const response = await fetch(`${baseURL}products/`, {
        method: 'POST',
        body: JSON.stringify({
          name, price, image, type,
        }),
        headers: {
          'Content-Type': 'application/json',
          // eslint-disable-next-line quote-props
          'Authorization': `${token.authorization}`,
        },
      });
      const data = await response.json();
      if (data.statusCode !== 200 && data.statusCode !== undefined) {
        throw new ApolloError(data.message);
      }
      return data;
    },
    PutProduct: async (parent, {
      productId, name, price, image, type,
    }, token) => {
      const response = await fetch(`${baseURL}products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({
          name, price, image, type,
        }),
        headers: {
          'Content-Type': 'application/json',
          // eslint-disable-next-line quote-props
          'Authorization': `${token.authorization}`,
        },
      });
      const data = await response.json();
      if (data.statusCode !== 200 && data.statusCode !== undefined) {
        throw new ApolloError(data.message);
      }
      return data;
    },
    DeleteProduct: async (parent, { productId }, token) => {
      const response = await fetch(`${baseURL}products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // eslint-disable-next-line quote-props
          'Authorization': `${token.authorization}`,
        },
      });
      const data = await response.json();
      if (data.statusCode !== 200 && data.statusCode !== undefined) {
        throw new ApolloError(data.message);
      }
      return data;
    },
    CreateOrder: async (parent, { userId, client, input }, token) => {
      const response = await fetch(`${baseURL}orders/`, {
        method: 'POST',
        body: JSON.stringify({ userId, client, products: input }),
        headers: {
          'Content-Type': 'application/json',
          // eslint-disable-next-line quote-props
          'Authorization': `${token.authorization}`,
        },
      });
      const data = await response.json();
      if (data.statusCode !== 200 && data.statusCode !== undefined) {
        throw new ApolloError(data.message);
      }
      return data;
    },
    PutOrderById: async (parent, {
      orderid, userId, client, input, status,
    }, token) => {
      const response = await fetch(`${baseURL}orders/${orderid}`, {
        method: 'PUT',
        body: JSON.stringify({
          userId, client, products: input, status,
        }),
        headers: {
          'Content-Type': 'application/json',
          // eslint-disable-next-line quote-props
          'Authorization': `${token.authorization}`,
        },
      });
      const data = await response.json();
      if (data.statusCode !== 200 && data.statusCode !== undefined) {
        throw new ApolloError(data.message);
      }
      return data;
    },
    DeleteOrderById: async (parent, { orderid }, token) => {
      const response = await fetch(`${baseURL}orders/${orderid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // eslint-disable-next-line quote-props
          'Authorization': `${token.authorization}`,
        },
      });
      const data = await response.json();
      if (data.statusCode !== 200 && data.statusCode !== undefined) {
        throw new ApolloError(data.message);
      }
      return data;
    },
  },
  Query: {
    GetUsers: async (parent, args, token) => {
      const { page } = args;
      const response = await fetch(`${baseURL}users/?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // eslint-disable-next-line quote-props
          'Authorization': `${token.authorization}`,
        },
      });
      // console.info('hola')
      const data = await response.json();
      if (data.statusCode !== 200 && data.statusCode !== undefined) {
        throw new ApolloError(data.message);
      }
      return data;
    },
    GetUserById: async (parent, args, token) => {
      const { uid } = args;
      const response = await fetch(`${baseURL}users/${uid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // eslint-disable-next-line quote-props
          'Authorization': `${token.authorization}`,
        },
      });
      const data = await response.json();
      if (data.statusCode !== 200 && data.statusCode !== undefined) {
        throw new ApolloError(data.message);
      }
      return data;
    },
    Getproducts: async (parent, args, token) => {
      const { page } = args;
      const response = await fetch(`${baseURL}products/?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // eslint-disable-next-line quote-props
          'Authorization': `${token.authorization}`,
        },
      });
      // console.info('hola')
      const data = await response.json();
      if (data.statusCode !== 200 && data.statusCode !== undefined) {
        throw new ApolloError(data.message);
      }
      return data;
    },
    GetproductsById: async (parent, args, token) => {
      const { productId } = args;
      const response = await fetch(`${baseURL}products/${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // eslint-disable-next-line quote-props
          'Authorization': `${token.authorization}`,
        },
      });
      const data = await response.json();
      if (data.statusCode !== 200 && data.statusCode !== undefined) {
        throw new ApolloError(data.message);
      }
      return data;
    },
    GetOrders: async (parent, args, token) => {
      const { page } = args;
      const response = await fetch(`${baseURL}orders/?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // eslint-disable-next-line quote-props
          'Authorization': `${token.authorization}`,
        },
      });
      // console.info('hola')
      const data = await response.json();
      if (data.statusCode !== 200 && data.statusCode !== undefined) {
        throw new ApolloError(data.message);
      }
      return data;
    },
    GetOrdersById: async (parent, args, token) => {
      const { orderid } = args;
      const response = await fetch(`${baseURL}orders/${orderid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // eslint-disable-next-line quote-props
          'Authorization': `${token.authorization}`,
        },
      });
      const data = await response.json();
      if (data.statusCode !== 200 && data.statusCode !== undefined) {
        throw new ApolloError(data.message);
      }
      return data;
    },
  },
};
module.exports = resolvers;
