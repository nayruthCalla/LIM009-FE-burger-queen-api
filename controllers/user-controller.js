const dbUser = require('../model/create-users');

module.exports = {
  controllerCreateUser: async (req, resp, next) => {
    const { email, password, roles } = req.body;
    if (!email || !password) {
      return next(400);
    }
    // console.log(email)
    const verifyUser = await dbUser.searchBd('users', { email });
    if (verifyUser != null) {
      return next(403);
    }
    const user = await dbUser.createUser(email, password, roles)
    return resp.send(user);
  },
};

// const createUserAdmin = async (adminUser, next) => {
//   const dbo = await db();
//   const user = await dbo
//     .collection('users')
//     .findOne({ email: adminUser.email });
//   if (!user) {
//     await dbo.collection('users').insertOne(adminUser);
//     next();
//   }

//   db().then((db) => {
//     db.collection('users')
//       .findOne({ email: adminUser.email })
//       .then((userAdmin) => {
//         if (!userAdmin) {
//           db.collection('users').insertOne(adminUser);
//           next();
//         }
//       });
//   });
// };
// module.exports;
