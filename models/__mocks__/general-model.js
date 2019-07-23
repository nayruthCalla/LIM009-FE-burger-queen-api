const userModelGeneral = jest.fn(() => ({
  createDocument: jest.fn().mockImplementation(() => Promise.resolve({
    ops: [{
      _id: '12345', email: 'user@gmail.com', password: '$2b$10$nod2eh0Lq0iPdp0BWLjgpeAt0sXV0Up7cfchL0gK2TZo3VJCgmwAa', roles: { admin: false },
    }],
  })),
  updateDocument: jest.fn().mockImplementation(() => Promise.resolve({})),
  deleteDocument: jest.fn().mockImplementation(() => Promise.resolve({})),
  searchDataBase: jest.fn().mockImplementation((doc) => {
    if (doc.email === 'userToUpdate@gmail.com') {
      return Promise.resolve({
        _id: '12345', email: 'updatedUser@gmail.com', password: '$2b$10$nod2eh0Lq0iPdp0BWLjgpeAt0sXV0Up7cfchL0gK2TZo3VJCgmwAa', roles: { admin: false },
      });
    }
    if (doc.email === 'user002@gmail.com') {
      return Promise.resolve({
        _id: '12345', email: 'user002@gmail.com', password: '$2b$10$nod2eh0Lq0iPdp0BWLjgpeAt0sXV0Up7cfchL0gK2TZo3VJCgmwAa', roles: { admin: true },
      });
    }
    if (doc.email === 'user003@gmail.com') {
      return Promise.resolve({
        _id: '12345', email: 'user003@gmail.com', password: '$2b$10$nod2eh0Lq0iPdp0BWLjgpeAt0sXV0Up7cfchL0gK2TZo3VJCgmwAa', roles: { admin: false },
      });
    }
    if (doc.email === 'email already exists') {
      return Promise.resolve({
        _id: '12345', email: 'user@gmail.com', password: '$2b$10$nod2eh0Lq0iPdp0BWLjgpeAt0sXV0Up7cfchL0gK2TZo3VJCgmwAa', roles: { admin: false },
      });
    }
    return Promise.resolve(null);
  }),
  showListCollections: jest.fn().mockImplementation(() => Promise.resolve([
    {
      _id: '12345a', email: 'admin@localhost', password: '$2b$10$nod2eh0Lq0iPdp0BWLjgpeAt0sXV0Up7cfchL0gK2TZo3VJCgmwAa', roles: { admin: true },
    },
    {
      _id: '12345b', email: 'user01@gmail.com', password: '$2b$10$nod2eh0Lq0iPdp0BWLjgpeAt0sXV0Up7cfchL0gK2TZo3VJCgmwAa', roles: { admin: false },
    },
    {
      _id: '12345c', email: 'user02@gmail.com', password: '$2b$10$nod2eh0Lq0iPdp0BWLjgpeAt0sXV0Up7cfchL0gK2TZo3VJCgmwAa', roles: { admin: false },
    },
    {
      _id: '12345d', email: 'user03@gmail.com', password: '$2b$10$nod2eh0Lq0iPdp0BWLjgpeAt0sXV0Up7cfchL0gK2TZo3VJCgmwAa', roles: { admin: false },
    },
  ])),
  countCollections: jest.fn().mockImplementation(() => Promise.resolve(12)),
}));

