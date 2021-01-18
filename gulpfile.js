
const { src, dest, watch } = require('gulp');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const through = require('through');
const sourcemaps = require('gulp-sourcemaps');
const lazypipe = require('lazypipe');
const cached = require('gulp-cached');

const MUST_EXCLUDE = ['!**/*.min.js', '!gulpfile.js', '!node_modules/**'];
const EXPORTS_FILE = (option = {}) => ['src/js/**/*.js'].concat(MUST_EXCLUDE, option.moreFiles || []);
const OPTION = { base: 'src', removeBOM: false, allowEmpty: true };

const renameFile = () => lazypipe()
  .pipe(rename, path => path.basename += '.min')()

const optimizeJs = (option = {}) => lazypipe()
  .pipe(option.production ? through : sourcemaps.init)
  .pipe(babel, {
    presets: ['@babel/preset-env', 'minify'],
    comments: false,
    shouldPrintComment: val => /(^!|@preserve|@license|@cc_on)/i.test(val),
  })
  .pipe(option.production ? through : sourcemaps.write, 'source-map/')
  ()

function watchJs() {
  watch(EXPORTS_FILE(), minJs)
}

async function minJs() {
  return src(EXPORTS_FILE(), Object.assign({}, OPTION))
    .pipe(cached('js'))
    .pipe(renameFile())
    .pipe(optimizeJs({ production: false }))
    .on('error', err => {
      console.log(err)
    })
    .pipe(dest('./dist'))
}

module.exports = Object.assign({},
  {
    'watch:js': watchJs,
  }
)
