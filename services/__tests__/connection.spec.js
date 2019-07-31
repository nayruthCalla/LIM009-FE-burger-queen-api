const { MongoMemoryServer } = require('mongodb-memory-server');
const dbf = require('../connection');

describe('insert', () => {
  let connection;
  let db;
  let mongoServer;

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const dbUrl = await mongoServer.getConnectionString();
    connection = await dbf(dbUrl);
    db = await connection;
  });

  afterAll(async () => {
    await connection.close();
    await db.close();
  });

  it('should insert a doc into collection', async () => {
    const users = db.collection('users');
    const mockUser = { _id: 'some-user-id', name: 'John' };
    await users.insertOne(mockUser);

    const insertedUser = await users.findOne({ _id: 'some-user-id' });
    expect(insertedUser).toEqual(mockUser);
  });
});
