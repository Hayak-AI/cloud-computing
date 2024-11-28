require('dotenv').config();
const Hapi = require ('@hapi/hapi');
const routes = require('./routes');
const Jwt = require('@hapi/jwt');

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
        },
    }});

    await server.register(Jwt);

    server.auth.strategy('jwt', 'jwt', {
        keys : process.env.JWT_SECRET,
        verify: {
            aud: false,
            iss: false,
            sub: false,
        },

        validate: (artifacts,  request, h) => {
            return {
                isValid: true,
                credentials: {
                    user: artifacts.decoded.payload.user,
                }
            }
        }
    })


  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
