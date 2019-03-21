const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

const mime = require('./mime');
const compress = require('./compress');
const range = require('./range');
const isFresh = require('./cache');

const tplPath = path.join(__dirname, '../template/dir.tpl'); // eslint-disable-line
const source = fs.readFileSync(tplPath);
const template = Handlebars.compile(source.toString());
module.exports = async function (req, res, filePath, config) {
  try {
    const stats = await stat(filePath);
    if (stats.isFile()) {
      const contentType = mime(filePath);
      
      res.setHeader('Content-type', contentType);
      console.log(isFresh(stats, req, res));
      if (isFresh(stats, req, res)) {
        res.statusCode == 304;
        res.end();
        return;
      }

      let rs;
      const { code, start, end } = range(stats.size, req, res);
      if( code === 200 ) {
        rs = fs.createReadStream(filePath);
        res.statusCode = 200;
      } else {
        rs = fs.createReadStream(filePath, { start, end });
        res.statusCode = 206;
      }
      
      if (filePath.match(config.compress)) {
        rs = compress(rs, req, res);
      }
      rs.pipe(res);
    } else if (stats.isDirectory()) {
      const contentType = mime(filePath);
      const files = await readdir(filePath);
      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      const dir = path.relative(config.root, filePath);
      const data = {
        title: path.basename(filePath),
        dir: dir ? `/${dir}` : '',
        files
      };
      res.end(template(data));
    }
  } catch (ex) {
    const contentType = mime(filePath);
    console.error(ex);
    res.statusCode = 404;
    res.setHeader('Content-Type', contentType);
    res.end(`${filePath} is not a directory or file`);
  }
};