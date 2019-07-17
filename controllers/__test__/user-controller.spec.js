const userController = require('../user-controller');
const bcrypt = require('bcrypt');
jest.mock('../../models/general-model');
const model = require('../../models/general-model');
const userModel = model('users', 'mongodb://localhost:27017/burger-queen');
const objectController = userController(userModel)(bcrypt);
console.log(model)
let a;
const req = {
  body:{
    email: '',
    password: '123',
    roles: {
      admin: true
    },
  }
}
const resp = {
    send : userModel.createDocument
}
// const next = () => ({
//     400: 'Bad request',
//     401: 'Unauthorized',
//     403: 'Forbidden',
//     404: 'Not found',
//     500: 'Internal server error',
// })
describe('GET /users', () => {
  it('controllerUser',async () => {
    const r = await objectController.controllerCreateUser(req, resp, next);
    expect(r).toEqual(true);
  });
});

























// const { MongoMemoryServer } = require('mongodb-memory-server');
// const { MongoClient } = require('mongodb');
// const bcrypt = require('bcrypt');
// const modelDataBase = require('../general-model');

// describe('Base de datos en memoria', () => {
//   let dbUrl;
//   let mongoServer;
//   let userController;
//   beforeAll(async () => {
//     mongoServer = new MongoMemoryServer();
//     dbUrl = await mongoServer.getConnectionString();
//     userController = modelDataBase('users', dbUrl);
//   });
//   it('Insertando un Documento en BD', async () => {
//     const mockUser = { email: 'mesero@gmail.com', password: bcrypt.hashSync('123', 10) };
//     const insertedUser = await userController.createDocument(mockUser);
//     expect(insertedUser.ops[0]).toEqual(mockUser);
//   });

//   it('Editando un Documento en la BD', async () => {
//     const mockUser = { email: 'meseroactualizado@gmail.com', password: bcrypt.hashSync('123', 10) };
//     const user = await userController.searchDataBase({ email: 'mesero@gmail.com' });
//     await userController.updateDocument(user._id, mockUser);
//     const updateUserOne = await userController.searchDataBase({ email: 'meseroactualizado@gmail.com' });
//     expect(updateUserOne.email).toEqual('meseroactualizado@gmail.com');
//   });
//   it('Eliminando un Documento en la BD', async () => {
//     const user = await userController.searchDataBase({ email: 'meseroactualizado@gmail.com' });
//     await userController.deleteDocument(user._id);
//     const deleteUserOne = await userController.searchDataBase({ email: 'meseroactualizado@gmail.com' });
//     expect(deleteUserOne).toEqual(null);
//   });
//   it('Lista de usuarios de la pagina dos con un limite de 5', async () => {
//     const createUsersMany = (cont, numDoc) => {
//       while (cont <= numDoc) {
//         userController.createDocument({
//           email: `user00${cont}@localhost`,
//           password: '$2b$10$.Jqhq/.CAkjv7CT3mOacqOBp3.DjbK4Bc6YqWZsYvyLDWG50d.Bxq',
//           roles: { admin: false },
//         });
//         cont++;
//       }
//     };
//     await createUsersMany(1, 10);
//     const users = await userController.showListCollections(5, 10);
//     // console.info(users);
//     expect(users[0].email).toEqual('user006@localhost');
//     expect(users[4].email).toEqual('user0010@localhost');
//   });

//   afterAll(async () => {

//   });
// });
