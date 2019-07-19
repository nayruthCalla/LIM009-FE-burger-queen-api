/* eslint-disable jest/no-identical-title */
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
/* ------------------post user---------------------------*/
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
/* ------------------put user---------------------------*/
describe('controllerPutUserById test', () => {
  it('should edit a user', async (done) => {
    const req = {
      body: new Req('meseroMockactualizado@gmail.com', '123', { admin: false }),
      params: {
        uid: 'meseroMockparaActualizado@gmail.com',
      },
      userAuth: { id: 'meseroMockactualizado@gmail.com', email: 'meseroMockactualizado@gmail.com', roles: { admin: false } },
    };
    // console.log(req)
    const result = await userController.controllerPutUserById(req, resp, next);
    expect(result.email).toEqual('meseroMockactualizado@gmail.com');
    done();
  });
  it('should return 404 if the user does not succeed', async (done) => {
    const req = {
      body: new Req('meseroMockactualizado@gmail.com', '123', { admin: false }),
      params: {
        uid: 'email that does not exist',
      },
      userAuth: { id: 'meseroMockactualizado@gmail.com', email: 'meseroMockactualizado@gmail.com', roles: { admin: false } },
    };
    const result = await userController.controllerPutUserById(req, resp, next);
    expect(result).toEqual(404);
    done();
  });
  it('should return 400 if email or password is not provided or neither', async (done) => {
    const req = {
      body: new Req('', '', { admin: false }),
      params: {
        uid: 'meseroMockparaActualizado@gmail.com',
      },
      userAuth: { id: '123', email: 'meseroMockactualizado@gmail.com', roles: { admin: false } },
    };
    const result = await userController.controllerPutUserById(req, resp, next);
    expect(result).toEqual(400);
    done();
  });
  it('should return 403 if the user is not admin and wants to change to admin', async (done) => {
    const req = {
      body: new Req('meseroMockactualizado@gmail.com', '123', { admin: false }),
      params: {
        uid: 'otroUseario5@gmail.com',
      },
      userAuth: { id: '1234', email: 'otroUseario@gmail.com', roles: false },
    };
    const result = await userController.controllerPutUserById(req, resp, next);
    expect(result).toEqual(403);
    done();
  });
  it('should return 403 if the user is not admin and wants to change to admin', async (done) => {
    const req = {
      body: new Req('meseroMockactualizado@gmail.com', '123', { admin: true }),
      params: {
        uid: 'otroUseario@gmail.com',
      },
      userAuth: { id: '1234', email: 'otroUseario@gmail.com', roles: false },
    };
    const result = await userController.controllerPutUserById(req, resp, next);
    expect(result).toEqual(403);
    done();
  });
});
/* ------------------delete user---------------------------*/
describe('controllerDeleteUserById test', () => {
  it('should remove a user', async (done) => {
    const req = {
      params: {
        uid: 'meseroMockparaActualizado@gmail.com',
      },
      userAuth: { id: '123', email: 'meseroMockparaActualizado@gmail.com', roles: { admin: false } },
    };
    const result = await userController.controllerDeleteUserById(req, resp, next);
    expect(result).toEqual({ _id: '123', email: 'meseroMockactualizado@gmail.com', roles: { admin: false } });
    done();
  });
  it('should return 404 if the user does not exist', async (done) => {
    const req = {
      body: new Req('meseroMockactualizado@gmail.com', '123', { admin: false }),
      params: {
        uid: 'email that does not exist',
      },
      userAuth: { id: 'meseroMockactualizado@gmail.com', email: 'meseroMockactualizado@gmail.com', roles: { admin: false } },
    };
    const result = await userController.controllerDeleteUserById(req, resp, next);
    expect(result).toEqual(404);
    done();
  });
  it('should return 403 if the user is not admin and wants to change to admin', async (done) => {
    const req = {
      body: new Req('meseroMockactualizado@gmail.com', '123', { admin: false }),
      params: {
        uid: 'otroUseario5@gmail.com',
      },
      userAuth: { id: '1234', email: 'otroUseario@gmail.com', roles: false },
    };
    const result = await userController.controllerDeleteUserById(req, resp, next);
    expect(result).toEqual(403);
    done();
  });
});
/* ------------------get user---------------------------*/
describe('controllerGetUserById Test', () => {
  it('should return my data', async (done) => {
    const req = {
      params: {
        uid: 'otroUseario@gmail.com',
      },
      userAuth: { id: '1234', email: 'otroUseario@gmail.com', roles: false },
    };
    const result = await userController.controllerGetUserById(req, resp, next);
    expect(result).toEqual({ _id: '1234', email: 'otroUseario@gmail.com', roles: { admin: false } });
    done();
  });
  it('should return 404 if the user does not succeed', async (done) => {
    const req = {
      body: new Req('meseroMockactualizado@gmail.com', '123', { admin: false }),
      params: {
        uid: 'email that does not exist',
      },
      userAuth: { id: 'meseroMockactualizado@gmail.com', email: 'meseroMockactualizado@gmail.com', roles: { admin: false } },
    };
    const result = await userController.controllerGetUserById(req, resp, next);
    expect(result).toEqual(404);
    done();
  });
  it('should return 403 if the user is not admin and wants to change to admin', async (done) => {
    const req = {
      body: new Req('meseroMockactualizado@gmail.com', '123', { admin: false }),
      params: {
        uid: 'otroUseario5@gmail.com',
      },
      userAuth: { id: '1234', email: 'otroUseario@gmail.com', roles: false },
    };
    const result = await userController.controllerGetUserById(req, resp, next);
    expect(result).toEqual(403);
    done();
  });
});
