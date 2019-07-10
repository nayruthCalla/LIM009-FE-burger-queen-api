const { MongoMemoryServer } = require('mongodb-memory-server');
// const mongo = require('../connection');

let mongoServer;
const run = async () => {
  mongoServer = new MongoMemoryServer();
  const db = await mongoServer.getConnectionString();
  // console.log(db)
  return db;
};

describe('Deberia conectar a la base de datos', () => {
  beforeAll(async () => run());
  it('Insertando primer dato', async () => {
    const db = await run();
    return mongo(db).then((result) => {
      result.collection('user').insertOne({ _id : 14, name:"nayrtuh" });
      return result.collection('user').findOne({ _id : 14 }).then((result) => {
        // console.log(result)
        expect(result).toEqual({ _id: 14, name: 'nayrtuh' });
      });
    });
  });
});
afterAll(async () => {
  await mongoServer.stop();
});
