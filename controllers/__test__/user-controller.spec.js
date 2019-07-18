const bcrypt = require('bcrypt');
const modelController = require('../user-controller');

jest.mock('../../models/general-model');
const model = require('../../models/general-model');

const userModel = model('users', 'esto no importa');
const userController = modelController(userModel)(bcrypt);
function Req(email, password, roles) {
  this.email = email;
  this.password = password;
  this.roles = roles;
}
const resp = {
  send: jest.fn((result => result)),
};
const next = jest.fn((result => result));

console.info(next(400));
// userModel.createDocument().then(r => console.log(r));
describe('ControllerCreateUser test', () => {
  it('should return user created ', async (done) => {
    const req = {
      body: new Req('meseroMock@gmail.com', '123', { admin: false }),
    };
    const result = await userController.controllerCreateUser(req, resp, next);
    expect(result).toEqual({ _id: '123', email: 'meseroMock@gmail.com', roles: { admin: false } });
    done();
  });
  it('should return 403 if the user is already created', async (done) => {
    const req = {
      body: new Req('email already exists', '123', { admin: false }),
    };
    const result = await userController.controllerCreateUser(req, resp, next);
    expect(result).toEqual(403);
    done();
  });
  it('should return 400 if there is no email or passwoed', async (done) => {
    const req = {
      body: new Req('', '123', { admin: false }),
    };
    const result = await userController.controllerCreateUser(req, resp, next);
    expect(result).toEqual(400);
    done();
  });
});
