const http = require('http');
const chalk = require('chalk');
const path = require('path');
const conf = require('./config/defaultconfig');
const route = require('./helper/router');

const server = http.createServer((req, res) => {
  const url = req.url;
  const filePath = path.join(conf.root, url);
  route(req, res, filePath);
});
  
server.listen(conf.port, conf.hostname, () => {
  const info = `http://${ conf.hostname }:${ conf.port }`;
  console.info(`servers started at ${ chalk.green(info) }`);
});