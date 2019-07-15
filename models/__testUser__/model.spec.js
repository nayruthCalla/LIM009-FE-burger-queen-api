/* eslint-disable jest/no-identical-title */
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const { createUser, updateUser, deleteUser } = require('../users-model');
const { searchDataBase } = require('../general-model');


describe('Base de datos en memoria', () => {
  // let connection;
  let dbUrl;
  let mongoServer;

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    dbUrl = await mongoServer.getConnectionString();
    // console.log(dbUrl);
    // connection = await MongoClient.connect(dbUrl, { useNewUrlParser: true });
    // db = await connection.db();
  });
  it('Insertando un Documento en BD', async () => {
    // const users = db.collection('users');
    // console.log(db);
    const mockUser = { email: 'mesero@gmail.com', password: bcrypt.hashSync('123', 10) };
    // await users.insertOne(mockUser);

    const insertedUser = await createUser('users', dbUrl, mockUser);
    expect(insertedUser.ops[0]).toEqual(mockUser);
  });

  it('Editando un Documento en la BD', async () => {
    const mockUser = { email: 'meseroactualizado@gmail.com', password: bcrypt.hashSync('123', 10) };
    const user = await searchDataBase('users', dbUrl, { email: 'mesero@gmail.com' });
    await updateUser('users', dbUrl, user._id, mockUser);
    // console.log(typeof user._id)
    const updateUserOne = await searchDataBase('users', dbUrl, { email: 'meseroactualizado@gmail.com' });
    expect(updateUserOne.email).toEqual('meseroactualizado@gmail.com');
  });
  it('Eliminando un Documento en la BD', async () => {
    const user = await searchDataBase('users', dbUrl, { email: 'meseroactualizado@gmail.com' });
    await deleteUser('users', dbUrl, user._id);
    // console.log(typeof user._id)
    const deleteUserOne = await searchDataBase('users', dbUrl, { email: 'meseroactualizado@gmail.com' });
    expect(deleteUserOne).toEqual(null);
  });
  afterAll(async () => {
    
  });
});
