/* eslint-disable no-unused-vars */
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const { createUser } = require('../users-model');
const { showListCollections } = require('../general-model');


const createUsersMany = (dbUrl, cont, numDoc) => {
  while (cont <= numDoc) {
    createUser('users', dbUrl, {
      email: `user00${cont}@localhost`,
      password: '$2b$10$.Jqhq/.CAkjv7CT3mOacqOBp3.DjbK4Bc6YqWZsYvyLDWG50d.Bxq',
      roles: { admin: false },
    });
    cont++;
  }
};

describe('Base de ddatos en Memoria', () => {
  let dbUrl;
  let mongoServer;
  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    dbUrl = await mongoServer.getConnectionString();
    await createUsersMany(dbUrl, 1, 10);
  });
  it('Lista de usuarios de la pagina dos con un limite de 5', async () => {    
    const users = await showListCollections('users', dbUrl, 5, 10);
    console.info(users);
    expect(users[0].email).toEqual('user006@localhost');
    expect(users[4].email).toEqual('user0010@localhost');
  });
  afterAll(async () => {
    // j
  });
});
