const bcrypt = require('bcrypt');
const modelController = require('../user-controller');

jest.mock('../../models/general-model');
const { userModelGeneral } = require('../../models/general-model');

const userModel = userModelGeneral('users', 'esto no importa');

const userController = modelController(userModel)(bcrypt);

function Req(email, password, roles) {
  this.email = email;
  this.password = password;
  this.roles = roles;
}

const resp = {
  set: jest.fn((link, property) => `{${link}:${property}}`),
  send: jest.fn(json => json),
};
const next = jest.fn(code => code);

describe('ControllerGetAllUsers', () => {
  it('Deberia mostrar 4 usuarios ', async (done) => {
    const req = {
      query: { page: '2', limit: '4' },
    };
    const result = await userController.controllerGetAllUsers(req, resp, next);
    const headerLink = '{link:</users?page=1&&limit=4>; rel="first", </users?page=3&&limit=4>; rel="last", </users?page=1&&limit=4>; rel="prev", </users?page=3&&limit=4>; rel="next"}';
    expect(result).toHaveLength(4);
    expect(result[0].email).toBe('admin@localhost');
    expect(result[3].email).toBe('user03@gmail.com');
    expect(resp.set).toHaveReturnedWith(headerLink);
    done();
  });
});
describe('controllerGetUserById', () => {
  it('Deberia el admin poder ver los datos de un usuario', async (done) => {
    const req = {
      params: {
        uid: 'user003@gmail.com',
      },
      userAuth: { id: '12345', email: 'admin@localhost', roles: true },
    };
    const result = await userController.controllerGetUserById(req, resp, next);
    expect(result).toEqual({ _id: '12345', email: 'user003@gmail.com', roles: { admin: false } });
    done();
  });
  it('Deberia un usuario poder ver sus datos ', async (done) => {
    const req = {
      params: {
        uid: 'user003@gmail.com',
      },
      userAuth: { id: '12345', email: 'user003@gmail.com', roles: false },
    };
    const result = await userController.controllerGetUserById(req, resp, next);
    expect(result).toEqual({ _id: '12345', email: 'user003@gmail.com', roles: { admin: false } });
    done();
  });
  it('Deberia retornar 403 si un usuario quiere accedera los datos de otro usuario ', async (done) => {
    const req = {
      params: {
        uid: 'user003@gmail.com',
      },
      userAuth: { id: '12345', email: 'user002@gmail.com', roles: false },
    };
    const result = await userController.controllerGetUserById(req, resp, next);
    expect(result).toBe(403);
    done();
  });
  it('Deberia retornar 404 si el usuario no existe', async (done) => {
    const req = {
      params: {
        uid: 'email that does not exist',
      },
      userAuth: { id: '12345', email: 'user003@gmail.com', roles: false },
    };
    const result = await userController.controllerGetUserById(req, resp, next);
    expect(result).toEqual(404);
    done();
  });
});

describe('ControllerCreateUser ', () => {
  it('Deberia retornar el usuario creado ', async (done) => {
    const req = {
      body: new Req('user@gmail.com', '123', { admin: false }),
      userAuth: { id: '12345', email: 'admin@localhost', roles: true },
    };
    const result = await userController.controllerCreateUser(req, resp, next);
    expect(result).toEqual({ _id: '12345', email: 'user@gmail.com', roles: { admin: false } });
    done();
  });
  it('Deberia retornar 403 si el usuario a crear ya existe  ', async (done) => {
    const req = {
      body: new Req('email already exists', '123', { admin: false }),
      userAuth: { id: '12345', email: 'admin@localhost', roles: true },
    };
    const result = await userController.controllerCreateUser(req, resp, next);
    expect(result).toEqual(403);
    done();
  });
  it('Deberia retornar 401 si no se ingresa el email o password', async (done) => {
    const req = {
      body: new Req('', '123', { admin: false }),
      userAuth: { id: '12345', email: 'admin@localhost', roles: true },
    };
    const result = await userController.controllerCreateUser(req, resp, next);
    expect(result).toEqual(400);
    done();
  });
});

