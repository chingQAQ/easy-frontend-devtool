const { src } = require('gulp');
const webserver = require('gulp-webserver');
const PATH = require('./config');
const viewPath = PATH.source.split(process.cwd())[1];
const option = { removeBOM: false, allowEmpty: true };
const serveStatic = require('serve-static')
const stream = {
  webserver: () => webserver({
    path: viewPath,
    livereload: true,
    directoryListing: true,
    open: true,
    fallback: 'index.html',
    middleware: [serveStatic(PATH.source)]
  })
}

function webServer() {
  return src(PATH.source, Object.assign({}, option))
    .pipe(stream.webserver())
}

module.exports = webServer;
