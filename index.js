const express = require('express');
const helmet = require('helmet');
const { ApolloServer } = require('apollo-server-express');

const cors = require('cors');
const typeDefs = require('./schemas-graphql/typeDefs');
const resolvers = require('./schemas-graphql/resolvers');
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
  playground: {
    settings: {
      'editor.theme': 'light',
    },
  },
  context: ({ req }) => req.headers,
});
server.applyMiddleware({ app });
db(dbUrl)
  .then(() => {
    app.set('config', config);
    app.set('pkg', pkg);
    app.use(cors());
    app.use(helmet());
    // parse application/x-www-form-urlencoded;
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
