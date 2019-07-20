/* eslint-disable radix */
const { ObjectId } = require('mongodb');
const { isAdmin } = require('../middleware/auth');

module.exports = userModel => bcrypt => ({
  controllerCreateUser: async (req, resp, next) => {
    const { email, password, roles } = req.body;
    if (!email || !password) {
      return next(400);
    }
    const user = await userModel.searchDataBase({ email });
    if (user !== null) {
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
  controllerGetAllProduct: async (req, resp) => {
    // console.info(req.query);
    const page = parseInt(req.query.page) || 1;
    console.log(page);
    const limit = parseInt(req.query.limit) || 10;
    const skip = ((limit * page) - limit);

    const users = await userModel.showListCollections(skip, limit);

    const count = await userModel.countCollections();
    const numPages = Math.ceil(count / limit);

    const firstPage = `</users?page=${numPages - (numPages - 1)}&&limit=${limit}>; rel="first"`;
    const lastPage = `</users?page=${numPages}&&limit=${limit}>; rel="last"`;
    const prevPage = `</users?page=${page - 1 === 0 ? 1 : page - 1}&&limit=${limit}>; rel="prev"`;
    const nextPage = `</users?page=${page === numPages ? page : page + 1}&&limit=${limit}>; rel="next"`;

    resp.set('link', `${firstPage}, ${lastPage}, ${prevPage}, ${nextPage}`);

    /*  resp.set('Link': `<${firstPage}>`; rel = "first", `<${lastPage}>`; rel = 'last',`<${prevPage}>`; rel = 'prev', `<${nextPage}>`; rel = 'next');
      */
    const usersList = users.map(user => ({
      _id: user._id,
      email: user.email,
      roles: { admin: user.roles.admin },
    }));
    resp.send(usersList);


    console.log(count, numPages);
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
    if (!isAdmin(req) && !(req.userAuth.id === req.params.uid || req.userAuth.email === req.params.uid)) {
      return next(403);
    }
    return resp.send({
      _id: user._id,
      email: user.email,
      roles: user.roles,
    });
  },
  controllerPutUserById: async (req, resp, next) => {
    const { email, password, roles } = req.body;
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
    if ((!isAdmin(req) && !(req.userAuth.id === req.params.uid || req.userAuth.email === req.params.uid)) || (!isAdmin(req) && roles && roles.admin)) {
      return next(403);
    }

    if (!email && !password) {
      return next(400);
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
    if (!(isAdmin(req)) && !(req.userAuth.id === req.params.uid || req.userAuth.email === req.params.uid)) {
      return next(403);
    }
    await userModel.deleteDocument(user._id);
    return resp.send({
      _id: user._id,
      email: user.email,
      roles: user.roles,
    });
  },
});
