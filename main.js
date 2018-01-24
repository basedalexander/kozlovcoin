const Server = require('./server');
const serverConfig = require('./config/app-config.json');
const node = require('./application/node');

const server = new Server(serverConfig, node);
server.start();