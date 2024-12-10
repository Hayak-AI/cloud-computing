require('dotenv').config();
const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const Jwt = require('@hapi/jwt');
const morgan = require('morgan');
const { Writable } = require('stream');

const morganStream = new Writable({
  write(chunk, encoding, callback) {
    console.log(chunk.toString().trim());
    callback();
  },
});

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register(Jwt);

  server.auth.strategy('jwt', 'jwt', {
    keys: process.env.JWT_SECRET,
    verify: {
      aud: false,
      iss: false,
      sub: false,
    },

    validate: (artifacts, request, h) => {
      return {
        isValid: true,
        credentials: {
          user: artifacts.decoded.payload.user,
        },
      };
    },
  });

  server.ext('onRequest', (request, h) => {
    morgan('combined', { stream: morganStream })(
      request.raw.req,
      request.raw.res,
      (err) => {
        if (err) {
          console.error('Morgan logging error:', err);
        }
      },
    );
    return h.continue;
  });

  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};
process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
