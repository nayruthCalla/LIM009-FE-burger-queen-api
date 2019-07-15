const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const modelDataBase = require('../general-model');

describe('Base de datos en memoria', () => {
  let dbUrl;
  let mongoServer;
  let userController;
  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    dbUrl = await mongoServer.getConnectionString();
    userController = modelDataBase('users', dbUrl);
  });
  it('Insertando un Documento en BD', async () => {
    const mockUser = { email: 'mesero@gmail.com', password: bcrypt.hashSync('123', 10) };
    const insertedUser = await userController.createDocument(mockUser);
    expect(insertedUser.ops[0]).toEqual(mockUser);
  });

  it('Editando un Documento en la BD', async () => {
    const mockUser = { email: 'meseroactualizado@gmail.com', password: bcrypt.hashSync('123', 10) };
    const user = await userController.searchDataBase({ email: 'mesero@gmail.com' });
    await userController.updateDocument(user._id, mockUser);
    const updateUserOne = await userController.searchDataBase({ email: 'meseroactualizado@gmail.com' });
    expect(updateUserOne.email).toEqual('meseroactualizado@gmail.com');
  });
  it('Eliminando un Documento en la BD', async () => {
    const user = await userController.searchDataBase({ email: 'meseroactualizado@gmail.com' });
    await userController.deleteDocument(user._id);  
    const deleteUserOne = await userController.searchDataBase({ email: 'meseroactualizado@gmail.com' });
    expect(deleteUserOne).toEqual(null);
  });
  afterAll(async () => {
    
  });
});
