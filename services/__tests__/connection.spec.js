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

// let mongoServer;
// beforeAll(async () => {
//   mongoServer = new MongoMemoryServer();
//   const dbUrl = await mongoServer.getConnectionString();
//   const client = new MongoClient(dbUrl, { useNewUrlParser: true });
//   try {
//     await client.connect();
//     const db = client.db();
//     // console.log(db)
//     // return db;
//   } catch (err) {
//     console.log(err.stack);
//   }
  
//   client.close();
//   const client = new MongoClient(dbUrl);
// // Use connect method to connect to the Server
// client.connect(function(err) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");

//   const db = client.db(dbName);

//   client.close(
// })}
// const mongo = require('../connection');

// let mongoServer;
// const run = async () => {
//   mongoServer = new MongoMemoryServer();
//   const db = await mongoServer.getConnectionString();
//   console.log(db)
//   return db;
// };

// describe('Deberia conectar a la base de datos', () => {
//   beforeAll(async () => run());
//   it('Insertando primer dato', async () => {
//     const db = await run();
//     return mongo(db).then((result) => {
//       result.collection('user').insertOne({ _id : 14, name:"nayrtuh" });
//       return result.collection('user').findOne({ _id : 14}).then((result) => {
//         // console.log(result)
//         expect(result).toEqual({ _id: 14, name: 'nayrtuh' });
//       });
//     });
//   });
// });
// afterAll(async () => {
//   await mongoServer.stop();
// });
