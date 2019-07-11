const db = require('../services/connection');

const createUserAdmin = async (adminUser, next) => {
  const dbo =  await db();
  const user = await dbo.collection('users').findOne({ email: adminUser.email });
  if(!user){
     await dbo.collection('users').insertOne(adminUser);
    next()
  }
  


  db()
    .then((db) => {
      db.collection('users').findOne({ email: adminUser.email }).then((userAdmin) => {
        if (!userAdmin) {
          db.collection('users').insertOne(adminUser);
          next();
        }
      });
    });
}

module.exports