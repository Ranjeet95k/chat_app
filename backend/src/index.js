const { createStrapi } = require('@strapi/strapi');
const { Server } = require('socket.io');
const http = require('http');

module.exports = async () => {
  const strapi = await createStrapi();
  const httpServer = http.createServer(strapi.server);
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000', 
      methods: ['GET', 'POST'],
    },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));
    try {
      const { payload, isValid } = strapi.plugins['users-permissions'].services.jwt.verify(token);
      if (isValid) {
        const user = await strapi.plugin('users-permissions').service('user').fetch(payload.id);
        socket.user = user;
        return next();
      }
    } catch (error) {
      return next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('message', (message) => {
      socket.emit('message', { text: message.text, sent: false });
    });
  });

  httpServer.listen(strapi.config.get('server.port'));
  return strapi;
};