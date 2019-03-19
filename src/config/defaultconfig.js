module.exports = {
  root: process.cwd(), // eslint-disable-line
  hostname: '127.0.0.1',
  port: '3099',
  compress: /\.(html|js|css|md)$/,
  cache: {
    maxAge: 600,
    expires: true,
    cacheControl: true,
    lastModified: true,
    etag: true
  }
};