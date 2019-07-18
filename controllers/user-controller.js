const ObjectId = require('mongodb').ObjectID;

module.exports = (userModel, bcrypt) => ({

  controllerCreateUser: async (req, resp, next) => {
    const { email, password, roles } = req.body;
    // console.log(req)
    if (!email || !password) {
      return next(400);
    }
    const user = await userModel.searchDataBase({ email });
    if (user != null) {
      return next(403);
    }
    const statusRol = (typeof roles === 'object')
      ? (!roles.admin) ? false : roles.admin
      : false;
    const newUser = await userModel.createDocument({ email, password: bcrypt.hashSync(password, 10), roles: { admin: statusRol } });
    return resp.send({
      _id: newUser.ops[0]._id,
      email: newUser.ops[0].email,
      roles: newUser.ops[0].roles,
    });
  },
  controllerGetAllUsers: async (req, resp) => {
    // console.info(req.query);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = ((limit * page) - limit);

    const users = await userModel.showListCollections(skip, limit);
    const usersList = users.map(user => ({
      _id: user._id,
      email: user.email,
      roles: { admin: user.roles.admin },
    }));
    resp.send(usersList);
  },
  controllerGetUserById: async (req, resp, next) => {
    const emailOrId = req.params.uid;
    let searchEmailOrId;
    if (emailOrId.indexOf('@') === -1) {
      try {
        searchEmailOrId = { _id: new ObjectId(emailOrId) };
      } catch (error) {
        searchEmailOrId = { email: emailOrId };
      }
    } else {
      searchEmailOrId = { email: emailOrId };
    }

    const user = await userModel.searchDataBase(searchEmailOrId);
    if (!user) {
      return next(404);
    }
    resp.send({
      _id: user._id,
      email: user.email,
      roles: user.roles,
    });
  },
  controllerPutUserById: async (req, resp, next) => {
    const { email, password, roles } = req.body;
    if (!email && !password) {
      return next(400);
    }
    const emailOrId = req.params.uid;
    let searchEmailOrId;
    try {
      searchEmailOrId = { _id: new ObjectId(emailOrId) };
    } catch (error) {
      searchEmailOrId = { email: emailOrId };
    }
    const user = await userModel.searchDataBase(searchEmailOrId);
    if (!user) {
      return next(404);
    }
    const statusRol = (typeof roles === 'object')
      ? (!roles.admin) ? false : roles.admin : false;

    await userModel.updateDocument(user._id, {
      email: email || user.email,
      password: (!password) ? user.password : bcrypt.hashSync(password, 10),
      roles: { admin: statusRol },
    });
    const updateUserOne = await userModel.searchDataBase(searchEmailOrId);
    return resp.send({
      _id: updateUserOne._id,
      email: updateUserOne.email,
      roles: updateUserOne.roles,
    });
  },
  controllerDeleteUserById: async (req, resp, next) => {
    const emailOrId = req.params.uid;
    let searchEmailOrId;
    try {
      searchEmailOrId = { _id: new ObjectId(emailOrId) };
    } catch (error) {
      searchEmailOrId = { email: emailOrId };
    }
    const user = await userModel.searchDataBase(searchEmailOrId);
    if (!user) {
      return next(404);
    }
    await userModel.deleteDocument(user._id);
    return resp.send({
      _id: user._id,
      email: user.email,
      roles: user.roles,
    });
  },
});
