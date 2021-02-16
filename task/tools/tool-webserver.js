const { src } = require('gulp');
const webserver = require('gulp-webserver');
const PATH = require('./config');
const viewPath = PATH.source.split(process.cwd())[1];
const option = { removeBOM: false, allowEmpty: true };
const serveStatic = require('serve-static');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { root: proxyRoot, option: proxyOptions } = {
  root: '/api',
  option: {
    target: 'https://www.example.com/',
    changeOrigin: true,
    pathRewrite: {
      '^/api': '',
    },
    router: {
      'dev.localhost:7000': 'http://localhost:7000',
    },
  }
};
const middleware = {
  static: serveStatic(PATH.source),
  proxy: createProxyMiddleware(proxyRoot, proxyOptions) // proxy想不到要用在哪先放上來
};

const stream = {
  webserver: () => webserver({
    path: viewPath,
    livereload: true,
    directoryListing: false,
    open: true,
    fallback: 'index.html',
    middleware: [middleware.static]
  })
};

function webServer() {
  return src(PATH.source, Object.assign({}, option))
    .pipe(stream.webserver())
};

module.exports = webServer;
