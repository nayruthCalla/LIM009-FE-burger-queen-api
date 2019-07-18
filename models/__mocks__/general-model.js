const { ObjectId } = require('mongodb');

const id = { _id: new ObjectId('5d2b074c8d949249fa60e5fe') };
module.exports = jest.fn((collection, dbUrl) => ({
  createDocument: jest.fn().mockImplementation(() => Promise.resolve({
    ops: [{
      _id: '123', email: 'meseroMock@gmail.com', password: '$2b$10$nod2eh0Lq0iPdp0BWLjgpeAt0sXV0Up7cfchL0gK2TZo3VJCgmwAa', roles: { admin: false },
    }],
  })),
  updateDocument: jest.fn().mockImplementation(() => Promise.resolve({ email: 'nayruthupdate@gmail.com', password: '$2b$10$nod2eh0Lq0iPdp0BWLjgpeAt0sXV0Up7cfchL0gK2TZo3VJCgmwAa', roles: { admin: true } })),
  deleteDocument: jest.fn().mockImplementation(() => Promise.resolve({})),
  searchDataBase: jest.fn().mockImplementation((doc) => {
    if (doc.email === 'email already exists') {
      console.log('poner usuario')
      return Promise.resolve({
        _id: '123', email: 'meseroMock@gmail.com', password: '$2b$10$nod2eh0Lq0iPdp0BWLjgpeAt0sXV0Up7cfchL0gK2TZo3VJCgmwAa', roles: { admin: false },
      });
    } if (doc.email === 'meseroMock@gmail.com') {
      console.log('no existe')

      return Promise.resolve(null);
    }
    if (doc.email === 'meseroMockparaActualizado@gmail.com') {
      console.log('actualiza')
      return Promise.resolve({
        _id: '123', email: 'meseroMockactualizado@gmail.com', password: '$2b$10$nod2eh0Lq0iPdp0BWLjgpeAt0sXV0Up7cfchL0gK2TZo3VJCgmwAa', roles: { admin: false },
      });
    }
    // console.log('null')
  }),
  showListCollections: jest.fn().mockImplementation(() => Promise.resolve({})),
}));