const productModelGeneral = jest.fn(() => ({
  createDocument: jest.fn().mockImplementation(() => Promise.resolve({
    ops: [{
      _id: '5d328d66976faf100edae191',
      name: 'hamburguesa',
      price: 6.7,
      image: 'http://localhost:8080/products/img/hamburguesa.png',
      type: 'frituras',
      dateEntry: '2019-07-20T03:41:26.873Z',
    }],
  })),
  updateDocument: jest.fn().mockImplementation(() => Promise.resolve({})),
  deleteDocument: jest.fn().mockImplementation(() => Promise.resolve({})),
  searchDataBase: jest.fn().mockImplementation((doc) => {
    const idProduct = (doc._id).toString();
    if (idProduct === '5d328d66976faf100edae191') {
      return Promise.resolve({
        _id: '5d328d66976faf100edae191',
        name: 'hamburguesa gourmet',
        price: 6.7,
        image: 'http://localhost:8080/products/img/hamburguesa.png',
        type: 'combo',
        dateEntry: '2019-07-20T03:41:26.873Z',
      });
    }
    return Promise.resolve(null);
  }),
  showListCollections: jest.fn().mockImplementation(() => Promise.resolve([
    {
      _id: '5d328d66976faf100edae191',
      name: 'hamburguesa gourmet1',
      price: 6.7,
      image: 'http://localhost:8080/products/img/hamburguesa.png',
      type: 'combo',
      dateEntry: '2019-07-20T03:41:26.873Z',
    },
    {
      _id: '5d328d66976faf100edae191',
      name: 'hamburguesa gourmet2',
      price: 6.7,
      image: 'http://localhost:8080/products/img/hamburguesa.png',
      type: 'combo',
      dateEntry: '2019-07-20T03:41:26.873Z',
    },
    {
      _id: '5d328d66976faf100edae191',
      name: 'hamburguesa gourmet3',
      price: 6.7,
      image: 'http://localhost:8080/products/img/hamburguesa.png',
      type: 'combo',
      dateEntry: '2019-07-20T03:41:26.873Z',
    },
    {
      _id: '5d328d66976faf100edae191',
      name: 'hamburguesa gourmet4',
      price: 6.7,
      image: 'http://localhost:8080/products/img/hamburguesa.png',
      type: 'combo',
      dateEntry: '2019-07-20T03:41:26.873Z',
    },
  ])),
  countCollections: jest.fn().mockImplementation(() => Promise.resolve(8)),
}));
const orderModelGeneral = jest.fn(() => ({
  createDocument: jest.fn().mockImplementation(() => Promise.resolve(
    {
      ops: [{
        _id: '5d33829988229e4f28b8ce7e',
        userId: '5d2b074c8d949249fa60e5fe',
        client: 'nameclient',
        products: [
          {
            product: {
              _id: '5d328d66976faf100edae191',
              name: 'hamburguesa',
              price: 6.7,
              image: 'http://localhost:8080/products/img/hamburguesa.png',
              type: 'frituras',
              dateEntry: '2019-07-20T03:41:26.873Z',
            },
            qty: 4,
          },
        ],
        status: 'pending',
        dateEntry: '2019-07-20T21:07:37.847Z',
      }],
    },
  )),
  updateDocument: jest.fn().mockImplementation(() => Promise.resolve({})),
  deleteDocument: jest.fn().mockImplementation(() => Promise.resolve({})),
  searchDataBase: jest.fn().mockImplementation((doc) => {
    const idOrder = (doc._id).toString();
    if (idOrder === '5d33729184d861448ac52d2f') {
      return Promise.resolve({
        _id: '5d33829988229e4f28b8ce7e',
        userId: '5d2b074c8d949249fa60e5fe',
        client: 'nameclient',
        products: [
          {
            product: {
              _id: '5d328d66976faf100edae191',
              name: 'hamburguesa',
              price: 6.7,
              image: 'http://localhost:8080/products/img/hamburguesa.png',
              type: 'frituras',
              dateEntry: '2019-07-20T03:41:26.873Z',
            },
            qty: 4,
          },
        ],
        status: 'preparing',
        dateEntry: '2019-07-20T21:07:37.847Z',
      });
    }
    return Promise.resolve(null);
  }),
  showListCollections: jest.fn().mockImplementation(() => Promise.resolve([
    {
      _id: '5d328d66976faf100edae191',
      name: 'hamburguesa gourmet1',
      price: 6.7,
      image: 'http://localhost:8080/orders/img/hamburguesa.png',
      type: 'combo',
      dateEntry: '2019-07-20T03:41:26.873Z',
    },
    {
      _id: '5d328d66976faf100edae191',
      name: 'hamburguesa gourmet2',
      price: 6.7,
      image: 'http://localhost:8080/orders/img/hamburguesa.png',
      type: 'combo',
      dateEntry: '2019-07-20T03:41:26.873Z',
    },
    {
      _id: '5d328d66976faf100edae191',
      name: 'hamburguesa gourmet3',
      price: 6.7,
      image: 'http://localhost:8080/orders/img/hamburguesa.png',
      type: 'combo',
      dateEntry: '2019-07-20T03:41:26.873Z',
    },
    {
      _id: '5d328d66976faf100edae191',
      name: 'hamburguesa gourmet4',
      price: 6.7,
      image: 'http://localhost:8080/orders/img/hamburguesa.png',
      type: 'combo',
      dateEntry: '2019-07-20T03:41:26.873Z',
    },
  ])),
  countCollections: jest.fn().mockImplementation(() => Promise.resolve(8)),
}));

module.exports = {
  userModelGeneral,
  productModelGeneral,
  orderModelGeneral,
};
