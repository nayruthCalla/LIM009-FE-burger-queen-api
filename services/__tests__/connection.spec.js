const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');

describe('insert', () => {
  let connection;
  let db;
  let mongoServer;

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const dbUrl = await mongoServer.getConnectionString();
    console.log(dbUrl);
    connection = await MongoClient.connect(dbUrl, { useNewUrlParser: true });
    db = await connection.db();    
  });

  afterAll(async () => {
    await connection.close();
    await db.close();
  });

  it('should insert a doc into collection', async () => {       
    const users = db.collection('users');
    console.log(db) 
    const mockUser = {_id: 'some-user-id', name: 'John'};
    await users.insertOne(mockUser);

    const insertedUser = await users.findOne({_id: 'some-user-id'});
    expect(insertedUser).toEqual(mockUser);
  });
});