describe('controllerPutUserById', () => {
  it('Deberia editar un usuario', async (done) => {
    const req = {
      body: new Req('updatedUser@gmail.com', '123', { admin: false }),
      params: {
        uid: 'userToUpdate@gmail.com',
      },
      userAuth: { id: '12345', email: 'userToUpdate@gmail.com', roles: false },
    };
    const result = await userController.controllerPutUserById(req, resp, next);
    expect(result.email).toBe('updatedUser@gmail.com');
    done();
  });
  it('Deberia retornar 404 si el usuario a actualizar no existe', async (done) => {
    const req = {
      body: new Req('updatedUser@gmail.com', '123', { admin: false }),
      params: {
        uid: 'email that does not exist',
      },
      userAuth: { id: '12345', email: 'userToUpdate@gmail.co', roles: false },
    };
    const result = await userController.controllerPutUserById(req, resp, next);
    expect(result).toEqual(404);
    done();
  });
  it('Debería retornar 400 si no se proporciona el correo electrónico o la contraseña o ninguno', async (done) => {
    const req = {
      body: new Req('', '', { admin: false }),
      params: {
        uid: 'userToUpdate@gmail.com',
      },
      userAuth: { id: '12345', email: 'userToUpdate@gmail.com', roles: false },
    };
    const result = await userController.controllerPutUserById(req, resp, next);
    expect(result).toEqual(400);
    done();
  });
  it('Deberia retornar 403 si el usuario no es admin y quiere cambiarse a admin', async (done) => {
    const req = {
      body: new Req('user002@gmail.com', '123', { admin: true }),
      params: {
        uid: 'user002@gmail.com',
      },
      userAuth: { id: '1234', email: 'user002@gmail.com', roles: false },
    };
    const result = await userController.controllerPutUserById(req, resp, next);
    expect(result).toEqual(403);
    done();
  });
  it('Deberia retornar 403 si el usuario quiere actulizar a otro usuario', async (done) => {
    const req = {
      body: new Req('user002@gmail.com', '123', { admin: false }),
      params: {
        uid: 'user002@gmail.com',
      },
      userAuth: { id: '1234', email: 'otherUser@gmail.com', roles: false },
    };
    const result = await userController.controllerPutUserById(req, resp, next);
    expect(result).toEqual(403);
    done();
  });
});

describe('controllerDeleteUserById', () => {
  it('Deberia el admin poder eliminar a un usuario ', async (done) => {
    const req = {
      params: { uid: 'user003@gmail.com' },
      userAuth: { id: '12345', email: 'admin@localhost', roles: true },
    };
    const result = await userController.controllerDeleteUserById(req, resp, next);
    expect(result).toEqual({ _id: '12345', email: 'user003@gmail.com', roles: { admin: false } });
    done();
  });
  it('Deberia un usuario eliminarse asi mismo ', async (done) => {
    const req = {
      params: { uid: 'user003@gmail.com' },
      userAuth: { id: '12345', email: 'user003@gmail.com', roles: false },
    };
    const result = await userController.controllerDeleteUserById(req, resp, next);
    expect(result).toEqual({ _id: '12345', email: 'user003@gmail.com', roles: { admin: false } });
    done();
  });
  it('Deberia retornar 403 si un usuario quiere eliminar a otro usuario ', async (done) => {
    const req = {
      params: { uid: 'user003@gmail.com' },
      userAuth: { id: '12345', email: 'other@gmail.com', roles: false },
    };
    const result = await userController.controllerDeleteUserById(req, resp, next);
    expect(result).toEqual(403);
    done();
  });
  it('Deberia retornar 404 si el usuario a eliminar no existe', async (done) => {
    const req = {
      body: new Req('user003@gmail.com', '123', { admin: false }),
      params: {
        uid: 'email that does not exist',
      },
      userAuth: { id: '12345', email: 'admin@localhost', roles: true },
    };
    const result = await userController.controllerDeleteUserById(req, resp, next);
    expect(result).toEqual(404);
    done();
  });
});
