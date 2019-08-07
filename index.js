const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const cors = require('cors');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const config = require('./config');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const routes = require('./routes');
const pkg = require('./package.json');
const db = require('./services/connection');

const { dbUrl, port, secret } = config;
const app = express();
// TODO: Conección a la BD en mogodb
const server = new ApolloServer({
  // These will be defined for both new or existing servers
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // get the user token from the headers
    // const { authorization } = req.headers;
    // const token = authorization.replace(/ +/, ' ').split(' ')[1];
    // const token = tokenWithBearer.split(' ')[1];
    // console.info(token);
    //  const [type, token] = authorization.replace(/ +/, ' ').split(' ');
    // try to retrieve a user with the token
    // const user = getUser(token)

    // add the user to the context
    return req.headers;
  },
});
server.applyMiddleware({ app });
app.listen({ port: 4000 }, () => console.info(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
db(dbUrl)
  .then(() => {
    app.set('config', config);
    app.set('pkg', pkg);
    app.use(cors());
    // parse application/x-www-form-urlencoded
    app.use(cors());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(authMiddleware(secret));
    // Registrar rutas
    routes(app, (err) => {
      if (err) {
        throw err;
      }
      app.use(errorHandler);
      app.listen(port, () => {
        console.info(`App listening on port ${port}`);
      });
    });
  });
